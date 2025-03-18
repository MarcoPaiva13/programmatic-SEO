// contentGenerator.js
// Gerador de conteúdo dinâmico para páginas de restaurantes

// Templates para diferentes seções do conteúdo
const templates = {
  introducao: [
    "Bem-vindo ao {nome}, um {tipo} que se destaca em {cidade} por sua {especialidade}. Localizado no coração de {bairro}, este estabelecimento oferece uma experiência gastronômica única que combina {caracteristica1} e {caracteristica2}.",
    "O {nome} é um {tipo} tradicional em {cidade}, situado em {bairro}. Com {anos} anos de história, o restaurante se tornou referência em {especialidade}, atraindo clientes que buscam {caracteristica1} e {caracteristica2}.",
    "Descubra o {nome}, um {tipo} que conquistou o paladar dos {cidade}nses. Localizado em {bairro}, o estabelecimento se destaca por sua {especialidade} e ambiente {caracteristica1}."
  ],
  
  historia: [
    "Fundado em {ano} por {fundador}, o {nome} nasceu da paixão pela {especialidade}. A história deste {tipo} em {cidade} começou com uma pequena cozinha e hoje se transformou em um dos mais respeitados estabelecimentos de {bairro}.",
    "A trajetória do {nome} em {cidade} começou em {ano}, quando {fundador} decidiu compartilhar sua expertise em {especialidade}. O {tipo} rapidamente se tornou um ponto de referência em {bairro}.",
    "Com uma história que remonta a {ano}, o {nome} foi criado por {fundador} com o objetivo de oferecer a melhor experiência em {especialidade} em {cidade}. Localizado em {bairro}, o {tipo} mantém viva a tradição."
  ],
  
  especialidades: [
    "As especialidades do {nome} incluem {prato1}, {prato2} e {prato3}, todos preparados com ingredientes frescos e técnicas tradicionais. O {tipo} em {cidade} se destaca por sua {especialidade}.",
    "No cardápio do {nome}, você encontra {prato1}, {prato2} e {prato3}, pratos que representam o melhor da {especialidade}. Este {tipo} em {bairro}, {cidade}, oferece uma experiência gastronômica única.",
    "O {nome} é conhecido por suas especialidades como {prato1}, {prato2} e {prato3}. Como um dos melhores {tipo}s de {cidade}, o estabelecimento em {bairro} mantém a excelência em {especialidade}."
  ],
  
  ambiente: [
    "O ambiente do {nome} combina {caracteristica1} e {caracteristica2}, criando uma atmosfera perfeita para {ocasiao1} e {ocasiao2}. Este {tipo} em {bairro}, {cidade}, oferece uma experiência completa.",
    "Com decoração {caracteristica1} e ambiente {caracteristica2}, o {nome} é ideal para {ocasiao1} e {ocasiao2}. O {tipo} em {cidade} se destaca por sua atmosfera acolhedora.",
    "O {nome} oferece um ambiente {caracteristica1} e {caracteristica2}, perfeito para {ocasiao1} e {ocasiao2}. Localizado em {bairro}, {cidade}, este {tipo} proporciona momentos especiais."
  ]
};

// Características e ocasiões para variação de conteúdo
const caracteristicas = {
  ambiente: ["aconchegante", "elegante", "moderno", "tradicional", "rústico", "contemporâneo"],
  ocasioes: ["jantares românticos", "encontros com amigos", "reuniões de família", "celebrationes especiais", "almoços de negócios"],
  tipos: ["restaurante", "cantina", "trattoria", "bistrô", "casa de massas", "casa de especialidades"]
};

// Função para calcular densidade de palavras-chave
function calcularDensidadePalavrasChave(texto, palavrasChave) {
  const palavras = texto.toLowerCase().split(/\s+/);
  const totalPalavras = palavras.length;
  let contagemPalavrasChave = 0;

  palavrasChave.forEach(palavra => {
    const regex = new RegExp(palavra.toLowerCase(), 'g');
    const matches = texto.toLowerCase().match(regex) || [];
    contagemPalavrasChave += matches.length;
  });

  return (contagemPalavrasChave / totalPalavras) * 100;
}

