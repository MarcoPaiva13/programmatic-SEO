import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/WebVitalsDashboard.module.css';
import { VITAL_THRESHOLDS } from '@/utils/vitalsUtils';
import { formatMetricValue } from '@/utils/dashboardUtils';

/**
 * Componente para modal de configuração de alertas
 */
const AlertsConfigModal = ({ isOpen, onClose, onSave }) => {
  // Estado para armazenar os limiares personalizados
  const [thresholds, setThresholds] = useState({
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  });
  
  // Inicializar com valores padrão ou salvos
  useEffect(() => {
    if (isOpen) {
      // Tentar obter configurações salvas no localStorage
      try {
        const savedThresholds = localStorage.getItem('customVitalsThresholds');
        if (savedThresholds) {
          setThresholds(JSON.parse(savedThresholds));
        } else {
          // Usar valores padrão do sistema
          setThresholds({ ...VITAL_THRESHOLDS });
        }
      } catch (error) {
        console.error('Erro ao carregar limiares customizados:', error);
        setThresholds({ ...VITAL_THRESHOLDS });
      }
    }
  }, [isOpen]);
  
  // Função para atualizar um valor de limiar
  const handleThresholdChange = (metric, type, value) => {
    // Validar valor numérico
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setThresholds(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [type]: numValue
      }
    }));
  };
  
  // Função para salvar configurações
  const handleSave = () => {
    // Validar configurações
    const validated = { ...thresholds };
    
    // Garantir que "good" seja sempre menor que "poor"
    Object.keys(validated).forEach(metric => {
      if (validated[metric].good > validated[metric].poor) {
        const temp = validated[metric].good;
        validated[metric].good = validated[metric].poor;
        validated[metric].poor = temp;
      }
    });
    
    // Salvar no localStorage
    try {
      localStorage.setItem('customVitalsThresholds', JSON.stringify(validated));
    } catch (error) {
      console.error('Erro ao salvar limiares:', error);
    }
    
    // Notificar componente pai
    onSave(validated);
  };
  
  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Configurar Alertas</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>
        
        <p className={styles.modalDescription}>
          Configure os limiares para classificação das métricas e alertas.
          Valores menores são melhores (exceto para CLS, onde menor é melhor).
        </p>
        
        <div className={styles.thresholdForm}>
          <h3>LCP (Largest Contentful Paint)</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bom (até):</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  className={styles.formInput}
                  value={thresholds.LCP.good}
                  onChange={(e) => handleThresholdChange('LCP', 'good', e.target.value)}
                  min="0"
                  step="100"
                />
                <span className={styles.inputUnit}>ms</span>
              </div>
              <small className={styles.formHelp}>
                Padrão: 2500ms ({formatMetricValue('LCP', 2500)})
              </small>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Precisa Melhorar (até):</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  className={styles.formInput}
                  value={thresholds.LCP.poor}
                  onChange={(e) => handleThresholdChange('LCP', 'poor', e.target.value)}
                  min="0"
                  step="100"
                />
                <span className={styles.inputUnit}>ms</span>
              </div>
              <small className={styles.formHelp}>
                Padrão: 4000ms ({formatMetricValue('LCP', 4000)})
              </small>
            </div>
          </div>
          
          <h3>FID (First Input Delay)</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bom (até):</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  className={styles.formInput}
                  value={thresholds.FID.good}
                  onChange={(e) => handleThresholdChange('FID', 'good', e.target.value)}
                  min="0"
                  step="10"
                />
                <span className={styles.inputUnit}>ms</span>
              </div>
              <small className={styles.formHelp}>
                Padrão: 100ms
              </small>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Precisa Melhorar (até):</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  className={styles.formInput}
                  value={thresholds.FID.poor}
                  onChange={(e) => handleThresholdChange('FID', 'poor', e.target.value)}
                  min="0"
                  step="10"
                />
                <span className={styles.inputUnit}>ms</span>
              </div>
              <small className={styles.formHelp}>
                Padrão: 300ms
              </small>
            </div>
          </div>
          
          <h3>CLS (Cumulative Layout Shift)</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bom (até):</label>
              <input
                type="number"
                className={styles.formInput}
                value={thresholds.CLS.good}
                onChange={(e) => handleThresholdChange('CLS', 'good', e.target.value)}
                min="0"
                step="0.01"
              />
              <small className={styles.formHelp}>
                Padrão: 0.1
              </small>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Precisa Melhorar (até):</label>
              <input
                type="number"
                className={styles.formInput}
                value={thresholds.CLS.poor}
                onChange={(e) => handleThresholdChange('CLS', 'poor', e.target.value)}
                min="0"
                step="0.01"
              />
              <small className={styles.formHelp}>
                Padrão: 0.25
              </small>
            </div>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
          >
            Salvar Configurações
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

AlertsConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AlertsConfigModal; 