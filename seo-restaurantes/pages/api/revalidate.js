import { verifySignature } from '@/lib/auth';

/**
 * API para revalidação sob demanda de páginas ISR
 * 
 * Permite forçar a regeneração de uma página específica quando os dados são atualizados
 * sem precisar esperar pelo timeout de revalidação
 * 
 * Segurança:
 * - Requer um token secreto para autorização
 * - Verifica a origem da solicitação
 * - Registra todas as tentativas de revalidação para auditoria
 */
export default async function handler(req, res) {
  // Apenas permitir solicitações POST para esta API
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use POST.' 
    });
  }

  try {
    // Extrair parâmetros da solicitação
    const { slug, secret, type = 'restaurante' } = req.body;

    // Verificar token de segurança
    if (!verifySignature(secret)) {
      console.warn('Tentativa de revalidação com token inválido:', new Date().toISOString());
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou não autorizado' 
      });
    }

    if (!slug) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parâmetro de slug ausente' 
      });
    }

    // Caminho para revalidação baseado no tipo
    let path;
    switch (type) {
      case 'restaurante':
        path = `/restaurantes/${slug}`;
        break;
      case 'categoria':
        path = `/categorias/${slug}`;
        break;
      case 'busca':
        path = `/busca/${slug}`;
        break;
      case 'home':
        path = '/';
        break;
      default:
        path = `/restaurantes/${slug}`;
    }

    // Chamar a função de revalidação do Next.js
    await res.revalidate(path);

    // Registrar a revalidação para monitoramento
    console.log(`[${new Date().toISOString()}] Revalidação realizada: ${path}`);

    return res.status(200).json({
      success: true,
      message: `Página ${path} revalidada com sucesso`,
      revalidatedAt: new Date().toISOString()
    });
  } catch (error) {
    // Capturar e registrar erros para depuração
    console.error('Erro durante revalidação:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao revalidar página',
      error: error.message
    });
  }
} 