// SavedSearches.js
// Componente para gerenciar buscas salvas

import { useState } from 'react';
import styles from '@/styles/Home.module.css';

const SavedSearches = ({ savedSearches, onLoadSearch, onDeleteSearch }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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
    <div className={styles.savedSearches}>
      <div className={styles.savedSearchesHeader}>
        <h3>Buscas Salvas</h3>
        {savedSearches.length > 0 && (
          <button
            className={styles.clearAllButton}
            onClick={() => setShowDeleteConfirm('all')}
            aria-label="Excluir todas as buscas salvas"
          >
            Limpar Tudo
          </button>
        )}
      </div>

      {savedSearches.length === 0 ? (
        <p className={styles.noSavedSearches}>
          Você ainda não salvou nenhuma busca.
        </p>
      ) : (
        <ul className={styles.savedSearchesList}>
          {savedSearches.map(search => (
            <li key={search.id} className={styles.savedSearchItem}>
              <div className={styles.savedSearchInfo}>
                <span className={styles.savedSearchName}>{search.name}</span>
                <span className={styles.savedSearchDate}>
                  Salvo em {formatDate(search.createdAt)}
                </span>
              </div>
              <div className={styles.savedSearchActions}>
                <button
                  className={styles.loadSearchButton}
                  onClick={() => onLoadSearch(search)}
                  aria-label={`Carregar busca: ${search.name}`}
                >
                  Carregar
                </button>
                <button
                  className={styles.deleteSearchButton}
                  onClick={() => setShowDeleteConfirm(search.id)}
                  aria-label={`Excluir busca: ${search.name}`}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Diálogo de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className={styles.confirmDialog}>
          <div className={styles.confirmDialogContent}>
            <h4>Confirmar Exclusão</h4>
            <p>
              {showDeleteConfirm === 'all'
                ? 'Tem certeza que deseja excluir todas as buscas salvas?'
                : 'Tem certeza que deseja excluir esta busca?'}
            </p>
            <div className={styles.confirmDialogActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  if (showDeleteConfirm === 'all') {
                    savedSearches.forEach(search => onDeleteSearch(search.id));
                  } else {
                    onDeleteSearch(showDeleteConfirm);
                  }
                  setShowDeleteConfirm(null);
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

export default SavedSearches; 