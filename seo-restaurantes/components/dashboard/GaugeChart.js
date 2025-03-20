// components/dashboard/GaugeChart.js
import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import styles from '@/styles/WebVitalsDashboard.module.css';
import { VITAL_THRESHOLDS } from '@/utils/vitalsUtils';
import { formatMetricValue, translateRating, getRatingClass } from '@/utils/dashboardUtils';

/**
 * Componente para exibir um gráfico de medidor/gauge para uma métrica
 */
const GaugeChart = ({ value, metricName, rating }) => {
  // Se não houver valor, exibir mensagem
  if (value === undefined || value === null) {
    return (
      <div className={styles.noData}>
        <p>Sem dados suficientes</p>
      </div>
    );
  }
  
  // Obter limiares para o tipo de métrica selecionado
  const thresholds = VITAL_THRESHOLDS[metricName.toUpperCase()];
  
  // Calcular configurações do gauge baseado no tipo de métrica
  let minValue = 0;
  let maxValue = thresholds ? thresholds.poor * 1.5 : value * 2;
  
  // Para CLS, temos outra abordagem, já que é número menor
  if (metricName === 'CLS') {
    maxValue = 1;
  }
  
  // Calcular valor de preenchimento (0 a 1)
  const fillPercent = Math.min(1, Math.max(0, value / maxValue));
  
  // Determinar cor baseada na classificação
  let color;
  if (rating === 'good') {
    color = '#10b981'; // Verde = bom
  } else if (rating === 'needs-improvement') {
    color = '#f59e0b'; // Amarelo = precisa melhorar
  } else {
    color = '#ef4444'; // Vermelho = ruim
  }
  
  // Dados para o gráfico de pizza (usado como gauge)
  const gaugeData = [
    { name: 'filled', value: fillPercent },
    { name: 'empty', value: 1 - fillPercent }
  ];
  
  // Classes CSS baseadas na classificação
  const ratingClass = getRatingClass(rating);
  
  return (
    <div className={styles.gaugeCard}>
      <h4 className={styles.gaugeTitle}>{metricName}</h4>
      
      <div style={{ width: '100%', height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={0}
              dataKey="value"
              isAnimationActive={true}
            >
              <Cell key="filled" fill={color} />
              <Cell key="empty" fill="#e5e7eb" />
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox;
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={styles[ratingClass]}
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          fill: 'currentColor'
                        }}
                      >
                        {formatMetricValue(metricName, value)}
                      </text>
                    </g>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className={`${styles.gaugeValue} ${styles[ratingClass]}`}>
        {translateRating(rating)}
      </div>
    </div>
  );
};

GaugeChart.propTypes = {
  value: PropTypes.number,
  metricName: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired
};

export default GaugeChart; 