import Papa from 'papaparse';
import { CsvData, MergeConfig, MergeResult } from '../types/csv';

export const parseCsvFile = (file: File): Promise<CsvData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Erreur lors du parsing: ${results.errors[0].message}`));
          return;
        }
        
        const data = results.data as Record<string, any>[];
        const headers = Object.keys(data[0] || {});
        
        resolve({
          data,
          headers,
          fileName: file.name
        });
      },
      error: (error) => {
        reject(new Error(`Erreur lors du parsing: ${error.message}`));
      }
    });
  });
};

export const mergeCsvFiles = (
  primaryFile: CsvData,
  secondaryFile: CsvData,
  config: MergeConfig
): MergeResult => {
  const { primaryKey, secondaryKey, mergeType } = config;
  
  // Créer un index du fichier secondaire pour une recherche rapide
  const secondaryIndex = new Map<string, Record<string, any>>();
  secondaryFile.data.forEach(row => {
    const key = row[secondaryKey];
    if (key) {
      secondaryIndex.set(key.toString(), row);
    }
  });
  
  // Identifier les colonnes en conflit
  const primaryHeaders = new Set(primaryFile.headers);
  const conflictingColumns = secondaryFile.headers.filter(header => 
    primaryHeaders.has(header) && header !== secondaryKey
  );
  
  // Colonnes à ignorer (conflits)
  const ignoredColumns = conflictingColumns;
  
  // Colonnes à ajouter du fichier secondaire
  const columnsToAdd = secondaryFile.headers.filter(header => 
    !primaryHeaders.has(header) || header === secondaryKey
  );
  
  const mergedData: Record<string, any>[] = [];
  const conflicts: string[] = [];
  
  // Traiter chaque ligne du fichier principal
  primaryFile.data.forEach(primaryRow => {
    const primaryKeyValue = primaryRow[primaryKey];
    const secondaryRow = primaryKeyValue ? secondaryIndex.get(primaryKeyValue.toString()) : null;
    
    // Créer la ligne fusionnée
    const mergedRow = { ...primaryRow };
    
    if (secondaryRow) {
      // Ajouter les colonnes non-conflictuelles du fichier secondaire
      columnsToAdd.forEach(column => {
        if (column !== secondaryKey) {
          mergedRow[column] = secondaryRow[column];
        }
      });
    } else {
      // Si pas de correspondance, remplir avec des valeurs vides
      columnsToAdd.forEach(column => {
        if (column !== secondaryKey) {
          mergedRow[column] = '';
        }
      });
    }
    
    mergedData.push(mergedRow);
  });
  
  // Pour les autres types de merge (right, inner, outer)
  if (mergeType === 'right' || mergeType === 'outer') {
    const processedKeys = new Set(primaryFile.data.map(row => row[primaryKey]?.toString()));
    
    secondaryFile.data.forEach(secondaryRow => {
      const secondaryKeyValue = secondaryRow[secondaryKey];
      if (!processedKeys.has(secondaryKeyValue?.toString())) {
        const mergedRow: Record<string, any> = {};
        
        // Remplir avec des valeurs vides pour les colonnes du fichier principal
        primaryFile.headers.forEach(header => {
          mergedRow[header] = '';
        });
        
        // Ajouter les données du fichier secondaire
        secondaryFile.headers.forEach(header => {
          if (!primaryHeaders.has(header) || header === secondaryKey) {
            mergedRow[header] = secondaryRow[header];
          }
        });
        
        mergedData.push(mergedRow);
      }
    });
  }
  
  return {
    mergedData,
    conflicts: conflictingColumns,
    ignoredColumns,
    stats: {
      primaryRows: primaryFile.data.length,
      secondaryRows: secondaryFile.data.length,
      mergedRows: mergedData.length,
      conflictsCount: conflictingColumns.length
    }
  };
};

export const downloadCsv = (data: Record<string, any>[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

