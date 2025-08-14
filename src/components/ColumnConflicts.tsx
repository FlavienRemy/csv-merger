import React from 'react';
import { useCsvStore } from '../store/csvStore';

export const ColumnConflicts: React.FC = () => {
  const { primaryFile, secondaryFile, mergeResult } = useCsvStore();

  if (!primaryFile || !secondaryFile || !mergeResult) {
    return null;
  }

  const { conflicts, ignoredColumns } = mergeResult;

  if (conflicts.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Aucun conflit de colonnes</h3>
            <p className="text-sm text-gray-600">
              Toutes les colonnes du fichier secondaire seront ajoutées au résultat
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Conflits de colonnes détectés</h3>
        <p className="text-sm text-gray-600">
          Les colonnes suivantes existent dans les deux fichiers et seront ignorées du fichier secondaire
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Colonnes ignorées ({conflicts.length})
            </h4>
            <div className="space-y-2">
              {conflicts.map((column) => (
                <div key={column} className="flex items-center justify-between bg-white rounded px-3 py-2">
                  <span className="text-sm text-gray-700 font-mono">{column}</span>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Fichier principal</span>
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-yellow-700 mt-3">
              <strong>Note:</strong> Les valeurs du fichier principal seront conservées pour ces colonnes.
            </p>
          </div>
        </div>
      </div>

      {/* Colonnes ajoutées */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Colonnes ajoutées du fichier secondaire</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {secondaryFile.headers
            .filter(header => !conflicts.includes(header))
            .map((column) => (
              <div key={column} className="flex items-center space-x-2 bg-green-50 rounded px-3 py-2">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-gray-700 font-mono">{column}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

