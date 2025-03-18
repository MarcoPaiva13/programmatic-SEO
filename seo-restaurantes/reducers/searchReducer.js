// searchReducer.js
// Gerenciador de estado para a busca avançada

// Estado inicial
export const initialState = {
  searchTerm: '',
  filters: [],
  sortBy: 'relevance',
  logicalOperator: 'AND',
  savedSearches: [],
  recentSearches: []
};

// Tipos de ação
export const actionTypes = {
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  ADD_FILTER: 'ADD_FILTER',
  REMOVE_FILTER: 'REMOVE_FILTER',
  UPDATE_FILTER: 'UPDATE_FILTER',
  SET_SORT: 'SET_SORT',
  SET_LOGICAL_OPERATOR: 'SET_LOGICAL_OPERATOR',
  SAVE_SEARCH: 'SAVE_SEARCH',
  LOAD_SAVED_SEARCH: 'LOAD_SAVED_SEARCH',
  LOAD_FROM_URL: 'LOAD_FROM_URL',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Reducer principal
export function searchReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };

    case actionTypes.ADD_FILTER:
      return {
        ...state,
        filters: [...state.filters, action.payload]
      };

    case actionTypes.REMOVE_FILTER:
      return {
        ...state,
        filters: state.filters.filter((_, index) => index !== action.payload)
      };

    case actionTypes.UPDATE_FILTER:
      return {
        ...state,
        filters: state.filters.map((filter, index) => 
          index === action.payload.index ? action.payload.filter : filter
        )
      };

    case actionTypes.SET_SORT:
      return {
        ...state,
        sortBy: action.payload
      };

    case actionTypes.SET_LOGICAL_OPERATOR:
      return {
        ...state,
        logicalOperator: action.payload
      };

    case actionTypes.SAVE_SEARCH:
      const newSavedSearch = {
        id: Date.now(),
        name: action.payload.name,
        filters: state.filters,
        searchTerm: state.searchTerm,
        sortBy: state.sortBy,
        logicalOperator: state.logicalOperator
      };
      
      return {
        ...state,
        savedSearches: [...state.savedSearches, newSavedSearch]
      };

    case actionTypes.LOAD_SAVED_SEARCH:
      return {
        ...state,
        ...action.payload
      };

    case actionTypes.LOAD_FROM_URL:
      const { search, filters, sort } = action.payload;
      
      return {
        ...state,
        searchTerm: search || '',
        filters: filters ? JSON.parse(filters) : [],
        sortBy: sort || 'relevance'
      };

    case actionTypes.CLEAR_FILTERS:
      return {
        ...state,
        filters: [],
        searchTerm: '',
        sortBy: 'relevance',
        logicalOperator: 'AND'
      };

    default:
      return state;
  }
}

// Funções auxiliares para criar ações
export const actions = {
  setSearchTerm: (term) => ({
    type: actionTypes.SET_SEARCH_TERM,
    payload: term
  }),

  addFilter: (filter) => ({
    type: actionTypes.ADD_FILTER,
    payload: filter
  }),

  removeFilter: (index) => ({
    type: actionTypes.REMOVE_FILTER,
    payload: index
  }),

  updateFilter: (index, filter) => ({
    type: actionTypes.UPDATE_FILTER,
    payload: { index, filter }
  }),

  setSort: (sortBy) => ({
    type: actionTypes.SET_SORT,
    payload: sortBy
  }),

  setLogicalOperator: (operator) => ({
    type: actionTypes.SET_LOGICAL_OPERATOR,
    payload: operator
  }),

  saveSearch: (name) => ({
    type: actionTypes.SAVE_SEARCH,
    payload: { name }
  }),

  loadSavedSearch: (search) => ({
    type: actionTypes.LOAD_SAVED_SEARCH,
    payload: search
  }),

  loadFromUrl: (query) => ({
    type: actionTypes.LOAD_FROM_URL,
    payload: query
  }),

  clearFilters: () => ({
    type: actionTypes.CLEAR_FILTERS
  })
}; 