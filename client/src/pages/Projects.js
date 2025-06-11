import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import ProjectForm from '../components/ProjectForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: projects, isLoading, error } = useQuery('projects', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  });

  const { data: managers } = useQuery('managers', async () => {
    const response = await axios.get(`${API_URL}/users?role=manager`);
    return response.data;
  });

  const createProjectMutation = useMutation(
    async (projectData) => {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        setIsModalOpen(false);
      },
    }
  );

  const updateProjectMutation = useMutation(
    async ({ id, projectData }) => {
      const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        setIsModalOpen(false);
        setSelectedProject(null);
      },
    }
  );

  const deleteProjectMutation = useMutation(
    async (id) => {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
      },
    }
  );

  const handleSubmit = async (values) => {
    if (selectedProject) {
      await updateProjectMutation.mutateAsync({ id: selectedProject.id, projectData: values });
    } else {
      await createProjectMutation.mutateAsync(values);
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      await deleteProjectMutation.mutateAsync(id);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'planning':
        return 'Планирование';
      case 'in_progress':
        return 'В работе';
      case 'completed':
        return 'Завершен';
      case 'on_hold':
        return 'Приостановлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      case 'critical':
        return 'Критический';
      default:
        return priority;
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <button
          onClick={() => navigate('/projects/new')}
          className="btn-primary"
        >
          Новый проект
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {projects?.map((project) => (
            <li key={project.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {project.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <button
                      onClick={() => navigate(`/projects/${project.id}/edit`)}
                      className="btn-secondary"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-danger"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Статус: {getStatusText(project.status)}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Приоритет: {getPriorityText(project.priority)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Срок: {new Date(project.startDate).toLocaleDateString()} -{' '}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedProject ? 'Редактировать проект' : 'Добавить проект'}
            </h2>
            <ProjectForm
              initialValues={selectedProject}
              onSubmit={handleSubmit}
              submitLabel={selectedProject ? 'Сохранить' : 'Создать'}
              managers={managers}
            />
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedProject(null);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects; 