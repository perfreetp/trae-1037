import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, List, Avatar,
  Input, Badge, Select, message,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  MessageOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { ReviewComment } from '../types';
import { getEpisodeTitle, getMemberName } from '../utils/format';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

function Review() {
  const { reviewComments, episodes, members, resolveReviewComment } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [episodeFilter, setEpisodeFilter] = useState<string | null>(null);

  const filteredComments = reviewComments.filter(c => {
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchEpisode = !episodeFilter || c.episodeId === episodeFilter;
    return matchStatus && matchEpisode;
  });

  const openCount = reviewComments.filter(c => c.status === 'open').length;
  const resolvedCount = reviewComments.filter(c => c.status === 'resolved').length;

  const handleResolve = (id: string) => {
    resolveReviewComment(id);
    message.success('已标记为已解决');
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>待处理意见</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                {openCount}
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>已解决意见</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                {resolvedCount}
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>待审核单集</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                {episodes.filter(e => e.status === 'review').length}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="middle">
            <Select
              placeholder="筛选状态"
              style={{ width: 150 }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="open">待处理</Option>
              <Option value="resolved">已解决</Option>
            </Select>
            <Select
              placeholder="筛选单集"
              style={{ width: 250 }}
              allowClear
              value={episodeFilter}
              onChange={setEpisodeFilter}
            >
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>EP.{ep.number} {ep.title}</Option>
              ))}
            </Select>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            提交审核意见
          </Button>
        </div>
      </Card>

      <Card title="审核意见列表">
        <List
          dataSource={filteredComments}
          renderItem={(comment) => (
            <List.Item
              style={{
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
                background: comment.status === 'resolved' ? '#fafafa' : '#fffcf1',
                margin: '8px 0',
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: 8,
              }}
              actions={
                comment.status === 'open'
                  ? [
                    <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleResolve(comment.id)}>
                      标记解决
                    </Button>
                  ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={
                  <Badge
                    status={comment.status === 'open' ? 'processing' : 'success'}
                    offset={[-4, 52]}
                  >
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {getMemberName(comment.reviewer, members).charAt(0)}
                    </Avatar>
                  </Badge>
                }
                title={
                  <Space>
                    <span style={{ fontWeight: 500 }}>
                      {getMemberName(comment.reviewer, members)}
                    </span>
                    <span style={{ color: '#999', fontSize: 13 }}>
                      对
                    </span>
                    <Tag color="blue">
                      {getEpisodeTitle(comment.episodeId, episodes)}
                    </Tag>
                    <span style={{ color: '#999', fontSize: 13 }}>
                      提交了审核意见
                    </span>
                  </Space>
                }
                description={
                  <div>
                    <div style={{ color: '#333', marginBottom: 8, fontSize: 14 }}>
                      {comment.content}
                    </div>
                    <Space size="small" style={{ fontSize: 12, color: '#999' }}>
                      <ClockCircleOutlined />
                      <span>{comment.createdAt}</span>
                      <Tag color={comment.status === 'open' ? 'processing' : 'success'}>
                        {comment.status === 'open' ? '待处理' : '已解决'}
                      </Tag>
                    </Space>
                    {comment.replies && comment.replies.length > 0 && (
                      <div style={{
                        marginTop: 12,
                        padding: '12px 16px',
                        background: '#f6ffed',
                        borderRadius: 6,
                        borderLeft: '3px solid #52c41a',
                      }}>
                        {comment.replies.map(reply => (
                          <div key={reply.id}>
                            <Space style={{ marginBottom: 4 }}>
                              <span style={{ fontWeight: 500, color: '#52c41a' }}>
                                {getMemberName(reply.author, members)}
                              </span>
                              <span style={{ fontSize: 12, color: '#999' }}>
                                {reply.createdAt}
                              </span>
                            </Space>
                            <div style={{ color: '#333' }}>{reply.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default Review;
