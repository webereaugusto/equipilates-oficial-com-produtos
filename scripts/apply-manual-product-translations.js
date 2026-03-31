/**
 * Grava no Supabase as traduções manuais (EN/ES/DE) definidas em
 * scripts/data/product-translations-manual.mjs — sem API externa.
 *
 * Uso (PowerShell):
 *   $env:DRY_RUN='1'; node --env-file=.env.local scripts/apply-manual-product-translations.js
 *   node --env-file=.env.local scripts/apply-manual-product-translations.js
 */
import { createClient } from '@supabase/supabase-js';
import { TRANSLATIONS_BY_SLUG } from './data/product-translations-manual.mjs';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (node --env-file=.env.local ...)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const REQUIRED_FIELDS = [
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

function validateRow(slug, row) {
  for (const k of REQUIRED_FIELDS) {
    if (typeof row[k] !== 'string' || !row[k].trim()) {
      throw new Error(`Slug "${slug}" missing or empty: ${k}`);
    }
  }
}

async function main() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, is_active')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;

  const definedSlugs = new Set(Object.keys(TRANSLATIONS_BY_SLUG));
  let updated = 0;
  let skipped = 0;
  const missingInFile = [];

  for (const p of products || []) {
    const t = TRANSLATIONS_BY_SLUG[p.slug];
    if (!t) {
      missingInFile.push(p.slug);
      continue;
    }
    validateRow(p.slug, t);
    if (DRY_RUN) {
      console.log(`[dry-run] ${p.slug} → ok`);
      updated++;
      continue;
    }
    const { error: upErr } = await supabase.from('products').update(t).eq('id', p.id);
    if (upErr) {
      console.error(`[erro] ${p.slug}:`, upErr.message);
      skipped++;
      continue;
    }
    console.log(`[ok] ${p.slug}`);
    updated++;
  }

  const missingInDb = [...definedSlugs].filter((s) => !(products || []).some((p) => p.slug === s));
  if (missingInFile.length) {
    console.warn('\nAviso: produtos ativos sem entrada no arquivo:', missingInFile.join(', '));
  }
  if (missingInDb.length) {
    console.warn('\nAviso: slugs no arquivo que não estão entre ativos:', missingInDb.join(', '));
  }

  console.log(`\nConcluído. ${DRY_RUN ? 'dry-run' : 'gravado'}: ${updated} atualizados, ${skipped} falhas.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
