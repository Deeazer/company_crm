import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import UserForm from '../components/UserForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: users, isLoading, error } = useQuery('users', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  });

  const createUserMutation = useMutation(
    async (userData) => {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setIsModalOpen(false);
      },
    }
  );

  const updateUserMutation = useMutation(
    async ({ id, userData }) => {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setIsModalOpen(false);
        setSelectedUser(null);
      },
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      }
    }
  );

  const handleSubmit = async (values) => {
    if (selectedUser) {
      await updateUserMutation.mutateAsync({ id: selectedUser.id, userData: values });
    } else {
      await createUserMutation.mutateAsync(values);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <button
          onClick={() => navigate('/users/new')}
          className="btn-primary"
        >
          Новый пользователь
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users?.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <button
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                      className="btn-secondary"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn-danger"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Роль: {user.role}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Создан: {new Date(user.createdAt).toLocaleDateString()}
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
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </h2>
            <UserForm
              initialValues={selectedUser}
              onSubmit={handleSubmit}
              submitLabel={selectedUser ? 'Сохранить' : 'Создать'}
            />
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUser(null);
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

export default Users; 