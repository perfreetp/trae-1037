import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, Input, Table,
  Upload, Modal, Select, message,
} from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  MusicOutlined,
  PictureOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  FileOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { Material } from '../types';
import dayjs from 'dayjs';

const { Option } = Select;

const typeIconMap: Record<string, any> = {
  audio: <MusicOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
  video: <VideoCameraOutlined style={{ color: '#eb2f96', fontSize: 24 }} />,
  image: <PictureOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
  document: <FileTextOutlined style={{ color: '#faad14', fontSize: 24 }} />,
  other: <FileOutlined style={{ color: '#8c8c8c', fontSize: 24 }} />,
};

const typeColorMap: Record<string, string> = {
  audio: 'green',
  video: 'magenta',
  image: 'blue',
  document: 'orange',
  other: 'default',
};

const typeTextMap: Record<string, string> = {
  audio: '音频',
  video: '视频',
  image: '图片',
  document: '文档',
  other: '其他',
};

function Materials() {
  const { materials, episodes } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredMaterials = materials.filter(m => {
    const matchSearch = !searchText || m.name.includes(searchText) || m.fileName.includes(searchText);
    const matchType = !typeFilter || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Material) => (
        <Space>
          {typeIconMap[record.type]}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color={typeColorMap[type]}>{typeTextMap[type]}</Tag>,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '上传日期',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: '关联单集',
      dataIndex: 'episodeId',
      key: 'episodeId',
      render: (id?: string) => {
        if (!id) return '-';
        const ep = episodes.find(e => e.id === id);
        return ep ? `EP.${ep.number} ${ep.title}` : '-';
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map(t => <Tag key={t} style={{ fontSize: 12 }}>{t}</Tag>)}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<DownloadOutlined />}>下载</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="middle">
            <Input
              placeholder="搜索素材名称"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="按类型筛选"
              style={{ width: 150 }}
              allowClear
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Option value="audio">音频</Option>
              <Option value="video">视频</Option>
              <Option value="image">图片</Option>
              <Option value="document">文档</Option>
              <Option value="other">其他</Option>
            </Select>
            <Select
              placeholder="关联单集"
              style={{ width: 200 }}
              allowClear
            >
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>EP.{ep.number} {ep.title}</Option>
              ))}
            </Select>
          </Space>
          <Space>
            <Button.Group>
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              >
                卡片视图
              </Button>
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                onClick={() => setViewMode('table')}
              >
                列表视图
              </Button>
            </Button.Group>
            <Upload multiple>
              <Button type="primary" icon={<UploadOutlined />}>
                上传素材
              </Button>
            </Upload>
          </Space>
        </div>
      </Card>

      <Card>
        <Space size="small" style={{ marginBottom: 16 }}>
          <Tag color="green">音频 {materials.filter(m => m.type === 'audio').length}</Tag>
          <Tag color="blue">图片 {materials.filter(m => m.type === 'image').length}</Tag>
          <Tag color="orange">文档 {materials.filter(m => m.type === 'document').length}</Tag>
          <Tag color="magenta">视频 {materials.filter(m => m.type === 'video').length}</Tag>
          <Tag color="default">其他 {materials.filter(m => m.type === 'other').length}</Tag>
        </Space>

        {viewMode === 'grid' ? (
          <Row gutter={[16, 16]}>
            {filteredMaterials.map(mat => (
              <Col span={6} key={mat.id}>
                <Card
                  hoverable
                  size="small"
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{
                    height: 100,
                    background: '#f5f5f5',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    {typeIconMap[mat.type]}
                  </div>
                  <div style={{ fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mat.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
                    {mat.size} · {mat.uploadDate}
                  </div>
                  <Space wrap>
                    <Tag color={typeColorMap[mat.type]} style={{ fontSize: 12 }}>
                      {typeTextMap[mat.type]}
                    </Tag>
                    {mat.tags.slice(0, 2).map(t => (
                      <Tag key={t} style={{ fontSize: 12 }}>{t}</Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredMaterials}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
}

export default Materials;
