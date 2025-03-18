import crypto from 'crypto';

/**
 * Funções de autenticação e segurança para APIs
 * Usadas principalmente para verificar assinaturas em endpoints de revalidação ISR
 */

/**
 * Verifica se o token de segurança é válido
 * @param {string} providedSecret - O token fornecido na requisição
 * @returns {boolean} - Verdadeiro se o token for válido
 */
export function verifySignature(providedSecret) {
  // Na produção, use um token seguro de ambiente
  const expectedSecret = process.env.REVALIDATION_SECRET || 'default_development_secret';
  
  // Em produção, use uma comparação segura (timing-safe) para prevenir ataques de timing
  if (process.env.NODE_ENV === 'production') {
    // Método seguro de comparação para evitar ataques de timing
    return crypto.timingSafeEqual(
      Buffer.from(providedSecret || ''),
      Buffer.from(expectedSecret)
    );
  }
  
  // Em desenvolvimento, comparação simples
  return providedSecret === expectedSecret;
}

/**
 * Gera um hash HMAC para validação de webhooks
 * @param {string} payload - O conteúdo a ser assinado
 * @param {string} secret - O segredo compartilhado
 * @returns {string} - A assinatura gerada
 */
export function generateSignature(payload, secret = process.env.WEBHOOK_SECRET) {
  return crypto
    .createHmac('sha256', secret || 'webhook_development_secret')
    .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
    .digest('hex');
}

/**
 * Verifica se uma requisição de webhook é autêntica
 * @param {object} req - O objeto de requisição
 * @returns {boolean} - Verdadeiro se a assinatura for válida
 */
export function verifyWebhook(req) {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body;
  
  if (!signature) return false;
  
  const expectedSignature = generateSignature(payload);
  return signature === expectedSignature;
} 