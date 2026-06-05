import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, Input, Avatar,
  List, Modal, Form, Select, message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { Guest } from '../types';

const { TextArea } = Input;
const { Option } = Select;

function Guests() {
  const { guests, addGuest, episodes } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [form] = Form.useForm();

  const allTags = Array.from(new Set(guests.flatMap(g => g.tags)));

  const filteredGuests = guests.filter(g => {
    const matchSearch = !searchText ||
      g.name.includes(searchText) ||
      g.title.includes(searchText) ||
      (g.company && g.company.includes(searchText));
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
    setIsModalOpen(false);
    form.resetFields();
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            添加嘉宾
          </Button>
        </div>
      </Card>

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
                {guest.bio}
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
                  <Button size="small" type="link" icon={<EditOutlined />}>编辑</Button>
                  <Button size="small" type="link" danger icon={<DeleteOutlined />}>删除</Button>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="添加嘉宾"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddGuest}>
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
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Guests;
