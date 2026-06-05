import {
  Member, Season, Episode, Task, Topic, Guest, Material,
  ClipMarker, MistakeRecord, EditingTodo, CopyrightMusic,
  CoverDraft, Copywriting, TimelineNote, ReviewComment,
  Sponsorship, ListenerData
} from '../types';

export const members: Member[] = [
  { id: 'm1', name: '李明', role: '制作人', avatar: '🎙️' },
  { id: 'm2', name: '王芳', role: '主持人', avatar: '👩‍🎤' },
  { id: 'm3', name: '张伟', role: '剪辑师', avatar: '🎬' },
  { id: 'm4', name: '刘静', role: '文案策划', avatar: '✍️' },
  { id: 'm5', name: '陈强', role: '运营', avatar: '📊' },
];

export const seasons: Season[] = [
  {
    id: 's1',
    name: '第一季：创业启示录',
    description: '聚焦创业者的心路历程',
    status: 'releasing',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    episodeCount: 12,
  },
  {
    id: 's2',
    name: '第二季：科技前沿',
    description: '探索最新科技趋势',
    status: 'planning',
    startDate: '2026-07-01',
    episodeCount: 10,
  },
];

export const episodes: Episode[] = [
  {
    id: 'e1', seasonId: 's1', title: '从0到1：一位连续创业者的独白',
    number: 1, status: 'published', deadline: '2026-01-20',
    assignees: ['m1', 'm2', 'm3'], duration: 3240,
    publishDate: '2026-01-25',
    summary: '嘉宾分享了三次创业的经历，从失败中学习的故事。'
  },
  {
    id: 'e2', seasonId: 's1', title: '产品经理的日常：在矛盾中寻找平衡',
    number: 2, status: 'published', deadline: '2026-02-05',
    assignees: ['m1', 'm2', 'm3', 'm4'], duration: 3600,
    publishDate: '2026-02-10',
    summary: '深度对话互联网大厂产品经理，揭秘产品决策背后的故事。'
  },
  {
    id: 'e3', seasonId: 's1', title: '远程工作三年，我学到了什么',
    number: 3, status: 'ready', deadline: '2026-06-10',
    assignees: ['m2', 'm3', 'm4'],
    summary: '嘉宾分享远程工作的效率技巧和心路历程。'
  },
  {
    id: 'e4', seasonId: 's1', title: 'AI时代的设计师：机遇还是挑战？',
    number: 4, status: 'review', deadline: '2026-06-15',
    assignees: ['m1', 'm2', 'm3'],
  },
  {
    id: 'e5', seasonId: 's1', title: '内容创业的下半场',
    number: 5, status: 'editing', deadline: '2026-06-20',
    assignees: ['m2', 'm3'],
  },
  {
    id: 'e6', seasonId: 's1', title: '从零开始做播客',
    number: 6, status: 'recording', deadline: '2026-06-25',
    assignees: ['m1', 'm2', 'm3', 'm4', 'm5'],
  },
  {
    id: 'e7', seasonId: 's1', title: '投资人眼中的好项目',
    number: 7, status: 'planning', deadline: '2026-07-05',
    assignees: ['m1', 'm2'],
  },
  {
    id: 'e8', seasonId: 's1', title: '技术人的职业天花板',
    number: 8, status: 'draft', deadline: '2026-07-15',
    assignees: ['m1'],
  },
];

