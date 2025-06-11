import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Введите корректный email')
    .required('Email обязателен')
});

function ForgotPassword() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`${API_URL}/auth/forgot-password`, {
          email: values.email
        });
        setSuccess(true);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка отправки инструкций');
        setSuccess(false);
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
            ВОССТАНОВЛЕНИЕ ДОСТУПА
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Введите email для получения инструкций
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-gray-900/50 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-purple-500/20">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-purple-300">Инструкции отправлены</h3>
              <p className="mt-2 text-sm text-purple-200">
                Проверьте вашу почту для получения инструкций по восстановлению пароля
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="text-sm text-purple-300 hover:text-purple-400 transition-colors duration-200"
                >
                  Вернуться на страницу входа
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

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
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  ОТПРАВИТЬ ИНСТРУКЦИИ
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-purple-300 hover:text-purple-400 transition-colors duration-200"
            >
              Вернуться на страницу входа
            </Link>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
    </div>
  );
}

export default ForgotPassword; 