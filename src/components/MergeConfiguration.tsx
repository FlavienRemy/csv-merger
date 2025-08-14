import React from 'react';
import { useCsvStore } from '../store/csvStore';

export const MergeConfiguration: React.FC = () => {
  const { primaryFile, secondaryFile, mergeConfig, setMergeConfig } = useCsvStore();

  if (!primaryFile || !secondaryFile) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Configuration de la fusion</h3>
            <p className="text-sm text-gray-600">Sélectionnez les colonnes de jointure et le type de fusion</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Colonne de jointure - Fichier principal */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Colonne de jointure - Fichier principal
          </label>
          <select
            value={mergeConfig.primaryKey}
            onChange={(e) => setMergeConfig({ primaryKey: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner une colonne</option>
            {primaryFile.headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">{primaryFile.fileName}</p>
        </div>

        {/* Colonne de jointure - Fichier secondaire */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Colonne de jointure - Fichier secondaire
          </label>
          <select
            value={mergeConfig.secondaryKey}
            onChange={(e) => setMergeConfig({ secondaryKey: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Sélectionner une colonne</option>
            {secondaryFile.headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">{secondaryFile.fileName}</p>
        </div>
      </div>

      {/* Type de fusion */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Type de fusion
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { value: 'left', label: 'Left Join', description: 'Toutes les lignes du fichier principal' },
            { value: 'right', label: 'Right Join', description: 'Toutes les lignes du fichier secondaire' },
            { value: 'inner', label: 'Inner Join', description: 'Lignes communes aux deux fichiers' },
            { value: 'outer', label: 'Outer Join', description: 'Toutes les lignes des deux fichiers' }
          ].map((option) => (
            <label
              key={option.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${
                mergeConfig.mergeType === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="mergeType"
                value={option.value}
                checked={mergeConfig.mergeType === option.value}
                onChange={(e) => setMergeConfig({ mergeType: e.target.value as any })}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-gray-500">{option.description}</p>
                  </div>
                </div>
                {mergeConfig.mergeType === option.value && (
                  <div className="shrink-0 text-purple-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bouton de fusion */}
      <div className="flex justify-center">
        <button
          onClick={() => useCsvStore.getState().performMerge()}
          disabled={!mergeConfig.primaryKey || !mergeConfig.secondaryKey}
          className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Fusionner les fichiers
        </button>
      </div>
    </div>
  );
};

