import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Введите корректный email')
    .required('Email обязателен'),
  password: Yup.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .required('Пароль обязателен'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
  firstName: Yup.string()
    .required('Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: Yup.string()
    .required('Фамилия обязательна')
    .min(2, 'Фамилия должна содержать минимум 2 символа'),
  role: Yup.string()
    .required('Роль обязательна')
    .oneOf(['user', 'manager'], 'Выберите корректную роль')
});

function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'user'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Отправка данных регистрации:', values);
        const response = await axios.post(`${API_URL}/api/auth/register`, {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role
        });
        console.log('Ответ сервера:', response.data);
        navigate('/login', { state: { message: 'Регистрация успешна. Теперь вы можете войти.' } });
      } catch (err) {
        console.error('Ошибка регистрации:', err.response?.data || err);
        setError(err.response?.data?.message || 'Ошибка регистрации');
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="text-center">
          <div className="inline-block">
            <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
              Cyberbits
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full"></div>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-purple-300 tracking-wider">
            РЕГИСТРАЦИЯ В СИСТЕМЕ
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Создайте новый аккаунт для доступа к системе
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-gray-900/50 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-purple-500/20">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-purple-300">
                  Имя
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    className="appearance-none block w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-md shadow-sm placeholder-purple-300/50 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="mt-1 text-sm text-red-400">{formik.errors.firstName}</div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-purple-300">
                  Фамилия
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    className="appearance-none block w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-md shadow-sm placeholder-purple-300/50 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="mt-1 text-sm text-red-400">{formik.errors.lastName}</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="appearance-none block w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-md shadow-sm placeholder-purple-300/50 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-300">
                Пароль
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="appearance-none block w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-md shadow-sm placeholder-purple-300/50 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.password}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-300">
                Подтверждение пароля
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="appearance-none block w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-md shadow-sm placeholder-purple-300/50 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-purple-300">
                Роль
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                  className="appearance-none block w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-md shadow-sm placeholder-purple-300/50 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-200"
                >
                  <option value="user">Пользователь</option>
                  <option value="manager">Менеджер</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.role}</div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                СОЗДАТЬ АККАУНТ
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/50 text-purple-300">Или</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-purple-300 hover:text-purple-400 transition-colors duration-200"
              >
                Уже есть аккаунт? Войти
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
    </div>
  );
}

export default Register; 