export const tasks: Task[] = [
  { id: 't1', episodeId: 'e6', title: '联系嘉宾确认时间', assignee: 'm1', status: 'done', dueDate: '2026-06-06', priority: 'high', category: '筹备' },
  { id: 't2', episodeId: 'e6', title: '准备采访提纲', assignee: 'm4', status: 'in_progress', dueDate: '2026-06-08', priority: 'high', category: '内容' },
  { id: 't3', episodeId: 'e5', title: '剪辑口误部分', assignee: 'm3', status: 'in_progress', dueDate: '2026-06-09', priority: 'medium', category: '剪辑' },
  { id: 't4', episodeId: 'e5', title: '添加背景音乐', assignee: 'm3', status: 'todo', dueDate: '2026-06-10', priority: 'medium', category: '剪辑' },
  { id: 't5', episodeId: 'e4', title: '根据审核意见修改', assignee: 'm3', status: 'todo', dueDate: '2026-06-12', priority: 'high', category: '审核' },
  { id: 't6', episodeId: 'e3', title: '撰写发布文案', assignee: 'm4', status: 'done', dueDate: '2026-06-05', priority: 'medium', category: '发布' },
  { id: 't7', episodeId: 'e3', title: '设计封面图', assignee: 'm5', status: 'done', dueDate: '2026-06-06', priority: 'medium', category: '设计' },
  { id: 't8', title: '更新官网节目列表', assignee: 'm5', status: 'todo', dueDate: '2026-06-15', priority: 'low', category: '运营' },
];

export const topics: Topic[] = [
  { id: 'tp1', title: 'AIGC对内容创作的影响', status: 'approved', createdAt: '2026-05-20', tags: ['AI', '内容创作'] },
  { id: 'tp2', title: '独立开发者的生存之道', status: 'scheduled', createdAt: '2026-05-15', tags: ['独立开发', '创业'] },
  { id: 'tp3', title: '如何打造个人品牌', status: 'proposed', createdAt: '2026-06-01', tags: ['个人成长', '品牌'] },
  { id: 'tp4', title: '播客商业化探索', status: 'proposed', createdAt: '2026-06-02', tags: ['播客', '商业化'] },
  { id: 'tp5', title: '远程团队协作工具盘点', status: 'approved', createdAt: '2026-05-28', tags: ['远程工作', '工具'] },
  { id: 'tp6', title: '健康工作：避免职业倦怠', status: 'proposed', createdAt: '2026-06-03', tags: ['健康', '职场'] },
];

export const guests: Guest[] = [
  { id: 'g1', name: '周航', title: '创始人 & CEO', company: '某科技公司', avatar: '👨‍💼', contact: 'zhouhang@example.com', bio: '连续创业者，三次创业经历，专注于SaaS领域。', tags: ['创业', 'SaaS', '管理'], episodeCount: 2, lastAppearance: '2026-02-10' },
  { id: 'g2', name: '林小雨', title: '高级产品经理', company: '字节跳动', avatar: '👩‍💻', contact: 'linxiaoyu@example.com', bio: '10年产品经验，主导过多款亿级用户产品。', tags: ['产品', '互联网', '大厂'], episodeCount: 1, lastAppearance: '2026-01-25' },
  { id: 'g3', name: '王大明', title: '知名设计师', company: '独立工作室', avatar: '🎨', contact: 'wangdaming@example.com', bio: '前腾讯设计总监，现独立设计师，专注于品牌设计。', tags: ['设计', '品牌', 'AI'], episodeCount: 0 },
  { id: 'g4', name: '陈思远', title: '投资人', company: '红杉资本', avatar: '💼', contact: 'chensiyuan@example.com', bio: '关注企业服务和AI赛道，投资过30+创业公司。', tags: ['投资', 'AI', '企业服务'], episodeCount: 0 },
  { id: 'g5', name: '赵晓晨', title: '远程工作倡导者', company: 'Remote China', avatar: '🌍', contact: 'zhaoxiaochen@example.com', bio: '远程工作5年，Remote China社区创始人。', tags: ['远程工作', '社区', '效率'], episodeCount: 1, lastAppearance: '2026-03-01' },
];

