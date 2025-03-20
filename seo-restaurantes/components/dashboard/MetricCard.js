import React from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/WebVitalsDashboard.module.css';
import { formatMetricValue, translateRating, getRatingClass, getBadgeClass } from '@/utils/dashboardUtils';

/**
 * Componente para exibir um cartão com informações de uma métrica específica
 */
const MetricCard = ({ title, description, value, metricName, rating }) => {
  // Classes CSS baseadas na classificação da métrica
  const valueClass = getRatingClass(rating);
  const badgeClass = getBadgeClass(rating);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      {description && <p className={styles.cardDescription}>{description}</p>}
      
      <div className={styles.metricValue + ' ' + styles[valueClass]}>
        {formatMetricValue(metricName, value)}
        <span className={`${styles.badge} ${styles[badgeClass]}`}>
          {translateRating(rating)}
        </span>
      </div>
      
      {metricName === 'LCP' && (
        <p className={styles.metricDescription}>
          Tempo para renderizar o maior elemento visível
        </p>
      )}
      
      {metricName === 'FID' && (
        <p className={styles.metricDescription}>
          Tempo para responder à primeira interação do usuário
        </p>
      )}
      
      {metricName === 'CLS' && (
        <p className={styles.metricDescription}>
          Medida de instabilidade visual da página
        </p>
      )}
      
      {metricName === 'FCP' && (
        <p className={styles.metricDescription}>
          Tempo para renderizar o primeiro conteúdo visível
        </p>
      )}
      
      {metricName === 'TTFB' && (
        <p className={styles.metricDescription}>
          Tempo até o recebimento do primeiro byte
        </p>
      )}
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.number,
  metricName: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired
};

export default MetricCard; 