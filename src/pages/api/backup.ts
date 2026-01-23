import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolver caminho do projeto (src/pages/api -> raiz do projeto)
const projectRoot = path.resolve(__dirname, '..', '..', '..');

// Configuração do Supabase
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpam1ic3hjdmN1Z25ta3ZsZGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzk1MzUsImV4cCI6MjA4NDI1NTUzNX0.Q4Hy-K8RxhVDCarj_ojD5ILb11iO4Jk7KC-5fYlrTh0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função para gerar nome do arquivo
function getBackupFileName(backupDatabase: boolean, backupStorage: boolean, backupCode: boolean) {
  const now = new Date();
  const dateStr = now.toISOString()
    .replace(/T/, '-')
    .replace(/\..+/, '')
    .replace(/:/g, '');
  
  const components = [];
  if (backupDatabase) components.push('db');
  if (backupStorage) components.push('storage');
  if (backupCode) components.push('code');
  
  const suffix = components.length === 3 ? 'all' : components.join('-');
  return `backup-${dateStr}-${suffix}.zip`;
}

// Função para exportar banco de dados
async function exportDatabase() {
  const tables = ['categories', 'products', 'site_settings', 'product_images'];
  const data: Record<string, any> = {};
  
  for (const table of tables) {
    const { data: tableData, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) {
      console.error(`Erro ao exportar ${table}:`, error.message);
      data[table] = [];
    } else {
      data[table] = tableData || [];
    }
  }
  
  return data;
}

// Função para baixar imagens do Storage
async function downloadStorageImages() {
  const { data: files, error } = await supabase
    .storage
    .from('product-images')
    .list('', {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
  
  if (error) {
    console.error('Erro ao listar imagens:', error.message);
    return {};
  }
  
  const images: Record<string, Buffer> = {};
  
  for (const file of files || []) {
    if (file.name && !file.name.endsWith('/')) {
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('product-images')
        .download(file.name);
      
      if (!downloadError && fileData) {
        const buffer = await fileData.arrayBuffer();
        images[file.name] = Buffer.from(buffer);
      }
    }
  }
  
  return images;
}

// Função para copiar arquivos do código
async function copyCodeFiles() {
  const codeFiles = {
    'package.json': path.join(projectRoot, 'package.json'),
    '.env.example': path.join(projectRoot, '.env.example'),
    'README.md': path.join(projectRoot, 'README.md'),
    'vercel.json': path.join(projectRoot, 'vercel.json')
  };
  
  const files: Record<string, string> = {};
  
  for (const [name, filePath] of Object.entries(codeFiles)) {
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf-8');
      files[name] = content;
    }
  }
  
  return files;
}

// Função para criar ZIP
async function createZip(
  databaseData: Record<string, any> | null,
  storageImages: Record<string, Buffer> | null,
  codeFiles: Record<string, string> | null,
  backupDatabase: boolean,
  backupStorage: boolean,
  backupCode: boolean
): Promise<string> {
  const backupsDir = path.join(projectRoot, 'backups');
  await fs.ensureDir(backupsDir);
  
  const fileName = getBackupFileName(backupDatabase, backupStorage, backupCode);
  const zipPath = path.join(backupsDir, fileName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      resolve(zipPath);
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    
    // Adicionar dados do banco
    if (backupDatabase && databaseData) {
      for (const [table, data] of Object.entries(databaseData)) {
        archive.append(JSON.stringify(data, null, 2), { name: `database/${table}.json` });
      }
    }
    
    // Adicionar imagens
    if (backupStorage && storageImages) {
      for (const [fileName, buffer] of Object.entries(storageImages)) {
        archive.append(buffer, { name: `storage/product-images/${fileName}` });
      }
    }
    
    // Adicionar arquivos de código
    if (backupCode && codeFiles) {
      for (const [fileName, content] of Object.entries(codeFiles)) {
        archive.append(content, { name: `code/${fileName}` });
      }
    }
    
    // Adicionar metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      components: {
        database: backupDatabase,
        storage: backupStorage,
        code: backupCode
      },
      version: '1.0.0'
    };
    archive.append(JSON.stringify(metadata, null, 2), { name: 'metadata.json' });
    
    // Adicionar README
    const readme = `Backup gerado em ${new Date().toLocaleString('pt-BR')}

Componentes incluídos:
${backupDatabase ? '- Banco de Dados (database/)\n' : ''}${backupStorage ? '- Imagens do Storage (storage/)\n' : ''}${backupCode ? '- Código do Projeto (code/)\n' : ''}

Para restaurar:
1. Descompacte este arquivo ZIP
2. Restaure os arquivos JSON do diretório database/ no Supabase
3. Faça upload das imagens do diretório storage/ para o bucket product-images
4. Copie os arquivos de code/ para o projeto
`;
    archive.append(readme, { name: 'README.txt' });
    
    archive.finalize();
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const database = formData.get('database') === '1';
    const storage = formData.get('storage') === '1';
    const code = formData.get('code') === '1';
    
    if (!database && !storage && !code) {
      return new Response(JSON.stringify({ error: 'Selecione pelo menos um componente para backup' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let databaseData = null;
    let storageImages = null;
    let codeFiles = null;
    
    if (database) {
      databaseData = await exportDatabase();
    }
    
    if (storage) {
      storageImages = await downloadStorageImages();
    }
    
    if (code) {
      codeFiles = await copyCodeFiles();
    }
    
    const zipPath = await createZip(databaseData, storageImages, codeFiles, database, storage, code);
    const fileName = path.basename(zipPath);
    
    return new Response(JSON.stringify({ 
      success: true,
      fileName,
      message: 'Backup criado com sucesso!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao criar backup:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao criar backup: ' + (error.message || 'Erro desconhecido')
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
