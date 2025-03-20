import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from '@/styles/WebVitalsDashboard.module.css';
import { formatMetricValue, getRatingClass } from '@/utils/dashboardUtils';

/**
 * Componente para exibir tabela de páginas com pior desempenho
 */
const WorstPagesTable = ({ data }) => {
  // Verificar se temos dados para exibir
  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>
        <p>Não há dados suficientes para análise de páginas</p>
      </div>
    );
  }
  
  // Função para renderizar célula com valor colorido por classificação
  const renderMetricCell = (value, rating) => {
    const ratingClass = getRatingClass(rating);
    
    return (
      <td className={styles[ratingClass]}>
        {value}
      </td>
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Página</th>
            <th>LCP</th>
            <th>FID</th>
            <th>CLS</th>
            <th>FCP</th>
            <th>TTFB</th>
            <th>Problemas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((page, index) => (
            <tr key={index}>
              <td>
                <Link href={`/admin/web-vitals-dashboard?page=${encodeURIComponent(page.path)}`}>
                  <a title={page.path}>{page.page}</a>
                </Link>
              </td>
              {renderMetricCell(
                page.lcp !== undefined ? formatMetricValue('LCP', page.lcp) : 'N/A',
                page.lcpRating
              )}
              {renderMetricCell(
                page.fid !== undefined ? formatMetricValue('FID', page.fid) : 'N/A',
                page.fidRating
              )}
              {renderMetricCell(
                page.cls !== undefined ? formatMetricValue('CLS', page.cls) : 'N/A',
                page.clsRating
              )}
              {renderMetricCell(
                page.fcp !== undefined ? formatMetricValue('FCP', page.fcp) : 'N/A',
                page.fcpRating
              )}
              {renderMetricCell(
                page.ttfb !== undefined ? formatMetricValue('TTFB', page.ttfb) : 'N/A',
                page.ttfbRating
              )}
              <td>
                <span className={
                  page.problemCount === 0 ? styles.good : 
                  page.problemCount <= 2 ? styles.needsImprovement : 
                  styles.poor
                }>
                  {page.problemCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

WorstPagesTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      page: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      lcp: PropTypes.number,
      lcpRating: PropTypes.string,
      fid: PropTypes.number,
      fidRating: PropTypes.string,
      cls: PropTypes.number,
      clsRating: PropTypes.string,
      fcp: PropTypes.number,
      fcpRating: PropTypes.string,
      ttfb: PropTypes.number,
      ttfbRating: PropTypes.string,
      problemCount: PropTypes.number.isRequired
    })
  ).isRequired
};

export default WorstPagesTable; 