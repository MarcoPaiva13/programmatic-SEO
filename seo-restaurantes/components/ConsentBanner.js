import { useState, useEffect } from 'react';
import styles from '@/styles/ConsentBanner.module.css';

/**
 * Banner de consentimento para cookies e rastreamento
 * Implementa as normas LGPD (Lei Geral de Proteção de Dados)
 * Permite ao usuário aceitar ou recusar rastreamento
 */
const ConsentBanner = ({ onAccept, onReject, onPreferences }) => {
  const [visible, setVisible] = useState(false);
  
  // Verificar se o usuário já deu consentimento
  useEffect(() => {
    try {
      const consentGiven = localStorage.getItem('cookieConsent');
      if (consentGiven === null) {
        // Se não houver registro no localStorage, mostrar o banner
        setVisible(true);
      }
    } catch (error) {
      // Em caso de erro (ex: cookies desativados), mostrar o banner
      console.error('Erro ao verificar consentimento:', error);
      setVisible(true);
    }
  }, []);
  
  const handleAccept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('consentTimestamp', new Date().toISOString());
      setVisible(false);
      
      // Ativar Google Analytics e outros rastreamentos
      if (onAccept) onAccept();
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error);
    }
  };
  
  const handleReject = () => {
    try {
      localStorage.setItem('cookieConsent', 'rejected');
      localStorage.setItem('consentTimestamp', new Date().toISOString());
      setVisible(false);
      
      // Desativar Google Analytics e outros rastreamentos
      if (onReject) onReject();
    } catch (error) {
      console.error('Erro ao salvar rejeição:', error);
    }
  };
  
  const handlePreferences = () => {
    if (onPreferences) onPreferences();
  };
  
  if (!visible) return null;
  
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContent}>
        <h3>Sua privacidade importa para nós</h3>
        <p>
          Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, 
          personalizar conteúdo e analisar o tráfego do site. 
          Coletamos dados sobre como você navega para otimizar nossas funcionalidades.
        </p>
        
        <div className={styles.bannerLinks}>
          <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">
            Política de Privacidade
          </a>
          <button 
            onClick={handlePreferences} 
            className={styles.linkButton}
          >
            Personalizar Preferências
          </button>
        </div>
        
        <div className={styles.bannerButtons}>
          <button 
            onClick={handleReject} 
            className={styles.rejectButton}
          >
            Recusar Cookies Não Essenciais
          </button>
          <button 
            onClick={handleAccept} 
            className={styles.acceptButton}
          >
            Aceitar Todos os Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner; 