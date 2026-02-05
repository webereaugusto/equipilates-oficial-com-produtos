// Mapeamento de slug do produto para nome do arquivo de imagem
export const productImageMap: Record<string, string> = {
  // Linha Clássica
  'cadillac-aluminum': 'cadillac aluminio.webp',
  'reformer-86-aluminum': 'reformer aluminium.webp',
  'reformer-torre-aluminum': 'reformer aluminium.webp', // usa mesma imagem
  'guilotina-aluminum': 'guilhotina.webp',
  'wunda-chair': 'electric chair.webp',
  'arm-chair': 'arm-chair.webp',
  'ladder-barrel-classico': 'lader barrel.webp',
  'wall-unit-classico': 'mat.webp', // placeholder
  'mat-classico': 'mat.webp',
  'mat-portatil': 'mat portatil.webp',
  'bench-mat': 'bench-mat.webp',
  
  // Linha Contemporânea
  'reformer-torre': 'reformer-torre.webp',
  'cadillac': 'reformer-torre.webp', // placeholder
  'reformer': 'reformer.webp',
  'step-chair': 'step-chair.webp',
  'ladder-barrel': 'ladder-barrel.webp',
  'wall-unit': 'reformer.webp', // placeholder
  'prancha-de-molas': 'prancha-de-molas.webp',
  
  // Acessórios (catálogo PDF 21.10.2025)
  'airplane-board': 'bench-mat.webp',
  'neck-stretcher': 'bench-mat.webp',
  'small-barrel': 'bench-mat.webp',
  'bean-bag': 'bench-mat.webp',
  'hand-tens-o-meter': 'bench-mat.webp',
  'push-up-device': 'bench-mat.webp',
  'plataforma-barrel-classico': 'bench-mat.webp',
  'magic-circle-archive': 'bench-mat.webp',
  'foot-corrector-aluminium': 'bench-mat.webp',
  'breath-a-cizer': 'bench-mat.webp',
  'travesseiro-benchmat': 'bench-mat.webp',
  'travesseiro-meia-lua': 'bench-mat.webp',
  'travesseiro-regua': 'bench-mat.webp',
  'travesseiro-ombreira-reformer': 'bench-mat.webp',
  'travesseiro-cervical-cilindrico': 'bench-mat.webp',
  'travesseiro-cabeceira-espuma-4cm-espessura': 'bench-mat.webp',
  'travesseiro-cabeceira-espuma-3cm-espessura': 'bench-mat.webp',
  'pedi-pole': 'pedi pole.webp',
  'toe-exerciser': 'bench-mat.webp',
  'pad-classico': 'bench-mat.webp',
  'spine-corrector': 'bench-mat.webp',
  'kuna-board': 'pedi pole.webp',
  'two-by-four': 'pedi pole.webp',
  'bastao-aluminio-150': 'pedi pole.webp',
  'spacer-box': 'bench-mat.webp',
};

// Mapeamento de categoria para pasta de imagens
const categoryFolderMap: Record<string, string> = {
  'linha-classica': 'linha-classic',
  'linha-contemporanea': 'linha-contemporanea',
  'acessorios': 'linha-classic', // acessórios usam imagens da linha clássica por enquanto
};

// Função para obter o caminho da imagem do produto
export function getProductImagePath(slug: string, categorySlug: string): string {
  const folder = categoryFolderMap[categorySlug] || 'linha-classic';
  const fileName = productImageMap[slug];
  
  if (fileName) {
    // Codifica espaços para URL
    return `/images/${folder}/${encodeURIComponent(fileName)}`;
  }
  
  // Fallback para o logo
  return '/images/logo-equipilates.webp';
}
