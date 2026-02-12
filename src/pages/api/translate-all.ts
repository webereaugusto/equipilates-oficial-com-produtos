import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { overwrite } = await request.json().catch(() => ({ overwrite: false }));

    // Fetch all active products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, title_en, title_es, title_de')
      .eq('is_active', true)
      .order('order_index');

    if (error || !products) {
      return new Response(JSON.stringify({ error: 'Falha ao buscar produtos' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filter products that need translation
    const needsTranslation = products.filter(p =>
      overwrite || !p.title_en || !p.title_es || !p.title_de
    );

    const results = [];
    const origin = new URL(request.url).origin;

    for (const product of needsTranslation) {
      try {
        const res = await fetch(`${origin}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, overwrite })
        });
        const data = await res.json();
        results.push({ id: product.id, title: product.title, ...data });
      } catch (err: any) {
        results.push({ id: product.id, title: product.title, error: err.message });
      }
    }

    return new Response(JSON.stringify({
      total: products.length,
      translated: results.filter(r => r.success).length,
      skipped: products.length - needsTranslation.length,
      results
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
