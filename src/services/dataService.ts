import Papa from 'papaparse';
import { SurveyResponse, DashboardStats } from '../types';

const API_URL = '/api/survey-data';

// Adicione esta lista com as opções exatas:
const PRIORIDADES_POSSIVEIS = [
  "Melhoria clara nos canais de comunicação interna (saber o que se passa na empresa).",
  "Mais momentos de integração e descompressão entre as equipes.",
  "Programas de reconhecimento e premiação mais transparentes.",
  "Maior investimento em treinos, cursos e desenvolvimento técnico.",
  "Ações focadas na saúde mental e bem-estar (ginástica laboral, palestras, etc.)"
];

const RECONHECIMENTO_POSSIVEIS = [
  "Reconhecimento financeiro (bónus, prémios)",
  "Reconhecimento público (ser elogiado em reuniões ou nos canais da empresa)",
  "Reconhecimento privado (um feedback sincero 1:1 do gestor)",
  "Tempo livre (folgas extra, maior flexibilidade)",
  "Oportunidades de crescimento e novos desafios"
];

export async function fetchSurveyData(): Promise<SurveyResponse[]> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status} ${errorData.error || ''}`);
    }

    const data = await response.json();
    
    let rows: any[] = [];
    
    // Check if we got a CSV fallback
    if (data.csvData) {
      const results = Papa.parse(data.csvData, {
        header: true,
        skipEmptyLines: true
      });
      rows = results.data;
    } else {
      // Handle different possible JSON structures from Apps Script
      rows = Array.isArray(data) ? data : (data.data || data.rows || []);
    }

    return rows.map((row: any) => {
      // Helper to find column value by partial or exact match (case-insensitive)
      const getVal = (patterns: string[], defaultValue: string = '') => {
        const key = Object.keys(row).find(k => 
          patterns.some(p => k.toLowerCase().includes(p.toLowerCase()))
        );
        return key ? String(row[key]) : defaultValue;
      };

      return {
        submissionId: getVal(['Submission ID', 'submissionId']),
        respondentId: getVal(['Respondent ID', 'respondentId']),
        submittedAt: getVal(['Submitted at', 'submittedAt']),
        area: getVal(['grupo de área', 'area']),
        hobbies: getVal(['hobbies', 'tempo livre']),
        exercise: getVal(['exercício físico', 'exercise']),
        infoSource: getVal(['notícias do dia', 'infoSource']),
        iaFrequency: getVal(['ferramentas de IA', 'iaFrequency']),
        personality: getVal(['empresa fosse uma pessoa', 'personality']),
        valuePerception: getVal(['frases melhor define', 'valuePerception']),
        pillarsIdentification: parseInt(getVal(['pilares da Consistem', 'pillarsIdentification'], '0')),
        culturalSync: parseInt(getVal(['externamente é exatamente o que vivemos', 'culturalSync'], '0')),
        testimonial: getVal(['trabalhar aí', 'testimonial']),
        managerExample: parseInt(getVal(['gestor direto age como um exemplo', 'managerExample'], '0')),
        leadershipAmbassador: getVal(['lideranças (como um todo) atuam', 'leadershipAmbassador']),
        psychologicalSafety: parseInt(getVal(['segurança na minha equipe', 'psychologicalSafety'], '0')),
        safeSpaceForErrors: parseInt(getVal(['espaço seguro" para admitir erros', 'safeSpaceForErrors'], '0')),
        enps: parseInt(getVal(['recomendaria a Consistem', 'enps'], '0')),
        recognitionFeeling: parseInt(getVal(['reconhecidos e valorizados', 'recognitionFeeling'], '0')),
        recognitionTypes: getVal(['formas de reconhecimento prefere', 'recognitionTypes']),
        elogioCanal: getVal(['elogiar e agradecer publicamente', 'elogioCanal']),
        legacy: parseInt(getVal(['deixar um legado', 'legacy'], '0')),
        mentorship: getVal(['programa estruturado de Mentoria', 'mentorship']),
        priorityActions: getVal(['faria mais diferença positiva', 'priorityActions']),
        communicationChange: getVal(['mudaria hoje na nossa comunicação', 'communicationChange']),
        vision40Years: getVal(['marca de 40 anos', 'vision40Years']),
      };
    });
  } catch (error) {
    console.error('Error fetching survey data:', error);
    throw error;
  }
}

export function processStats(
  data: SurveyResponse[], 
  selectedArea: string = 'Todas',
  startDate?: string,
  endDate?: string
): DashboardStats {
  // 1. First, filter by date for ALL calculations
  let dateFilteredData = [...data];
  
  if (startDate) {
    const start = new Date(startDate);
    dateFilteredData = dateFilteredData.filter(d => new Date(d.submittedAt) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    // Set end of day for end date
    end.setHours(23, 59, 59, 999);
    dateFilteredData = dateFilteredData.filter(d => new Date(d.submittedAt) <= end);
  }

  // 2. Then filter by area for specific metrics
  let filteredData = selectedArea === 'Todas' ? dateFilteredData : dateFilteredData.filter(d => d.area === selectedArea);

  const total = filteredData.length;
  const allAreas = Array.from(new Set(data.map(d => d.area)));

  if (total === 0) return {
    enpsScore: 0, 
    enpsDistribution: { promoters: 0, passives: 0, detractors: 0 },
    mentorshipInterest: 0, iaUsageHigh: 0, legacyMotivation: 0,
    areaEngagement: [], areaDistribution: [], iaUsageByArea: [],
    recognitionScore: 0,
    identificationScore: 0,
    leadershipScore: 0,
    safetyScore: 0,
    culturalSyncScore: 0,
    elogioInterest: 0,
    recognitionPreferences: [],
    iaFrequencyBreakdown: [],
    habits: { exercise: 0, hobbies: 0 }, testimonials: [], personalityTraits: [],
    leadershipSentiment: [], 
    priorityActions: PRIORIDADES_POSSIVEIS.slice(0, 4).map(action => ({
      action: action.replace(/\.$/, ''), // Remove o ponto final na interface
      count: 0
    })),
    infoSources: [],
    areas: allAreas,
    heatmap: [],
    comparisons: [],
    valuePerceptionRanking: [],
    communicationFeedback: [],
    visionFeedback: [],
    totalResponses: 0,
    crossInsights: {
      iaUsageVsEnps: [],
      exerciseVsEnps: [],
    }
  };

  const enpsScore = (Math.ceil(filteredData.reduce((acc, curr) => acc + curr.enps, 0) / total) / 10) * 100;
  
  // eNPS Distribution (keeping for context)
  const promoters = filteredData.filter(d => d.enps >= 9).length;
  const passives = filteredData.filter(d => d.enps >= 7 && d.enps <= 8).length;
  const detractors = filteredData.filter(d => d.enps <= 6).length;
  
  const enpsDistribution = {
    promoters: (promoters / total) * 100,
    passives: (passives / total) * 100,
    detractors: (detractors / total) * 100
  };

  const mentorshipInterest = (filteredData.filter(d => d.mentorship && d.mentorship.toLowerCase().includes('sim')).length / total) * 100;
  
  const iaUsageHigh = (filteredData.filter(d => d.iaFrequency && (d.iaFrequency.toLowerCase().includes('diariamente') || d.iaFrequency.toLowerCase().includes('semana'))).length / total) * 100;
  
  const legacyMotivation = (Math.ceil(filteredData.reduce((acc, curr) => acc + curr.legacy, 0) / total) / 5) * 100;

  // Area Engagement (calculated from date-filtered data)
  const areas = Array.from(new Set(data.map(d => d.area)));
  const areaEngagement = areas.map(area => {
    const areaData = dateFilteredData.filter(d => d.area === area);
    if (areaData.length === 0) return { area, score: 0 };
    const avg = areaData.reduce((acc, curr) => acc + curr.enps, 0) / areaData.length;
    const score = (Math.ceil(avg) / 10) * 100; // Scale 0-10 to 0-100%
    return { area, score };
  }).sort((a, b) => b.score - a.score);

  const areaDistribution = areas.map(area => {
    const areaData = dateFilteredData.filter(d => d.area === area);
    return { area, percentage: dateFilteredData.length > 0 ? (areaData.length / dateFilteredData.length) * 100 : 0 };
  }).sort((a, b) => b.percentage - a.percentage);

  const iaUsageByArea = areas.map(area => {
    const areaData = dateFilteredData.filter(d => d.area === area);
    const highUsage = areaData.filter(d => d.iaFrequency && (d.iaFrequency.includes('Diariamente') || d.iaFrequency.includes('Algumas vezes'))).length;
    return { area, percentage: areaData.length > 0 ? (highUsage / areaData.length) * 100 : 0 };
  }).sort((a, b) => b.percentage - a.percentage);

  // Calculate scores using average rounded up and converted to percentage
  const getPercentageScore = (field: keyof SurveyResponse, maxScale: number = 5) => {
    const sum = filteredData.reduce((acc, curr) => acc + (typeof curr[field] === 'number' ? (curr[field] as number) : 0), 0);
    const avg = sum / total;
    // For identification (1-10), map to 1-5 first if maxScale is 5
    let scaledAvg = avg;
    if (field === 'pillarsIdentification' && maxScale === 5) {
      scaledAvg = avg / 2;
    }
    return (Math.ceil(scaledAvg) / maxScale) * 100;
  };

  const recognitionScore = getPercentageScore('recognitionFeeling', 5);
  const identificationScore = getPercentageScore('pillarsIdentification', 5); // User said 0-5 scale
  const leadershipScore = getPercentageScore('managerExample', 5);
  const safetyScore = getPercentageScore('safeSpaceForErrors', 5);
  const culturalSyncScore = getPercentageScore('culturalSync', 5);
  const elogioInterest = (filteredData.filter(d => d.elogioCanal && d.elogioCanal.toLowerCase().includes('sim')).length / total) * 100;

  // Recognition Preferences
  const recMap: Record<string, number> = {};
  filteredData.forEach(d => {
    if (!d.recognitionTypes) return;
    
    RECONHECIMENTO_POSSIVEIS.forEach(rec => {
      if (d.recognitionTypes.includes(rec)) {
        recMap[rec] = (recMap[rec] || 0) + 1;
      }
    });
  });
  
  const recognitionPreferences = Object.entries(recMap)
    .map(([type, count]) => ({ type, percentage: (count / total) * 100 }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Agora pega o Top 5 em vez de apenas 2

  // IA Frequency Breakdown
  const iaMap: Record<string, number> = {};
  filteredData.forEach(d => {
    if (d.iaFrequency) iaMap[d.iaFrequency] = (iaMap[d.iaFrequency] || 0) + 1;
  });
  const iaFrequencyBreakdown = Object.entries(iaMap)
    .map(([label, count]) => ({ label, percentage: (count / total) * 100 }));

  // Habits
  const exerciseCount = filteredData.filter(d => d.exercise && d.exercise.toLowerCase().startsWith('sim')).length;
  const hobbiesCount = filteredData.filter(d => d.hobbies && d.hobbies.split(',').length >= 2).length;

  // Testimonials
  const testimonials = filteredData.slice(0, 6).map(d => ({
    text: d.testimonial,
    role: d.area
  }));

  // Personality Traits
  const traitMap: Record<string, number> = {};
  filteredData.forEach(d => {
    const traits = d.personality.split(',').map(t => t.trim());
    traits.forEach(t => {
      if (t) traitMap[t] = (traitMap[t] || 0) + 1;
    });
  });
  const personalityTraits = Object.entries(traitMap)
    .map(([trait, count]) => ({ trait, percentage: (count / total) * 100 }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Leadership Sentiment
  const leadMap: Record<string, number> = {};
  filteredData.forEach(d => {
    if (d.leadershipAmbassador) {
      const label = d.leadershipAmbassador.split('(')[0].trim();
      leadMap[label] = (leadMap[label] || 0) + 1;
    }
  });
  const leadershipSentiment = Object.entries(leadMap).map(([label, count]) => ({ label, value: count }));

  // Priority Actions
  const actionMap: Record<string, number> = {};
  filteredData.forEach(d => {
    if (!d.priorityActions) return;
    
    // Procura por cada frase exata dentro da resposta do usuário
    PRIORIDADES_POSSIVEIS.forEach(prioridade => {
      if (d.priorityActions.includes(prioridade)) {
        const labelLimpa = prioridade.replace(/\.$/, ''); // Remove o ponto final
        actionMap[labelLimpa] = (actionMap[labelLimpa] || 0) + 1;
      }
    });
  });
  
  const priorityActions = Object.entries(actionMap)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Info Sources
  const infoMap: Record<string, number> = {};
  filteredData.forEach(d => {
    if (d.infoSource) infoMap[d.infoSource] = (infoMap[d.infoSource] || 0) + 1;
  });
  const infoSources = Object.entries(infoMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  const valuePerceptionMap: Record<string, number> = {};
  filteredData.forEach(d => {
    if (d.valuePerception) valuePerceptionMap[d.valuePerception] = (valuePerceptionMap[d.valuePerception] || 0) + 1;
  });
  const valuePerceptionRanking = Object.entries(valuePerceptionMap)
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const communicationFeedback = filteredData.map(d => ({ area: d.area, text: d.communicationChange }));
  const visionFeedback = filteredData.map(d => ({ area: d.area, text: d.vision40Years }));

  // Heatmap Data (using date-filtered data)
  const heatmap = allAreas.map(area => {
    const areaData = dateFilteredData.filter(d => d.area === area);
    const aTotal = areaData.length;
    if (aTotal === 0) return { area, metrics: [] };

    const getAreaPercentage = (field: keyof SurveyResponse, maxScale: number = 5) => {
      const sum = areaData.reduce((acc, curr) => acc + (typeof curr[field] === 'number' ? (curr[field] as number) : 0), 0);
      const avg = sum / aTotal;
      let scaledAvg = avg;
      if (field === 'pillarsIdentification' && maxScale === 5) {
        scaledAvg = avg / 2;
      }
      return (Math.ceil(scaledAvg) / maxScale) * 100;
    };

    const aEnpsScore = (Math.ceil(areaData.reduce((acc, curr) => acc + curr.enps, 0) / aTotal) / 10) * 100;

    const metrics = [
      { label: 'Identificação', score: getAreaPercentage('pillarsIdentification', 5) },
      { label: 'Liderança', score: getAreaPercentage('managerExample', 5) },
      { label: 'Segurança', score: getAreaPercentage('safeSpaceForErrors', 5) },
      { label: 'Reconhecimento', score: getAreaPercentage('recognitionFeeling', 5) },
      { label: 'eNPS', score: aEnpsScore }, // 0-100%
    ];

    return {
      area,
      metrics: metrics.map(m => ({
        ...m,
        color: m.score >= 75 ? '#049C7A' : m.score >= 50 ? '#F27D26' : '#E84F3D'
      }))
    };
  });

  // Comparisons Data (using date-filtered data)
  const comparisons = allAreas.map(area => {
    const areaData = dateFilteredData.filter(d => d.area === area);
    const aTotal = areaData.length;
    
    // Calculate top priority action for this area
    const areaActionMap: Record<string, number> = {};
    areaData.forEach(d => {
      if (!d.priorityActions) return;
      PRIORIDADES_POSSIVEIS.forEach(prioridade => {
        if (d.priorityActions.includes(prioridade)) {
           const labelLimpa = prioridade.replace(/\.$/, '');
           areaActionMap[labelLimpa] = (areaActionMap[labelLimpa] || 0) + 1;
        }
      });
    });
    const topAction = Object.entries(areaActionMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const getAreaPercentage = (field: keyof SurveyResponse, maxScale: number = 5) => {
      if (aTotal === 0) return 0;
      const sum = areaData.reduce((acc, curr) => acc + (typeof curr[field] === 'number' ? (curr[field] as number) : 0), 0);
      const avg = sum / aTotal;
      let scaledAvg = avg;
      if (field === 'pillarsIdentification' && maxScale === 5) {
        scaledAvg = avg / 2;
      }
      return (Math.ceil(scaledAvg) / maxScale) * 100;
    };

    const aEnpsScore = aTotal > 0 ? (Math.ceil(areaData.reduce((acc, curr) => acc + curr.enps, 0) / aTotal) / 10) * 100 : 0;
    const aPromoters = areaData.filter(d => d.enps >= 9).length;
    const aPassives = areaData.filter(d => d.enps >= 7 && d.enps <= 8).length;
    const aDetractors = areaData.filter(d => d.enps <= 6).length;

    return {
      area,
      enps: aEnpsScore,
      enpsDistribution: {
        promoters: aTotal > 0 ? (aPromoters / aTotal) * 100 : 0,
        passives: aTotal > 0 ? (aPassives / aTotal) * 100 : 0,
        detractors: aTotal > 0 ? (aDetractors / aTotal) * 100 : 0
      },
      seguranca: getAreaPercentage('safeSpaceForErrors', 5),
      lideranca: getAreaPercentage('managerExample', 5),
      identificacao: getAreaPercentage('pillarsIdentification', 5),
      reconhecimento: getAreaPercentage('recognitionFeeling', 5),
      topPriorityAction: topAction,
      iaUsage: aTotal > 0 ? (areaData.filter(d => d.iaFrequency && (d.iaFrequency.toLowerCase().includes('diariamente') || d.iaFrequency.toLowerCase().includes('semana'))).length / aTotal) * 100 : 0,
      mentorshipInterest: aTotal > 0 ? (areaData.filter(d => d.mentorship && d.mentorship.toLowerCase().includes('sim')).length / aTotal) * 100 : 0,
    };
  });

  return {
    enpsScore,
    enpsDistribution,
    mentorshipInterest,
    iaUsageHigh,
    legacyMotivation,
    areaEngagement,
    areaDistribution,
    iaUsageByArea,
    recognitionScore,
    identificationScore,
    leadershipScore,
    safetyScore,
    culturalSyncScore,
    elogioInterest,
    recognitionPreferences,
    iaFrequencyBreakdown,
    habits: {
      exercise: (exerciseCount / total) * 100,
      hobbies: (hobbiesCount / total) * 100,
    },
    testimonials,
    personalityTraits,
    leadershipSentiment,
    priorityActions,
    infoSources,
    valuePerceptionRanking,
    communicationFeedback,
    visionFeedback,
    areas: allAreas,
    heatmap,
    comparisons,
    totalResponses: total,
    crossInsights: {
      iaUsageVsEnps: Array.from(new Set(filteredData.map(d => d.iaFrequency))).map(label => {
        const group = filteredData.filter(d => d.iaFrequency === label);
        const gAvg = group.reduce((acc, curr) => acc + curr.enps, 0) / group.length;
        const gEnps = (Math.ceil(gAvg) / 10) * 100;
        return { label, enps: group.length > 0 ? gEnps : 0 };
      }).sort((a, b) => b.enps - a.enps),
      exerciseVsEnps: Array.from(new Set(filteredData.map(d => d.exercise))).map(label => {
        const group = filteredData.filter(d => d.exercise === label);
        const gAvg = group.reduce((acc, curr) => acc + curr.enps, 0) / group.length;
        const gEnps = (Math.ceil(gAvg) / 10) * 100;
        return { label, enps: group.length > 0 ? gEnps : 0 };
      }).sort((a, b) => b.enps - a.enps),
    }
  };
}