// Função para ajustar densidade de palavras-chave
function ajustarDensidadePalavrasChave(texto, palavrasChave, densidadeAlvo = 2.2) {
  let densidadeAtual = calcularDensidadePalavrasChave(texto, palavrasChave);
  
  if (densidadeAtual < densidadeAlvo - 0.5) {
    // Adicionar mais palavras-chave naturalmente
    const paragrafos = texto.split('\n\n');
    const paragrafoAleatorio = paragrafos[Math.floor(Math.random() * paragrafos.length)];
    const palavrasChaveAleatoria = palavrasChave[Math.floor(Math.random() * palavrasChave.length)];
    
    const novoParagrafo = paragrafoAleatorio.replace(/\./g, `, destacando nossa ${palavrasChaveAleatoria}.`);
    paragrafos[paragrafos.indexOf(paragrafoAleatorio)] = novoParagrafo;
    
    return paragrafos.join('\n\n');
  }
  
  return texto;
}

// Função para selecionar template aleatório
function selecionarTemplate(tipo) {
  const templatesDisponiveis = templates[tipo];
  return templatesDisponiveis[Math.floor(Math.random() * templatesDisponiveis.length)];
}

// Função para gerar conteúdo completo
export function gerarConteudoRestaurante(restaurante) {
  const palavrasChave = restaurante.keywords;
  let conteudo = '';
  
  // Gerar introdução
  let introducao = selecionarTemplate('introducao')
    .replace('{nome}', restaurante.name)
    .replace('{tipo}', caracteristicas.tipos[Math.floor(Math.random() * caracteristicas.tipos.length)])
    .replace('{cidade}', restaurante.city)
    .replace('{bairro}', restaurante.neighborhood)
    .replace('{especialidade}', restaurante.specialties[0])
    .replace('{caracteristica1}', caracteristicas.ambiente[Math.floor(Math.random() * caracteristicas.ambiente.length)])
    .replace('{caracteristica2}', caracteristicas.ambiente[Math.floor(Math.random() * caracteristicas.ambiente.length)]);
  
  conteudo += introducao + '\n\n';
  
  // Gerar história
  let historia = selecionarTemplate('historia')
    .replace('{nome}', restaurante.name)
    .replace('{ano}', restaurante.establishment.foundedYear)
    .replace('{fundador}', restaurante.establishment.founder)
    .replace('{tipo}', caracteristicas.tipos[Math.floor(Math.random() * caracteristicas.tipos.length)])
    .replace('{cidade}', restaurante.city)
    .replace('{bairro}', restaurante.neighborhood)
    .replace('{especialidade}', restaurante.specialties[0]);
  
  conteudo += historia + '\n\n';
  
  // Gerar especialidades
  let especialidades = selecionarTemplate('especialidades')
    .replace('{nome}', restaurante.name)
    .replace('{tipo}', caracteristicas.tipos[Math.floor(Math.random() * caracteristicas.tipos.length)])
    .replace('{cidade}', restaurante.city)
    .replace('{bairro}', restaurante.neighborhood)
    .replace('{especialidade}', restaurante.specialties[0])
    .replace('{prato1}', restaurante.menuHighlights[0].name)
    .replace('{prato2}', restaurante.menuHighlights[1].name)
    .replace('{prato3}', restaurante.menuHighlights[2].name);
  
  conteudo += especialidades + '\n\n';
  
  // Gerar ambiente
  let ambiente = selecionarTemplate('ambiente')
    .replace('{nome}', restaurante.name)
    .replace('{tipo}', caracteristicas.tipos[Math.floor(Math.random() * caracteristicas.tipos.length)])
    .replace('{cidade}', restaurante.city)
    .replace('{bairro}', restaurante.neighborhood)
    .replace('{caracteristica1}', caracteristicas.ambiente[Math.floor(Math.random() * caracteristicas.ambiente.length)])
    .replace('{caracteristica2}', caracteristicas.ambiente[Math.floor(Math.random() * caracteristicas.ambiente.length)])
    .replace('{ocasiao1}', caracteristicas.ocasioes[Math.floor(Math.random() * caracteristicas.ocasioes.length)])
    .replace('{ocasiao2}', caracteristicas.ocasioes[Math.floor(Math.random() * caracteristicas.ocasioes.length)]);
  
  conteudo += ambiente + '\n\n';
  
  // Ajustar densidade de palavras-chave
  conteudo = ajustarDensidadePalavrasChave(conteudo, palavrasChave);
  
  return conteudo;
}

// Função para gerar descrição curta (meta description)
export function gerarDescricaoCurta(restaurante) {
  return `${restaurante.name} - ${restaurante.cuisine.join(' e ')} em ${restaurante.neighborhood}, ${restaurante.city}. ${restaurante.specialties.join(', ')}. Avaliação ${restaurante.rating}/5.`;
}

// Função para gerar título otimizado
export function gerarTituloOtimizado(restaurante) {
  return `${restaurante.name} - ${restaurante.cuisine.join(', ')} em ${restaurante.neighborhood}, ${restaurante.city} | Guia de Restaurantes`;
} 