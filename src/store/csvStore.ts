import { create } from 'zustand';
import type { CsvData, MergeConfig, MergeResult } from '../types/csv';
import { parseCsvFile, mergeCsvFiles } from '../utils/csvUtils';

interface CsvStore {
  // State
  primaryFile: CsvData | null;
  secondaryFile: CsvData | null;
  mergeConfig: MergeConfig;
  result: MergeResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPrimaryFile: (file: CsvData | null) => void;
  setSecondaryFile: (file: CsvData | null) => void;
  setMergeConfig: (config: Partial<MergeConfig>) => void;
  setResult: (result: MergeResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // File upload actions
  uploadPrimaryFile: (file: File) => Promise<void>;
  uploadSecondaryFile: (file: File) => Promise<void>;

  // Merge action
  performMerge: () => void;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

export const useCsvStore = create<CsvStore>((set, get) => ({
  // Initial state
  primaryFile: null,
  secondaryFile: null,
  mergeConfig: {
    primaryKey: '',
    secondaryKey: '',
    mergeType: 'left'
  },
  result: null,
  isLoading: false,
  error: null,

  // Actions
  setPrimaryFile: (file) => set({ primaryFile: file }),
  setSecondaryFile: (file) => set({ secondaryFile: file }),
  setMergeConfig: (config) => set((state) => ({ 
    mergeConfig: { ...state.mergeConfig, ...config } 
  })),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // File upload actions
  uploadPrimaryFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const csvData = await parseCsvFile(file);
      set({ primaryFile: csvData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement du fichier', 
        isLoading: false 
      });
    }
  },

  uploadSecondaryFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const csvData = await parseCsvFile(file);
      set({ secondaryFile: csvData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement du fichier', 
        isLoading: false 
      });
    }
  },

  // Merge action
  performMerge: () => {
    const { primaryFile, secondaryFile, mergeConfig } = get();
    
    if (!primaryFile || !secondaryFile) {
      set({ error: 'Veuillez charger les deux fichiers CSV' });
      return;
    }

    if (!mergeConfig.primaryKey || !mergeConfig.secondaryKey) {
      set({ error: 'Veuillez sélectionner les colonnes de jointure' });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const result = mergeCsvFiles(primaryFile, secondaryFile, mergeConfig);
      set({ result, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la fusion', 
        isLoading: false 
      });
    }
  },

  // Utility actions
  clearError: () => set({ error: null }),
  reset: () => set({
    primaryFile: null,
    secondaryFile: null,
    mergeConfig: {
      primaryKey: '',
      secondaryKey: '',
      mergeType: 'left'
    },
    result: null,
    isLoading: false,
    error: null
  })
}));

