// components/dashboard/PageComparisonChart.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import styles from '@/styles/WebVitalsDashboard.module.css';
import { VITAL_THRESHOLDS } from '@/utils/vitalsUtils';
import { formatMetricValue, getMetricRating } from '@/utils/dashboardUtils';

/**
 * Componente para exibir gráfico de comparação de métricas entre páginas
 */
const PageComparisonChart = ({ data, metricName }) => {
  // Verificar se temos dados para exibir
  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>
        <p>Sem dados para comparação entre páginas</p>
      </div>
    );
  }
  
  // Obter limiares para o tipo de métrica selecionado
  const thresholds = VITAL_THRESHOLDS[metricName.toUpperCase()];
  
  // Formatter para o eixo Y
  const formatYAxis = (value) => {
    return formatMetricValue(metricName, value);
  };
  
  // Formatter para o tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    const value = data.value;
    const rating = getMetricRating(metricName, value);
    const formattedValue = formatMetricValue(metricName, value);
    
    let ratingText, ratingClass;
    if (rating === 'good') {
      ratingText = 'Bom';
      ratingClass = styles.good;
    } else if (rating === 'needs-improvement') {
      ratingText = 'Precisa Melhorar';
      ratingClass = styles.needsImprovement;
    } else {
      ratingText = 'Ruim';
      ratingClass = styles.poor;
    }
    
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={`${styles.tooltipValue} ${ratingClass}`}>
          {formattedValue} <span>({ratingText})</span>
        </p>
      </div>
    );
  };
  
  // Função para determinar cor das barras com base na métrica
  const getBarColor = (entry) => {
    if (!thresholds) return '#1e88e5'; // Azul padrão
    
    if (entry.value <= thresholds.good) return '#10b981'; // Verde = bom
    if (entry.value <= thresholds.poor) return '#f59e0b'; // Amarelo = precisa melhorar
    return '#ef4444'; // Vermelho = ruim
  };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            tickFormatter={formatYAxis}
          />
          <YAxis 
            type="category" 
            dataKey="page" 
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Linhas de referência para bom/precisa melhorar/ruim */}
          {thresholds && (
            <>
              <ReferenceLine
                x={thresholds.good}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: `Bom (${formatMetricValue(metricName, thresholds.good)})`,
                  fill: '#10b981',
                  position: 'top',
                }}
              />
              <ReferenceLine
                x={thresholds.poor}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{
                  value: `Melhoria necessária (${formatMetricValue(metricName, thresholds.poor)})`,
                  fill: '#f59e0b',
                  position: 'top',
                }}
              />
            </>
          )}
          
          <Bar 
            dataKey="value" 
            name={metricName} 
            fill="#1e88e5"
            animationDuration={500}
            isAnimationActive={true}
            label={{ 
              position: 'right', 
              formatter: formatYAxis,
              fontSize: 12
            }}
            shape={(props) => {
              // Alterar cor com base na métrica
              return <rect 
                {...props} 
                fill={getBarColor(props.payload)} 
                radius={[0, 4, 4, 0]}
              />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

PageComparisonChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      page: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      rating: PropTypes.string
    })
  ).isRequired,
  metricName: PropTypes.string.isRequired
};

export default PageComparisonChart; 