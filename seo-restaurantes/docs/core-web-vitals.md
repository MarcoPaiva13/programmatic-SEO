# Monitoramento de Core Web Vitals

Este documento descreve a implementação do monitoramento de Core Web Vitals no projeto SEO de restaurantes.

## Métricas Monitoradas

Monitoramos as seguintes métricas:

- **LCP (Largest Contentful Paint)**: Tempo para renderizar o maior elemento visível na viewport.
- **FID (First Input Delay)**: Tempo que leva para o navegador responder à primeira interação do usuário.
- **CLS (Cumulative Layout Shift)**: Medida de instabilidade visual da página.
- **FCP (First Contentful Paint)**: Tempo para renderizar o primeiro conteúdo visível.
- **TTFB (Time to First Byte)**: Tempo até o recebimento do primeiro byte de resposta do servidor.

## Arquitetura da Implementação

### 1. Coleta de Métricas (`pages/_app.js`)

Utilizamos a função `reportWebVitals` do Next.js para coletar métricas em tempo real. Cada métrica é:
- Registrada no console (ambiente de desenvolvimento)
- Enviada para um endpoint de API interno
- Enviada para o Google Analytics (se permitido)

### 2. Armazenamento de Métricas (`pages/api/vitals.js`)

As métricas são armazenadas em:
- Arquivos JSON organizados por data
- Pasta `data/vitals/`
- Formato de nome de arquivo: `YYYY-MM-DD.json`

### 3. Utilidades para Métricas (`utils/vitalsUtils.js`)

Implementamos funções utilitárias para:
- Classificar métricas conforme limiares de qualidade
- Calcular médias para análise
- Obter dados de métricas por intervalo de datas

### 4. API para Análise (`pages/api/vitals/summary.js`)

Disponibilizamos um endpoint para análise que:
- Retorna médias por tipo de métrica
- Permite filtrar por página
- Agrupa dados por período

## Como Funciona

1. Quando um usuário carrega uma página, as métricas são coletadas pelo navegador.
2. A função `reportWebVitals` em `_app.js` é chamada para cada métrica.
3. Os dados são enviados ao endpoint `/api/vitals` via POST.
4. O endpoint armazena os dados em um arquivo JSON.
5. Os dados podem ser analisados via endpoint `/api/vitals/summary`.

## Valores de Referência

| Métrica | Bom       | Precisa Melhorar | Ruim     |
|---------|-----------|------------------|----------|
| LCP     | ≤ 2.5s    | ≤ 4.0s           | > 4.0s   |
| FID     | ≤ 100ms   | ≤ 300ms          | > 300ms  |
| CLS     | ≤ 0.1     | ≤ 0.25           | > 0.25   |
| FCP     | ≤ 1.8s    | ≤ 3.0s           | > 3.0s   |
| TTFB    | ≤ 800ms   | ≤ 1.8s           | > 1.8s   |

## Privacidade e Consentimento

- O monitoramento respeita as preferências de privacidade do usuário
- As métricas só são enviadas se o usuário consentiu com analytics
- Em ambiente de desenvolvimento, as métricas são sempre coletadas

## Exemplos de Uso

### Obter resumo de métricas dos últimos 7 dias:

```
GET /api/vitals/summary
```

### Obter métricas para uma página específica:

```
GET /api/vitals/summary?page=/restaurantes/nome-do-restaurante
```

### Obter métricas para um período específico:

```
GET /api/vitals/summary?start=2023-01-01&end=2023-01-31
``` 