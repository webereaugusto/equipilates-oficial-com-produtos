/**
 * Seed: cadastra os 21 acessórios do catálogo PDF (itens 1-21).
 * Os itens 22-25 (Kuna Board, 2x4, Bastão Alumínio, Spacer Box) já existem no banco.
 *
 * Uso: node --env-file=.env.local scripts/seed-acessorios-pdf.js
 * Ou: set SUPABASE_SERVICE_ROLE_KEY=... && set PUBLIC_SUPABASE_URL=... && node scripts/seed-acessorios-pdf.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex.: node --env-file=.env.local scripts/seed-acessorios-pdf.js)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SEO_KEYWORDS = 'acessórios pilates, equipamentos pilates, pilates clássico';

const ACESSORIOS_NOVOS = [
  {
    title: 'Airplane Board',
    price: 200,
    short_description: 'Estabilidade e suporte em exercícios complexos para praticantes avançados.',
    detailed_description: 'O Airplane Board é especialmente utilizado por praticantes mais avançados do método e tem como principal finalidade a estabilidade e suporte durante exercícios complexos que exigem alto controle corporal e força.',
  },
  {
    title: 'Neck Stretcher',
    price: 390,
    short_description: 'Acessório de Joseph Pilates para desenvolvimento e fortalecimento da região cervical.',
    detailed_description: 'O Neck Stretcher é um acessório criado por Joseph Pilates para o trabalho de desenvolvimento da região cervical. Desenvolvido para fortalecimento da região cervical.',
  },
  {
    title: 'Small Barrel',
    price: 990,
    short_description: 'Compacto, portátil; ideal para estudos e uso pessoal.',
    detailed_description: 'Compacto, portátil e fácil de usar, o Small Barrel é ideal tanto para estudos profissionais quanto para uso pessoal. Sua altura rasa acomoda praticantes com menos flexibilidade ou uma amplitude de movimento mais limitada. Com uma superfície acolchoada, este aparelho envolve o corpo e permite uma experiência de usuário confortável.',
  },
  {
    title: 'Bean Bag',
    price: 150,
    short_description: 'Alinhamento da cintura escapular e fortalecimento de ombros e punhos.',
    detailed_description: 'O Bean Bag é muito efetivo para o alinhamento da cintura escapular e fortalecimento principal da articulação dos ombros superiores, punhos e articulação metacarpal, sendo um tratamento preventivo ou de reabilitação na ocorrência de tendinite nesta região.',
  },
  {
    title: 'Hand Tens-o-Meter',
    price: 250,
    short_description: 'Acessório manual do estúdio de Joe para fortalecimento de mãos e dedos.',
    detailed_description: 'Este "Acessório manual" foi originalmente usado no estúdio de Joe para fortalecer as mãos, também foram criados para criar consciência, conexão e força em partes do corpo que tendem a ser deixadas de fora no condicionamento físico moderno - mãos e dedos, por exemplo.',
  },
  {
    title: 'Push Up Device',
    price: 1100,
    short_description: 'Exercícios de flexão de antebraço em várias posições; equilíbrio com mãos apoiadas.',
    detailed_description: 'O Push Up Device é um acessório utilizado para executar exercícios de flexão de antebraço em várias posições. Em níveis mais avançados, é possível realizar séries equilibrando o corpo com as mãos apoiadas sobre esse acessório.',
  },
  {
    title: 'Plataforma Barrel Clássico',
    price: 380,
    short_description: 'Plataforma na escada ou espaldar do Barrel para auxiliar alunos de baixa estatura.',
    detailed_description: 'A plataforma é utilizada na escada ou espaldar do Barrel para auxiliar os alunos de baixa estatura em alguns exercícios.',
  },
  {
    title: 'Magic Circle Archive',
    price: 390,
    short_description: 'Acessórios clássicos originais de Joseph Pilates.',
    detailed_description: 'Mantendo suas características originais, o Magic Circle Archive é perfeito para os amantes dos acessórios clássicos originais criados por Joseph Pilates.',
  },
  {
    title: 'Foot Corrector Aluminium',
    price: 690,
    short_description: 'Mesma medida e configurações do clássico de madeira; estrutura em alumínio.',
    detailed_description: 'O Foot Corrector Aluminium possui a mesma medida e configurações do clássico de madeira, com exceção da matéria prima da estrutura, que é integralmente de Alumínio.',
  },
  {
    title: 'Breath a Cizer',
    price: 300,
    short_description: 'Acessório para melhora da capacidade pulmonar.',
    detailed_description: 'O Breath-a-Cizer é um acessório criado para melhora da capacidade pulmonar. O próprio Joseph Pilates dizia: "Ponha todo ar para fora".',
  },
  {
    title: 'Travesseiro BenchMat',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Travesseiro Meia Lua',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Travesseiro Régua',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Travesseiro Ombreira Reformer',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Travesseiro Cervical Cilíndrico',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Travesseiro Cabeceira Espuma 4cm espessura',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Travesseiro Cabeceira Espuma 3cm espessura',
    price: 120,
    short_description: 'Almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
    detailed_description: 'As almofadas auxiliam no posicionamento do corpo e na execução dos exercícios.',
  },
  {
    title: 'Pedi Pole',
    price: 1500,
    short_description: 'Ajuda na postura; melhora controle, alinhamento e equilíbrio. Inclui par de alças e par de molas Roll Down.',
    detailed_description: 'Criado com o objetivo de ajudar na postura a cantores de ópera, os exercícios realizados neste equipamento melhorariam a postura total, aumentando o controle, o alinhamento e o equilíbrio do utilizador. Inclui 01 Par de alças de mão e 01 par de molas Roll Down.',
  },
  {
    title: 'Toe Exerciser',
    price: 260,
    short_description: 'Fortalecer e aumentar amplitude articular dos dedos; auxílio em problemas como joanetes.',
    detailed_description: 'O Toe Exerciser é um acessório utilizado para fortalecer e aumentar a amplitude articular dos dedos. Utilizando a resistência da mola, que está localizada no centro, o aluno pode realizar vários exercícios, segurando nas extremidades, fazendo pressão para a mola abrir. Esse exercício é muito eficiente no auxílio de problemas como joanetes.',
  },
  {
    title: 'Pad Clássico',
    price: 100,
    short_description: 'Par de Pad antiderrapante.',
    detailed_description: 'Par de Pad antiderrapante para uso nos equipamentos de Pilates.',
  },
  {
    title: 'Spine Corrector',
    price: 1190,
    short_description: 'Trabalha flexibilidade da coluna, corrige postura; ideal para quadril e ombro; aulas em grupo.',
    detailed_description: 'O Spine Corrector foi criado para trabalhar a flexibilidade da coluna, corrigindo a postura, ideal para o quadril e ombro. Ideal para aulas em grupo.',
  },
];

async function run() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'acessorios').single();
  if (!cat) {
    console.error('Categoria "acessorios" não encontrada.');
    process.exit(1);
  }
  const categoryId = cat.id;
  console.log('Categoria Acessórios:', categoryId);

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < ACESSORIOS_NOVOS.length; i++) {
    const p = ACESSORIOS_NOVOS[i];
    const slug = slugify(p.title);
    const row = {
      category_id: categoryId,
      title: p.title,
      slug,
      short_description: p.short_description,
      detailed_description: p.detailed_description,
      technical_specs: [],
      price: p.price,
      optional_items: [],
      seo_title: `${p.title} | Equipilates`,
      seo_description: p.short_description,
      seo_keywords: SEO_KEYWORDS,
      seo_text: null,
      is_active: true,
      order_index: i + 1,
    };

    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (existing) {
      console.log(`  [pular] ${slug} (já existe)`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from('products').insert(row);
    if (error) {
      console.error(`  [erro] ${slug}:`, error.message);
      continue;
    }
    console.log(`  [ok] ${slug}`);
    inserted++;
  }

  console.log('\nConcluído:', inserted, 'inseridos,', skipped, 'já existiam.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
