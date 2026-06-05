import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, List, Avatar,
  Input, Badge, Select, message, Modal, Form,
} from 'antd';
import {
  CheckOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { getEpisodeTitle, getMemberName } from '../utils/format';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

function Review() {
  const {
    reviewComments, episodes, members,
    resolveReviewComment, addReviewComment,
    addReplyToReview, reopenReviewComment,
  } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [episodeFilter, setEpisodeFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [form] = Form.useForm();

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

  const handleSubmitComment = (values: any) => {
    addReviewComment({
      episodeId: values.episodeId,
      content: values.content,
      reviewer: members[0].id,
      status: 'open',
      createdAt: dayjs().format('YYYY-MM-DD'),
    });
    message.success('审核意见已提交');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }
    addReplyToReview(commentId, {
      author: members[0].id,
      content: replyContent.trim(),
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
    });
    message.success('回复已提交');
    setReplyContent('');
    setReplyingCommentId(null);
  };

  const handleReopen = (commentId: string) => {
    reopenReviewComment(commentId);
    message.success('意见已重新打开');
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            提交审核意见
          </Button>
        </div>
      </Card>

      <Card title="审核意见列表">
        {filteredComments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <MessageOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <div>暂无审核意见</div>
          </div>
        ) : (
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
                actions={[
                  <Button
                    type="link"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() => {
                      setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id);
                      setReplyContent('');
                    }}
                  >
                    回复
                  </Button>,
                  ...(comment.status === 'open'
                    ? [
                      <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleResolve(comment.id)}>
                        标记解决
                      </Button>
                    ]
                    : [
                      <Button type="link" size="small" onClick={() => handleReopen(comment.id)}>
                        重新打开
                      </Button>
                    ])
                ]}
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
                            <div key={reply.id} style={{ marginBottom: reply.id === comment.replies![comment.replies!.length - 1].id ? 0 : 12 }}>
                              <Space style={{ marginBottom: 4 }}>
                                <Avatar size={20} style={{ backgroundColor: '#52c41a' }}>
                                  {getMemberName(reply.author, members).charAt(0)}
                                </Avatar>
                                <span style={{ fontWeight: 500, color: '#52c41a' }}>
                                  {getMemberName(reply.author, members)}
                                </span>
                                <span style={{ fontSize: 12, color: '#999' }}>
                                  {reply.createdAt}
                                </span>
                              </Space>
                              <div style={{ color: '#333', paddingLeft: 28 }}>{reply.content}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {replyingCommentId === comment.id && (
                        <div style={{
                          marginTop: 12,
                          padding: '12px 16px',
                          background: '#f0f5ff',
                          borderRadius: 6,
                        }}>
                          <div style={{ marginBottom: 8, fontWeight: 500, color: '#1890ff' }}>
                            追加回复：
                          </div>
                          <TextArea
                            rows={3}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="请输入回复内容..."
                            style={{ marginBottom: 8 }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <Button size="small" onClick={() => {
                              setReplyingCommentId(null);
                              setReplyContent('');
                            }}>
                              取消
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleSubmitReply(comment.id)}
                            >
                              提交回复
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title="提交审核意见"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitComment}>
          <Form.Item name="episodeId" label="选择单集" rules={[{ required: true }]}>
            <Select placeholder="选择要审核的单集">
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>EP.{ep.number} {ep.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="审核意见" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请输入详细的审核意见..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Review;
