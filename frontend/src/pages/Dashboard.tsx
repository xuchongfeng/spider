import React from 'react';
import { Row, Col, Card, Statistic, Table, Button } from 'antd';
import { BugOutlined, DatabaseOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const recentTasks = [
    {
      key: '1',
      name: '新闻网站爬虫',
      status: '运行中',
      progress: 75,
      createTime: '2024-01-15 10:30:00',
    },
    {
      key: '2',
      name: '电商数据爬虫',
      status: '已完成',
      progress: 100,
      createTime: '2024-01-15 09:15:00',
    },
    {
      key: '3',
      name: '社交媒体爬虫',
      status: '等待中',
      progress: 0,
      createTime: '2024-01-15 08:45:00',
    },
  ];

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case '运行中':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case '已完成':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case '等待中':
            color = 'default';
            icon = <ClockCircleOutlined />;
            break;
        }
        
        return (
          <span style={{ color }}>
            {icon} {status}
          </span>
        );
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => `${progress}%`,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>仪表盘</h2>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={25}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中任务"
              value={3}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成任务"
              value={20}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总数据量"
              value={15420}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近任务 */}
      <Card title="最近任务" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={recentTasks}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 系统状态 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="系统状态">
            <p>CPU使用率: 45%</p>
            <p>内存使用率: 62%</p>
            <p>磁盘使用率: 38%</p>
            <p>网络状态: 正常</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="爬虫引擎状态">
            <p>爬虫引擎: 运行中</p>
            <p>任务队列: 正常</p>
            <p>数据存储: 正常</p>
            <p>API服务: 正常</p>
          </Card>
        </Col>
      </Row>


    </div>
  );
};

export default Dashboard;
