// SearchHistory.js
// Componente para mostrar histórico de buscas recentes

import { useState } from 'react';
import styles from '@/styles/Home.module.css';

const SearchHistory = ({ searchHistory, onRepeatSearch, onClearHistory }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.searchHistory}>
      <div className={styles.searchHistoryHeader}>
        <h3>Histórico de Buscas</h3>
        {searchHistory.length > 0 && (
          <button
            className={styles.clearHistoryButton}
            onClick={() => setShowClearConfirm(true)}
            aria-label="Limpar histórico de buscas"
          >
            Limpar Histórico
          </button>
        )}
      </div>

      {searchHistory.length === 0 ? (
        <p className={styles.noSearchHistory}>
          Nenhuma busca realizada ainda.
        </p>
      ) : (
        <ul className={styles.searchHistoryList}>
          {searchHistory.map(search => (
            <li key={search.id} className={styles.searchHistoryItem}>
              <div className={styles.searchHistoryInfo}>
                <span className={styles.searchTerm}>{search.term}</span>
                <span className={styles.searchDate}>
                  {formatDate(search.timestamp)}
                </span>
              </div>
              <div className={styles.searchHistoryActions}>
                <button
                  className={styles.repeatSearchButton}
                  onClick={() => onRepeatSearch(search)}
                  aria-label={`Repetir busca: ${search.term}`}
                >
                  Repetir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Diálogo de confirmação para limpar histórico */}
      {showClearConfirm && (
        <div className={styles.confirmDialog}>
          <div className={styles.confirmDialogContent}>
            <h4>Limpar Histórico</h4>
            <p>Tem certeza que deseja limpar todo o histórico de buscas?</p>
            <div className={styles.confirmDialogActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHistory; 