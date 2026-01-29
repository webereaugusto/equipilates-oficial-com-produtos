import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com service_role para operações admin
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://hijmbsxcvcugnmkvldgl.supabase.co';
const SUPABASE_SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

// DELETE - Excluir usuário
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'ID do usuário é obrigatório' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Usuário excluído com sucesso!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno ao excluir usuário' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Atualizar senha do usuário
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'ID do usuário é obrigatório' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Service role key não configurada' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 6) {
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

    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Senha atualizada com sucesso!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno ao atualizar usuário' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
