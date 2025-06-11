import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const validationSchema = Yup.object({
  title: Yup.string().required('Название обязательно'),
  description: Yup.string().required('Описание обязательно'),
  type: Yup.string().required('Тип документа обязателен'),
  projectId: Yup.number().required('Проект обязателен'),
  file: Yup.mixed().when('isEdit', {
    is: false,
    then: Yup.mixed().required('Файл обязателен')
  })
});

function DocumentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const { data: document, isLoading: isLoadingDocument } = useQuery(
    ['document', id],
    async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    {
      enabled: isEdit
    }
  );

  const { data: projects } = useQuery('projects', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  });

  const mutation = useMutation(
    async (values) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (key === 'file' && values[key]) {
          formData.append('file', values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      const url = isEdit ? `${API_URL}/documents/${id}` : `${API_URL}/documents`;
      const method = isEdit ? 'put' : 'post';
      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
        navigate('/documents');
      }
    }
  );

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      type: 'contract',
      projectId: '',
      file: null
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  React.useEffect(() => {
    if (document) {
      formik.setValues({
        title: document.title,
        description: document.description,
        type: document.type,
        projectId: document.projectId,
        file: null
      });
    }
  }, [document]);

  if (isLoadingDocument) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Редактирование документа' : 'Новый документ'}
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Название
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Тип документа
            </label>
            <select
              id="type"
              name="type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.type}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="contract">Договор</option>
              <option value="invoice">Счет</option>
              <option value="report">Отчет</option>
              <option value="other">Другое</option>
            </select>
            {formik.touched.type && formik.errors.type && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.type}</div>
            )}
          </div>

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
              Проект
            </label>
            <select
              id="projectId"
              name="projectId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.projectId}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Выберите проект</option>
              {projects?.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {formik.touched.projectId && formik.errors.projectId && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.projectId}</div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Файл
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={(event) => {
              formik.setFieldValue('file', event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full"
          />
          {formik.touched.file && formik.errors.file && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.file}</div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/documents')}
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

export default DocumentForm; 