export const materials: Material[] = [
  { id: 'mat1', name: '开场音乐', type: 'audio', fileName: 'intro_v2.mp3', size: '3.2 MB', uploadDate: '2026-01-10', tags: ['音乐', '开场'] },
  { id: 'mat2', name: '结尾音乐', type: 'audio', fileName: 'outro_v2.mp3', size: '2.8 MB', uploadDate: '2026-01-10', tags: ['音乐', '结尾'] },
  { id: 'mat3', name: '嘉宾周航照片', type: 'image', fileName: 'zhouhang_avatar.jpg', size: '1.5 MB', uploadDate: '2026-01-15', episodeId: 'e1', tags: ['嘉宾', '照片'] },
  { id: 'mat4', name: '转场音效包', type: 'audio', fileName: 'transitions.zip', size: '15 MB', uploadDate: '2026-02-01', tags: ['音效', '转场'] },
  { id: 'mat5', name: '第一季封面PSD', type: 'document', fileName: 'season1_cover.psd', size: '45 MB', uploadDate: '2026-01-08', tags: ['封面', '设计稿'] },
  { id: 'mat6', name: 'e5录音原始文件', type: 'audio', fileName: 'e5_raw.wav', size: '256 MB', uploadDate: '2026-06-01', episodeId: 'e5', tags: ['录音', '原始'] },
];

export const clipMarkers: ClipMarker[] = [
  { id: 'cm1', episodeId: 'e5', startTime: 120, endTime: 180, label: '精彩片段-创业心得', color: '#52c41a' },
  { id: 'cm2', episodeId: 'e5', startTime: 450, endTime: 520, label: '广告口播', color: '#1890ff' },
  { id: 'cm3', episodeId: 'e5', startTime: 890, endTime: 920, label: '金句', color: '#faad14' },
  { id: 'cm4', episodeId: 'e4', startTime: 200, endTime: 260, label: '核心观点', color: '#52c41a' },
  { id: 'cm5', episodeId: 'e4', startTime: 700, endTime: 780, label: '案例分享', color: '#722ed1' },
];

export const mistakeRecords: MistakeRecord[] = [
  { id: 'mr1', episodeId: 'e5', timeCode: 245, description: '口误：把"产品"说成"产出"', fixed: false, createdAt: '2026-06-05' },
  { id: 'mr2', episodeId: 'e5', timeCode: 567, description: '背景噪音较大，需要处理', fixed: true, createdAt: '2026-06-05' },
  { id: 'mr3', episodeId: 'e5', timeCode: 1023, description: '卡顿重复', fixed: false, createdAt: '2026-06-06' },
  { id: 'mr4', episodeId: 'e4', timeCode: 345, description: '呼吸声过大', fixed: true, createdAt: '2026-06-03' },
];

export const editingTodos: EditingTodo[] = [
  { id: 'ed1', episodeId: 'e5', content: '剪辑掉所有口误部分', assignee: 'm3', status: 'in_progress', priority: 'high' },
  { id: 'ed2', episodeId: 'e5', content: '添加转场音效', assignee: 'm3', status: 'pending', priority: 'medium' },
  { id: 'ed3', episodeId: 'e5', content: '调整音量平衡', assignee: 'm3', status: 'pending', priority: 'medium' },
  { id: 'ed4', episodeId: 'e5', content: '添加背景音乐', assignee: 'm3', status: 'pending', priority: 'low' },
  { id: 'ed5', episodeId: 'e4', content: '修复第345秒的呼吸声', assignee: 'm3', status: 'done', priority: 'high' },
];

export const copyrightMusic: CopyrightMusic[] = [
  { id: 'cm1', title: 'Morning Vibes', artist: 'Acoustic Dreams', licenseType: 'Epidemic Sound', episodeIds: ['e1', 'e2', 'e3'], usageType: 'intro' },
  { id: 'cm2', title: 'Gentle Breeze', artist: 'Soft Orchestra', licenseType: 'Artlist', episodeIds: ['e1', 'e2'], usageType: 'background' },
  { id: 'cm3', title: 'Sunset Drive', artist: 'Lo-Fi Beats', licenseType: 'Epidemic Sound', episodeIds: ['e3'], usageType: 'outro' },
];

