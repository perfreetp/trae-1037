import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, List, Badge,
  Calendar, Modal, Form, DatePicker, Select, Input, message,
} from 'antd';
import {
  PlusOutlined,
  AudioOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import dayjs, { Dayjs } from 'dayjs';
import type { Dayjs as DayjsType } from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

function PublishCalendar() {
  const { episodes, sponsorships, updateEpisodeStatus, updateEpisode } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const publishedEpisodes = episodes.filter(e => e.status === 'published');
  const upcomingEpisodes = episodes.filter(e =>
    ['ready', 'review', 'editing'].includes(e.status)
  );

  const dateCellRender = (value: DayjsType) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayEpisodes = episodes.filter(e => {
      if (e.publishDate) {
        return dayjs(e.publishDate).isSame(value, 'day');
      }
      return dayjs(e.deadline).isSame(value, 'day') && e.status !== 'published';
    });

    if (dayEpisodes.length === 0) return null;

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayEpisodes.slice(0, 2).map(ep => (
          <li key={ep.id} style={{ fontSize: 11, marginBottom: 2 }}>
            <Badge
              color={ep.status === 'published' ? '#52c41a' : '#faad14'}
              text={
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  maxWidth: 80,
                  verticalAlign: 'bottom'
                }}>
                  EP.{ep.number}
                </span>
              }
            />
          </li>
        ))}
        {dayEpisodes.length > 2 && (
          <li style={{ fontSize: 11, color: '#999' }}>+{dayEpisodes.length - 2} 更多</li>
        )}
      </ul>
    );
  };

  const getListData = (value: DayjsType) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayEpisodes = episodes.filter(e => {
      if (e.publishDate) {
        return dayjs(e.publishDate).isSame(value, 'day');
      }
      return dayjs(e.deadline).isSame(value, 'day') && e.status !== 'published';
    });
    const daySponsors = sponsorships.filter(s =>
      s.airDate && dayjs(s.airDate).isSame(value, 'day')
    );
    return { episodes: dayEpisodes, sponsors: daySponsors };
  };

  const selectedData = getListData(selectedDate);

  const handlePublish = (episodeId: string) => {
    updateEpisode(episodeId, {
      status: 'published',
      publishDate: dayjs().format('YYYY-MM-DD'),
    });
    message.success('已标记为已发布');
  };

  const handleSchedulePublish = (values: any) => {
    updateEpisode(values.episodeId, {
      status: 'ready',
      publishDate: values.publishDate.format('YYYY-MM-DD'),
      deadline: values.publishDate.format('YYYY-MM-DD'),
    });
    message.success('发布已安排');
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>已发布</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>
                {publishedEpisodes.length} 期
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>待发布</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#faad14' }}>
                {upcomingEpisodes.length} 期
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>本月计划发布</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>
                {episodes.filter(e =>
                  e.deadline && dayjs(e.deadline).isSame(dayjs(), 'month')
                ).length} 期
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13, color: '#666' }}>待安排赞助</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#722ed1' }}>
                {sponsorships.filter(s => s.status === 'scheduled').length} 个
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="发布日历"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                安排发布
              </Button>
            }
          >
            <Calendar
              cellRender={dateCellRender}
              onSelect={(date) => setSelectedDate(date)}
              value={selectedDate}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={`${selectedDate.format('YYYY年MM月DD日')} 日程`}>
            {selectedData.episodes.length === 0 && selectedData.sponsors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 12 }} />
                <div>今日暂无安排</div>
              </div>
            ) : (
              <div>
                {selectedData.episodes.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>单集安排</div>
                    <List
                      size="small"
                      dataSource={selectedData.episodes}
                      renderItem={(ep) => (
                        <List.Item
                          actions={
                            ep.status === 'ready'
                              ? [<Button type="link" size="small" onClick={() => handlePublish(ep.id)}>标记发布</Button>]
                              : []
                          }
                        >
                          <List.Item.Meta
                            avatar={<AudioOutlined style={{ color: '#1890ff' }} />}
                            title={
                              <Space>
                                <span>EP.{ep.number} {ep.title}</span>
                                <Tag color={ep.status === 'published' ? 'success' : 'orange'}>
                                  {ep.status === 'published' ? '已发布' : '待发布'}
                                </Tag>
                              </Space>
                            }
                            description={ep.summary || '暂无简介'}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )}
                {selectedData.sponsors.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>赞助排期</div>
                    <List
                      size="small"
                      dataSource={selectedData.sponsors}
                      renderItem={(sp) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<RocketOutlined style={{ color: '#722ed1' }} />}
                            title={
                              <Space>
                                <span>{sp.sponsorName}</span>
                                <Tag color="purple">{sp.position === 'pre_roll' ? '片头' : sp.position === 'mid_roll' ? '片中' : '片尾'}</Tag>
                              </Space>
                            }
                            description={`${sp.duration}秒口播`}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>即将发布</div>
              <List
                size="small"
                dataSource={upcomingEpisodes.slice(0, 3)}
                renderItem={(ep) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`EP.${ep.number} ${ep.title}`}
                      description={
                        <Space size="small">
                          <ClockCircleOutlined />
                          <span>{ep.deadline}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="安排发布"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSchedulePublish}>
          <Form.Item name="episodeId" label="选择单集" rules={[{ required: true }]}>
            <Select placeholder="选择要发布的单集">
              {upcomingEpisodes.map(ep => (
                <Option key={ep.id} value={ep.id}>EP.{ep.number} {ep.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="publishDate" label="发布日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="platforms" label="发布平台">
            <Select mode="multiple" placeholder="选择发布平台" style={{ width: '100%' }}>
              <Option value="xiaouzhou">小宇宙</Option>
              <Option value="apple">Apple Podcasts</Option>
              <Option value="netease">网易云音乐</Option>
              <Option value="ximalaya">喜马拉雅</Option>
              <Option value="spotify">Spotify</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">确认安排</Button>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PublishCalendar;
