import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, Progress, Row, Col, Statistic } from 'antd';
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Proxy {
  id: number;
  ip: string;
  port: number;
  protocol: string;
  location: string;
  speed: number;
  successRate: number;
  lastCheck: string;
  status: 'active' | 'inactive' | 'testing';
  type: 'free' | 'paid';
  source: string;
}

const ProxyManagement: React.FC = () => {
  const [proxies, setProxies] = useState<Proxy[]>([
    {
      id: 1,
      ip: '192.168.1.100',
      port: 8080,
      protocol: 'http',
      location: '中国-北京',
      speed: 150,
      successRate: 95,
      lastCheck: '2024-01-15 10:30:00',
      status: 'active',
      type: 'free',
      source: '自动发现'
    },
    {
      id: 2,
      ip: '10.0.0.50',
      port: 3128,
      protocol: 'https',
      location: '美国-纽约',
      speed: 200,
      successRate: 88,
      lastCheck: '2024-01-15 10:25:00',
      status: 'active',
      type: 'paid',
      source: '代理API'
    },
    {
      id: 3,
      ip: '172.16.0.25',
      port: 8888,
      protocol: 'socks5',
      location: '日本-东京',
      speed: 120,
      successRate: 92,
      lastCheck: '2024-01-15 10:20:00',
      status: 'testing',
      type: 'free',
      source: '手动添加'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProxy, setEditingProxy] = useState<Proxy | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => (
        <Tag color={protocol === 'https' ? 'green' : protocol === 'socks5' ? 'blue' : 'orange'}>
          {protocol.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '地理位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '响应速度(ms)',
      dataIndex: 'speed',
      key: 'speed',
      render: (speed: number) => (
        <span style={{ color: speed < 100 ? '#52c41a' : speed < 200 ? '#faad14' : '#f5222d' }}>
          {speed}ms
        </span>
      ),
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '活跃', icon: <CheckCircleOutlined /> },
          inactive: { color: 'red', text: '失效', icon: <CloseCircleOutlined /> },
          testing: { color: 'processing', text: '检测中', icon: <ReloadOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'paid' ? 'gold' : 'blue'}>
          {type === 'paid' ? '付费' : '免费'}
        </Tag>
      ),
    },
    {
      title: '最后检测',
      dataIndex: 'lastCheck',
      key: 'lastCheck',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Proxy) => (
        <Space size="middle">
          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={() => handleTestProxy(record.id)}
          >
            检测
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditProxy(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteProxy(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddProxy = () => {
    setEditingProxy(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProxy = (proxy: Proxy) => {
    setEditingProxy(proxy);
    form.setFieldsValue(proxy);
    setIsModalVisible(true);
  };

  const handleDeleteProxy = (id: number) => {
    setProxies(proxies.filter(proxy => proxy.id !== id));
  };

  const handleTestProxy = (id: number) => {
    // 模拟代理检测
    setProxies(proxies.map(proxy =>
      proxy.id === id ? { ...proxy, status: 'testing' } : proxy
    ));
    
    setTimeout(() => {
      setProxies(proxies.map(proxy =>
        proxy.id === id ? { ...proxy, status: 'active', lastCheck: new Date().toLocaleString() } : proxy
      ));
    }, 2000);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingProxy) {
        setProxies(proxies.map(proxy =>
          proxy.id === editingProxy.id ? { ...proxy, ...values } : proxy
        ));
      } else {
        const newProxy: Proxy = {
          id: Date.now(),
          ...values,
          status: 'active',
          lastCheck: new Date().toLocaleString(),
          speed: Math.floor(Math.random() * 200) + 50,
          successRate: Math.floor(Math.random() * 30) + 70,
        };
        setProxies([...proxies, newProxy]);
      }
      setIsModalVisible(false);
    });
  };

  const stats = {
    total: proxies.length,
    active: proxies.filter(p => p.status === 'active').length,
    free: proxies.filter(p => p.type === 'free').length,
    paid: proxies.filter(p => p.type === 'paid').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>代理管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProxy}>
            添加代理
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总代理数" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="活跃代理" value={stats.active} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="免费代理" value={stats.free} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="付费代理" value={stats.paid} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={proxies}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingProxy ? '编辑代理' : '添加代理'}
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
            name="ip"
            label="IP地址"
            rules={[{ required: true, message: '请输入IP地址' }]}
          >
            <Input placeholder="请输入IP地址" />
          </Form.Item>
          
          <Form.Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口号' }]}
          >
            <InputNumber min={1} max={65535} placeholder="请输入端口号" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="protocol"
            label="协议"
            rules={[{ required: true, message: '请选择协议' }]}
          >
            <Select placeholder="请选择协议">
              <Option value="http">HTTP</Option>
              <Option value="https">HTTPS</Option>
              <Option value="socks5">SOCKS5</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="location"
            label="地理位置"
          >
            <Input placeholder="请输入地理位置" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="代理类型"
            rules={[{ required: true, message: '请选择代理类型' }]}
          >
            <Select placeholder="请选择代理类型">
              <Option value="free">免费代理</Option>
              <Option value="paid">付费代理</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="source"
            label="来源"
          >
            <Input placeholder="请输入代理来源" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProxyManagement;
