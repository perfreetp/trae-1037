import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, Input, Table,
  Upload, Modal, Select, message, Popconfirm, Form,
} from 'antd';
import {
  SearchOutlined,
  AudioOutlined,
  PictureOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  FileOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { Material } from '../types';
import dayjs from 'dayjs';

const { Option } = Select;
const { Dragger } = Upload;

const typeIconMap: Record<string, any> = {
  audio: <AudioOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
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

const getTypeFromFileName = (fileName: string): Material['type'] => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma'].includes(ext || '')) return 'audio';
  if (['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm'].includes(ext || '')) return 'video';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'psd', 'ai'].includes(ext || '')) return 'image';
  if (['doc', 'docx', 'pdf', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'].includes(ext || '')) return 'document';
  return 'other';
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

function Materials() {
  const { materials, episodes, addMaterial, deleteMaterial } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [episodeFilter, setEpisodeFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm] = Form.useForm();
  const [selectedFileInfo, setSelectedFileInfo] = useState<{ name: string; fileName: string; size: string; type: Material['type'] } | null>(null);

  const filteredMaterials = materials.filter(m => {
    const matchSearch = !searchText ||
      m.name.toLowerCase().includes(searchText.toLowerCase()) ||
      m.fileName.toLowerCase().includes(searchText.toLowerCase());
    const matchType = !typeFilter || m.type === typeFilter;
    const matchEpisode = !episodeFilter || m.episodeId === episodeFilter;
    return matchSearch && matchType && matchEpisode;
  });

  const handleDelete = (id: string) => {
    deleteMaterial(id);
    message.success('素材已删除');
  };

  const handleDownload = (material: Material) => {
    const content = `素材名称: ${material.name}\n文件名: ${material.fileName}\n类型: ${typeTextMap[material.type]}\n大小: ${material.size}\n上传日期: ${material.uploadDate}\n关联单集: ${material.episodeId ? episodes.find(e => e.id === material.episodeId)?.title || '-' : '-'}\n标签: ${material.tags.join(', ')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.name}_素材信息.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(`已导出 ${material.name} 的素材信息文件`);
  };

  const handleFileSelect = (file: File) => {
    const type = getTypeFromFileName(file.name);
    const info = {
      name: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      size: formatFileSize(file.size),
      type,
    };
    setSelectedFileInfo(info);
    uploadForm.setFieldsValue({
      name: info.name,
      fileName: info.fileName,
      size: info.size,
      type: info.type,
    });
    return false;
  };

  const handleUploadConfirm = (values: any) => {
    addMaterial({
      name: values.name,
      type: values.type,
      fileName: values.fileName || selectedFileInfo?.fileName || '未命名文件',
      size: values.size || selectedFileInfo?.size || '1.0 MB',
      uploadDate: dayjs().format('YYYY-MM-DD'),
      episodeId: values.episodeId || undefined,
      tags: values.tags || [],
    });
    message.success('素材上传成功');
    setIsUploadModalOpen(false);
    setSelectedFileInfo(null);
    uploadForm.resetFields();
  };

  const openUploadModal = () => {
    setSelectedFileInfo(null);
    uploadForm.resetFields();
    setIsUploadModalOpen(true);
  };

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
      render: (_: any, record: Material) => (
        <Space>
          <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>下载信息</Button>
          <Popconfirm title="确定删除此素材？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
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
              value={episodeFilter}
              onChange={setEpisodeFilter}
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
            <Button type="primary" icon={<PlusOutlined />} onClick={openUploadModal}>
              上传素材
            </Button>
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

        {filteredMaterials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <FileOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <div>暂无匹配的素材</div>
          </div>
        ) : viewMode === 'grid' ? (
          <Row gutter={[16, 16]}>
            {filteredMaterials.map(mat => (
              <Col span={6} key={mat.id}>
                <Card
                  hoverable
                  size="small"
                  bodyStyle={{ padding: 16 }}
                  actions={[
                    <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(mat)}>下载信息</Button>,
                    <Popconfirm title="确定删除？" onConfirm={() => handleDelete(mat.id)} okText="确定" cancelText="取消">
                      <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>,
                  ]}
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
                  {mat.episodeId && (
                    <div style={{ fontSize: 12, color: '#1890ff', marginBottom: 8 }}>
                      📎 EP.{episodes.find(e => e.id === mat.episodeId)?.number}
                    </div>
                  )}
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

      <Modal
        title="上传素材"
        open={isUploadModalOpen}
        onCancel={() => {
          setIsUploadModalOpen(false);
          setSelectedFileInfo(null);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        {!selectedFileInfo ? (
          <Dragger
            accept="*"
            multiple={false}
            beforeUpload={handleFileSelect}
            showUploadList={false}
            style={{ marginBottom: 24 }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持音频、视频、图片、文档等各种格式</p>
          </Dragger>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              padding: 16,
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Space>
                {typeIconMap[selectedFileInfo.type]}
                <div>
                  <div style={{ fontWeight: 500 }}>{selectedFileInfo.fileName}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {typeTextMap[selectedFileInfo.type]} · {selectedFileInfo.size}
                  </div>
                </div>
              </Space>
              <Button
                type="link"
                size="small"
                style={{ marginTop: 8, padding: 0 }}
                onClick={() => {
                  setSelectedFileInfo(null);
                  uploadForm.resetFields();
                }}
              >
                重新选择文件
              </Button>
            </div>
          </div>
        )}

        <Form form={uploadForm} layout="vertical" onFinish={handleUploadConfirm}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="name" label="素材名称" rules={[{ required: true }]}>
                <Input placeholder="请输入素材名称" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="type" label="素材类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  <Option value="audio">音频</Option>
                  <Option value="video">视频</Option>
                  <Option value="image">图片</Option>
                  <Option value="document">文档</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="fileName" label="文件名">
                <Input placeholder="文件名" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="size" label="文件大小">
                <Input placeholder="例如: 5.2 MB" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="episodeId" label="关联单集">
            <Select placeholder="选择关联的单集（可选）" allowClear>
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>EP.{ep.number} {ep.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后回车" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" disabled={!selectedFileInfo}>
                确认上传
              </Button>
              <Button onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFileInfo(null);
              }}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Materials;
