import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, PlayCircleOutlined, StopOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface Task {
  id: number;
  name: string;
  description: string;
  url: string;
  status: string;
  createTime: string;
  updateTime: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: '新闻网站爬虫',
      description: '爬取新闻网站的文章内容',
      url: 'https://example.com/news',
      status: '运行中',
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      name: '电商数据爬虫',
      description: '爬取电商平台商品信息',
      url: 'https://example.com/shop',
      status: '已完成',
      createTime: '2024-01-15 09:15:00',
      updateTime: '2024-01-15 09:15:00',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '任务名称',
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
      title: '目标URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case '运行中':
            color = 'processing';
            break;
          case '已完成':
            color = 'success';
            break;
          case '等待中':
            color = 'default';
            break;
          case '失败':
            color = 'error';
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          {record.status === '等待中' && (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="small"
              onClick={() => handleStartTask(record.id)}
            >
              启动
            </Button>
          )}
          {record.status === '运行中' && (
            <Button
              danger
              icon={<StopOutlined />}
              size="small"
              onClick={() => handleStopTask(record.id)}
            >
              停止
            </Button>
          )}
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditTask(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteTask(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddTask = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setIsModalVisible(true);
  };

  const handleDeleteTask = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      onOk: () => {
        setTasks(tasks.filter(task => task.id !== id));
        message.success('任务已删除');
      },
    });
  };

  const handleStartTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: '运行中' } : task
    ));
    message.success('任务已启动');
  };

  const handleStopTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: '已完成' } : task
    ));
    message.success('任务已停止');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingTask) {
        // 编辑现有任务
        setTasks(tasks.map(task =>
          task.id === editingTask.id
            ? { ...task, ...values, updateTime: new Date().toLocaleString() }
            : task
        ));
        message.success('任务已更新');
      } else {
        // 创建新任务
        const newTask: Task = {
          id: Date.now(),
          ...values,
          status: '等待中',
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString(),
        };
        setTasks([...tasks, newTask]);
        message.success('任务已创建');
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>爬虫任务管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddTask}
        >
          新建任务
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingTask ? '编辑任务' : '新建任务'}
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
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>
          
          <Form.Item
            name="url"
            label="目标URL"
            rules={[
              { required: true, message: '请输入目标URL' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input placeholder="请输入目标URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
