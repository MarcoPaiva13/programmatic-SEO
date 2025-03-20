// components/dashboard/TimelineChart.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import styles from '@/styles/WebVitalsDashboard.module.css';
import { VITAL_THRESHOLDS } from '@/utils/vitalsUtils';
import { formatMetricValue } from '@/utils/dashboardUtils';

/**
 * Componente para exibir gráfico de tendências temporais de métricas
 */
const TimelineChart = ({ data, metricName }) => {
  // Verificar se temos dados para exibir
  if (!data || data.length < 2) {
    return (
      <div className={styles.noData}>
        <p>Dados insuficientes para gerar gráfico de tendências</p>
        <small>São necessárias métricas de pelo menos dois dias diferentes</small>
      </div>
    );
  }
  
  // Obter limiares para o tipo de métrica selecionado
  const thresholds = VITAL_THRESHOLDS[metricName.toUpperCase()];
  
  // Função para formatar o valor no tooltip
  const formatTooltipValue = (value) => {
    return formatMetricValue(metricName, value);
  };
  
  // Função para formatar data no eixo X
  const formatXAxis = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };
  
  // Função para determinar cor baseada no valor da métrica
  const getLineColor = (item) => {
    if (!thresholds) return '#1e88e5'; // Azul padrão se não houver limiares
    
    if (item.value <= thresholds.good) return '#10b981'; // Verde = bom
    if (item.value <= thresholds.poor) return '#f59e0b'; // Amarelo = precisa melhorar
    return '#ef4444'; // Vermelho = ruim
  };
  
  // Formatter para tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    const value = data.value;
    const formattedValue = formatTooltipValue(value);
    const date = new Date(label).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    let ratingClass;
    if (thresholds) {
      if (value <= thresholds.good) ratingClass = styles.good;
      else if (value <= thresholds.poor) ratingClass = styles.needsImprovement;
      else ratingClass = styles.poor;
    }
    
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>{date}</p>
        <p className={`${styles.tooltipValue} ${ratingClass}`}>
          {formattedValue}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            minTickGap={30}
          />
          <YAxis
            tickFormatter={(value) => formatTooltipValue(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Linhas de referência para bom/precisa melhorar/ruim */}
          {thresholds && (
            <>
              <ReferenceLine
                y={thresholds.good}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: `Bom (${formatTooltipValue(thresholds.good)})`,
                  fill: '#10b981',
                  position: 'right',
                }}
              />
              <ReferenceLine
                y={thresholds.poor}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{
                  value: `Melhoria necessária (${formatTooltipValue(thresholds.poor)})`,
                  fill: '#f59e0b',
                  position: 'right',
                }}
              />
            </>
          )}
          
          <Line
            type="monotone"
            dataKey="value"
            name={metricName}
            stroke="#1e88e5"
            strokeWidth={2}
            dot={{ fill: getLineColor, r: 6 }}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

TimelineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      rating: PropTypes.string
    })
  ).isRequired,
  metricName: PropTypes.string.isRequired
};

export default TimelineChart; 