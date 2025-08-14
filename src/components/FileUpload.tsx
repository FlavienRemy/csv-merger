import React, { useCallback, useState } from 'react';
import { useCsvStore } from '../store/csvStore';

interface FileUploadProps {
  type: 'primary' | 'secondary';
  title: string;
  description: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ type, title, description }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { 
    primaryFile, 
    secondaryFile, 
    uploadPrimaryFile, 
    uploadSecondaryFile, 
    isLoading 
  } = useCsvStore();

  const currentFile = type === 'primary' ? primaryFile : secondaryFile;
  const uploadFile = type === 'primary' ? uploadPrimaryFile : uploadSecondaryFile;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      uploadFile(csvFile);
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            type === 'primary' 
              ? 'bg-blue-500' 
              : 'bg-green-500'
          }`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 ml-11">{description}</p>
      </div>

      {currentFile ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">{currentFile.fileName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {currentFile.data.length} lignes
                  </span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {currentFile.headers.length} colonnes
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => type === 'primary' ? useCsvStore.getState().setPrimaryFile(null) : useCsvStore.getState().setSecondaryFile(null)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : type === 'primary'
                ? 'border-blue-200 hover:border-blue-300'
                : 'border-green-200 hover:border-green-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                type === 'primary' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  type === 'primary' ? 'text-blue-500' : 'text-green-500'
                }`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Cliquez pour sélectionner</span> ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">Fichier CSV uniquement</p>
            </div>

            <div>
              <label className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                type === 'primary'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Sélectionner un fichier
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Chargement en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

