import { useState } from 'react';
import {
  Card, Row, Col, Tag, Space, Button, Table, Input,
  Select, Statistic, Progress, List,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  BarChartOutlined,
  AudioOutlined,
  TeamOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { formatDuration } from '../utils/format';
import dayjs from 'dayjs';

const { Option } = Select;

function Archive() {
  const { episodes, listenerData, guests, sponsorships } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);

  const publishedEpisodes = episodes.filter(e => e.status === 'published');
  const archivedEpisodes = episodes.filter(e => e.status === 'archived');

  const filteredEpisodes = [...publishedEpisodes, ...archivedEpisodes].filter(ep => {
    const matchSearch = !searchText ||
      ep.title.includes(searchText) ||
      (ep.summary && ep.summary.includes(searchText));
    const matchSeason = !seasonFilter || ep.seasonId === seasonFilter;
    return matchSearch && matchSeason;
  });

  const totalDownloads = listenerData.reduce((sum, d) => sum + d.downloads, 0);
  const totalListens = listenerData.reduce((sum, d) => sum + d.listens, 0);
  const totalDuration = publishedEpisodes.reduce((sum, ep) => sum + (ep.duration || 0), 0);
  const totalSponsors = sponsorships.filter(s => s.status === 'published').length;

  const columns = [
    {
      title: '单集',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          <AudioOutlined style={{ color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>EP.{record.number} {text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.publishDate}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (d?: number) => d ? formatDuration(d) : '-',
    },
    {
      title: '下载量',
      dataIndex: 'downloads',
      key: 'downloads',
      render: (_: any, record: any) => {
        const data = listenerData.filter(d => d.episodeId === record.id);
        const total = data.reduce((sum, d) => sum + d.downloads, 0);
        return <span style={{ fontWeight: 500 }}>{total.toLocaleString()}</span>;
      },
    },
    {
      title: '播放量',
      dataIndex: 'listens',
      key: 'listens',
      render: (_: any, record: any) => {
        const data = listenerData.filter(d => d.episodeId === record.id);
        const total = data.reduce((sum, d) => sum + d.listens, 0);
        return <span style={{ fontWeight: 500 }}>{total.toLocaleString()}</span>;
      },
    },
    {
      title: '平均收听时长',
      dataIndex: 'avgTime',
      key: 'avgTime',
      render: (_: any, record: any) => {
        const data = listenerData.filter(d => d.episodeId === record.id);
        if (data.length === 0) return '-';
        const avg = Math.round(data.reduce((sum, d) => sum + d.avgListenTime, 0) / data.length);
        return formatDuration(avg);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'published' ? 'success' : 'default'}>
          {s === 'published' ? '已发布' : '已归档'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<BarChartOutlined />}>数据</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />}>导出</Button>
        </Space>
      ),
    },
  ];

  const platformStats = [
    { platform: '小宇宙', downloads: 28300, listens: 21800, color: '#ff7a45' },
    { platform: 'Apple Podcasts', downloads: 17700, listens: 13700, color: '#1890ff' },
    { platform: '网易云音乐', downloads: 5600, listens: 4200, color: '#eb2f96' },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总节目时长"
              value={formatDuration(totalDuration)}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总下载量"
              value={totalDownloads}
              prefix={<DownloadOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ fontSize: 20 }}
              formatter={(v) => <span>{Number(v).toLocaleString()}</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总播放量"
              value={totalListens}
              prefix={<RiseOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: 20 }}
              formatter={(v) => <span>{Number(v).toLocaleString()}</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="合作品牌"
              value={totalSponsors}
              prefix={<TeamOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="平台分布">
            <List
              dataSource={platformStats}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.platform}</span>
                        <span style={{ fontWeight: 500 }}>{item.downloads.toLocaleString()} 下载</span>
                      </div>
                    }
                    description={
                      <Progress
                        percent={Math.round((item.downloads / totalDownloads) * 100)}
                        strokeColor={item.color}
                        showInfo={false}
                        size="small"
                      />
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="热门单集 TOP 3">
            <List
              dataSource={publishedEpisodes.slice(0, 3)}
              renderItem={(ep, idx) => {
                const downloads = listenerData
                  .filter(d => d.episodeId === ep.id)
                  .reduce((sum, d) => sum + d.downloads, 0);
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: idx === 0 ? '#faad14' : idx === 1 ? '#bfbfbf' : '#d4b106',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                          {idx + 1}
                        </div>
                      }
                      title={`EP.${ep.number} ${ep.title}`}
                      description={`${downloads.toLocaleString()} 次下载`}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="嘉宾榜">
            <List
              dataSource={guests.filter(g => g.episodeCount > 0).sort((a, b) => b.episodeCount - a.episodeCount).slice(0, 3)}
              renderItem={(g) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<span style={{ fontSize: 24 }}>{g.avatar}</span>}
                    title={g.name}
                    description={`${g.episodeCount} 期节目`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="节目归档"
        extra={
          <Space>
            <Input
              placeholder="搜索单集标题或简介"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="按季筛选"
              style={{ width: 150 }}
              allowClear
              value={seasonFilter}
              onChange={setSeasonFilter}
            >
              <Option value="s1">第一季</Option>
              <Option value="s2">第二季</Option>
            </Select>
            <Button icon={<DownloadOutlined />}>导出报表</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredEpisodes}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 期节目`,
          }}
        />
      </Card>
    </div>
  );
}

export default Archive;
