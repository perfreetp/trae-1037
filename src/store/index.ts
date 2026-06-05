import { create } from 'zustand';
import {
  Member, Season, Episode, Task, Topic, Guest, Material,
  ClipMarker, MistakeRecord, EditingTodo, CopyrightMusic,
  CoverDraft, Copywriting, TimelineNote, ReviewComment,
  Sponsorship, ListenerData, ModuleKey, PublishCheckItem
} from '../types';
import {
  members as mockMembers,
  seasons as mockSeasons,
  episodes as mockEpisodes,
  tasks as mockTasks,
  topics as mockTopics,
  guests as mockGuests,
  materials as mockMaterials,
  clipMarkers as mockClipMarkers,
  mistakeRecords as mockMistakeRecords,
  editingTodos as mockEditingTodos,
  copyrightMusic as mockCopyrightMusic,
  coverDrafts as mockCoverDrafts,
  copywritings as mockCopywritings,
  timelineNotes as mockTimelineNotes,
  reviewComments as mockReviewComments,
  sponsorships as mockSponsorships,
  listenerData as mockListenerData,
} from '../data/mockData';

interface AppState {
  currentModule: ModuleKey;
  currentEpisodeId: string | null;
  members: Member[];
  seasons: Season[];
  episodes: Episode[];
  tasks: Task[];
  topics: Topic[];
  guests: Guest[];
  materials: Material[];
  clipMarkers: ClipMarker[];
  mistakeRecords: MistakeRecord[];
  editingTodos: EditingTodo[];
  copyrightMusic: CopyrightMusic[];
  coverDrafts: CoverDraft[];
  copywritings: Copywriting[];
  timelineNotes: TimelineNote[];
  reviewComments: ReviewComment[];
  sponsorships: Sponsorship[];
  listenerData: ListenerData[];
  setCurrentModule: (module: ModuleKey) => void;
  setCurrentEpisodeId: (id: string | null) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateEpisodeStatus: (episodeId: string, status: Episode['status']) => void;
  updateEpisode: (episodeId: string, updates: Partial<Episode>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (guestId: string, updates: Partial<Guest>) => void;
  deleteGuest: (guestId: string) => void;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  deleteMaterial: (materialId: string) => void;
  toggleMistakeFixed: (id: string) => void;
  updateEditingTodoStatus: (id: string, status: EditingTodo['status']) => void;
  addReviewComment: (comment: Omit<ReviewComment, 'id'>) => void;
  resolveReviewComment: (id: string) => void;
  addReplyToReview: (commentId: string, reply: { author: string; content: string; createdAt: string }) => void;
  reopenReviewComment: (id: string) => void;
  togglePublishCheckItem: (episodeId: string, itemId: string) => void;
  addListenerData: (data: Omit<ListenerData, 'id'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentModule: 'dashboard',
  currentEpisodeId: null,
  members: mockMembers,
  seasons: mockSeasons,
  episodes: mockEpisodes,
  tasks: mockTasks,
  topics: mockTopics,
  guests: mockGuests,
  materials: mockMaterials,
  clipMarkers: mockClipMarkers,
  mistakeRecords: mockMistakeRecords,
  editingTodos: mockEditingTodos,
  copyrightMusic: mockCopyrightMusic,
  coverDrafts: mockCoverDrafts,
  copywritings: mockCopywritings,
  timelineNotes: mockTimelineNotes,
  reviewComments: mockReviewComments,
  sponsorships: mockSponsorships,
  listenerData: mockListenerData,

  setCurrentModule: (module) => set({ currentModule: module }),
  setCurrentEpisodeId: (id) => set({ currentEpisodeId: id }),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
  })),

  updateEpisodeStatus: (episodeId, status) => set((state) => ({
    episodes: state.episodes.map(e => e.id === episodeId ? { ...e, status } : e)
  })),

  updateEpisode: (episodeId, updates) => set((state) => ({
    episodes: state.episodes.map(e => e.id === episodeId ? { ...e, ...updates } : e)
  })),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: `t${Date.now()}` }]
  })),

  addTopic: (topic) => set((state) => ({
    topics: [...state.topics, { ...topic, id: `tp${Date.now()}` }]
  })),

  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, { ...guest, id: `g${Date.now()}` }]
  })),

  updateGuest: (guestId, updates) => set((state) => ({
    guests: state.guests.map(g => g.id === guestId ? { ...g, ...updates } : g)
  })),

  deleteGuest: (guestId) => set((state) => ({
    guests: state.guests.filter(g => g.id !== guestId)
  })),

  addMaterial: (material) => set((state) => ({
    materials: [...state.materials, { ...material, id: `mat${Date.now()}` }]
  })),

  deleteMaterial: (materialId) => set((state) => ({
    materials: state.materials.filter(m => m.id !== materialId)
  })),

  toggleMistakeFixed: (id) => set((state) => ({
    mistakeRecords: state.mistakeRecords.map(m => m.id === id ? { ...m, fixed: !m.fixed } : m)
  })),

  updateEditingTodoStatus: (id, status) => set((state) => ({
    editingTodos: state.editingTodos.map(e => e.id === id ? { ...e, status } : e)
  })),

  addReviewComment: (comment) => set((state) => ({
    reviewComments: [...state.reviewComments, { ...comment, id: `rc${Date.now()}` }]
  })),

  resolveReviewComment: (id) => set((state) => ({
    reviewComments: state.reviewComments.map(r => r.id === id ? { ...r, status: 'resolved' as const } : r)
  })),

  addReplyToReview: (commentId, reply) => set((state) => ({
    reviewComments: state.reviewComments.map(r => {
      if (r.id === commentId) {
        const newReply = { ...reply, id: `r${Date.now()}` };
        return {
          ...r,
          replies: [...(r.replies || []), newReply],
        };
      }
      return r;
    })
  })),

  reopenReviewComment: (id) => set((state) => ({
    reviewComments: state.reviewComments.map(r => r.id === id ? { ...r, status: 'open' as const } : r)
  })),

  togglePublishCheckItem: (episodeId, itemId) => set((state) => {
    const episode = state.episodes.find(e => e.id === episodeId);
    let currentChecklist = episode?.publishChecklist;
    if (!currentChecklist) {
      const defaultChecklist: PublishCheckItem[] = [
        { id: 'audio-1', label: '音频文件已导出并备份', checked: false, category: 'audio' },
        { id: 'audio-2', label: '音量电平符合平台标准', checked: false, category: 'audio' },
        { id: 'audio-3', label: '背景音乐音量合适', checked: false, category: 'audio' },
        { id: 'content-1', label: '节目简介已校对', checked: false, category: 'content' },
        { id: 'content-2', label: 'Shownotes已完成', checked: false, category: 'content' },
        { id: 'content-3', label: '社交媒体文案准备', checked: false, category: 'content' },
        { id: 'design-1', label: '封面图已确认', checked: false, category: 'design' },
        { id: 'legal-1', label: '版权音乐授权确认', checked: false, category: 'legal' },
        { id: 'legal-2', label: '嘉宾照片及授权', checked: false, category: 'legal' },
        { id: 'legal-3', label: '赞助商口播已插入', checked: false, category: 'legal' },
        { id: 'platform-1', label: '发布时间已确认', checked: false, category: 'platform' },
        { id: 'platform-2', label: '各平台账号已登录', checked: false, category: 'platform' },
        { id: 'platform-3', label: 'RSS Feed配置正确', checked: false, category: 'platform' },
      ];
      currentChecklist = defaultChecklist;
    }
    const newChecklist = currentChecklist.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    return {
      episodes: state.episodes.map(e =>
        e.id === episodeId ? { ...e, publishChecklist: newChecklist } : e
      )
    };
  }),

  addListenerData: (data) => set((state) => {
    const existingIndex = state.listenerData.findIndex(
      d => d.episodeId === data.episodeId && d.platform === data.platform
    );
    if (existingIndex >= 0) {
      const existing = state.listenerData[existingIndex];
      const updated = {
        ...existing,
        downloads: existing.downloads + data.downloads,
        listens: existing.listens + data.listens,
        avgListenTime: Math.round(
          (existing.avgListenTime * existing.downloads + data.avgListenTime * data.downloads) /
          (existing.downloads + data.downloads)
        ) || 0,
        date: data.date,
      };
      const newListenerData = [...state.listenerData];
      newListenerData[existingIndex] = updated;
      return { listenerData: newListenerData };
    }
    return {
      listenerData: [...state.listenerData, { ...data, id: `ld${Date.now()}` }]
    };
  }),
}));
