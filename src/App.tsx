import { Layout, Menu, Avatar, Tag, Space } from 'antd';
import {
  DashboardOutlined,
  AudioOutlined,
  TeamOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  BarChartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAppStore } from './store';
import { ModuleKey } from './types';
import Dashboard from './pages/Dashboard';
import EpisodeWorkbench from './pages/EpisodeWorkbench';
import Guests from './pages/Guests';
import Materials from './pages/Materials';
import Review from './pages/Review';
import PublishCalendar from './pages/PublishCalendar';
import Archive from './pages/Archive';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '节目看板' },
  { key: 'episode', icon: <AudioOutlined />, label: '单集工作台' },
  { key: 'guests', icon: <TeamOutlined />, label: '嘉宾库' },
  { key: 'materials', icon: <FolderOpenOutlined />, label: '素材库' },
  { key: 'review', icon: <CheckCircleOutlined />, label: '审核中心' },
  { key: 'calendar', icon: <CalendarOutlined />, label: '发布日历' },
  { key: 'archive', icon: <BarChartOutlined />, label: '统计归档' },
];

function App() {
  const { currentModule, setCurrentModule, members, reviewComments } = useAppStore();
  const openComments = reviewComments.filter(c => c.status === 'open').length;

  const renderContent = () => {
    switch (currentModule as ModuleKey) {
      case 'dashboard': return <Dashboard />;
      case 'episode': return <EpisodeWorkbench />;
      case 'guests': return <Guests />;
      case 'materials': return <Materials />;
      case 'review': return <Review />;
      case 'calendar': return <PublishCalendar />;
      case 'archive': return <Archive />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: '#001529',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          borderBottom: '1px solid #002140',
        }}>
          🎙️ 播客工作室
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentModule]}
          items={menuItems}
          onClick={({ key }) => setCurrentModule(key as ModuleKey)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout style={{ marginLeft: 220 }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          height: 64,
        }}>
          <Space size="large">
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
              第一季：创业启示录
            </Tag>
          </Space>
          <Space size="middle">
            <BellOutlined style={{ fontSize: 18, color: '#666', cursor: 'pointer' }} />
            <Space size="small">
              <Avatar style={{ backgroundColor: '#1890ff' }}>
                {members[0]?.avatar || '👤'}
              </Avatar>
              <span style={{ color: '#333' }}>{members[0]?.name}</span>
            </Space>
          </Space>
        </Header>
        <Content style={{
          margin: '24px',
          padding: 0,
          minHeight: 280,
          overflow: 'auto',
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
