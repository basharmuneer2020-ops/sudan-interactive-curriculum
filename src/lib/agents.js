import agentsData from '@/data/subject-agents.json';

export function getAgent(subjectId) {
  return agentsData.agents.find(a => a.subjectId === subjectId) || null;
}

export function getAllAgents() {
  return agentsData.agents;
}

export function getAgentsByTrack(track) {
  const trackMap = {
    common: ['islamic-education', 'arabic', 'english'],
    'scientific-fixed': ['specialized-mathematics', 'physics', 'chemistry'],
    'literary-fixed': ['basic-mathematics', 'geography', 'history'],
    'scientific-7th': ['biology', 'computer-science', 'engineering-sciences', 'home-science', 'arts-and-design'],
    'literary-7th': ['islamic-studies', 'english-literature', 'french-language', 'arts-and-design'],
  };

  const subjectIds = trackMap[track] || [];
  return agentsData.agents.filter(a => subjectIds.includes(a.subjectId));
}

export function buildSystemPrompt(agent) {
  return `${agentsData.globalSystemPrompt}\n\n${agent.systemPrompt}`;
}

export const trackLabels = {
  common: 'مواد مشتركة',
  'scientific-fixed': 'المسار العلمي — ثابتة',
  'literary-fixed': 'المسار الأدبي — ثابتة',
  'scientific-7th': 'المادة السابعة — علمي',
  'literary-7th': 'المادة السابعة — أدبي',
};

export const trackOrder = [
  'common',
  'scientific-fixed',
  'literary-fixed',
  'scientific-7th',
  'literary-7th',
];
