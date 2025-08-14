export interface CsvData {
  data: Record<string, any>[];
  headers: string[];
  fileName: string;
}

export interface MergeConfig {
  primaryKey: string;
  secondaryKey: string;
  mergeType: 'left' | 'right' | 'inner' | 'outer';
}

export interface MergeResult {
  mergedData: Record<string, any>[];
  conflicts: string[];
  ignoredColumns: string[];
  stats: {
    primaryRows: number;
    secondaryRows: number;
    mergedRows: number;
    conflictsCount: number;
  };
}

export interface FileUploadState {
  primaryFile: CsvData | null;
  secondaryFile: CsvData | null;
  isLoading: boolean;
  error: string | null;
}

