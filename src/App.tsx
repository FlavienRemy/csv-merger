import React from 'react';
import { FileUpload } from './components/FileUpload';
import { MergeConfiguration } from './components/MergeConfiguration';
import { ColumnConflicts } from './components/ColumnConflicts';
import { ResultDisplay } from './components/ResultDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CSV Merger</h1>
                <p className="text-sm text-gray-600 font-medium">
                  Fusionnez vos données en toute simplicité
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Prêt à fusionner</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fusionnez vos fichiers CSV en quelques clics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chargez vos fichiers, configurez la fusion et téléchargez le résultat. 
              Simple, rapide et sécurisé.
            </p>
          </div>

          {/* Error Display */}
          <ErrorDisplay />

          {/* File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUpload
              type="primary"
              title="Fichier principal"
              description="Ce fichier servira de base pour la fusion"
            />
            <FileUpload
              type="secondary"
              title="Fichier secondaire"
              description="Ce fichier sera fusionné avec le principal"
            />
          </div>

          {/* Merge Configuration */}
          <MergeConfiguration />

          {/* Column Conflicts */}
          <ColumnConflicts />

          {/* Result Display */}
          <ResultDisplay />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Développé avec React & TypeScript</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>© 2024 CSV Merger</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
