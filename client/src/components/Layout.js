import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/cyberpunk.css';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="cyber-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="cyber-title text-2xl">
                  CYBERBITS CRM
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`cyber-nav-link inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/') ? 'active' : ''
                  }`}
                >
                  ДАШБОРД
                </Link>
                <Link
                  to="/projects"
                  className={`cyber-nav-link inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/projects') ? 'active' : ''
                  }`}
                >
                  ПРОЕКТЫ
                </Link>
                <Link
                  to="/documents"
                  className={`cyber-nav-link inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/documents') ? 'active' : ''
                  }`}
                >
                  ДОКУМЕНТЫ
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/users"
                    className={`cyber-nav-link inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive('/users') ? 'active' : ''
                    }`}
                  >
                    ПОЛЬЗОВАТЕЛИ
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="cyber-subtitle">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={logout}
                    className="cyber-button"
                  >
                    ВЫЙТИ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="cyber-container p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout; 