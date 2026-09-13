import React from 'react';
import {HashRouter, Route, Routes, useLocation} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import {MapPage} from './pages/MapPage';
import {SpotListPage} from './pages/SpotListPage';
import {SpotDetailPage} from './pages/SpotDetailPage';
import {StampBookPage} from './pages/StampBookPage';
import {SettingsPage} from './pages/SettingsPage';
import {NotFoundPage} from './pages/NotFoundPage';
import {AppHeader} from './components/AppHeader';
import {MainNavigation} from './components/MainNavigation';
import {AppFooter} from './components/AppFooter';
import styles from './App.module.css';

const routes = [
  {path: '/', element: <HomePage />, key: 'home'},
  {path: '/map', element: <MapPage />, key: 'map'},
  {path: '/spots', element: <SpotListPage />, key: 'spots'},
  {path: '/spots/:spotId', element: <SpotDetailPage />, key: 'spotDetail'},
  {path: '/stamps', element: <StampBookPage />, key: 'stamps'},
  {path: '/settings', element: <SettingsPage />, key: 'settings'},
];

const AppContent = () => {
  const location = useLocation();

  const navKeys = [
    {key: 'home', label: 'ホーム', path: '/'},
    {key: 'map', label: '地図', path: '/map'},
    {key: 'spots', label: '一覧', path: '/spots'},
    {key: 'stamps', label: 'スタンプ帳', path: '/stamps'},
    {key: 'settings', label: '設定', path: '/settings'},
  ];

  const isActive = (path: string) =>
    location.pathname === path || (location.pathname === '/' && path === '/');

  return (
    <div className={styles.app}>
      <AppHeader />
      <MainNavigation
        isActive={isActive}
        navItems={navKeys}
        onSelect={(path: string) => {
          window.location.hash = path;
        }}
      />

      <Routes>
        {routes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={route.element}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <AppFooter />
    </div>
  );
};

export const App = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};