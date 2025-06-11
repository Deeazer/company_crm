import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useQuery('dashboardStats', async () => {
    const response = await axios.get(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  const projectStatusData = {
    labels: ['Планирование', 'В работе', 'На проверке', 'Завершены'],
    datasets: [
      {
        data: [
          stats?.projectStatus?.planning || 0,
          stats?.projectStatus?.inProgress || 0,
          stats?.projectStatus?.review || 0,
          stats?.projectStatus?.completed || 0,
        ],
        backgroundColor: [
          '#8B5CF6',
          '#3B82F6',
          '#EC4899',
          '#10B981',
        ],
      },
    ],
  };

  const monthlyProjectsData = {
    labels: stats?.monthlyProjects?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Проекты',
        data: stats?.monthlyProjects?.map(item => item.count) || [],
        backgroundColor: '#8B5CF6',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/projects/new')}
            className="btn-primary"
          >
            Новый проект
          </button>
          <button
            onClick={() => navigate('/documents/new')}
            className="btn-primary"
          >
            Новый документ
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/users/new')}
              className="btn-primary"
            >
              Новый пользователь
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Проекты</h2>
          <button
            onClick={() => navigate('/projects')}
            className="btn-secondary w-full"
          >
            Управление проектами
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Документы</h2>
          <button
            onClick={() => navigate('/documents')}
            className="btn-secondary w-full"
          >
            Управление документами
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Пользователи</h2>
            <button
              onClick={() => navigate('/users')}
              className="btn-secondary w-full"
            >
              Управление пользователями
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Всего проектов</h3>
          <p className="text-3xl font-bold text-cyber-purple">{stats?.totalProjects || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Активные проекты</h3>
          <p className="text-3xl font-bold text-cyber-blue">{stats?.activeProjects || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Всего документов</h3>
          <p className="text-3xl font-bold text-cyber-pink">{stats?.totalDocuments || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Статус проектов</h3>
          <div className="h-64">
            <Pie data={projectStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Проекты по месяцам</h3>
          <div className="h-64">
            <Bar
              data={monthlyProjectsData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 