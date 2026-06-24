// netlify/functions/events.js
//
// Proxy para a API pública do Só Foto.
// O navegador não consegue chamar api.sofoto.com.br diretamente porque
// o CORS dela só libera origem `sofoto.com.br`. Esta função roda no
// servidor (sem regras de CORS) e devolve os dados pro app com CORS livre.
//
// Endpoint chamado: GET https://api.sofoto.com.br/v2/teams/eunagarupa/events
//   ?page=1&perPage=20
//
// Resposta filtrada: só eventos com isPublished === 1.
//
// Cache de 5 minutos (Cache-Control) reduz carga na API quando vários
// clientes abrem o app em sequência.

const API_BASE = 'https://api.sofoto.com.br/v2/teams/eunagarupa';

export default async (req) => {
  const url = new URL(req.url);
  const page = url.searchParams.get('page') || '1';
  const perPage = url.searchParams.get('perPage') || '20';

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const apiUrl = `${API_BASE}/events?page=${page}&perPage=${perPage}`;
    const apiRes = await fetch(apiUrl, {
      headers: { Accept: 'application/json' }
    });

    if (!apiRes.ok) {
      return new Response(
        JSON.stringify({
          error: 'upstream_error',
          status: apiRes.status,
          message: `Sofoto API retornou ${apiRes.status}`
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const data = await apiRes.json();

    // A API do sofoto retorna no formato:
    //   { formattedEvents: [...], meta: {...} }
    // Cobrimos também variações genéricas pra robustez.
    const events =
      data.formattedEvents ||
      data.data ||
      data.events ||
      (Array.isArray(data) ? data : []);

    // Filtra apenas publicados — isPublished pode vir como 1 ou true
    const published = events.filter(
      (e) => e && (e.isPublished === 1 || e.isPublished === true)
    );

    return new Response(JSON.stringify({ events: published, total: published.length }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'proxy_failure', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};
