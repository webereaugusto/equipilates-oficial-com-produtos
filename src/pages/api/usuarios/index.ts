import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com service_role para operações admin
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SUPABASE_SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

// GET - Listar todos os usuários
export const GET: APIRoute = async () => {
  try {
    if (!SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Service role key não configurada' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mapear dados dos usuários para retornar apenas o necessário
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at
    }));

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno ao listar usuários' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Criar novo usuário
export const POST: APIRoute = async ({ request }) => {
  try {
    if (!SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Service role key não configurada' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Email e senha são obrigatórios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Confirma o email automaticamente
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      },
      message: 'Usuário criado com sucesso!'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno ao criar usuário' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
