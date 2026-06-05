import { create } from 'zustand';
import {
  Member, Season, Episode, Task, Topic, Guest, Material,
  ClipMarker, MistakeRecord, EditingTodo, CopyrightMusic,
  CoverDraft, Copywriting, TimelineNote, ReviewComment,
  Sponsorship, ListenerData, ModuleKey
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
  addTask: (task: Omit<Task, 'id'>) => void;
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  toggleMistakeFixed: (id: string) => void;
  updateEditingTodoStatus: (id: string, status: EditingTodo['status']) => void;
  resolveReviewComment: (id: string) => void;
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

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: `t${Date.now()}` }]
  })),

  addTopic: (topic) => set((state) => ({
    topics: [...state.topics, { ...topic, id: `tp${Date.now()}` }]
  })),

  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, { ...guest, id: `g${Date.now()}` }]
  })),

  toggleMistakeFixed: (id) => set((state) => ({
    mistakeRecords: state.mistakeRecords.map(m => m.id === id ? { ...m, fixed: !m.fixed } : m)
  })),

  updateEditingTodoStatus: (id, status) => set((state) => ({
    editingTodos: state.editingTodos.map(e => e.id === id ? { ...e, status } : e)
  })),

  resolveReviewComment: (id) => set((state) => ({
    reviewComments: state.reviewComments.map(r => r.id === id ? { ...r, status: 'resolved' as const } : r)
  })),
}));
