import React from 'react';
import { useCsvStore } from '../store/csvStore';

export const ColumnConflicts: React.FC = () => {
  const { primaryFile, secondaryFile, result } = useCsvStore();

  if (!primaryFile || !secondaryFile || !result) {
    return null;
  }

  if (result.conflicts.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-sm font-semibold text-yellow-800">
          Colonnes en conflit détectées
        </h3>
      </div>
      <p className="text-sm text-yellow-700 mb-2">
        Les colonnes suivantes existent dans les deux fichiers. Les valeurs du fichier principal seront conservées :
      </p>
      <div className="flex flex-wrap gap-2">
        {result.conflicts.map((column) => (
          <span
            key={column}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800"
          >
            {column}
          </span>
        ))}
      </div>
    </div>
  );
};

