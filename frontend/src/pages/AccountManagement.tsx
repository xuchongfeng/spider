import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, Row, Col, Statistic, Progress, Upload, message, Tooltip } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface Account {
  id: number;
  username: string;
  email: string;
  password: string;
  type: 'email' | 'personal' | 'guest' | 'corporate';
  status: 'active' | 'banned' | 'expired' | 'testing';
  platform: string;
  lastUsed: string;
  successRate: number;
  dailyUsage: number;
  monthlyUsage: number;
  banReason: string;
  expireDate: string;
  notes: string;
}

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 1,
      username: 'user001',
      email: 'user001@example.com',
      password: '******',
      type: 'email',
      status: 'active',
      platform: 'Gmail',
      lastUsed: '2024-01-15 10:30:00',
      successRate: 95,
      dailyUsage: 25,
      monthlyUsage: 750,
      banReason: '',
      expireDate: '2025-01-15',
      notes: '主要邮箱账号'
    },
    {
      id: 2,
      username: 'personal_user',
      email: 'personal@example.com',
      password: '******',
      type: 'personal',
      status: 'active',
      platform: '个人账号',
      lastUsed: '2024-01-15 10:25:00',
      successRate: 88,
      dailyUsage: 15,
      monthlyUsage: 450,
      banReason: '',
      expireDate: '2024-12-31',
      notes: '个人注册账号'
    },
    {
      id: 3,
      username: 'guest_001',
      email: 'guest001@temp.com',
      password: '******',
      type: 'guest',
      status: 'banned',
      platform: '临时邮箱',
      lastUsed: '2024-01-14 15:20:00',
      successRate: 45,
      dailyUsage: 0,
      monthlyUsage: 120,
      banReason: 'IP被封禁',
      expireDate: '2024-01-20',
      notes: '临时游客账号'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '账号类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          email: { color: 'blue', text: '邮箱账号', icon: <MailOutlined /> },
          personal: { color: 'green', text: '个人账号', icon: <UserOutlined /> },
          guest: { color: 'orange', text: '游客账号', icon: <TeamOutlined /> },
          corporate: { color: 'purple', text: '企业账号', icon: <TeamOutlined /> }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Account) => {
        const statusConfig = {
          active: { color: 'green', text: '正常', icon: <CheckCircleOutlined /> },
          banned: { color: 'red', text: '封禁', icon: <CloseCircleOutlined /> },
          expired: { color: 'orange', text: '过期', icon: <CloseCircleOutlined /> },
          testing: { color: 'processing', text: '测试中', icon: <EyeOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        
        if (status === 'banned' && record.banReason) {
          return (
            <Tooltip title={`封禁原因: ${record.banReason}`}>
              <Tag color={config.color} icon={config.icon}>
                {config.text}
              </Tag>
            </Tooltip>
          );
        }
        
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate > 90 ? '#52c41a' : rate > 70 ? '#faad14' : '#f5222d'}
        />
      ),
    },
    {
      title: '今日使用',
      dataIndex: 'dailyUsage',
      key: 'dailyUsage',
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
    },
    {
      title: '到期时间',
      dataIndex: 'expireDate',
      key: 'expireDate',
      render: (date: string) => {
        const expireDate = new Date(date);
        const now = new Date();
        const daysLeft = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
          return <Tag color="red">已过期</Tag>;
        } else if (daysLeft <= 7) {
          return <Tag color="orange">{daysLeft}天后到期</Tag>;
        } else {
          return <span>{date}</span>;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Account) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleTestAccount(record.id)}
            disabled={record.status === 'banned' || record.status === 'expired'}
          >
            测试
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditAccount(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteAccount(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddAccount = () => {
    setEditingAccount(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    form.setFieldsValue(account);
    setIsModalVisible(true);
  };

  const handleDeleteAccount = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleTestAccount = (id: number) => {
    // 模拟账号测试
    setAccounts(accounts.map(account =>
      account.id === id ? { ...account, status: 'testing' } : account
    ));
    
    setTimeout(() => {
      setAccounts(accounts.map(account =>
        account.id === id ? { ...account, status: 'active' } : account
      ));
      message.success('账号测试成功！');
    }, 2000);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingAccount) {
        setAccounts(accounts.map(account =>
          account.id === editingAccount.id ? { ...account, ...values } : account
        ));
      } else {
        const newAccount: Account = {
          id: Date.now(),
          ...values,
          status: 'active',
          successRate: Math.floor(Math.random() * 30) + 70,
          dailyUsage: 0,
          monthlyUsage: 0,
          banReason: '',
          lastUsed: '-'
        };
        setAccounts([...accounts, newAccount]);
      }
      setIsModalVisible(false);
    });
  };

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    banned: accounts.filter(a => a.status === 'banned').length,
    expired: accounts.filter(a => a.status === 'expired').length,
    email: accounts.filter(a => a.type === 'email').length,
    personal: accounts.filter(a => a.type === 'personal').length,
    guest: accounts.filter(a => a.type === 'guest').length,
    totalDailyUsage: accounts.reduce((sum, a) => sum + a.dailyUsage, 0)
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>账号管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAccount}>
            添加账号
          </Button>
          <Button icon={<UploadOutlined />}>
            批量导入
          </Button>
          <Button>
            账号检测
          </Button>
        </Space>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={3}>
          <Card>
            <Statistic title="总账号数" value={stats.total} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="正常账号" value={stats.active} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="封禁账号" value={stats.banned} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="过期账号" value={stats.expired} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="邮箱账号" value={stats.email} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="个人账号" value={stats.personal} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="游客账号" value={stats.guest} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic title="今日使用" value={stats.totalDailyUsage} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingAccount ? '编辑账号' : '添加账号'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="账号类型"
            rules={[{ required: true, message: '请选择账号类型' }]}
          >
            <Select placeholder="请选择账号类型">
              <Option value="email">邮箱账号</Option>
              <Option value="personal">个人账号</Option>
              <Option value="guest">游客账号</Option>
              <Option value="corporate">企业账号</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请输入平台' }]}
          >
            <Input placeholder="请输入平台" />
          </Form.Item>
          
          <Form.Item
            name="expireDate"
            label="到期时间"
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
