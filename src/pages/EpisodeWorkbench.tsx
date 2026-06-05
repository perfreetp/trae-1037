import { useState } from 'react';
import {
  Card, Tabs, Row, Col, Tag, Space, Table, Button, Input,
  List, Avatar, Checkbox, Timeline, Badge, Select, Modal,
  Form, DatePicker, Upload, message, Divider, Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  PictureOutlined,
  FileTextOutlined,
  TagOutlined,
  CalendarOutlined,
  SafetyOutlined,
  InboxOutlined,
  MessageOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import dayjs from 'dayjs';
import { formatTimeCode, getMemberName } from '../utils/format';

const { TextArea } = Input;
const { Option } = Select;

const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'planning', label: '筹备中' },
  { value: 'recording', label: '录制中' },
  { value: 'editing', label: '剪辑中' },
  { value: 'review', label: '审核中' },
  { value: 'ready', label: '待发布' },
  { value: 'published', label: '已发布' },
];

const topicStatusColor: Record<string, string> = {
  proposed: 'default',
  approved: 'processing',
  scheduled: 'blue',
  used: 'success',
};

const topicStatusText: Record<string, string> = {
  proposed: '待审核',
  approved: '已通过',
  scheduled: '已排期',
  used: '已使用',
};

function EpisodeWorkbench() {
  const {
    episodes, currentEpisodeId, setCurrentEpisodeId,
    topics, tasks, members, guests, clipMarkers,
    mistakeRecords, editingTodos, copyrightMusic,
    coverDrafts, copywritings, timelineNotes, sponsorships,
    materials, reviewComments,
    updateTaskStatus, toggleMistakeFixed, updateEditingTodoStatus,
    addTask, addTopic, updateEpisode,
    togglePublishCheckItem,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('topics');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topicStatusFilter, setTopicStatusFilter] = useState<string | null>(null);
  const [topicSearchText, setTopicSearchText] = useState('');
  const [form] = Form.useForm();
  const [topicForm] = Form.useForm();

  const currentEpisode = episodes.find(e => e.id === currentEpisodeId) || episodes[2];
  const epId = currentEpisode?.id || 'e3';

  const filteredTopics = topics.filter(topic => {
    const matchStatus = !topicStatusFilter || topic.status === topicStatusFilter;
    const matchSearch = !topicSearchText ||
      topic.title.toLowerCase().includes(topicSearchText.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(topicSearchText.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const episodeTasks = tasks.filter(t => t.episodeId === epId || !t.episodeId);
  const episodeClips = clipMarkers.filter(c => c.episodeId === epId);
  const episodeMistakes = mistakeRecords.filter(m => m.episodeId === epId);
  const episodeEditingTodos = editingTodos.filter(e => e.episodeId === epId);
  const episodeCovers = coverDrafts.filter(c => c.episodeId === epId);
  const episodeCopy = copywritings.filter(c => c.episodeId === epId);
  const episodeTimeline = timelineNotes.filter(t => t.episodeId === epId);
  const episodeSponsors = sponsorships.filter(s => s.episodeId === epId);
  const episodeMaterials = materials.filter(m => m.episodeId === epId);
  const episodeReviews = reviewComments.filter(r => r.episodeId === epId);

  const defaultChecklistItems = [
    { id: 'audio-1', label: '音频文件已导出并备份', checked: false, category: 'audio' as const },
    { id: 'audio-2', label: '音量电平符合平台标准', checked: false, category: 'audio' as const },
    { id: 'audio-3', label: '背景音乐音量合适', checked: false, category: 'audio' as const },
    { id: 'content-1', label: '节目简介已校对', checked: false, category: 'content' as const },
    { id: 'content-2', label: 'Shownotes已完成', checked: false, category: 'content' as const },
    { id: 'content-3', label: '社交媒体文案准备', checked: false, category: 'content' as const },
    { id: 'design-1', label: '封面图已确认', checked: false, category: 'design' as const },
    { id: 'legal-1', label: '版权音乐授权确认', checked: false, category: 'legal' as const },
    { id: 'legal-2', label: '嘉宾照片及授权', checked: false, category: 'legal' as const },
    { id: 'legal-3', label: '赞助商口播已插入', checked: false, category: 'legal' as const },
    { id: 'platform-1', label: '发布时间已确认', checked: false, category: 'platform' as const },
    { id: 'platform-2', label: '各平台账号已登录', checked: false, category: 'platform' as const },
    { id: 'platform-3', label: 'RSS Feed配置正确', checked: false, category: 'platform' as const },
  ];
  const currentEpisodeChecklist = currentEpisode?.publishChecklist || defaultChecklistItems;

  const handleAddTask = (values: any) => {
    addTask({
      title: values.title,
      assignee: values.assignee,
      status: 'todo',
      dueDate: values.dueDate?.format('YYYY-MM-DD'),
      priority: values.priority || 'medium',
      category: values.category || '通用',
      episodeId: epId,
    });
    message.success('任务添加成功');
    setIsTaskModalOpen(false);
    form.resetFields();
  };

  const handleAddTopic = (values: any) => {
    addTopic({
      title: values.title,
      description: values.description,
      status: 'proposed',
      createdAt: dayjs().format('YYYY-MM-DD'),
      tags: values.tags || [],
    });
    message.success('选题添加成功');
    setIsTopicModalOpen(false);
    topicForm.resetFields();
  };

  const taskColumns = [
    {
      title: '任务',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          <Checkbox
            checked={record.status === 'done'}
            onChange={(e) => updateTaskStatus(record.id, e.target.checked ? 'done' : 'todo')}
          />
          <span style={{
            textDecoration: record.status === 'done' ? 'line-through' : 'none',
            color: record.status === 'done' ? '#999' : '#333'
          }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (id: string) => getMemberName(id, members),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (p: string) => (
        <Tag color={p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'green'}>
          {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (d: string) => d || '-',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (c: string) => <Tag>{c}</Tag>,
    },
  ];

  const tabItems = [
    {
      key: 'topics',
      label: '选题池',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Space>
              <Select
                placeholder="筛选状态"
                style={{ width: 150 }}
                allowClear
                value={topicStatusFilter}
                onChange={(val) => setTopicStatusFilter(val || null)}
              >
                <Option value="proposed">待审核</Option>
                <Option value="approved">已通过</Option>
                <Option value="scheduled">已排期</Option>
                <Option value="used">已使用</Option>
              </Select>
              <Input.Search
                placeholder="搜索选题标题或标签..."
                style={{ width: 250 }}
                value={topicSearchText}
                onChange={(e) => setTopicSearchText(e.target.value)}
                onClear={() => setTopicSearchText('')}
                allowClear
              />
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsTopicModalOpen(true)}>
              新增选题
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {filteredTopics.length === 0 ? (
              <Col span={24}>
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                  暂无匹配的选题
                </div>
              </Col>
            ) : (
              filteredTopics.map(topic => (
                <Col span={8} key={topic.id}>
                  <Card
                    size="small"
                    hoverable
                    title={
                      <Space>
                        <span style={{ fontSize: 14 }}>{topic.title}</span>
                        <Tag color={topicStatusColor[topic.status]}>
                          {topicStatusText[topic.status]}
                        </Tag>
                      </Space>
                    }
                  >
                    <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>
                      {topic.description || '暂无描述'}
                    </div>
                    <Space wrap>
                      {topic.tags.map(tag => (
                        <Tag key={tag} color="blue" style={{ fontSize: 12 }}>{tag}</Tag>
                      ))}
                    </Space>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                      创建于 {topic.createdAt}
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      ),
    },
    {
      key: 'guests',
      label: '嘉宾资料 & 采访提纲',
      children: (
        <Row gutter={16}>
          <Col span={10}>
            <Card title="嘉宾信息" size="small">
              {guests.slice(0, 2).map(guest => (
                <div key={guest.id} style={{ marginBottom: 16 }}>
                  <Space>
                    <Avatar size={48} style={{ backgroundColor: '#1890ff', fontSize: 24 }}>
                      {guest.avatar}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15 }}>{guest.name}</div>
                      <div style={{ color: '#666', fontSize: 13 }}>{guest.title} @ {guest.company}</div>
                    </div>
                  </Space>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{guest.bio}</div>
                  <Space wrap>
                    {guest.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </Space>
                </div>
              ))}
            </Card>
          </Col>
          <Col span={14}>
            <Card
              title="采访提纲"
              size="small"
              extra={<Button type="link" icon={<EditOutlined />}>编辑</Button>}
            >
              <Timeline
                items={[
                  { color: 'blue', children: '00:00 - 开场寒暄，介绍嘉宾背景 (5分钟)' },
                  { color: 'green', children: '05:00 - 第一个话题：远程工作的契机 (15分钟)' },
                  { color: 'green', children: '20:00 - 第二个话题：效率工具与方法论 (20分钟)' },
                  { color: 'orange', children: '40:00 - 广告口播 (2分钟)' },
                  { color: 'green', children: '42:00 - 第三个话题：给新手的建议 (15分钟)' },
                  { color: 'gray', children: '57:00 - 结尾总结，下期预告 (3分钟)' },
                ]}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'recording',
      label: '录音清单 & 素材导入',
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="录音清单"
              size="small"
              extra={<Button icon={<PlusOutlined />} size="small">添加录音</Button>}
            >
              <List
                dataSource={[
                  { name: '主录音-嘉宾', duration: '58:32', size: '256MB', date: '2026-06-05' },
                  { name: '主录音-主持人', duration: '60:15', size: '268MB', date: '2026-06-05' },
                  { name: '备用音轨', duration: '62:08', size: '280MB', date: '2026-06-05' },
                ]}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="link" size="small">播放</Button>]}
                  >
                    <List.Item.Meta
                      avatar={<AudioOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                      title={item.name}
                      description={
                        <Space size="small">
                          <span>{item.duration}</span>
                          <span>·</span>
                          <span>{item.size}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="素材导入"
              size="small"
              extra={
                <Upload multiple>
                  <Button icon={<UploadOutlined />}>上传素材</Button>
                </Upload>
              }
            >
              <List
                dataSource={[
                  { name: '开场音乐_v2.mp3', type: '音乐', size: '3.2MB' },
                  { name: '转场音效包.zip', type: '音效', size: '15MB' },
                  { name: '嘉宾照片.jpg', type: '图片', size: '1.5MB' },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        item.type === '音乐' ? <AudioOutlined style={{ color: '#52c41a' }} /> :
                        item.type === '图片' ? <PictureOutlined style={{ color: '#1890ff' }} /> :
                        <FileTextOutlined style={{ color: '#faad14' }} />
                      }
                      title={item.name}
                      description={`${item.type} · ${item.size}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'editing',
      label: '片段标记 & 口误记录 & 剪辑待办',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card
              title="片段标记"
              size="small"
              extra={<Button type="link" size="small" icon={<PlusOutlined />}>添加</Button>}
            >
              <List
                dataSource={episodeClips}
                renderItem={(item) => (
                  <List.Item>
                    <div
                      style={{
                        width: 4,
                        height: 40,
                        backgroundColor: item.color,
                        borderRadius: 2,
                        marginRight: 12,
                      }}
                    />
                    <List.Item.Meta
                      title={item.label}
                      description={
                        <Space size="small">
                          <TagOutlined />
                          <span>{formatTimeCode(item.startTime)} - {formatTimeCode(item.endTime)}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="口误记录"
              size="small"
              extra={<Badge count={episodeMistakes.filter(m => !m.fixed).length} />}
            >
              <List
                dataSource={episodeMistakes}
                renderItem={(item) => (
                  <List.Item>
                    <Checkbox
                      checked={item.fixed}
                      onChange={() => toggleMistakeFixed(item.id)}
                    />
                    <List.Item.Meta
                      title={
                        <span style={{
                          textDecoration: item.fixed ? 'line-through' : 'none',
                          color: item.fixed ? '#999' : '#333'
                        }}>
                          {item.description}
                        </span>
                      }
                      description={
                        <Space size="small">
                          <CalendarOutlined />
                          <span>{formatTimeCode(item.timeCode)}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="剪辑待办"
              size="small"
              extra={<Button type="link" size="small" icon={<PlusOutlined />}>添加</Button>}
            >
              <List
                dataSource={episodeEditingTodos}
                renderItem={(item) => (
                  <List.Item>
                    <Select
                      size="small"
                      value={item.status}
                      style={{ width: 100, marginRight: 8 }}
                      onChange={(v) => updateEditingTodoStatus(item.id, v)}
                    >
                      <Option value="pending">待处理</Option>
                      <Option value="in_progress">进行中</Option>
                      <Option value="done">已完成</Option>
                    </Select>
                    <List.Item.Meta
                      title={
                        <span style={{
                          textDecoration: item.status === 'done' ? 'line-through' : 'none',
                          color: item.status === 'done' ? '#999' : '#333'
                        }}>
                          {item.content}
                        </span>
                      }
                      description={
                        <Tag color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'green'}>
                          {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                        </Tag>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'assets',
      label: '版权音乐 & 封面草稿 & 文案',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="版权音乐" size="small">
              <List
                dataSource={copyrightMusic}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<AudioOutlined style={{ color: '#1890ff' }} />}
                      title={`${item.title} - ${item.artist}`}
                      description={
                        <Space size="small">
                          <Tag color="blue">{item.licenseType}</Tag>
                          <Tag>{item.usageType === 'intro' ? '开场' : item.usageType === 'outro' ? '结尾' : '背景'}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="封面草稿" size="small">
              <Row gutter={[8, 8]}>
                {episodeCovers.map(cover => (
                  <Col span={12} key={cover.id}>
                    <div style={{
                      height: 120,
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      marginBottom: 4,
                    }}>
                      封面 v{cover.version}
                    </div>
                    <Space>
                      <Tag color={cover.status === 'approved' ? 'green' : cover.status === 'review' ? 'orange' : 'default'}>
                        {cover.status === 'approved' ? '已通过' : cover.status === 'review' ? '审核中' : '草稿'}
                      </Tag>
                      <span style={{ fontSize: 12, color: '#999' }}>{cover.createdAt}</span>
                    </Space>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="文案编辑" size="small">
              <List
                dataSource={episodeCopy}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="link" size="small">编辑</Button>]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{item.type === 'description' ? '节目简介' : item.type === 'shownotes' ? '时间线' : '社交媒体'}</span>
                          <Tag color="blue">v{item.version}</Tag>
                        </Space>
                      }
                      description={
                        <div style={{
                          fontSize: 12,
                          color: '#666',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {item.content}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'timeline',
      label: '时间轴备注 & 审核意见',
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="时间轴备注"
              size="small"
              extra={<Button type="link" icon={<PlusOutlined />} size="small">添加备注</Button>}
            >
              <List
                dataSource={episodeTimeline}
                renderItem={(item) => (
                  <List.Item>
                    <Tag color="blue">{formatTimeCode(item.timeCode)}</Tag>
                    <div style={{ flex: 1, marginLeft: 12 }}>
                      <div>{item.content}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        {getMemberName(item.createdBy, members)} · {item.createdAt}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="审核意见" size="small">
              <List
                dataSource={[
                  { user: '李明', content: '第5分钟到第8分钟可以再精简一些', status: 'open', time: '2026-06-05' },
                  { user: '王芳', content: '结尾部分的背景音乐音量有点大', status: 'resolved', reply: '已调整音量', time: '2026-06-04' },
                ]}
                renderItem={(item, idx) => (
                  <List.Item key={idx}>
                    <Badge status={item.status === 'open' ? 'processing' : 'success'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 4 }}>
                        <strong>{item.user}</strong>
                        <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>{item.time}</span>
                      </div>
                      <div style={{ marginBottom: 4 }}>{item.content}</div>
                      {item.reply && (
                        <div style={{
                          background: '#f6ffed',
                          padding: '8px 12px',
                          borderRadius: 4,
                          fontSize: 13,
                          color: '#52c41a',
                        }}>
                          ✓ {item.reply}
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'publish',
      label: '发布检查 & 赞助排期',
      children: (
        <Row gutter={16}>
          <Col span={14}>
            <Card title="发布检查清单" size="small">
              <div style={{ columnCount: 2, columnGap: 24 }}>
                {currentEpisodeChecklist.map((item) => (
                  <div key={item.id} style={{ padding: '6px 0', breakInside: 'avoid' }}>
                    <Checkbox
                      checked={item.checked}
                      onChange={() => currentEpisodeId && togglePublishCheckItem(currentEpisodeId, item.id)}
                    >
                      {item.label}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="赞助口播排期" size="small">
              <List
                dataSource={episodeSponsors}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{item.sponsorName}</span>
                          <Tag color={item.position === 'pre_roll' ? 'blue' : item.position === 'mid_roll' ? 'orange' : 'green'}>
                            {item.position === 'pre_roll' ? '片头' : item.position === 'mid_roll' ? '片中' : '片尾'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space size="small">
                          <span>{item.duration}秒</span>
                          <span>·</span>
                          <span>{item.airDate}</span>
                        </Space>
                      }
                    />
                    <Tag color={item.status === 'recorded' ? 'green' : 'orange'}>
                      {item.status === 'recorded' ? '已录制' : '待录制'}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'publish-prep',
      label: '发布准备',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  title={
                    <Space>
                      <PictureOutlined style={{ color: '#1890ff' }} />
                      <span>封面 & 设计</span>
                    </Space>
                  }
                  size="small"
                >
                  <div style={{
                    height: 180,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 16,
                    marginBottom: 12,
                  }}>
                    {currentEpisode?.title || '单集封面'}
                  </div>
                  <Space direction="vertical" size="small">
                    <div>
                      <span style={{ color: '#666' }}>当前版本：</span>
                      <Tag color="green">v{episodeCovers.length > 0 ? episodeCovers.length : 1}</Tag>
                      <Tag color="blue">{episodeCovers.length > 0 && episodeCovers[0].status === 'approved' ? '已通过' : '审核中'}</Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <Space>
                      <FileTextOutlined style={{ color: '#1890ff' }} />
                      <span>文案内容</span>
                    </Space>
                  }
                  size="small"
                >
                  <List
                    size="small"
                    dataSource={episodeCopy.slice(0, 3)}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Space>
                              <span style={{ fontSize: 13 }}>
                                {item.type === 'description' ? '节目简介' : item.type === 'shownotes' ? '时间线' : '社交媒体'}
                              </span>
                              <Tag color="blue">v{item.version}</Tag>
                            </Space>
                          }
                          description={
                            <div style={{
                              fontSize: 12,
                              color: '#666',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {item.content}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  {episodeCopy.length === 0 && (
                    <Empty description="暂无文案" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <InboxOutlined style={{ color: '#1890ff' }} />
                      <span>素材资产</span>
                    </Space>
                  }
                  size="small"
                >
                  {episodeMaterials.length > 0 ? (
                    <Row gutter={[8, 8]}>
                      {episodeMaterials.slice(0, 6).map(m => (
                        <Col span={8} key={m.id}>
                          <div style={{
                            padding: 8,
                            border: '1px solid #f0f0f0',
                            borderRadius: 4,
                            fontSize: 12,
                          }}>
                            <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.name}
                            </div>
                            <div style={{ color: '#999', marginTop: 4 }}>
                              {m.type} · {m.size}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty description="暂无素材" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={
                    <Space>
                      <MessageOutlined style={{ color: '#1890ff' }} />
                      <span>审核意见</span>
                    </Space>
                  }
                  size="small"
                >
                  {episodeReviews.length > 0 ? (
                    <List
                      size="small"
                      dataSource={episodeReviews.slice(0, 3)}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar size="small">{getMemberName(item.reviewer, members)?.[0]}</Avatar>}
                            title={
                              <Space>
                                <span>{getMemberName(item.reviewer, members)}</span>
                                <Tag color={item.status === 'resolved' ? 'green' : 'red'}>
                                  {item.status === 'resolved' ? '已解决' : '待处理'}
                                </Tag>
                              </Space>
                            }
                            description={<div style={{ fontSize: 12 }}>{item.content}</div>}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="暂无审核意见" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Card
              title={
                <Space>
                  <SafetyOutlined style={{ color: '#1890ff' }} />
                  <span>发布检查清单</span>
                </Space>
              }
              size="small"
              extra={
                <span style={{ fontSize: 12, color: '#666' }}>
                  {currentEpisodeChecklist.filter(i => i.checked).length}/{currentEpisodeChecklist.length}
                </span>
              }
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {[
                  { key: 'audio', label: '音频制作' },
                  { key: 'content', label: '内容文案' },
                  { key: 'design', label: '设计素材' },
                  { key: 'legal', label: '法律版权' },
                  { key: 'platform', label: '平台发布' },
                ].map(category => {
                  const items = currentEpisodeChecklist.filter(i => i.category === category.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={category.key}>
                      <div style={{ fontWeight: 500, marginBottom: 8, color: '#1890ff' }}>
                        {category.label}
                      </div>
                      {items.map(item => (
                        <div key={item.id} style={{ padding: '4px 0' }}>
                          <Checkbox
                            checked={item.checked}
                            onChange={() => currentEpisodeId && togglePublishCheckItem(currentEpisodeId, item.id)}
                          >
                            {item.label}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Space>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'tasks',
      label: '任务列表',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Space>
              <Select placeholder="筛选负责人" style={{ width: 150 }} allowClear>
                {members.map(m => (
                  <Option key={m.id} value={m.id}>{m.name}</Option>
                ))}
              </Select>
              <Select placeholder="筛选状态" style={{ width: 120 }} allowClear>
                <Option value="todo">待办</Option>
                <Option value="in_progress">进行中</Option>
                <Option value="done">已完成</Option>
              </Select>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsTaskModalOpen(true)}>
              新建任务
            </Button>
          </div>
          <Table
            columns={taskColumns}
            dataSource={episodeTasks}
            rowKey="id"
            pagination={false}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="large">
            <Select
              value={currentEpisode?.id}
              style={{ width: 300 }}
              onChange={(val) => setCurrentEpisodeId(val)}
            >
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>
                  EP.{ep.number} {ep.title}
                </Option>
              ))}
            </Select>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              {currentEpisode ? `EP.${currentEpisode.number}` : ''}
            </Tag>
          </Space>
          <Space>
            <span style={{ color: '#666' }}>状态：</span>
            <Select
              value={currentEpisode?.status}
              style={{ width: 120 }}
              onChange={(val) => {
                if (currentEpisode) {
                  updateEpisode(currentEpisode.id, { status: val as any });
                  message.success('状态已更新');
                }
              }}
            >
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
            <span style={{ color: '#666', marginLeft: 16 }}>截止日期：</span>
            <DatePicker
              value={currentEpisode ? dayjs(currentEpisode.deadline) : null}
              onChange={(date) => {
                if (currentEpisode && date) {
                  updateEpisode(currentEpisode.id, { deadline: date.format('YYYY-MM-DD') });
                  message.success('截止日期已更新');
                }
              }}
            />
          </Space>
        </div>
        <div style={{ marginTop: 12, fontSize: 15 }}>
          <strong>{currentEpisode?.title}</strong>
        </div>
        {currentEpisode?.summary && (
          <div style={{ marginTop: 8, color: '#666' }}>{currentEpisode.summary}</div>
        )}
        <div style={{ marginTop: 12 }}>
          <span style={{ color: '#666', marginRight: 8 }}>负责人：</span>
          <Avatar.Group>
            {currentEpisode?.assignees.map(id => {
              const m = members.find(m => m.id === id);
              return <Avatar key={id} style={{ backgroundColor: '#1890ff' }}>{m?.avatar}</Avatar>;
            })}
          </Avatar.Group>
        </div>
      </Card>

      <Card bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarStyle={{ padding: '0 24px', margin: 0 }}
          style={{ padding: 24 }}
        />
      </Card>

      <Modal
        title="新建任务"
        open={isTaskModalOpen}
        onCancel={() => setIsTaskModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTask}>
          <Form.Item name="title" label="任务名称" rules={[{ required: true }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="负责人" rules={[{ required: true }]}>
                <Select placeholder="选择负责人">
                  {members.map(m => (
                    <Option key={m.id} value={m.id}>{m.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" initialValue="medium">
                <Select>
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="截止日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="分类" initialValue="通用">
                <Select>
                  <Option value="筹备">筹备</Option>
                  <Option value="内容">内容</Option>
                  <Option value="剪辑">剪辑</Option>
                  <Option value="审核">审核</Option>
                  <Option value="发布">发布</Option>
                  <Option value="设计">设计</Option>
                  <Option value="运营">运营</Option>
                  <Option value="通用">通用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">创建</Button>
              <Button onClick={() => setIsTaskModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新增选题"
        open={isTopicModalOpen}
        onCancel={() => setIsTopicModalOpen(false)}
        footer={null}
      >
        <Form form={topicForm} layout="vertical" onFinish={handleAddTopic}>
          <Form.Item name="title" label="选题标题" rules={[{ required: true }]}>
            <Input placeholder="请输入选题标题" />
          </Form.Item>
          <Form.Item name="description" label="选题描述">
            <TextArea rows={3} placeholder="请描述选题内容" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后回车" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">创建</Button>
              <Button onClick={() => setIsTopicModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EpisodeWorkbench;
