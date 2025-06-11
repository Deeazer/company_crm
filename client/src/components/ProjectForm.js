import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Название обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  description: Yup.string()
    .max(500, 'Описание не должно превышать 500 символов'),
  startDate: Yup.date()
    .required('Дата начала обязательна'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'Дата окончания должна быть позже даты начала'),
  client: Yup.string()
    .required('Клиент обязателен')
    .max(100, 'Название клиента не должно превышать 100 символов'),
  projectManagerId: Yup.string()
    .required('Руководитель проекта обязателен'),
  managerId: Yup.string()
    .required('Менеджер обязателен'),
  priority: Yup.string()
    .required('Приоритет обязателен')
    .oneOf(['low', 'medium', 'high', 'critical'], 'Неверный приоритет'),
  budget: Yup.number()
    .min(0, 'Бюджет не может быть отрицательным'),
  status: Yup.string()
    .required('Статус обязателен')
    .oneOf(['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'], 'Неверный статус'),
  progress: Yup.number()
    .min(0, 'Прогресс не может быть меньше 0')
    .max(100, 'Прогресс не может быть больше 100')
});

function ProjectForm({ initialValues, onSubmit, submitLabel = 'Сохранить', managers = [] }) {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      client: '',
      projectManagerId: '',
      managerId: '',
      priority: 'medium',
      budget: 0,
      status: 'planning',
      progress: 0
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Клиент
          </label>
          <input
            type="text"
            id="client"
            name="client"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.client}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.client && formik.errors.client && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.client}</div>
          )}
        </div>

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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.startDate}</div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.endDate}</div>
          )}
        </div>

        <div>
          <label htmlFor="projectManagerId" className="block text-sm font-medium text-gray-700">
            Руководитель проекта
          </label>
          <select
            id="projectManagerId"
            name="projectManagerId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.projectManagerId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Выберите руководителя</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </select>
          {formik.touched.projectManagerId && formik.errors.projectManagerId && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.projectManagerId}</div>
          )}
        </div>

        <div>
          <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
            Менеджер
          </label>
          <select
            id="managerId"
            name="managerId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.managerId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Выберите менеджера</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </select>
          {formik.touched.managerId && formik.errors.managerId && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.managerId}</div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="critical">Критический</option>
          </select>
          {formik.touched.priority && formik.errors.priority && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.priority}</div>
          )}
        </div>

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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="planning">Планирование</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершен</option>
            <option value="on_hold">Приостановлен</option>
            <option value="cancelled">Отменен</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.status}</div>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Бюджет
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.budget}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.budget && formik.errors.budget && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.budget}</div>
          )}
        </div>

        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
            Прогресс (%)
          </label>
          <input
            type="number"
            id="progress"
            name="progress"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.progress}
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.progress && formik.errors.progress && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.progress}</div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.description}</div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm; 