import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Card, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Config {
  id: number;
  name: string;
  description: string;
  configData: any;
  isDefault: boolean;
  isActive: boolean;
  createTime: string;
}

const Configs: React.FC = () => {
  const [configs, setConfigs] = useState<Config[]>([
    {
      id: 1,
      name: '新闻网站配置',
      description: '用于爬取新闻网站的配置模板',
      configData: {
        selectors: {
          title: 'css:h1.title',
          content: 'css:.article-content',
          author: 'css:.author-name',
          publishTime: 'css:.publish-time'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        delay: 1
      },
      isDefault: true,
      isActive: true,
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      name: '电商网站配置',
      description: '用于爬取电商网站的配置模板',
      configData: {
        selectors: {
          title: 'css:.product-title',
          price: 'css:.price',
          brand: 'css:.brand',
          rating: 'css:.rating'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        delay: 2
      },
      isDefault: false,
      isActive: true,
      createTime: '2024-01-15 09:15:00',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record: Config) => (
        <Space>
          {record.isDefault && <Tag color="gold">默认</Tag>}
          {record.isActive ? (
            <Tag color="green">启用</Tag>
          ) : (
            <Tag color="red">禁用</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Config) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditConfig(record)}
          >
            编辑
          </Button>
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => handleCopyConfig(record)}
          >
            复制
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteConfig(record.id)}
            disabled={record.isDefault}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddConfig = () => {
    setEditingConfig(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditConfig = (config: Config) => {
    setEditingConfig(config);
    form.setFieldsValue({
      ...config,
      configData: JSON.stringify(config.configData, null, 2)
    });
    setIsModalVisible(true);
  };

  const handleCopyConfig = (config: Config) => {
    const newConfig: Config = {
      ...config,
      id: Date.now(),
      name: `${config.name}_副本`,
      isDefault: false,
      createTime: new Date().toLocaleString(),
    };
    setConfigs([...configs, newConfig]);
    message.success('配置已复制');
  };

  const handleDeleteConfig = (id: number) => {
    setConfigs(configs.filter(config => config.id !== id));
    message.success('配置已删除');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      try {
        const configData = JSON.parse(values.configData);
        
        if (editingConfig) {
          // 编辑现有配置
          setConfigs(configs.map(config =>
            config.id === editingConfig.id
              ? { ...config, ...values, configData, updateTime: new Date().toLocaleString() }
              : config
          ));
          message.success('配置已更新');
        } else {
          // 创建新配置
          const newConfig: Config = {
            id: Date.now(),
            ...values,
            configData,
            isDefault: false,
            isActive: true,
            createTime: new Date().toLocaleString(),
          };
          setConfigs([...configs, newConfig]);
          message.success('配置已创建');
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error('配置数据格式错误，请输入有效的JSON');
      }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>爬虫配置管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddConfig}
        >
          新建配置
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={configs}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingConfig ? '编辑配置' : '新建配置'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input placeholder="请输入配置名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="配置描述"
          >
            <TextArea rows={3} placeholder="请输入配置描述" />
          </Form.Item>
          
          <Form.Item
            name="configData"
            label="配置数据 (JSON格式)"
            rules={[
              { required: true, message: '请输入配置数据' },
              {
                validator: (_, value) => {
                  if (value) {
                    try {
                      JSON.parse(value);
                      return Promise.resolve();
                    } catch (error) {
                      return Promise.reject(new Error('请输入有效的JSON格式'));
                    }
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <TextArea 
              rows={10} 
              placeholder={`请输入JSON格式的配置数据，例如：
{
  "selectors": {
    "title": "css:h1.title",
    "content": "css:.content"
  },
  "headers": {
    "User-Agent": "Mozilla/5.0..."
  },
  "delay": 1
}`}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Configs;
