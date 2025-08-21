import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BugOutlined,
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  RocketOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/tasks',
      icon: <BugOutlined />,
      label: '爬虫任务',
    },
    {
      key: '/data',
      icon: <DatabaseOutlined />,
      label: '爬虫数据',
    },
    {
      key: '/configs',
      icon: <SettingOutlined />,
      label: '爬虫配置',
    },
    {
      key: '/proxies',
      icon: <CloudOutlined />,
      label: '代理管理',
    },
    {
      key: '/captchas',
      icon: <SafetyCertificateOutlined />,
      label: '验证码管理',
    },
    {
      key: '/accounts',
      icon: <TeamOutlined />,
      label: '账号管理',
    },
    {
      key: '/alerts',
      icon: <BellOutlined />,
      label: '告警管理',
    },
    {
      key: '/support',
      icon: <UserOutlined />,
      label: '技术支持',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 处理退出登录
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <BugOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <span style={{ fontWeight: 600 }}>蚂蚁搬家</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
