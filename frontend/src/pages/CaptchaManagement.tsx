import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, Row, Col, Statistic, Progress, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface Captcha {
  id: number;
  name: string;
  type: 'image' | 'slider' | 'click' | 'audio';
  platform: string;
  apiKey: string;
  successRate: number;
  avgResponseTime: number;
  status: 'active' | 'inactive' | 'testing';
  dailyUsage: number;
  monthlyUsage: number;
  cost: number;
  lastUsed: string;
}

const CaptchaManagement: React.FC = () => {
  const [captchas, setCaptchas] = useState<Captcha[]>([
    {
      id: 1,
      name: '超级鹰验证码识别',
      type: 'image',
      platform: '超级鹰',
      apiKey: 'chaojiying_****',
      successRate: 95,
      avgResponseTime: 2.5,
      status: 'active',
      dailyUsage: 150,
      monthlyUsage: 4500,
      cost: 0.003,
      lastUsed: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      name: '2captcha滑块验证',
      type: 'slider',
      platform: '2captcha',
      apiKey: '2captcha_****',
      successRate: 88,
      avgResponseTime: 5.2,
      status: 'active',
      dailyUsage: 80,
      monthlyUsage: 2400,
      cost: 0.005,
      lastUsed: '2024-01-15 10:25:00'
    },
    {
      id: 3,
      name: '本地OCR识别',
      type: 'image',
      platform: '本地',
      apiKey: 'local_ocr',
      successRate: 75,
      avgResponseTime: 0.8,
      status: 'active',
      dailyUsage: 200,
      monthlyUsage: 6000,
      cost: 0,
      lastUsed: '2024-01-15 10:20:00'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCaptcha, setEditingCaptcha] = useState<Captcha | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '验证码名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          image: { color: 'blue', text: '图片验证码' },
          slider: { color: 'green', text: '滑块验证' },
          click: { color: 'orange', text: '点选验证' },
          audio: { color: 'purple', text: '语音验证' }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
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
      title: '平均响应时间',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      render: (time: number) => (
        <span style={{ color: time < 2 ? '#52c41a' : time < 5 ? '#faad14' : '#f5222d' }}>
          {time}s
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '启用', icon: <CheckCircleOutlined /> },
          inactive: { color: 'red', text: '禁用', icon: <CloseCircleOutlined /> },
          testing: { color: 'processing', text: '测试中', icon: <EyeOutlined /> }
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
      title: '今日使用量',
      dataIndex: 'dailyUsage',
      key: 'dailyUsage',
    },
    {
      title: '成本(元/次)',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (
        <span style={{ color: cost === 0 ? '#52c41a' : '#faad14' }}>
          ¥{cost.toFixed(3)}
        </span>
      ),
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Captcha) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleTestCaptcha(record.id)}
          >
            测试
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditCaptcha(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteCaptcha(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddCaptcha = () => {
    setEditingCaptcha(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCaptcha = (captcha: Captcha) => {
    setEditingCaptcha(captcha);
    form.setFieldsValue(captcha);
    setIsModalVisible(true);
  };

  const handleDeleteCaptcha = (id: number) => {
    setCaptchas(captchas.filter(captcha => captcha.id !== id));
  };

  const handleTestCaptcha = (id: number) => {
    // 模拟验证码测试
    setCaptchas(captchas.map(captcha =>
      captcha.id === id ? { ...captcha, status: 'testing' } : captcha
    ));
    
    setTimeout(() => {
      setCaptchas(captchas.map(captcha =>
        captcha.id === id ? { ...captcha, status: 'active' } : captcha
      ));
      message.success('验证码测试成功！');
    }, 2000);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingCaptcha) {
        setCaptchas(captchas.map(captcha =>
          captcha.id === editingCaptcha.id ? { ...captcha, ...values } : captcha
        ));
      } else {
        const newCaptcha: Captcha = {
          id: Date.now(),
          ...values,
          status: 'active',
          successRate: Math.floor(Math.random() * 30) + 70,
          avgResponseTime: Math.random() * 5 + 1,
          dailyUsage: 0,
          monthlyUsage: 0,
          lastUsed: '-'
        };
        setCaptchas([...captchas, newCaptcha]);
      }
      setIsModalVisible(false);
    });
  };

  const stats = {
    total: captchas.length,
    active: captchas.filter(c => c.status === 'active').length,
    totalDailyUsage: captchas.reduce((sum, c) => sum + c.dailyUsage, 0),
    totalMonthlyUsage: captchas.reduce((sum, c) => sum + c.monthlyUsage, 0),
    totalCost: captchas.reduce((sum, c) => sum + c.dailyUsage * c.cost, 0)
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>验证码管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCaptcha}>
            添加验证码平台
          </Button>
          <Button icon={<UploadOutlined />}>
            批量导入
          </Button>
        </Space>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic title="总平台数" value={stats.total} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="启用平台" value={stats.active} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="今日使用量" value={stats.totalDailyUsage} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="本月使用量" value={stats.totalMonthlyUsage} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="今日成本" value={stats.totalCost} precision={2} suffix="元" />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="平均成功率" value={captchas.length > 0 ? 
              Math.round(captchas.reduce((sum, c) => sum + c.successRate, 0) / captchas.length) : 0} 
              suffix="%" 
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={captchas}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingCaptcha ? '编辑验证码平台' : '添加验证码平台'}
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
            name="name"
            label="平台名称"
            rules={[{ required: true, message: '请输入平台名称' }]}
          >
            <Input placeholder="请输入平台名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="验证码类型"
            rules={[{ required: true, message: '请选择验证码类型' }]}
          >
            <Select placeholder="请选择验证码类型">
              <Option value="image">图片验证码</Option>
              <Option value="slider">滑块验证</Option>
              <Option value="click">点选验证</Option>
              <Option value="audio">语音验证</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="platform"
            label="平台标识"
            rules={[{ required: true, message: '请输入平台标识' }]}
          >
            <Input placeholder="请输入平台标识" />
          </Form.Item>
          
          <Form.Item
            name="apiKey"
            label="API密钥"
            rules={[{ required: true, message: '请输入API密钥' }]}
          >
            <Input.Password placeholder="请输入API密钥" />
          </Form.Item>
          
          <Form.Item
            name="cost"
            label="单次成本(元)"
            rules={[{ required: true, message: '请输入单次成本' }]}
          >
            <InputNumber 
              min={0} 
              step={0.001} 
              placeholder="请输入单次成本" 
              style={{ width: '100%' }} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CaptchaManagement;
