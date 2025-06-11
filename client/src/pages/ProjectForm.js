import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const validationSchema = Yup.object({
  name: Yup.string().required('Название обязательно'),
  description: Yup.string().required('Описание обязательно'),
  startDate: Yup.date().required('Дата начала обязательна'),
  endDate: Yup.date().min(
    Yup.ref('startDate'),
    'Дата окончания должна быть позже даты начала'
  ),
  status: Yup.string().required('Статус обязателен'),
  priority: Yup.string().required('Приоритет обязателен'),
  managerId: Yup.number().required('Руководитель обязателен')
});

function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const { data: project, isLoading: isLoadingProject } = useQuery(
    ['project', id],
    async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    {
      enabled: isEdit
    }
  );

  const { data: users } = useQuery('users', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  });

  const mutation = useMutation(
    async (values) => {
      const token = localStorage.getItem('token');
      const url = isEdit ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;
      const method = isEdit ? 'put' : 'post';
      const response = await axios[method](url, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        navigate('/projects');
      }
    }
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      priority: 'medium',
      managerId: ''
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  React.useEffect(() => {
    if (project) {
      formik.setValues({
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        priority: project.priority,
        managerId: project.managerId
      });
    }
  }, [project]);

  if (isLoadingProject) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Редактирование проекта' : 'Новый проект'}
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Название
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Дата начала
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.startDate}</div>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Дата окончания
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.endDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.endDate}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Статус
            </label>
            <select
              id="status"
              name="status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="planning">Планирование</option>
              <option value="inProgress">В работе</option>
              <option value="review">На проверке</option>
              <option value="completed">Завершен</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Приоритет
            </label>
            <select
              id="priority"
              name="priority"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.priority}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
            {formik.touched.priority && formik.errors.priority && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.priority}</div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
            Руководитель
          </label>
          <select
            id="managerId"
            name="managerId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.managerId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Выберите руководителя</option>
            {users?.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          {formik.touched.managerId && formik.errors.managerId && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.managerId}</div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="btn-primary"
          >
            {mutation.isLoading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm; 