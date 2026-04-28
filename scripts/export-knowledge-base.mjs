/**
 * Exporta base de conhecimento (Markdown + JSONL) para RAG / agentes de IA.
 * Combina: Supabase (catálogo ativo, imagens, site_settings) + locales do site Europa.
 *
 * Uso:
 *   node --env-file=.env.local scripts/export-knowledge-base.mjs
 *   EUROPA_LOCALES_DIR=C:\\caminho\\locales node --env-file=.env.local scripts/export-knowledge-base.mjs
 *
 * Saída (padrão): docs/equipilates-knowledge-base.md e docs/equipilates-knowledge-base.jsonl
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DOCS_DIR = process.env.KB_OUTPUT_DIR || path.join(projectRoot, 'docs');
const OUT_MD = path.join(DOCS_DIR, 'equipilates-knowledge-base.md');
const OUT_JSONL = path.join(DOCS_DIR, 'equipilates-knowledge-base.jsonl');

const EUROPA_BASE_URL = process.env.EUROPA_PUBLIC_URL || 'https://equipilateseuropa.com';
const DOC_VERSION = '1';

const DEFAULT_LOCALES_DIR = path.resolve(projectRoot, '..', '..', 'equipilates-europa', 'public', 'locales');
const LOCALES_DIR = process.env.EUROPA_LOCALES_DIR
  ? path.resolve(process.env.EUROPA_LOCALES_DIR)
  : DEFAULT_LOCALES_DIR;

const LOCALE_FILES = ['pt-BR.json', 'en.json', 'es.json', 'de.json'];

if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex.: node --env-file=.env.local scripts/export-knowledge-base.mjs)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/** @type {{ id: string, text: string, metadata: Record<string, unknown> }[]} */
const jsonlChunks = [];

function pushChunk(id, text, metadata) {
  if (!text || !String(text).trim()) return;
  jsonlChunks.push({
    id,
    text: String(text).trim(),
    metadata: { document_version: DOC_VERSION, generated_at: new Date().toISOString(), ...metadata },
  });
}

function mdBullet(line) {
  const s = String(line).replace(/\r\n/g, '\n').trim();
  return s ? `- ${s.replace(/^- /, '')}` : '';
}

function formatSpecs(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));
  }
  return [typeof raw === 'string' ? raw : JSON.stringify(raw)];
}

function formatOptionals(raw) {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((o) => {
    if (typeof o === 'string') return o;
    if (o && typeof o === 'object') {
      const k = o.key ?? o.name ?? '';
      const v = o.value ?? '';
      return v ? `${k}: ${v}` : String(k);
    }
    return String(o);
  });
}

