import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    // 这里应该调用登录API
    console.log('登录信息:', values);
    
    // 模拟登录成功
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('登录成功！');
      navigate('/');
    } else {
      message.error('用户名或密码错误！');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <h1>通用爬虫网站</h1>
            <p>基于React和FastAPI的现代化爬虫平台</p>
          </div>
          
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                登录
              </Button>
            </Form.Item>
          </Form>
          
          <div className="login-footer">
            <p>默认账号: admin / admin</p>
            <p>这是一个演示项目，请根据实际需求修改</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
