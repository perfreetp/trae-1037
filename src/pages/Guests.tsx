import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, Input, Avatar,
  Modal, Form, Select, message, Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { Guest } from '../types';

const { TextArea } = Input;
const { Option } = Select;

function Guests() {
  const { guests, addGuest, episodes, updateGuest, deleteGuest } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const allTags = Array.from(new Set(guests.flatMap(g => g.tags)));

  const filteredGuests = guests.filter(g => {
    const matchSearch = !searchText ||
      g.name.toLowerCase().includes(searchText.toLowerCase()) ||
      g.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (g.company && g.company.toLowerCase().includes(searchText.toLowerCase()));
    const matchTag = !selectedTag || g.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const handleAddGuest = (values: any) => {
    addGuest({
      name: values.name,
      title: values.title,
      company: values.company,
      contact: values.contact,
      bio: values.bio,
      tags: values.tags || [],
      avatar: '👤',
      episodeCount: 0,
    });
    message.success('嘉宾添加成功');
    setIsAddModalOpen(false);
    addForm.resetFields();
  };

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest);
    editForm.setFieldsValue({
      name: guest.name,
      title: guest.title,
      company: guest.company,
      contact: guest.contact,
      bio: guest.bio,
      tags: guest.tags,
    });
    setIsEditModalOpen(true);
  };

  const handleEditGuest = (values: any) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, {
        name: values.name,
        title: values.title,
        company: values.company,
        contact: values.contact,
        bio: values.bio,
        tags: values.tags || [],
      });
      message.success('嘉宾信息已更新');
      setIsEditModalOpen(false);
      setEditingGuest(null);
      editForm.resetFields();
    }
  };

  const handleDeleteGuest = (guestId: string) => {
    deleteGuest(guestId);
    message.success('嘉宾已删除');
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="middle">
            <Input
              placeholder="搜索嘉宾姓名、职位或公司"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="按标签筛选"
              style={{ width: 150 }}
              allowClear
              value={selectedTag}
              onChange={setSelectedTag}
            >
              {allTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
            添加嘉宾
          </Button>
        </div>
      </Card>

      {filteredGuests.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <Avatar size={64} style={{ backgroundColor: '#f0f0f0', marginBottom: 12, fontSize: 32 }}>👥</Avatar>
            <div>暂无匹配的嘉宾</div>
          </div>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredGuests.map(guest => (
            <Col span={8} key={guest.id}>
              <Card hoverable>
                <div style={{ display: 'flex', marginBottom: 16 }}>
                  <Avatar size={64} style={{ backgroundColor: '#1890ff', fontSize: 32 }}>
                    {guest.avatar}
                  </Avatar>
                  <div style={{ marginLeft: 16, flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
                      {guest.name}
                    </div>
                    <div style={{ color: '#666', marginBottom: 4 }}>
                      {guest.title}
                      {guest.company && <span> @ {guest.company}</span>}
                    </div>
                    <Space size="small">
                      <Tag color="blue">{guest.episodeCount} 期节目</Tag>
                      {guest.lastAppearance && (
                        <Tag color="default">上次：{guest.lastAppearance}</Tag>
                      )}
                    </Space>
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 12, minHeight: 40 }}>
                  {guest.bio || '暂无简介'}
                </div>
                <Space wrap style={{ marginBottom: 12 }}>
                  {guest.tags.map(tag => (
                    <Tag key={tag} color="blue" style={{ fontSize: 12 }}>{tag}</Tag>
                  ))}
                </Space>
                {guest.contact && (
                  <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                    <Space>
                      <MailOutlined />
                      <span>{guest.contact}</span>
                    </Space>
                  </div>
                )}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                  <Space size="small">
                    <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleEditClick(guest)}>
                      编辑
                    </Button>
                    <Popconfirm
                      title={`确定删除嘉宾"${guest.name}"？`}
                      description="删除后不可恢复"
                      onConfirm={() => handleDeleteGuest(guest.id)}
                      okText="确定删除"
                      cancelText="取消"
                      okButtonProps={{ danger: true }}
                    >
                      <Button size="small" type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="添加嘉宾"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddGuest}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入嘉宾姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="职位" rules={[{ required: true }]}>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company" label="公司">
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact" label="联系方式">
                <Input placeholder="邮箱或电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="bio" label="简介">
            <TextArea rows={3} placeholder="嘉宾简介" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后回车" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">添加</Button>
              <Button onClick={() => setIsAddModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑嘉宾"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingGuest(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditGuest}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入嘉宾姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="职位" rules={[{ required: true }]}>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company" label="公司">
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact" label="联系方式">
                <Input placeholder="邮箱或电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="bio" label="简介">
            <TextArea rows={3} placeholder="嘉宾简介" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后回车" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => {
                setIsEditModalOpen(false);
                setEditingGuest(null);
              }}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Guests;
