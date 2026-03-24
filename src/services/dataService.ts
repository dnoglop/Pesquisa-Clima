import Papa from 'papaparse';
import { SurveyResponse, DashboardStats } from '../types';

const API_URL = '/api/survey-data';

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

    return rows.map((row: any) => ({
      submissionId: String(row['Submission ID'] || row['submissionId'] || ''),
      respondentId: String(row['Respondent ID'] || row['respondentId'] || ''),
      submittedAt: String(row['Submitted at'] || row['submittedAt'] || ''),
      area: String(row['Em qual grupo de área você atua hoje?'] || row['area'] || ''),
      hobbies: String(row['Quais são os seus hobbies no tempo livre? (selecione até 3)'] || row['hobbies'] || ''),
      exercise: String(row['Pratica exercício físico?'] || row['exercise'] || ''),
      infoSource: String(row['Onde se informa mais sobre as notícias do dia?'] || row['infoSource'] || ''),
      iaFrequency: String(row['Com que frequência utiliza ferramentas de IA (como Gemini) no seu dia a dia?'] || row['iaFrequency'] || ''),
      personality: String(row['Se a nossa empresa fosse uma pessoa, quais adjetivos melhor a descreveriam? (selecione até 3)'] || row['personality'] || ''),
      valuePerception: String(row['Qual destas frases melhor define o que fazemos aqui hoje?'] || row['valuePerception'] || ''),
      pillarsIdentification: parseInt(String(row['Conheço, entendo e identifico-me com os pilares da Consistem (Relacionamento, comprometimento, qualidade, evolução e transparência)'] || row['pillarsIdentification'] || '0')),
      culturalSync: parseInt(String(row['O que comunicamos (nos nossos canais) aos clientes externamente é exatamente o que vivemos aqui dentro.'] || row['culturalSync'] || '0')),
      testimonial: String(row['Se um amigo te perguntasse "Como é trabalhar aí?", o que você diria honestamente nos primeiros 10 segundos?'] || row['testimonial'] || ''),
      managerExample: parseInt(String(row['O meu gestor direto age como um exemplo prático da cultura e dos valores da Consistem.'] || row['managerExample'] || '0')),
      leadershipAmbassador: String(row['Você sente que as lideranças (como um todo) atuam como embaixadoras da marca ou como crítica da marca diante das equipes?'] || row['leadershipAmbassador'] || ''),
      psychologicalSafety: parseInt(String(row['Sinto segurança na minha equipe para dar opiniões, propor ideias e inovar.'] || row['psychologicalSafety'] || '0')),
      safeSpaceForErrors: parseInt(String(row['O quanto você sente que temos "espaço seguro" para admitir erros sem que isso vire um julgamento pessoal?'] || row['safeSpaceForErrors'] || '0')),
      enps: parseInt(String(row['De 0 a 10, o quanto você recomendaria a Consistem como um excelente lugar para se trabalhar a um amigo ou familiar?'] || row['enps'] || '0')),
      recognitionFeeling: parseInt(String(row['Sinto que o meu trabalho e o meu esforço diário são reconhecidos e valorizados pela empresa.'] || row['recognitionFeeling'] || '0')),
      recognitionTypes: String(row['Que formas de reconhecimento prefere? (Selecione até 2)'] || row['recognitionTypes'] || ''),
      elogioCanal: String(row['Gostaria de ter um canal oficial e aberto para elogiar e agradecer publicamente aos colegas de trabalho que me ajudam.'] || row['elogioCanal'] || ''),
      legacy: parseInt(String(row['Eu me sinto motivado(a) a documentar e partilhar os meus conhecimentos e processos com o restante da empresa para deixar um legado.'] || row['legacy'] || '0')),
      mentorship: String(row['Teria muito interesse em participar num programa estruturado de Mentoria (seja para aprender com os mais experientes ou para ensinar).'] || row['mentorship'] || ''),
      priorityActions: String(row['Pensando no que faria mais diferença positiva no seu dia a dia hoje, quais destas ações gostaria de ver a Consistem a lançar primeiro?'] || row['priorityActions'] || ''),
      communicationChange: String(row['O que você mudaria hoje na nossa comunicação para que ela parecesse mais "a nossa cara"?'] || row['communicationChange'] || ''),
      vision40Years: String(row['Pensando na nossa marca de 40 anos, o que você acredita que a Consistem precisa começar a fazer HOJE para ser uma empresa ainda melhor nas próximas décadas?'] || row['vision40Years'] || ''),
    }));
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
  let filteredData = selectedArea === 'Todas' ? data : data.filter(d => d.area === selectedArea);
  
  if (startDate) {
    const start = new Date(startDate);
    filteredData = filteredData.filter(d => new Date(d.submittedAt) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    // Set end of day for end date
    end.setHours(23, 59, 59, 999);
    filteredData = filteredData.filter(d => new Date(d.submittedAt) <= end);
  }

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
    leadershipSentiment: [], priorityActions: [], infoSources: [],
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

  const promoters = filteredData.filter(d => d.enps >= 9).length;
  const passives = filteredData.filter(d => d.enps >= 7 && d.enps <= 8).length;
  const detractors = filteredData.filter(d => d.enps <= 6).length;
  
  const enpsScore = ((promoters - detractors) / total) * 100;
  
  // eNPS Distribution
  const enpsDistribution = {
    promoters: (promoters / total) * 100,
    passives: (passives / total) * 100,
    detractors: (detractors / total) * 100
  };

  const mentorshipInterest = (filteredData.filter(d => d.mentorship && d.mentorship.toLowerCase().includes('sim')).length / total) * 100;
  
  const iaUsageHigh = (filteredData.filter(d => d.iaFrequency && (d.iaFrequency.includes('Diariamente') || d.iaFrequency.includes('Algumas vezes'))).length / total) * 100;
  
  const legacyMotivation = filteredData.reduce((acc, curr) => acc + curr.legacy, 0) / total;

  // Area Engagement (always calculated from full data for comparison)
  const areas = Array.from(new Set(data.map(d => d.area)));
  const areaEngagement = areas.map(area => {
    const areaData = data.filter(d => d.area === area);
    const score = areaData.reduce((acc, curr) => acc + curr.enps, 0) / areaData.length;
    return { area, score };
  }).sort((a, b) => b.score - a.score);

  const areaDistribution = areas.map(area => {
    const areaData = data.filter(d => d.area === area);
    return { area, percentage: (areaData.length / data.length) * 100 };
  }).sort((a, b) => b.percentage - a.percentage);

  const iaUsageByArea = areas.map(area => {
    const areaData = data.filter(d => d.area === area);
    const highUsage = areaData.filter(d => d.iaFrequency && (d.iaFrequency.includes('Diariamente') || d.iaFrequency.includes('Algumas vezes'))).length;
    return { area, percentage: areaData.length > 0 ? (highUsage / areaData.length) * 100 : 0 };
  }).sort((a, b) => b.percentage - a.percentage);

  const recognitionScore = filteredData.reduce((acc, curr) => acc + curr.recognitionFeeling, 0) / total;
  const identificationScore = filteredData.reduce((acc, curr) => acc + curr.pillarsIdentification, 0) / total;
  const leadershipScore = filteredData.reduce((acc, curr) => acc + curr.managerExample, 0) / total;
  const safetyScore = filteredData.reduce((acc, curr) => acc + curr.safeSpaceForErrors, 0) / total;
  const culturalSyncScore = filteredData.reduce((acc, curr) => acc + curr.culturalSync, 0) / total;
  const elogioInterest = (filteredData.filter(d => d.elogioCanal && d.elogioCanal.toLowerCase().includes('sim')).length / total) * 100;

  // Recognition Preferences
  const recMap: Record<string, number> = {};
  filteredData.forEach(d => {
    const types = d.recognitionTypes.split(',').map(t => t.trim());
    types.forEach(t => {
      if (t) recMap[t] = (recMap[t] || 0) + 1;
    });
  });
  const recognitionPreferences = Object.entries(recMap)
    .map(([type, count]) => ({ type, percentage: (count / total) * 100 }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 2);

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
    const actions = d.priorityActions.split(',').map(a => a.trim());
    actions.forEach(a => {
      if (a) actionMap[a] = (actionMap[a] || 0) + 1;
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

  // Heatmap Data
  const heatmap = allAreas.map(area => {
    const areaData = data.filter(d => d.area === area);
    const aTotal = areaData.length;
    if (aTotal === 0) return { area, metrics: [] };

    const metrics = [
      { label: 'Identificação', score: areaData.reduce((acc, curr) => acc + curr.pillarsIdentification, 0) / aTotal },
      { label: 'Liderança', score: areaData.reduce((acc, curr) => acc + curr.managerExample, 0) / aTotal },
      { label: 'Segurança', score: areaData.reduce((acc, curr) => acc + curr.psychologicalSafety, 0) / aTotal },
      { label: 'Reconhecimento', score: areaData.reduce((acc, curr) => acc + curr.recognitionFeeling, 0) / aTotal },
      { label: 'eNPS', score: areaData.reduce((acc, curr) => acc + curr.enps, 0) / aTotal },
    ];

    return {
      area,
      metrics: metrics.map(m => ({
        ...m,
        color: m.score >= 8.5 ? '#049C7A' : m.score >= 7 ? '#F27D26' : '#E84F3D'
      }))
    };
  });

  // Comparisons Data
  const comparisons = allAreas.map(area => {
    const areaData = data.filter(d => d.area === area);
    const aTotal = areaData.length;
    
    // Calculate top priority action for this area
    const areaActionMap: Record<string, number> = {};
    areaData.forEach(d => {
      const actions = d.priorityActions.split(',').map(a => a.trim());
      actions.forEach(a => { if (a) areaActionMap[a] = (areaActionMap[a] || 0) + 1; });
    });
    const topAction = Object.entries(areaActionMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const aPromoters = areaData.filter(d => d.enps >= 9).length;
    const aPassives = areaData.filter(d => d.enps >= 7 && d.enps <= 8).length;
    const aDetractors = areaData.filter(d => d.enps <= 6).length;

    const aEnpsScore = aTotal > 0 ? ((aPromoters - aDetractors) / aTotal) * 100 : 0;

    return {
      area,
      enps: aEnpsScore,
      enpsDistribution: {
        promoters: aTotal > 0 ? (aPromoters / aTotal) * 100 : 0,
        passives: aTotal > 0 ? (aPassives / aTotal) * 100 : 0,
        detractors: aTotal > 0 ? (aDetractors / aTotal) * 100 : 0
      },
      seguranca: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.psychologicalSafety, 0) / aTotal : 0,
      lideranca: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.managerExample, 0) / aTotal : 0,
      identificacao: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.pillarsIdentification, 0) / aTotal : 0,
      reconhecimento: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.recognitionFeeling, 0) / aTotal : 0,
      topPriorityAction: topAction,
      iaUsage: aTotal > 0 ? (areaData.filter(d => d.iaFrequency && (d.iaFrequency.includes('Diariamente') || d.iaFrequency.includes('Algumas vezes'))).length / aTotal) * 100 : 0,
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
        const gPromoters = group.filter(d => d.enps >= 9).length;
        const gDetractors = group.filter(d => d.enps <= 6).length;
        return { label, enps: group.length > 0 ? ((gPromoters - gDetractors) / group.length) * 100 : 0 };
      }).sort((a, b) => b.enps - a.enps),
      exerciseVsEnps: Array.from(new Set(filteredData.map(d => d.exercise))).map(label => {
        const group = filteredData.filter(d => d.exercise === label);
        const gPromoters = group.filter(d => d.enps >= 9).length;
        const gDetractors = group.filter(d => d.enps <= 6).length;
        return { label, enps: group.length > 0 ? ((gPromoters - gDetractors) / group.length) * 100 : 0 };
      }).sort((a, b) => b.enps - a.enps),
    }
  };
}
