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
  
  // Acessórios
  'kuna-board': 'pedi pole.webp', // placeholder - substituir quando tiver imagem
  'two-by-four': 'pedi pole.webp', // placeholder
  'bastao-aluminio-150': 'pedi pole.webp', // placeholder
  'spacer-box': 'bench-mat.webp', // placeholder
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
