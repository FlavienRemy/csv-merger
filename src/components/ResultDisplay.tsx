import React, { useState } from 'react';
import { useCsvStore } from '../store/csvStore';
import { downloadCsv } from '../utils/csvUtils';

export const ResultDisplay: React.FC = () => {
  const { mergeResult, primaryFile, secondaryFile } = useCsvStore();
  const [showPreview, setShowPreview] = useState(false);

  if (!mergeResult) {
    return null;
  }

  const { mergedData, stats } = mergeResult;

  const handleDownload = () => {
    const filename = `merged_${primaryFile?.fileName.replace('.csv', '')}_${secondaryFile?.fileName.replace('.csv', '')}.csv`;
    downloadCsv(mergedData, filename);
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Résultat de la fusion</h3>
        <p className="text-sm text-gray-600">
          Votre fichier a été fusionné avec succès
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.primaryRows}</div>
          <div className="text-sm text-blue-800">Lignes fichier principal</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.secondaryRows}</div>
          <div className="text-sm text-green-800">Lignes fichier secondaire</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.mergedRows}</div>
          <div className="text-sm text-purple-800">Lignes fusionnées</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.conflictsCount}</div>
          <div className="text-sm text-yellow-800">Conflits résolus</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleDownload}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Télécharger le fichier fusionné</span>
        </button>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{showPreview ? 'Masquer' : 'Aperçu'} des données</span>
        </button>
      </div>

      {/* Aperçu des données */}
      {showPreview && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">
              Aperçu des données fusionnées (premières 10 lignes)
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(mergedData[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mergedData.slice(0, 10).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mergedData.length > 10 && (
            <div className="bg-gray-50 px-4 py-3 text-center">
              <p className="text-sm text-gray-600">
                ... et {mergedData.length - 10} autres lignes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

