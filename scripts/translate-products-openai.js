/**
 * Tradução em massa (one-off) para preencher campos *_en/es/de no Supabase.
 *
 * Uso:
 *  - Dry run (não grava): DRY_RUN=1 node --env-file=.env.local scripts/translate-products-openai.js
 *  - Execução real:        node --env-file=.env.local scripts/translate-products-openai.js
 *
 * Requer:
 *  - SUPABASE_SERVICE_ROLE_KEY
 *  - OPENAI_API_KEY
 *  - (opcional) PUBLIC_SUPABASE_URL
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const CONCURRENCY = Number(process.env.CONCURRENCY || '2');
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex.: node --env-file=.env.local scripts/translate-products-openai.js)');
  process.exit(1);
}
if (!OPENAI_API_KEY) {
  console.error('Defina OPENAI_API_KEY (ex.: node --env-file=.env.local scripts/translate-products-openai.js)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function nowIso() {
  return new Date().toISOString();
}

function safeStr(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

function truncateForPrompt(s, max = 3000) {
  const str = safeStr(s);
  if (str.length <= max) return str;
  return str.slice(0, max) + '…';
}

async function fetchWithRetry(url, init, { retries = 5 } = {}) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || res.status >= 500) {
        if (attempt >= retries) return res;
        const backoff = Math.min(30_000, 800 * Math.pow(2, attempt));
        await sleep(backoff);
        attempt++;
        continue;
      }
      return res;
    } catch (e) {
      if (attempt >= retries) throw e;
      const backoff = Math.min(30_000, 800 * Math.pow(2, attempt));
      await sleep(backoff);
      attempt++;
    }
  }
}

function buildPrompt({ title, short_description, detailed_description }) {
  return [
    'Você é um tradutor profissional para catálogo de equipamentos de Pilates.',
    'Traduza do PT-BR para EN, ES e DE.',
    '',
    'Regras importantes:',
    '- Preserve nomes próprios, marca "Equipilates", nomes de linha/modelos e medidas.',
    '- Não invente especificações, não adicione preço, não crie claims novos.',
    '- Mantenha o tom comercial/profissional.',
    '- Retorne APENAS um JSON válido (sem markdown), exatamente com estas chaves:',
    '  title_en, short_description_en, detailed_description_en,',
    '  title_es, short_description_es, detailed_description_es,',
    '  title_de, short_description_de, detailed_description_de',
    '',
    'Conteúdo (PT-BR):',
    `title: ${JSON.stringify(truncateForPrompt(title, 500))}`,
    `short_description: ${JSON.stringify(truncateForPrompt(short_description, 1200))}`,
    `detailed_description: ${JSON.stringify(truncateForPrompt(detailed_description, 3000))}`,
  ].join('\n');
}

async function translateOne(product) {
  const prompt = buildPrompt(product);

  const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'Responda sempre com JSON válido, sem markdown.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`OpenAI HTTP ${res.status}: ${raw.slice(0, 500)}`);
  }

  let content = '';
  try {
    const json = JSON.parse(raw);
    content = json?.choices?.[0]?.message?.content || '';
  } catch {
    throw new Error(`Resposta OpenAI não-JSON (envelope): ${raw.slice(0, 500)}`);
  }

  // Às vezes vem com espaços/linhas. Garantir parse.
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Conteúdo OpenAI não é JSON parseável: ${content.slice(0, 500)}`);
  }

  const required = [
    'title_en',
    'short_description_en',
    'detailed_description_en',
    'title_es',
    'short_description_es',
    'detailed_description_es',
    'title_de',
    'short_description_de',
    'detailed_description_de',
  ];

  for (const k of required) {
    if (typeof parsed[k] !== 'string') {
      throw new Error(`Campo ausente/invalid: ${k}`);
    }
  }

  // Normalização mínima
  const update = {};
  for (const k of required) {
    update[k] = parsed[k].trim();
  }

  return update;
}

async function runPool(items, worker, concurrency) {
  let idx = 0;
  const results = [];

  async function runner() {
    while (true) {
      const my = idx++;
      if (my >= items.length) return;
      results[my] = await worker(items[my], my);
    }
  }

  const runners = Array.from({ length: Math.max(1, concurrency) }, () => runner());
  await Promise.all(runners);
  return results;
}

async function main() {
  console.log(`[${nowIso()}] Iniciando. DRY_RUN=${DRY_RUN} CONCURRENCY=${CONCURRENCY} MODEL=${MODEL}`);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, short_description, detailed_description, is_active')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  if (!products || products.length === 0) {
    console.log('Nenhum produto ativo encontrado.');
    return;
  }

  console.log(`Produtos ativos: ${products.length}`);

  let ok = 0;
  let failed = 0;

  await runPool(
    products,
    async (p, i) => {
      const slug = p.slug || p.id;
      const base = {
        title: p.title,
        short_description: p.short_description,
        detailed_description: p.detailed_description,
      };

      try {
        console.log(`\n[${i + 1}/${products.length}] ${slug} → traduzindo...`);
        const update = await translateOne(base);

        if (DRY_RUN) {
          console.log(`[dry-run] ${slug} OK (não gravado)`);
          ok++;
          return;
        }

        const { error: upErr } = await supabase.from('products').update(update).eq('id', p.id);
        if (upErr) throw upErr;

        console.log(`[ok] ${slug} atualizado`);
        ok++;
      } catch (e) {
        failed++;
        console.error(`[erro] ${slug}:`, e?.message || e);
      }
    },
    CONCURRENCY
  );

  console.log(`\n[${nowIso()}] Concluído. ok=${ok} failed=${failed} total=${products.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

