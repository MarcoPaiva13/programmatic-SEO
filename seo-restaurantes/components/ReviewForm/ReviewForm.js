import { useState } from 'react';
import styles from '@/styles/Home.module.css';

/**
 * Componente de formulário para avaliações de restaurantes
 * @param {Object} props - Propriedades do componente
 * @param {string} props.restaurantId - ID do restaurante a ser avaliado
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {boolean} props.isSubmitting - Flag indicando se o envio está em andamento
 */
const ReviewForm = ({ restaurantId, onSubmit, isSubmitting = false }) => {
  // Estado para armazenar os valores do formulário
  const [formData, setFormData] = useState({
    rating: 5,
    authorName: '',
    comment: ''
  });
  
  // Estado para controlar erros de validação
  const [errors, setErrors] = useState({});
  
  // Função para renderizar as estrelas de avaliação
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={i <= formData.rating ? styles.starActive : styles.star}
          onClick={() => handleRatingChange(i)}
          aria-label={`Avaliar ${i} estrelas`}
        >
          ★
        </button>
      );
    }
    return stars;
  };
  
  // Função para atualizar o valor de classificação
  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };
  
  // Função para atualizar os valores dos campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Nome é obrigatório';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comentário é obrigatório';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Comentário deve ter pelo menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        restaurantId,
        date: new Date().toISOString()
      });
    }
  };
  
  return (
    <div className={styles.reviewFormContainer}>
      <h3>Deixe sua avaliação</h3>
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.formGroup}>
          <label htmlFor="authorName">Nome:</label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={handleInputChange}
            placeholder="Seu nome"
            className={errors.authorName ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {errors.authorName && <p className={styles.errorText}>{errors.authorName}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Classificação:</label>
          <div className={styles.starsContainer}>
            {renderStars()}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="comment">Comentário:</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Compartilhe sua experiência"
            rows={4}
            className={errors.comment ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {errors.comment && <p className={styles.errorText}>{errors.comment}</p>}
        </div>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 