async function loadLocaleJson(filename) {
  const fp = path.join(LOCALES_DIR, filename);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function localeToMarkdownBlock(langCode, obj) {
  if (!obj) return `_Arquivo de locale ausente: ${langCode}_\n`;
  const keys = Object.keys(obj).sort();
  const lines = keys.map((k) => `- **${k}**: ${String(obj[k]).replace(/\n/g, ' ')}`);
  return lines.join('\n') + '\n';
}

function buildPoliciesMultilingual(locales) {
  /** @type {Record<string, Record<string, string>>} */
  const pick = {};
  const keys = [
    'faq.a2',
    'faq.a4',
    'faq.a5',
    'faq.a6',
    'faq.a9',
    'support.item4.title',
    'support.item4.text',
    'faq.q7',
    'faq.a7',
  ];
  for (const code of ['pt-BR', 'en', 'es', 'de']) {
    const file = code === 'pt-BR' ? 'pt-BR.json' : `${code}.json`;
    const data = locales[file];
    if (!data) continue;
    pick[code] = {};
    for (const k of keys) {
      if (data[k]) pick[code][k] = data[k];
    }
  }
  let md = '';
  for (const code of Object.keys(pick)) {
    md += `#### Políticas e FAQ (${code})\n\n`;
    for (const [k, v] of Object.entries(pick[code])) {
      md += mdBullet(`**${k}**: ${v}`) + '\n';
    }
    md += '\n';
  }
  return md;
}

async function main() {
  await fs.mkdir(DOCS_DIR, { recursive: true });

  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug, description)')
    .eq('is_active', true)
    .order('order_index');

  if (pErr) throw pErr;

  const { data: allImages, error: iErr } = await supabase
    .from('product_images')
    .select('id, product_id, url, is_primary, order_index')
    .order('order_index');

  if (iErr) throw iErr;

  const imageByProduct = new Map();
  for (const img of allImages || []) {
    if (!imageByProduct.has(img.product_id)) imageByProduct.set(img.product_id, []);
    imageByProduct.get(img.product_id).push(img);
  }

  const { data: settingsRows } = await supabase.from('site_settings').select('key, value');
  const settings = Object.fromEntries((settingsRows || []).map((r) => [r.key, r.value]));

  /** @type {Record<string, Record<string, string>>} */
  const locales = {};
  let localesFound = false;
  for (const f of LOCALE_FILES) {
    const j = await loadLocaleJson(f);
    if (j) {
      locales[f] = j;
      localesFound = true;
    }
  }

  const generatedAt = new Date().toISOString();
  let md = '';
  md += `# Base de conhecimento — Equipilates (Europa + catálogo compartilhado)\n\n`;
  md += `> Gerado em: **${generatedAt}** (ISO)\n`;
  md += `> Versão do documento: **${DOC_VERSION}**\n`;
  md += `> Reexporte este arquivo após alterar produtos ou textos no admin / locales.\n\n`;
  md += `---\n\n`;

  const section1 = `## 1. Organização e canais — site Europa\n\n` +
    `- **Domínio público (produção)**: ${EUROPA_BASE_URL}\n` +
    `- **Home**: ${EUROPA_BASE_URL}/\n` +
    `- **Página de produto**: ${EUROPA_BASE_URL}/produtos/<slug-do-produto>\n` +
    `- **Idiomas no site**: pt-BR, en, es, de\n` +
    `- **Detecção de idioma (prioridade)**: (1) escolha salva em \`localStorage.language\`; (2) idiomas do navegador; (3) cookie \`detected-lang\` (geo, Edge/Vercel); (4) fallback **es**.\n` +
    `- **Preços**: não divulgar valores numéricos; orientar **orçamento** via WhatsApp / consultor.\n\n`;

  md += section1;
  pushChunk('site-v1-europa-overview', section1, { type: 'site_overview', source: 'static+europa' });

  md += `---\n\n`;
  md += `## 2. Marca, FAQ e políticas (resumo multilíngue)\n\n`;
  if (localesFound) {
    md += `### 2.1 Trechos priorizados (garantia, exportação, fábricas, contato)\n\n`;
    md += buildPoliciesMultilingual(locales);
    md += `### 2.2 Conteúdo completo por idioma (locales do site Europa)\n\n`;
    md += `> Diretório dos arquivos: \`${LOCALES_DIR}\`\n\n`;
    const map = { 'pt-BR.json': 'pt-BR', 'en.json': 'en', 'es.json': 'es', 'de.json': 'de' };
    for (const [file, code] of Object.entries(map)) {
      md += `#### Locale ${code}\n\n`;
      const block = localeToMarkdownBlock(code, locales[file]);
      md += block + `\n`;
      pushChunk(`site-v1-brand-locale-${code}`, `# Marca Equipilates — locale ${code}\n\n${block}`, {
        type: 'brand_locale',
        language: code,
        source: 'equipilates-europa-locales',
      });
    }
  } else {
    md += `_Locales não encontrados em \`${LOCALES_DIR}\`. Defina \`EUROPA_LOCALES_DIR\` ou coloque o projeto \`equipilates-europa\` em \`${DEFAULT_LOCALES_DIR}\`._\n\n`;
  }

  md += `---\n\n`;
  md += `## 3. Contato e configurações (site_settings)\n\n`;
  const wa = settings.whatsapp_number || '5524998450039';
  md += `- **WhatsApp (cadastro)**: +${wa.replace(/\D/g, '')}\n`;
  md += `- **Mensagem sugerida (Europa)**: consulta sobre equipamentos / orçamento, mencionando o produto de interesse.\n`;
  if (Object.keys(settings).length > 0) {
    md += `\n| Chave | Valor (não divulgar preços ao usuário final) |\n| --- | --- |\n`;
    for (const [k, v] of Object.entries(settings)) {
      if (k === 'show_prices' || k.includes('price')) {
        md += `| ${k} | _omitido na base de conhecimento pública_ |\n`;
        continue;
      }
      let val = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
      val = val.replace(/\|/g, '\\|').slice(0, 500);
      md += `| ${k} | ${val} |\n`;
    }
  }
  md += `\n`;

  pushChunk('site-v1-contact-settings', `## Contato\nWhatsApp cadastro: +${wa.replace(/\D/g, '')}\n`, {
    type: 'contact',
    source: 'supabase-site_settings',
  });

  md += `---\n\n`;
  md += `## 4. Catálogo de produtos (ativos)\n\n`;
  md += `Total de produtos ativos: **${(products || []).length}**\n\n`;
  md += `> **Nota**: especificações técnicas e opcionais costumam estar somente em português no cadastro; títulos e descrições longas estão em PT, EN, ES e DE onde aplicável.\n\n`;

  for (const p of products || []) {
    const cat = p.category;
    const catSlug = cat?.slug || '';
    const catName = cat?.name || '';
    const slug = p.slug;
    const productUrl = `${EUROPA_BASE_URL}/produtos/${slug}`;
    const isAccessory = catSlug === 'acessorios';

    const specs = formatSpecs(p.technical_specs);
    const optionals = formatOptionals(p.optional_items);
    const imgs = imageByProduct.get(p.id) || [];

    md += `### ${p.title}\n\n`;
    md += `| Campo | Valor |\n| --- | --- |\n`;
    md += `| slug | \`${slug}\` |\n`;
    md += `| URL (Europa) | ${productUrl} |\n`;
    md += `| Categoria | ${catName} (\`${catSlug}\`) |\n`;
    md += `| Tipo garantia (regra site) | ${isAccessory ? 'Acessório: 3 meses (conforme FAQ)' : 'Equipamento: 2 anos (conforme FAQ)'} |\n`;
    md += `| Preço | _sob consulta — não divulgar valores_ |\n`;
    md += `\n`;

    const langBlock = (label, title, shortD, longD) => {
      md += `#### ${label}\n\n`;
      md += `**Título:** ${title || '—'}\n\n`;
      md += `**Descrição curta:**\n\n${(shortD || '—').replace(/\r\n/g, '\n')}\n\n`;
      md += `**Descrição detalhada:**\n\n${(longD || '—').replace(/\r\n/g, '\n')}\n\n`;
    };

    langBlock('Português (PT)', p.title, p.short_description, p.detailed_description);
    langBlock('English (EN)', p.title_en, p.short_description_en, p.detailed_description_en);
    langBlock('Español (ES)', p.title_es, p.short_description_es, p.detailed_description_es);
    langBlock('Deutsch (DE)', p.title_de, p.short_description_de, p.detailed_description_de);

    md += `#### Especificações técnicas\n\n`;
    if (specs.length) {
      for (const s of specs) md += mdBullet(s) + `\n`;
    } else {
      md += `_Nenhuma especificação cadastrada._\n`;
    }
    md += `\n#### Opcionais / itens\n\n`;
    if (optionals.length) {
      for (const o of optionals) md += mdBullet(o) + `\n`;
    } else {
      md += `_Nenhum opcional cadastrado._\n`;
    }

    md += `\n#### Imagens\n\n`;
    if (imgs.length) {
      for (const im of imgs) {
        const star = im.is_primary ? ' (principal)' : '';
        md += mdBullet(`[${im.url}](${im.url})${star}`) + `\n`;
      }
    } else {
      md += `_Sem imagens no banco._\n`;
    }

    if (p.seo_title || p.seo_description || p.seo_keywords || p.seo_text) {
      md += `\n#### SEO (cadastro)\n\n`;
      if (p.seo_title) md += `- **seo_title:** ${p.seo_title}\n`;
      if (p.seo_description) md += `- **seo_description:** ${p.seo_description}\n`;
      if (p.seo_keywords) md += `- **seo_keywords:** ${p.seo_keywords}\n`;
      if (p.seo_text) {
        const st = String(p.seo_text);
        md += `- **seo_text:** ${st.slice(0, 2000)}${st.length > 2000 ? '…' : ''}\n`;
      }
    }

    md += `\n---\n\n`;

    // JSONL: produto completo (um chunk grande por slug)
    const specsText = specs.length ? `Especificações:\n${specs.map((s) => `- ${s}`).join('\n')}` : '';
    const optText = optionals.length ? `Opcionais:\n${optionals.map((s) => `- ${s}`).join('\n')}` : '';
    const imgText = imgs.length ? `Imagens:\n${imgs.map((i) => `- ${i.url}${i.is_primary ? ' (principal)' : ''}`).join('\n')}` : '';

    const productNarrative = `
Produto: ${p.title} (slug: ${slug})
URL Europa: ${productUrl}
Categoria: ${catName} (${catSlug})
${isAccessory ? 'Categoria acessórios: garantia do site 3 meses.' : 'Equipamento: garantia do site 2 anos.'}

PT — ${p.title}
${p.short_description || ''}
${p.detailed_description || ''}

EN — ${p.title_en || p.title}
${p.short_description_en || ''}
${p.detailed_description_en || ''}

ES — ${p.title_es || p.title}
${p.short_description_es || ''}
${p.detailed_description_es || ''}

DE — ${p.title_de || p.title}
${p.short_description_de || ''}
${p.detailed_description_de || ''}

${specsText}
${optText}
${imgText}
`.trim();

    pushChunk(`product-v1-${slug}`, productNarrative, {
      type: 'product_full',
      slug,
      category_slug: catSlug,
      source: 'supabase-products',
    });

    if (specs.length) {
      pushChunk(`product-v1-${slug}-specs`, `Produto ${slug} (${p.title})\n\n${specsText}`, {
        type: 'product_specs',
        slug,
        category_slug: catSlug,
        source: 'supabase-products',
      });
    }
  }

  const policiesMd = localesFound ? buildPoliciesMultilingual(locales) : '';
  if (policiesMd) {
    pushChunk('site-v1-policies-faq', policiesMd, { type: 'policies_faq', source: 'locales' });
  }

  await fs.writeFile(OUT_MD, md, 'utf8');
  const jsonlBody = jsonlChunks.map((c) => JSON.stringify(c)).join('\n') + '\n';
  await fs.writeFile(OUT_JSONL, jsonlBody, 'utf8');

  console.log(`OK: ${OUT_MD}`);
  console.log(`OK: ${OUT_JSONL} (${jsonlChunks.length} chunks)`);
  console.log(`Produtos: ${(products || []).length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
