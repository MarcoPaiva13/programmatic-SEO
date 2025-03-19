import { useEffect, useRef } from 'react';
import styles from '@/styles/Home.module.css';

/**
 * Componente de modal para compartilhar detalhes do restaurante
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Flag indicando se o modal está aberto
 * @param {Function} props.onClose - Função chamada para fechar o modal
 * @param {Object} props.restaurantData - Dados do restaurante a ser compartilhado
 */
const ShareModal = ({ isOpen, onClose, restaurantData }) => {
  const modalRef = useRef(null);
  
  // Fechar o modal quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Impedir a propagação do evento para evitar que o modal seja fechado ao clicar dentro dele
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  // Gerar link para compartilhar
  const getShareLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/restaurantes/${restaurantData?.slug || ''}`;
    }
    return '';
  };
  
  // Funções para compartilhar em diferentes redes sociais
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareLink())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const shareOnTwitter = () => {
    const text = `Conheça ${restaurantData?.name || 'este restaurante'} no Guia de Restaurantes!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareLink())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const shareOnWhatsapp = () => {
    const text = `Conheça ${restaurantData?.name || 'este restaurante'} no Guia de Restaurantes! ${getShareLink()}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareLink()).then(
      () => {
        alert('Link copiado para a área de transferência!');
      },
      (err) => {
        console.error('Erro ao copiar link:', err);
      }
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div ref={modalRef} className={styles.modalContent} onClick={handleModalClick}>
        <div className={styles.modalHeader}>
          <h3>Compartilhar Restaurante</h3>
          <button 
            type="button" 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p>Compartilhe {restaurantData?.name || 'este restaurante'} com seus amigos:</p>
          
          <div className={styles.shareOptions}>
            <button 
              type="button" 
              className={`${styles.shareButton} ${styles.facebook}`}
              onClick={shareOnFacebook}
            >
              Facebook
            </button>
            
            <button 
              type="button" 
              className={`${styles.shareButton} ${styles.twitter}`}
              onClick={shareOnTwitter}
            >
              Twitter
            </button>
            
            <button 
              type="button" 
              className={`${styles.shareButton} ${styles.whatsapp}`}
              onClick={shareOnWhatsapp}
            >
              WhatsApp
            </button>
            
            <button 
              type="button" 
              className={`${styles.shareButton} ${styles.copyLink}`}
              onClick={copyToClipboard}
            >
              Copiar Link
            </button>
          </div>
          
          <div className={styles.shareLink}>
            <input 
              type="text" 
              readOnly 
              value={getShareLink()} 
              className={styles.shareLinkInput} 
            />
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 