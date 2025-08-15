import Papa from 'papaparse';
import type { CsvData, MergeConfig, MergeResult } from '../types/csv';

export const parseCsvFile = (file: File): Promise<CsvData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Erreur lors du parsing du fichier CSV'));
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
  
  // Create a map of secondary file data for quick lookup
  const secondaryMap = new Map();
  secondaryFile.data.forEach(row => {
    const key = row[secondaryKey];
    if (key !== undefined) {
      secondaryMap.set(key, row);
    }
  });

  // Find conflicting columns
  const conflictingColumns: string[] = [];
  const ignoredColumns: string[] = [];
  
  secondaryFile.headers.forEach(header => {
    if (header !== secondaryKey) {
      if (primaryFile.headers.includes(header)) {
        conflictingColumns.push(header);
      } else {
        ignoredColumns.push(header);
      }
    }
  });

  // Merge data based on merge type
  let mergedData: Record<string, any>[] = [];

  if (mergeType === 'left') {
    mergedData = primaryFile.data.map(primaryRow => {
      const key = primaryRow[primaryKey];
      const secondaryRow = secondaryMap.get(key);
      
      if (secondaryRow) {
        // Merge with secondary data, prioritizing primary for conflicts
        const mergedRow = { ...primaryRow };
        secondaryFile.headers.forEach(header => {
          if (header !== secondaryKey && !conflictingColumns.includes(header)) {
            mergedRow[header] = secondaryRow[header];
          }
        });
        return mergedRow;
      } else {
        // No match found, keep primary data with empty secondary columns
        const mergedRow = { ...primaryRow };
        ignoredColumns.forEach(header => {
          mergedRow[header] = '';
        });
        return mergedRow;
      }
    });
  } else if (mergeType === 'right') {
    mergedData = secondaryFile.data.map(secondaryRow => {
      const key = secondaryRow[secondaryKey];
      const primaryRow = primaryFile.data.find(row => row[primaryKey] === key);
      
      if (primaryRow) {
        // Merge with primary data, prioritizing secondary for conflicts
        const mergedRow = { ...secondaryRow };
        primaryFile.headers.forEach(header => {
          if (header !== primaryKey && !conflictingColumns.includes(header)) {
            mergedRow[header] = primaryRow[header];
          }
        });
        return mergedRow;
      } else {
        // No match found, keep secondary data with empty primary columns
        const mergedRow = { ...secondaryRow };
        primaryFile.headers.forEach(header => {
          if (header !== primaryKey && !conflictingColumns.includes(header)) {
            mergedRow[header] = '';
          }
        });
        return mergedRow;
      }
    });
  } else if (mergeType === 'inner') {
    mergedData = primaryFile.data
      .filter(primaryRow => {
        const key = primaryRow[primaryKey];
        return secondaryMap.has(key);
      })
      .map(primaryRow => {
        const key = primaryRow[primaryKey];
        const secondaryRow = secondaryMap.get(key);
        
        // Merge with secondary data, prioritizing primary for conflicts
        const mergedRow = { ...primaryRow };
        secondaryFile.headers.forEach(header => {
          if (header !== secondaryKey && !conflictingColumns.includes(header)) {
            mergedRow[header] = secondaryRow[header];
          }
        });
        return mergedRow;
      });
  } else if (mergeType === 'outer') {
    // Union of all keys
    const allKeys = new Set([
      ...primaryFile.data.map(row => row[primaryKey]),
      ...secondaryFile.data.map(row => row[secondaryKey])
    ]);

    mergedData = Array.from(allKeys).map(key => {
      const primaryRow = primaryFile.data.find(row => row[primaryKey] === key);
      const secondaryRow = secondaryMap.get(key);
      
      if (primaryRow && secondaryRow) {
        // Both exist, merge with primary priority
        const mergedRow = { ...primaryRow };
        secondaryFile.headers.forEach(header => {
          if (header !== secondaryKey && !conflictingColumns.includes(header)) {
            mergedRow[header] = secondaryRow[header];
          }
        });
        return mergedRow;
      } else if (primaryRow) {
        // Only primary exists
        const mergedRow = { ...primaryRow };
        ignoredColumns.forEach(header => {
          mergedRow[header] = '';
        });
        return mergedRow;
      } else {
        // Only secondary exists
        const mergedRow = { ...secondaryRow };
        primaryFile.headers.forEach(header => {
          if (header !== primaryKey && !conflictingColumns.includes(header)) {
            mergedRow[header] = '';
          }
        });
        return mergedRow;
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

