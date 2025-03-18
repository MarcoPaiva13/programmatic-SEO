import { useState, useEffect } from 'react';
import styles from '@/styles/PreferencesModal.module.css';

/**
 * Modal de preferências avançadas para cookies e rastreamento
 * Permite configurações granulares de privacidade
 */
const PreferencesModal = ({ isOpen, onClose, onSave }) => {
  // Estado para as preferências
  const [preferences, setPreferences] = useState({
    essential: true, // Sempre ativado e não pode ser desativado
    analytics: false,
    marketing: false,
    personalization: false,
    thirdParty: false
  });
  
  // Carregar preferências salvas
  useEffect(() => {
    if (isOpen) {
      try {
        const savedPrefs = localStorage.getItem('cookiePreferences');
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        } else {
          // Verificar se já aceitou todos os cookies
          const consent = localStorage.getItem('cookieConsent');
          if (consent === 'accepted') {
            setPreferences({
              essential: true,
              analytics: true,
              marketing: true,
              personalization: true,
              thirdParty: true
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
  }, [isOpen]);
  
  // Manipular mudanças de toggle
  const handleToggleChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Salvar preferências
  const handleSave = () => {
    try {
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      localStorage.setItem('cookieConsent', 'customized');
      localStorage.setItem('consentTimestamp', new Date().toISOString());
      
      if (onSave) onSave(preferences);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };
  
  // Aceitar todos os cookies
  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
      thirdParty: true
    };
    
    try {
      localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('consentTimestamp', new Date().toISOString());
      
      if (onSave) onSave(allAccepted);
      onClose();
    } catch (error) {
      console.error('Erro ao aceitar todos os cookies:', error);
    }
  };
  
  // Rejeitar cookies não essenciais
  const handleRejectAll = () => {
    const allRejected = {
      essential: true, // Sempre ativado
      analytics: false,
      marketing: false,
      personalization: false,
      thirdParty: false
    };
    
    try {
      localStorage.setItem('cookiePreferences', JSON.stringify(allRejected));
      localStorage.setItem('cookieConsent', 'rejected');
      localStorage.setItem('consentTimestamp', new Date().toISOString());
      
      if (onSave) onSave(allRejected);
      onClose();
    } catch (error) {
      console.error('Erro ao rejeitar cookies:', error);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Preferências de Privacidade</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            Personalize suas preferências de privacidade. Cookies essenciais são necessários para o funcionamento do site e não podem ser desativados.
          </p>
          
          <div className={styles.preferencesSection}>
            <div className={styles.preferenceItem}>
              <div>
                <h4>Cookies Essenciais</h4>
                <p>Necessários para o funcionamento básico do site</p>
              </div>
              <div className={`${styles.toggle} ${styles.disabled}`}>
                <input 
                  type="checkbox" 
                  checked={preferences.essential} 
                  disabled 
                  readOnly
                />
                <span className={styles.slider}></span>
              </div>
            </div>
            
            <div className={styles.preferenceItem}>
              <div>
                <h4>Analytics</h4>
                <p>Cookies para análise de tráfego e comportamento</p>
              </div>
              <div className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics} 
                  onChange={() => handleToggleChange('analytics')} 
                />
                <span className={styles.slider}></span>
              </div>
            </div>
            
            <div className={styles.preferenceItem}>
              <div>
                <h4>Marketing</h4>
                <p>Cookies para publicidade direcionada</p>
              </div>
              <div className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing} 
                  onChange={() => handleToggleChange('marketing')} 
                />
                <span className={styles.slider}></span>
              </div>
            </div>
            
            <div className={styles.preferenceItem}>
              <div>
                <h4>Personalização</h4>
                <p>Cookies para personalizar sua experiência</p>
              </div>
              <div className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={preferences.personalization} 
                  onChange={() => handleToggleChange('personalization')} 
                />
                <span className={styles.slider}></span>
              </div>
            </div>
            
            <div className={styles.preferenceItem}>
              <div>
                <h4>Cookies de Terceiros</h4>
                <p>Cookies de parceiros e serviços integrados</p>
              </div>
              <div className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={preferences.thirdParty} 
                  onChange={() => handleToggleChange('thirdParty')} 
                />
                <span className={styles.slider}></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.rejectButton}
            onClick={handleRejectAll}
          >
            Recusar Não Essenciais
          </button>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
          >
            Salvar Preferências
          </button>
          <button 
            className={styles.acceptButton}
            onClick={handleAcceptAll}
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal; 