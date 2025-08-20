import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, Row, Col, Statistic, Badge, Switch, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, BellOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface Alert {
  id: number;
  name: string;
  type: 'task' | 'system' | 'data' | 'performance';
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'triggered';
  condition: string;
  channels: string[];
  recipients: string[];
  lastTriggered: string;
  triggerCount: number;
  enabled: boolean;
  description: string;
}

const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      name: '任务执行失败告警',
      type: 'task',
      level: 'high',
      status: 'active',
      condition: '任务执行失败次数 > 3',
      channels: ['email', 'dingtalk'],
      recipients: ['admin@example.com', 'ops@example.com'],
      lastTriggered: '2024-01-15 10:30:00',
      triggerCount: 5,
      enabled: true,
      description: '监控爬虫任务执行状态，失败次数超过阈值时发送告警'
    },
    {
      id: 2,
      name: '系统CPU使用率告警',
      type: 'system',
      level: 'medium',
      status: 'active',
      condition: 'CPU使用率 > 80%',
      channels: ['email', 'wechat'],
      recipients: ['admin@example.com'],
      lastTriggered: '2024-01-15 09:15:00',
      triggerCount: 2,
      enabled: true,
      description: '监控系统CPU使用率，超过阈值时发送告警'
    },
    {
      id: 3,
      name: '数据异常检测告警',
      type: 'data',
      level: 'critical',
      status: 'triggered',
      condition: '数据质量评分 < 60',
      channels: ['email', 'sms', 'dingtalk'],
      recipients: ['admin@example.com', 'data@example.com'],
      lastTriggered: '2024-01-15 10:25:00',
      triggerCount: 1,
      enabled: true,
      description: '检测爬取数据质量，评分过低时发送告警'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '告警名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          task: { color: 'blue', text: '任务告警' },
          system: { color: 'green', text: '系统告警' },
          data: { color: 'orange', text: '数据告警' },
          performance: { color: 'purple', text: '性能告警' }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelConfig = {
          low: { color: 'blue', text: '低' },
          medium: { color: 'orange', text: '中' },
          high: { color: 'red', text: '高' },
          critical: { color: 'red', text: '严重' }
        };
        const config = levelConfig[level as keyof typeof levelConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '正常', icon: <CheckCircleOutlined /> },
          inactive: { color: 'default', text: '禁用', icon: <CloseCircleOutlined /> },
          triggered: { color: 'red', text: '已触发', icon: <ExclamationCircleOutlined /> }
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
      title: '触发条件',
      dataIndex: 'condition',
      key: 'condition',
      ellipsis: true,
    },
    {
      title: '通知渠道',
      dataIndex: 'channels',
      key: 'channels',
      render: (channels: string[]) => (
        <Space>
          {channels.map(channel => (
            <Tag key={channel} color="blue">
              {channel === 'email' ? '邮件' : 
               channel === 'sms' ? '短信' : 
               channel === 'dingtalk' ? '钉钉' : 
               channel === 'wechat' ? '微信' : channel}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
    },
    {
      title: '触发次数',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: count > 0 ? '#f5222d' : '#d9d9d9' }} />
      ),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: Alert) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleAlert(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Alert) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditAlert(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteAlert(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddAlert = () => {
    setEditingAlert(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert);
    form.setFieldsValue(alert);
    setIsModalVisible(true);
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleToggleAlert = (id: number, enabled: boolean) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, enabled } : alert
    ));
    message.success(`${enabled ? '启用' : '禁用'}告警成功`);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingAlert) {
        setAlerts(alerts.map(alert =>
          alert.id === editingAlert.id ? { ...alert, ...values } : alert
        ));
        message.success('告警更新成功');
      } else {
        const newAlert: Alert = {
          id: Date.now(),
          ...values,
          status: 'active',
          lastTriggered: '-',
          triggerCount: 0,
          enabled: true,
        };
        setAlerts([...alerts, newAlert]);
        message.success('告警创建成功');
      }
      setIsModalVisible(false);
    });
  };

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    triggered: alerts.filter(a => a.status === 'triggered').length,
    enabled: alerts.filter(a => a.enabled).length,
    totalTriggers: alerts.reduce((sum, a) => sum + a.triggerCount, 0)
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>告警管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAlert}>
            添加告警
          </Button>
          <Button icon={<BellOutlined />}>
            测试告警
          </Button>
        </Space>
      </div>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic title="总告警数" value={stats.total} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="正常告警" value={stats.active} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="已触发" value={stats.triggered} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="已启用" value={stats.enabled} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="总触发次数" value={stats.totalTriggers} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="今日触发" value={alerts.filter(a => 
              a.lastTriggered.includes('2024-01-15')).length} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={alerts}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingAlert ? '编辑告警' : '添加告警'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="告警名称"
                rules={[{ required: true, message: '请输入告警名称' }]}
              >
                <Input placeholder="请输入告警名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="告警类型"
                rules={[{ required: true, message: '请选择告警类型' }]}
              >
                <Select placeholder="请选择告警类型">
                  <Option value="task">任务告警</Option>
                  <Option value="system">系统告警</Option>
                  <Option value="data">数据告警</Option>
                  <Option value="performance">性能告警</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="告警级别"
                rules={[{ required: true, message: '请选择告警级别' }]}
              >
                <Select placeholder="请选择告警级别">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">严重</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="channels"
                label="通知渠道"
                rules={[{ required: true, message: '请选择通知渠道' }]}
              >
                <Select mode="multiple" placeholder="请选择通知渠道">
                  <Option value="email">邮件</Option>
                  <Option value="sms">短信</Option>
                  <Option value="dingtalk">钉钉</Option>
                  <Option value="wechat">微信</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="condition"
            label="触发条件"
            rules={[{ required: true, message: '请输入触发条件' }]}
          >
            <Input placeholder="例如: 任务执行失败次数 > 3" />
          </Form.Item>
          
          <Form.Item
            name="recipients"
            label="接收人"
            rules={[{ required: true, message: '请输入接收人' }]}
          >
            <Select mode="tags" placeholder="请输入邮箱或手机号">
              <Option value="admin@example.com">admin@example.com</Option>
              <Option value="ops@example.com">ops@example.com</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="告警描述"
          >
            <TextArea rows={3} placeholder="请输入告警描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertManagement;
