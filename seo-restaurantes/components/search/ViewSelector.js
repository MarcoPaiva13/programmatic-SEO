// ViewSelector.js
// Componente para selecionar o modo de visualização dos resultados

import { useState } from 'react';
import styles from '@/styles/Home.module.css';

const ViewSelector = ({ onViewChange, currentView }) => {
  const views = [
    { id: 'grid', label: 'Grade', icon: '📱' },
    { id: 'table', label: 'Tabela', icon: '📊' },
    { id: 'map', label: 'Mapa', icon: '🗺️' }
  ];

  return (
    <div className={styles.viewSelector}>
      <span className={styles.viewLabel}>Visualização:</span>
      <div className={styles.viewButtons}>
        {views.map(view => (
          <button
            key={view.id}
            className={`${styles.viewButton} ${currentView === view.id ? styles.active : ''}`}
            onClick={() => onViewChange(view.id)}
            aria-pressed={currentView === view.id}
            aria-label={`Visualização em ${view.label}`}
          >
            <span className={styles.viewIcon}>{view.icon}</span>
            <span className={styles.viewText}>{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewSelector; 