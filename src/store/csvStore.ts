import { create } from 'zustand';
import { CsvData, MergeConfig, MergeResult } from '../types/csv';
import { parseCsvFile, mergeCsvFiles } from '../utils/csvUtils';

interface CsvStore {
  // État
  primaryFile: CsvData | null;
  secondaryFile: CsvData | null;
  mergeConfig: MergeConfig;
  mergeResult: MergeResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPrimaryFile: (file: CsvData | null) => void;
  setSecondaryFile: (file: CsvData | null) => void;
  uploadPrimaryFile: (file: File) => Promise<void>;
  uploadSecondaryFile: (file: File) => Promise<void>;
  setMergeConfig: (config: Partial<MergeConfig>) => void;
  performMerge: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialMergeConfig: MergeConfig = {
  primaryKey: '',
  secondaryKey: '',
  mergeType: 'left'
};

export const useCsvStore = create<CsvStore>((set, get) => ({
  // État initial
  primaryFile: null,
  secondaryFile: null,
  mergeConfig: initialMergeConfig,
  mergeResult: null,
  isLoading: false,
  error: null,
  
  // Actions
  setPrimaryFile: (file) => set({ primaryFile: file }),
  
  setSecondaryFile: (file) => set({ secondaryFile: file }),
  
  uploadPrimaryFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const csvData = await parseCsvFile(file);
      set({ 
        primaryFile: csvData,
        mergeConfig: {
          ...get().mergeConfig,
          primaryKey: csvData.headers[0] || ''
        }
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors du chargement du fichier' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  uploadSecondaryFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const csvData = await parseCsvFile(file);
      set({ 
        secondaryFile: csvData,
        mergeConfig: {
          ...get().mergeConfig,
          secondaryKey: csvData.headers[0] || ''
        }
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors du chargement du fichier' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setMergeConfig: (config) => set((state) => ({
    mergeConfig: { ...state.mergeConfig, ...config }
  })),
  
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
    
    try {
      const result = mergeCsvFiles(primaryFile, secondaryFile, mergeConfig);
      set({ mergeResult: result, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la fusion' });
    }
  },
  
  clearError: () => set({ error: null }),
  
  reset: () => set({
    primaryFile: null,
    secondaryFile: null,
    mergeConfig: initialMergeConfig,
    mergeResult: null,
    error: null
  })
}));

