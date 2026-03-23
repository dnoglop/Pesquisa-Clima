export interface SurveyResponse {
  submissionId: string;
  respondentId: string;
  submittedAt: string;
  area: string;
  hobbies: string;
  exercise: string;
  infoSource: string;
  iaFrequency: string;
  personality: string;
  valuePerception: string;
  pillarsIdentification: number;
  culturalSync: number;
  testimonial: string;
  managerExample: number;
  leadershipAmbassador: string;
  psychologicalSafety: number;
  safeSpaceForErrors: number;
  enps: number;
  recognitionFeeling: number;
  recognitionTypes: string;
  elogioCanal: string;
  legacy: number;
  mentorship: string;
  priorityActions: string;
  communicationChange: string;
  vision40Years: string;
}

export interface HeatmapData {
  area: string;
  metrics: {
    label: string;
    score: number;
    color: string;
  }[];
}

export interface AreaComparison {
  area: string;
  enps: number;
  seguranca: number;
  lideranca: number;
  identificacao: number;
  reconhecimento: number;
}

export interface DashboardStats {
  enpsScore: number;
  enpsDistribution: { promoters: number; passives: number; detractors: number };
  mentorshipInterest: number;
  iaUsageHigh: number;
  legacyMotivation: number;
  areaEngagement: { area: string; score: number }[];
  recognitionPreferences: { type: string; percentage: number }[];
  iaFrequencyBreakdown: { label: string; percentage: number }[];
  habits: {
    exercise: number;
    hobbies: number;
  };
  testimonials: { text: string; role: string }[];
  personalityTraits: { trait: string; percentage: number }[];
  leadershipSentiment: { label: string; value: number }[];
  priorityActions: { action: string; count: number }[];
  infoSources: { source: string; count: number }[];
  areas: string[];
  heatmap: HeatmapData[];
  comparisons: AreaComparison[];
  totalResponses: number;
}
