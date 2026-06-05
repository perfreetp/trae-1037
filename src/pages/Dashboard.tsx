import { Card, Row, Col, Statistic, Progress, Table, Tag, Avatar, List, Badge, Space, Button } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  EditOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import dayjs from 'dayjs';
import { getMemberName } from '../utils/format';

const statusMap: Record<string, { color: string; text: string }> = {
  draft: { color: 'default', text: '草稿' },
  planning: { color: 'blue', text: '筹备中' },
  recording: { color: 'processing', text: '录制中' },
  editing: { color: 'orange', text: '剪辑中' },
  review: { color: 'purple', text: '审核中' },
  ready: { color: 'cyan', text: '待发布' },
  published: { color: 'success', text: '已发布' },
  archived: { color: 'default', text: '已归档' },
};

const priorityColor: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const priorityText: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

function Dashboard() {
  const { seasons, episodes, tasks, members, setCurrentModule, setCurrentEpisodeId } = useAppStore();

  const publishedCount = episodes.filter(e => e.status === 'published').length;
  const inProgressCount = episodes.filter(e => ['recording', 'editing', 'review'].includes(e.status)).length;
  const plannedCount = episodes.filter(e => ['draft', 'planning'].includes(e.status)).length;
  const upcomingDeadlines = episodes
    .filter(e => e.status !== 'published' && e.status !== 'archived')
    .sort((a, b) => dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf())
    .slice(0, 5);

  const myTasks = tasks.filter(t => t.status !== 'done').slice(0, 8);

  const episodeColumns = [
    {
      title: '单集',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          <span style={{ fontWeight: 500 }}>EP.{record.number}</span>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const s = statusMap[status];
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => {
        const isUrgent = dayjs(date).diff(dayjs(), 'day') <= 3;
        return (
          <Space>
            <ClockCircleOutlined style={{ color: isUrgent ? '#ff4d4f' : '#666' }} />
            <span style={{ color: isUrgent ? '#ff4d4f' : '#333' }}>
              {dayjs(date).format('MM-DD')}
            </span>
          </Space>
        );
      },
    },
    {
      title: '负责人',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (assignees: string[]) => (
        <Avatar.Group maxCount={3}>
          {assignees.map(id => {
            const m = members.find(m => m.id === id);
            return <Avatar key={id} style={{ backgroundColor: '#1890ff' }}>{m?.avatar}</Avatar>;
          })}
        </Avatar.Group>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发布单集"
              value={publishedCount}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="制作中单集"
              value={inProgressCount}
              prefix={<PlayCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="筹备中单集"
              value={plannedCount}
              prefix={<EditOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={members.length}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card
            title="节目季进度"
            extra={<Button type="link" onClick={() => setCurrentModule('episode')}>查看全部</Button>}
          >
            {seasons.map(season => (
              <div key={season.id} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Space>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{season.name}</span>
                    <Tag color="blue">{season.episodeCount} 集</Tag>
                  </Space>
                  <span style={{ color: '#666' }}>
                    {dayjs(season.startDate).format('YYYY.MM')} - {season.endDate ? dayjs(season.endDate).format('YYYY.MM') : '进行中'}
                  </span>
                </div>
                <Progress
                  percent={Math.round((publishedCount / season.episodeCount) * 100)}
                  strokeColor={{ from: '#1890ff', to: '#52c41a' }}
                  format={percent => `${percent}% 已发布`}
                />
              </div>
            ))}
          </Card>

          <Card
            title="单集列表"
            style={{ marginTop: 16 }}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => setCurrentModule('episode')}
              >
                新建单集
              </Button>
            }
          >
            <Table
              columns={episodeColumns}
              dataSource={episodes}
              rowKey="id"
              pagination={false}
              size="middle"
              onRow={(record) => ({
                onClick: () => {
                  setCurrentEpisodeId(record.id);
                  setCurrentModule('episode');
                },
                style: { cursor: 'pointer' }
              })}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="即将截止"
            extra={<Badge count={upcomingDeadlines.length} />}
          >
            <List
              dataSource={upcomingDeadlines}
              renderItem={(item) => {
                const daysLeft = dayjs(item.deadline).diff(dayjs(), 'day');
                const isUrgent = daysLeft <= 3;
                return (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '12px 0' }}
                    onClick={() => {
                      setCurrentEpisodeId(item.id);
                      setCurrentModule('episode');
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>EP.{item.number}</span>
                          <span style={{ color: isUrgent ? '#ff4d4f' : '#333' }}>
                            {item.title}
                          </span>
                        </Space>
                      }
                      description={
                        <Space>
                          <Tag color={statusMap[item.status].color}>{statusMap[item.status].text}</Tag>
                          <span style={{ color: isUrgent ? '#ff4d4f' : '#666' }}>
                            还剩 {daysLeft} 天
                          </span>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>

          <Card
            title="我的任务"
            style={{ marginTop: 16 }}
            extra={<Button type="link" onClick={() => setCurrentModule('episode')}>全部任务</Button>}
          >
            <List
              dataSource={myTasks}
              renderItem={(item) => (
                <List.Item style={{ padding: '10px 0' }}>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Badge
                          status={item.status === 'done' ? 'success' : item.status === 'in_progress' ? 'processing' : 'default'}
                        />
                        <span style={{
                          textDecoration: item.status === 'done' ? 'line-through' : 'none',
                          color: item.status === 'done' ? '#999' : '#333'
                        }}>
                          {item.title}
                        </span>
                      </Space>
                    }
                    description={
                      <Space size="small">
                        <Tag color={priorityColor[item.priority]} style={{ fontSize: 12 }}>
                          {priorityText[item.priority]}优先级
                        </Tag>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {getMemberName(item.assignee, members)}
                        </span>
                        {item.dueDate && (
                          <span style={{ fontSize: 12, color: '#999' }}>
                            · {dayjs(item.dueDate).format('MM-DD')}
                          </span>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