export const coverDrafts: CoverDraft[] = [
  { id: 'cd1', episodeId: 'e3', version: 1, status: 'approved', comments: '效果很好，就用这版', createdAt: '2026-06-02' },
  { id: 'cd2', episodeId: 'e4', version: 2, status: 'review', comments: '色调可以再暖一点', createdAt: '2026-06-05' },
  { id: 'cd3', episodeId: 'e5', version: 1, status: 'draft', createdAt: '2026-06-06' },
];

export const copywritings: Copywriting[] = [
  { id: 'cw1', episodeId: 'e3', type: 'description', content: '本期我们邀请到远程工作倡导者赵晓晨，分享她五年远程工作的经验...', version: 2, updatedAt: '2026-06-04' },
  { id: 'cw2', episodeId: 'e3', type: 'shownotes', content: '00:00 开场\n02:30 什么契机开始远程工作\n15:45 远程工作最大的挑战...', version: 1, updatedAt: '2026-06-05' },
  { id: 'cw3', episodeId: 'e4', type: 'description', content: 'AI时代到来，设计师的职业路径将发生怎样的变化？', version: 1, updatedAt: '2026-06-03' },
];

export const timelineNotes: TimelineNote[] = [
  { id: 'tn1', episodeId: 'e5', timeCode: 180, content: '这里可以加入产品图片', createdBy: 'm4', createdAt: '2026-06-05' },
  { id: 'tn2', episodeId: 'e5', timeCode: 600, content: '嘉宾提到的书名需要确认一下', createdBy: 'm1', createdAt: '2026-06-06' },
  { id: 'tn3', episodeId: 'e4', timeCode: 420, content: '这里需要加个音效转场', createdBy: 'm3', createdAt: '2026-06-04' },
];

export const reviewComments: ReviewComment[] = [
  { id: 'rc1', episodeId: 'e4', content: '第5分钟到第8分钟可以再精简一些', reviewer: 'm1', status: 'open', createdAt: '2026-06-05' },
  { id: 'rc2', episodeId: 'e4', content: '结尾部分的背景音乐音量有点大', reviewer: 'm2', status: 'resolved', createdAt: '2026-06-04', replies: [{ id: 'r1', content: '已调整音量', author: 'm3', createdAt: '2026-06-05' }] },
  { id: 'rc3', episodeId: 'e5', content: '整体节奏不错，可以进入下一轮审核', reviewer: 'm1', status: 'resolved', createdAt: '2026-06-06' },
];

export const sponsorships: Sponsorship[] = [
  { id: 'sp1', sponsorName: 'Notion', episodeId: 'e3', position: 'mid_roll', duration: 60, script: '本期节目由 Notion 赞助...', status: 'recorded', airDate: '2026-06-10' },
  { id: 'sp2', sponsorName: '灵犀声卡', episodeId: 'e4', position: 'pre_roll', duration: 45, script: '欢迎收听本期节目，感谢灵犀声卡的赞助...', status: 'scheduled', airDate: '2026-06-15' },
  { id: 'sp3', sponsorName: '飞书', episodeId: 'e5', position: 'post_roll', duration: 30, status: 'scheduled', airDate: '2026-06-20' },
];

export const listenerData: ListenerData[] = [
  { id: 'ld1', episodeId: 'e1', platform: '小宇宙', downloads: 12500, listens: 9800, avgListenTime: 2800, date: '2026-06-01' },
  { id: 'ld2', episodeId: 'e1', platform: 'Apple Podcasts', downloads: 8200, listens: 6500, avgListenTime: 2650, date: '2026-06-01' },
  { id: 'ld3', episodeId: 'e1', platform: '网易云音乐', downloads: 5600, listens: 4200, avgListenTime: 2100, date: '2026-06-01' },
  { id: 'ld4', episodeId: 'e2', platform: '小宇宙', downloads: 15800, listens: 12000, avgListenTime: 3100, date: '2026-06-01' },
  { id: 'ld5', episodeId: 'e2', platform: 'Apple Podcasts', downloads: 9500, listens: 7200, avgListenTime: 2900, date: '2026-06-01' },
];
