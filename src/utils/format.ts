export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const formatTimeCode = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getMemberName = (memberId: string, members: { id: string; name: string }[]): string => {
  const member = members.find(m => m.id === memberId);
  return member?.name || '未知';
};

export const getEpisodeTitle = (episodeId: string, episodes: { id: string; title: string }[]): string => {
  const ep = episodes.find(e => e.id === episodeId);
  return ep?.title || '未知单集';
};
