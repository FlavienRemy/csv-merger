import React from 'react';
import { useCsvStore } from '../store/csvStore';
import { downloadCsv } from '../utils/csvUtils';

export const ResultDisplay: React.FC = () => {
  const { result } = useCsvStore();

  if (!result) {
    return null;
  }

  const handleDownload = () => {
    const filename = `merged_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCsv(result.mergedData, filename);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Fusion terminée</h3>
            <p className="text-sm text-gray-600">Votre fichier CSV a été fusionné avec succès</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{result.stats.primaryRows}</div>
          <div className="text-sm text-blue-700">Lignes fichier principal</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{result.stats.secondaryRows}</div>
          <div className="text-sm text-green-700">Lignes fichier secondaire</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{result.stats.mergedRows}</div>
          <div className="text-sm text-purple-700">Lignes fusionnées</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{result.stats.conflictsCount}</div>
          <div className="text-sm text-yellow-700">Conflits résolus</div>
        </div>
      </div>

      {/* Bouton de téléchargement */}
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger le fichier fusionné
        </button>
      </div>
    </div>
  );
};

