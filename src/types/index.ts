export interface Member {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Season {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'recording' | 'editing' | 'releasing' | 'completed';
  startDate: string;
  endDate?: string;
  episodeCount: number;
}

export interface PublishCheckItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'audio' | 'content' | 'design' | 'platform' | 'legal';
}

export interface Episode {
  id: string;
  seasonId: string;
  title: string;
  number: number;
  status: 'draft' | 'planning' | 'recording' | 'editing' | 'review' | 'ready' | 'published' | 'archived';
  deadline: string;
  assignees: string[];
  topic?: string;
  summary?: string;
  duration?: number;
  publishDate?: string;
  publishChecklist?: PublishCheckItem[];
}

export interface Task {
  id: string;
  episodeId?: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  source?: string;
  status: 'proposed' | 'approved' | 'scheduled' | 'used';
  createdAt: string;
  tags: string[];
}

export interface Guest {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar?: string;
  contact?: string;
  bio?: string;
  tags: string[];
  episodeCount: number;
  lastAppearance?: string;
}

export interface InterviewOutline {
  id: string;
  episodeId: string;
  guestId?: string;
  questions: { id: string; question: string; notes?: string; order: number }[];
  duration?: number;
}

export interface RecordingItem {
  id: string;
  episodeId: string;
  name: string;
  fileName: string;
  duration: number;
  createdAt: string;
  size: string;
  quality: 'good' | 'medium' | 'poor';
}

export interface Material {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'image' | 'document' | 'other';
  fileName: string;
  size: string;
  uploadDate: string;
  episodeId?: string;
  tags: string[];
}

export interface ClipMarker {
  id: string;
  episodeId: string;
  startTime: number;
  endTime: number;
  label: string;
  description?: string;
  color: string;
}

export interface MistakeRecord {
  id: string;
  episodeId: string;
  timeCode: number;
  description: string;
  fixed: boolean;
  createdAt: string;
}

export interface EditingTodo {
  id: string;
  episodeId: string;
  content: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface CopyrightMusic {
  id: string;
  title: string;
  artist: string;
  album?: string;
  licenseType: string;
  licenseFile?: string;
  episodeIds: string[];
  usageType: 'intro' | 'outro' | 'background' | 'other';
}

export interface CoverDraft {
  id: string;
  episodeId: string;
  version: number;
  imageUrl?: string;
  status: 'draft' | 'review' | 'approved';
  comments?: string;
  createdAt: string;
}

export interface Copywriting {
  id: string;
  episodeId: string;
  type: 'description' | 'shownotes' | 'social' | 'newsletter';
  content: string;
  version: number;
  updatedAt: string;
}

export interface TimelineNote {
  id: string;
  episodeId: string;
  timeCode: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ReviewComment {
  id: string;
  episodeId: string;
  content: string;
  reviewer: string;
  status: 'open' | 'resolved';
  createdAt: string;
  replies?: { id: string; content: string; author: string; createdAt: string }[];
}

export interface PublishChecklist {
  id: string;
  episodeId: string;
  items: { id: string; label: string; checked: boolean; category: string }[];
  completedAt?: string;
}

export interface ListenerData {
  id: string;
  episodeId: string;
  platform: string;
  downloads: number;
  listens: number;
  avgListenTime: number;
  date: string;
}

export interface Sponsorship {
  id: string;
  sponsorName: string;
  episodeId: string;
  position: 'pre_roll' | 'mid_roll' | 'post_roll';
  duration: number;
  script?: string;
  status: 'scheduled' | 'recorded' | 'published';
  airDate?: string;
}

export type ModuleKey = 'dashboard' | 'episode' | 'guests' | 'materials' | 'review' | 'calendar' | 'archive';
