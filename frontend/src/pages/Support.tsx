import React from 'react';
import { Card, Row, Col, Typography, Divider, Avatar, Tag, List, Space, Button, Timeline, Descriptions } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TrophyOutlined,
  BookOutlined,
  CodeOutlined,
  RocketOutlined,
  SafetyOutlined,
  CloudOutlined,
  DatabaseOutlined,
  BugOutlined,
  SettingOutlined,
  BarChartOutlined,
  BellOutlined,
  TeamOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Support: React.FC = () => {
  const personalInfo = {
    name: '徐重峰',
    title: '爬虫专家 / 全栈开发工程师',
    email: 'far.far.away.away@gmail.com',
    phone: '+86 185-2945-9265',
    github: 'https://github.com/xuchongfeng',
    linkedin: 'https://linkedin.com/in/xuchongfeng',
    location: '广州',
    experience: '10年+',
    education: '硕士'
  };

  const skills = [
    { category: '爬虫技术', skills: ['Scrapy', 'IDA Pro', 'JS分析', '反爬虫策略', 'APP逆向分析'] },
    { category: '后端技术', skills: ['FastAPI', 'Django', 'Flask', 'Python', 'Node.js', 'MySQL', 'Postgresql'] },
  ];

  const experience = [
    {
      period: '2015-至今',
      company: '网易游戏/阿里巴巴/字节跳动公司',
      position: '研发专家',
      description: '负责公司爬虫平台的整体技术架构设计，带领团队开发企业级爬虫解决方案'
    }
  ];

  const projects = [
    {
      name: '蚂蚁搬家爬虫平台',
      description: '企业级通用爬虫解决方案，支持任意网站和APP内容爬取',
      tech: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
      features: ['智能反爬策略', '代理管理系统', '验证码处理', '账号管理', '任务调度']
    }
  ];

  const supportServices = [
    {
      title: '技术咨询',
      description: '提供爬虫技术选型、架构设计、性能优化等专业建议',
      icon: <CodeOutlined />,
      details: [
        '爬虫技术选型指导',
        '系统架构设计咨询',
        '性能优化方案',
        '反爬虫策略分析'
      ]
    },
    {
      title: '项目开发',
      description: '承接各类爬虫项目开发，从需求分析到部署上线全流程服务',
      icon: <RocketOutlined />,
      details: [
        '需求分析与技术方案',
        '系统设计与开发',
        '测试与部署',
        '运维与监控'
      ]
    },
    {
      title: '技术培训',
      description: '提供爬虫技术培训，帮助团队快速掌握相关技能',
      icon: <BookOutlined />,
      details: [
        '爬虫基础入门',
        '高级反爬虫技术',
        '大规模数据处理',
        '系统架构设计'
      ]
    },
    {
      title: '问题排查',
      description: '帮助解决爬虫系统运行中的各种技术问题',
      icon: <BugOutlined />,
      details: [
        '性能问题诊断',
        '反爬虫绕过',
        '数据质量问题',
        '系统故障排查'
      ]
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{ color: '#1890ff' }}>
          🛠️ 技术支持
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          专业的爬虫技术专家，为您提供全方位的技术支持服务
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 个人简历 */}
        <Col xs={24} lg={12}>
          <Card title="👨‍💻 个人简历" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ marginTop: '16px' }}>{personalInfo.name}</Title>
              <Paragraph style={{ fontSize: '16px', color: '#666' }}>{personalInfo.title}</Paragraph>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="📧 邮箱">{personalInfo.email}</Descriptions.Item>
              <Descriptions.Item label="📱 电话">{personalInfo.phone}</Descriptions.Item>
              <Descriptions.Item label="📍 位置">{personalInfo.location}</Descriptions.Item>
              <Descriptions.Item label="⏰ 工作经验">{personalInfo.experience}</Descriptions.Item>
              <Descriptions.Item label="🎓 学历">{personalInfo.education}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>🔗 联系方式</Title>
            <Space size="middle">
              <Button icon={<GithubOutlined />} href={personalInfo.github} target="_blank">
                GitHub
              </Button>
              <Button icon={<LinkedinOutlined />} href={personalInfo.linkedin} target="_blank">
                LinkedIn
              </Button>
              <Button icon={<MailOutlined />} type="primary">
                发送邮件
              </Button>
            </Space>

            <Divider />

            <Title level={4}>💡 技能专长</Title>
            {skills.map((skillGroup, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <Text strong>{skillGroup.category}:</Text>
                <div style={{ marginTop: '8px' }}>
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <Tag key={skillIndex} color="blue" style={{ marginBottom: '4px' }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}

            <Divider />

            <Title level={4}>📈 工作经历</Title>
            <Timeline
              items={experience.map((exp, index) => ({
                children: (
                  <div>
                    <Text strong>{exp.period} - {exp.company}</Text>
                    <br />
                    <Text type="secondary">{exp.position}</Text>
                    <br />
                    <Text>{exp.description}</Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* 项目案例 */}
        <Col xs={24} lg={12}>
          <Card title="🚀 项目案例" style={{ marginBottom: '24px' }}>
            {projects.map((project, index) => (
              <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                <Title level={4} style={{ marginBottom: '8px' }}>{project.name}</Title>
                <Paragraph style={{ color: '#666', marginBottom: '12px' }}>{project.description}</Paragraph>
                
                <div style={{ marginBottom: '12px' }}>
                  <Text strong>技术栈: </Text>
                  {project.tech.map((tech, techIndex) => (
                    <Tag key={techIndex} color="green" style={{ marginBottom: '4px' }}>
                      {tech}
                    </Tag>
                  ))}
                </div>

                <div>
                  <Text strong>核心功能: </Text>
                  {project.features.map((feature, featureIndex) => (
                    <Tag key={featureIndex} color="orange" style={{ marginBottom: '4px' }}>
                      {feature}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* 技术支持服务 */}
          <Card title="🛠️ 技术支持服务">
            <Row gutter={[16, 16]}>
              {supportServices.map((service, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card size="small" hoverable>
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>
                        {service.icon}
                      </div>
                      <Title level={5} style={{ margin: 0 }}>{service.title}</Title>
                    </div>
                    <Paragraph style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                      {service.description}
                    </Paragraph>
                    <List
                      size="small"
                      dataSource={service.details}
                      renderItem={(item) => (
                        <List.Item style={{ padding: '4px 0', border: 'none' }}>
                          <Text style={{ fontSize: '12px' }}>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 联系信息 */}
      <Card style={{ marginTop: '24px', textAlign: 'center', background: '#f5f5f5' }}>
        <Title level={3}>📞 立即联系</Title>
        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
          如果您需要技术支持或有任何技术问题，欢迎随时联系我
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" icon={<MailOutlined />}>
            发送邮件咨询
          </Button>
          <Button size="large" icon={<PhoneOutlined />}>
            电话咨询
          </Button>
          <Button size="large" icon={<GithubOutlined />}>
            查看代码
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Support;
