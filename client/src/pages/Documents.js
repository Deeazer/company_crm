import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { PlusIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Documents() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: documents, isLoading } = useQuery('documents', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  });

  const { data: projects } = useQuery('projects', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  });

  const uploadMutation = useMutation(
    async ({ file, projectId }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
        setIsUploadModalOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    async (documentId) => {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
      },
    }
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0 && selectedProject) {
        uploadMutation.mutate({
          file: acceptedFiles[0],
          projectId: selectedProject,
        });
      }
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот документ?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Документы</h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Загрузить документ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents?.map((document) => (
          <div key={document.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <DocumentIcon className="h-8 w-8 text-cyber-purple mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">{document.name}</h3>
                  <p className="text-sm text-gray-400">
                    {projects?.find(p => p.id === document.projectId)?.name}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-4">
                <button
                  onClick={() => navigate(`/documents/${document.id}/edit`)}
                  className="btn-secondary"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(document.id)}
                  className="btn-danger"
                >
                  Удалить
                </button>
              </div>
            </div>
            <p className="text-gray-400 mb-4">{document.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Версия {document.version}</span>
              <span>{new Date(document.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Загрузка документа</h3>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="input-field mb-4"
            >
              <option value="">Выберите проект</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragActive ? 'border-cyber-purple' : 'border-gray-600'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Отпустите файл здесь...</p>
              ) : (
                <p>Перетащите файл сюда или кликните для выбора</p>
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents; 