import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY não configurada' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { productId, languages, overwrite } = await request.json();

    if (!productId) {
      return new Response(JSON.stringify({ error: 'productId é obrigatório' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch the product
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fieldsToTranslate = [
      { field: 'title', value: product.title },
      { field: 'short_description', value: product.short_description },
      { field: 'detailed_description', value: product.detailed_description }
    ];

    // Se languages foi passado, traduzir apenas esses idiomas; senão, traduzir todos
    const allLangs = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'de', name: 'German' }
    ];
    
    const langs = languages 
      ? allLangs.filter(l => languages.includes(l.code))
      : allLangs;

    const updates: Record<string, string> = {};

    for (const lang of langs) {
      // Check which fields need translation
      const toTranslate = fieldsToTranslate.filter(f => {
        if (!f.value) return false; // Skip empty source fields
        const colName = `${f.field}_${lang.code}`;
        return overwrite || !product[colName as keyof typeof product];
      });

      if (toTranslate.length === 0) continue;

      // Build prompt
      const prompt = `Translate the following product information from Portuguese (Brazil) to ${lang.name}. 
This is for a professional Pilates equipment manufacturer website. 
Keep the tone professional and technical. Maintain any HTML tags if present.
Return ONLY a valid JSON object with the translated fields, no markdown or extra text.

Fields to translate:
${toTranslate.map(f => `"${f.field}": "${(f.value || '').replace(/"/g, '\\"').replace(/\n/g, '\\n').substring(0, 3000)}"`).join(',\n')}

Return JSON format:
{${toTranslate.map(f => `"${f.field}": "translated text"`).join(', ')}}`;

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional translator specializing in Pilates equipment terminology. Always return valid JSON only, no markdown wrapping.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 3000
        })
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error(`OpenAI error for ${lang.code}:`, errText);
        continue;
      }

      const openaiData = await openaiRes.json();
      const content = openaiData.choices?.[0]?.message?.content?.trim();

      if (!content) continue;

      try {
        // Clean potential markdown wrapping
        const cleanJson = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
        const translated = JSON.parse(cleanJson);

        for (const f of toTranslate) {
          if (translated[f.field]) {
            updates[`${f.field}_${lang.code}`] = translated[f.field];
          }
        }
      } catch (parseErr) {
        console.error(`JSON parse error for ${lang.code}:`, parseErr, content);
      }
    }

    // Save translations to Supabase
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (updateError) {
        return new Response(JSON.stringify({ error: 'Falha ao salvar traduções', details: updateError.message }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      translated: Object.keys(updates).length,
      fields: Object.keys(updates)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
