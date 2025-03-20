import fs from 'fs';
import path from 'path';

/**
 * API Endpoint para armazenar métricas de Core Web Vitals
 * 
 * Recebe dados de métricas via POST e os armazena em um arquivo JSON
 * organizado por data, em data/vitals/YYYY-MM-DD.json
 * 
 * @param {object} req - Objeto de requisição Next.js
 * @param {object} res - Objeto de resposta Next.js
 */
export default async function handler(req, res) {
  // Verificar se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Validar o corpo da requisição
    const { 
      name, id, value, delta, rating, navigationType, page, userAgent, timestamp 
    } = req.body;

    // Verificar se os campos obrigatórios estão presentes
    if (!name || !id || value === undefined) {
      return res.status(400).json({ error: 'Dados de métrica incompletos' });
    }

    // Obter a data atual no formato YYYY-MM-DD para nomear o arquivo
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Caminho para o arquivo de dados do dia
    const dataDir = path.join(process.cwd(), 'data', 'vitals');
    const filePath = path.join(dataDir, `${dateString}.json`);
    
    // Verificar se o diretório existe, senão criar
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Dados a serem armazenados
    const metricData = {
      name,
      id,
      value,
      delta,
      rating,
      navigationType,
      page,
      userAgent,
      timestamp: timestamp || new Date().toISOString(),
    };
    
    // Ler o arquivo existente ou criar um novo
    let fileData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      try {
        fileData = JSON.parse(fileContent);
        if (!Array.isArray(fileData)) {
          fileData = [];
        }
      } catch (error) {
        console.error('Erro ao parsear arquivo de métricas:', error);
        fileData = [];
      }
    }
    
    // Adicionar a nova métrica aos dados existentes
    fileData.push(metricData);
    
    // Salvar o arquivo atualizado
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
    
    // Responder com sucesso
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao processar requisição de métricas:', error);
    return res.status(500).json({ error: 'Erro interno ao processar métricas' });
  }
} 