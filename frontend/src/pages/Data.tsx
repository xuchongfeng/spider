import React, { useState } from 'react';
import { Table, Card, Input, Button, Space, Tag, Modal, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;

interface DataItem {
  id: number;
  taskName: string;
  url: string;
  title: string;
  content: string;
  extractedData: any;
  createTime: string;
}

const Data: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([
    {
      id: 1,
      taskName: '新闻网站爬虫',
      url: 'https://example.com/news/1',
      title: '重要新闻标题',
      content: '这是新闻的详细内容...',
      extractedData: {
        author: '张三',
        publishTime: '2024-01-15',
        category: '科技'
      },
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      taskName: '电商数据爬虫',
      url: 'https://example.com/shop/product/1',
      title: '商品名称',
      content: '商品描述信息...',
      extractedData: {
        price: '¥99.00',
        brand: '知名品牌',
        rating: '4.5'
      },
      createTime: '2024-01-15 09:15:00',
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [selectedData, setSelectedData] = useState<DataItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '提取数据',
      dataIndex: 'extractedData',
      key: 'extractedData',
      render: (extractedData: any): React.ReactNode => (
        <div>
          {Object.entries(extractedData).map(([key, value]) => (
            <Tag key={key} color="blue">
              {key}: {String(value)}
            </Tag>
          ))}
        </div>
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
      render: (_: any, record: DataItem) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewData(record)}
          >
            查看
          </Button>
          <Button
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => handleDownloadData(record)}
          >
            下载
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteData(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleViewData = (dataItem: DataItem) => {
    setSelectedData(dataItem);
    setIsModalVisible(true);
  };

  const handleDownloadData = (dataItem: DataItem) => {
    // 实现下载功能
    const dataStr = JSON.stringify(dataItem, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_${dataItem.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteData = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  const filteredData = data.filter(item =>
    item.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.url.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>爬虫数据</h2>
        <Space>
          <Search
            placeholder="搜索数据..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary">导出数据</Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="数据详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => selectedData && handleDownloadData(selectedData)}
          >
            下载
          </Button>,
        ]}
        width={800}
      >
        {selectedData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="任务名称">{selectedData.taskName}</Descriptions.Item>
            <Descriptions.Item label="URL">{selectedData.url}</Descriptions.Item>
            <Descriptions.Item label="标题">{selectedData.title}</Descriptions.Item>
            <Descriptions.Item label="内容">
              <div style={{ maxHeight: 200, overflow: 'auto' }}>
                {selectedData.content}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="提取数据">
              <pre style={{ maxHeight: 200, overflow: 'auto' }}>
                {JSON.stringify(selectedData.extractedData, null, 2)}
              </pre>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedData.createTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Data;
