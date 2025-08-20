import React from 'react';
import { Card, Row, Col, Typography, Divider, Tag, List, Space, Button } from 'antd';
import {
  BugOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  UserOutlined,
  EyeOutlined,
  BellOutlined,
  CloudOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  BarChartOutlined,
  NotificationOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Features: React.FC = () => {
  const features = [
    {
      icon: <BugOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: '智能爬虫引擎',
      description: '支持任意Web站点和APP内容爬取',
      features: [
        'Web站点爬取（静态/动态页面）',
        'APP内容爬取（模拟器/真机/API）',
        '智能反爬策略',
        '动态渲染支持（Selenium/Playwright）',
        '请求频率智能控制',
        '多线程并发爬取'
      ],
      color: '#1890ff'
    },
    {
      icon: <CloudOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: '代理管理系统',
      description: '免费代理维护与收费代理接入',
      features: [
        '免费代理池自动维护',
        '代理质量实时检测',
        '收费代理API接入',
        '代理自动切换策略',
        '代理地理位置分布',
        '代理性能统计'
      ],
      color: '#52c41a'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      title: '验证码处理',
      description: '自动识别与第三方平台接入',
      features: [
        'OCR自动识别',
        '滑块验证码处理',
        '点选验证码识别',
        '第三方验证码平台',
        '人工验证码处理',
        '验证码成功率统计'
      ],
      color: '#fa8c16'
    },
    {
      icon: <UserOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: '账号管理系统',
      description: '多类型账号池维护',
      features: [
        '邮箱账号池管理',
        '个人账号维护',
        '游客账号轮换',
        '账号状态监控',
        '账号封禁检测',
        '账号使用统计'
      ],
      color: '#722ed1'
    },
    {
      icon: <DatabaseOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
      title: '数据处理存储',
      description: '海量数据结构化与存储',
      features: [
        '分布式数据存储',
        '智能数据清洗',
        '结构化数据提取',
        '数据去重与合并',
        '多格式数据导出',
        '数据API接口'
      ],
      color: '#eb2f96'
    },
    {
      icon: <SettingOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
      title: '任务管理系统',
      description: '完整的爬虫任务生命周期管理',
      features: [
        '任务创建与配置',
        '任务调度与执行',
        '任务状态监控',
        '任务依赖关系',
        '任务重试机制',
        '任务性能分析'
      ],
      color: '#13c2c2'
    },
    {
      icon: <BarChartOutlined style={{ fontSize: 32, color: '#f5222d' }} />,
      title: '数据看板',
      description: '实时数据可视化与任务监控',
      features: [
        '实时数据统计',
        '任务执行监控',
        '爬取效率分析',
        '数据质量评估',
        '自定义报表',
        '数据趋势分析'
      ],
      color: '#f5222d'
    },
    {
      icon: <NotificationOutlined style={{ fontSize: 32, color: '#fa541c' }} />,
      title: '告警通知系统',
      description: '智能告警与多渠道通知',
      features: [
        '异常任务告警',
        '系统性能告警',
        '数据异常检测',
        '多渠道通知（邮件/短信/钉钉/微信）',
        '告警级别管理',
        '告警历史记录'
      ],
      color: '#fa541c'
    }
  ];

  const technicalFeatures = [
    {
      title: '高并发处理',
      description: '支持数千个并发爬虫任务，采用异步处理和队列机制',
      icon: <RocketOutlined />
    },
    {
      title: '智能反爬',
      description: '自动识别反爬策略，智能调整请求参数和频率',
      icon: <EyeOutlined />
    },
    {
      title: '分布式架构',
      description: '支持多节点部署，任务自动负载均衡',
      icon: <CloudOutlined />
    },
    {
      title: '数据安全',
      description: '数据加密存储，访问权限控制，审计日志记录',
      icon: <SafetyOutlined />
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ color: '#1890ff' }}>
          🕷️ 通用爬虫平台功能特性
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          专业的爬虫解决方案，支持任意网站和APP内容爬取，提供完整的代理管理、验证码处理、账号管理等核心功能
        </Paragraph>
      </div>

      {/* 核心功能展示 */}
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              hoverable
              style={{ height: '100%', border: `2px solid ${feature.color}20` }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {feature.icon}
                <Title level={3} style={{ marginTop: '16px', color: feature.color }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: '#666', marginBottom: '20px' }}>
                  {feature.description}
                </Paragraph>
              </div>
              
              <List
                size="small"
                dataSource={feature.features}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px 0', border: 'none' }}>
                    <Space>
                      <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: feature.color 
                      }} />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* 技术特性 */}
      <div style={{ marginBottom: '48px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
          技术特性
        </Title>
        <Row gutter={[24, 24]}>
          {technicalFeatures.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }}>
                  {feature.icon}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph style={{ color: '#666' }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 应用场景 */}
      <div style={{ marginBottom: '48px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
          应用场景
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Title level={4}>📰 新闻媒体</Title>
                <List size="small">
                  <List.Item>新闻内容采集</List.Item>
                  <List.Item>热点话题监控</List.Item>
                  <List.Item>舆情分析数据</List.Item>
                </List>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Title level={4}>🛒 电商平台</Title>
                <List size="small">
                  <List.Item>商品信息采集</List.Item>
                  <List.Item>价格监控分析</List.Item>
                  <List.Item>竞品数据对比</List.Item>
                </List>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Title level={4}>💼 企业信息</Title>
                <List size="small">
                  <List.Item>企业工商信息</List.Item>
                  <List.Item>招聘信息采集</List.Item>
                  <List.Item>行业数据监控</List.Item>
                </List>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 开始使用 */}
      <div style={{ textAlign: 'center', padding: '48px', background: '#f5f5f5', borderRadius: '12px' }}>
        <Title level={2}>准备开始使用？</Title>
        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
          立即体验强大的爬虫平台，开始您的数据采集之旅
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" icon={<RocketOutlined />}>
            立即开始
          </Button>
          <Button size="large" icon={<EyeOutlined />}>
            查看演示
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Features;
