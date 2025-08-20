import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Data from './pages/Data';
import Configs from './pages/Configs';
import Features from './pages/Features';
import ProxyManagement from './pages/ProxyManagement';
import CaptchaManagement from './pages/CaptchaManagement';
import AccountManagement from './pages/AccountManagement';
import AlertManagement from './pages/AlertManagement';
import Login from './pages/Login';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="data" element={<Data />} />
          <Route path="configs" element={<Configs />} />
          <Route path="features" element={<Features />} />
          <Route path="proxies" element={<ProxyManagement />} />
          <Route path="captchas" element={<CaptchaManagement />} />
          <Route path="accounts" element={<AccountManagement />} />
          <Route path="alerts" element={<AlertManagement />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
