import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Data from './pages/Data';
import Configs from './pages/Configs';
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
