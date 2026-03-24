import Papa from 'papaparse';
import { SurveyResponse, DashboardStats } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uAUb9NnJe9JNFu-FqY1tOmIcQFjJZNACLsOHHufBU7w/export?format=csv';

export async function fetchSurveyData(): Promise<SurveyResponse[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row: any) => ({
          submissionId: row['Submission ID'],
          respondentId: row['Respondent ID'],
          submittedAt: row['Submitted at'],
          area: row['Em qual grupo de área você atua hoje?'],
          hobbies: row['Quais são os seus hobbies no tempo livre? (selecione até 3)'],
          exercise: row['Pratica exercício físico?'],
          infoSource: row['Onde se informa mais sobre as notícias do dia?'],
          iaFrequency: row['Com que frequência utiliza ferramentas de IA (como Gemini) no seu dia a dia?'],
          personality: row['Se a nossa empresa fosse uma pessoa, quais adjetivos melhor a descreveriam? (selecione até 3)'],
          valuePerception: row['Qual destas frases melhor define o que fazemos aqui hoje?'],
          pillarsIdentification: parseInt(row['Conheço, entendo e identifico-me com os pilares da Consistem (Relacionamento, comprometimento, qualidade, evolução e transparência)']),
          culturalSync: parseInt(row['O que comunicamos (nos nossos canais) aos clientes externamente é exatamente o que vivemos aqui dentro.']),
          testimonial: row['Se um amigo te perguntasse "Como é trabalhar aí?", o que você diria honestamente nos primeiros 10 segundos?'],
          managerExample: parseInt(row['O meu gestor direto age como um exemplo prático da cultura e dos valores da Consistem.']),
          leadershipAmbassador: row['Você sente que as lideranças (como um todo) atuam como embaixadoras da marca ou como crítica da marca diante das equipes?'],
          psychologicalSafety: parseInt(row['Sinto segurança na minha equipe para dar opiniões, propor ideias e inovar.']),
          safeSpaceForErrors: parseInt(row['O quanto você sente que temos "espaço seguro" para admitir erros sem que isso vire um julgamento pessoal?']),
          enps: parseInt(row['De 0 a 10, o quanto você recomendaria a Consistem como um excelente lugar para se trabalhar a um amigo ou familiar?']),
          recognitionFeeling: parseInt(row['Sinto que o meu trabalho e o meu esforço diário são reconhecidos e valorizados pela empresa.']),
          recognitionTypes: row['Que formas de reconhecimento prefere? (Selecione até 2)'],
          elogioCanal: row['Gostaria de ter um canal oficial e aberto para elogiar e agradecer publicamente aos colegas de trabalho que me ajudam.'],
          legacy: parseInt(row['Eu me sinto motivado(a) a documentar e partilhar os meus conhecimentos e processos com o restante da empresa para deixar um legado.']),
          mentorship: row['Teria muito interesse em participar num programa estruturado de Mentoria (seja para aprender com os mais experientes ou para ensinar).'],
          priorityActions: row['Pensando no que faria mais diferença positiva no seu dia a dia hoje, quais destas ações gostaria de ver a Consistem a lançar primeiro?'],
          communicationChange: row['O que você mudaria hoje na nossa comunicação para que ela parecesse mais "a nossa cara"?'],
          vision40Years: row['Pensando na nossa marca de 40 anos, o que você acredita que a Consistem precisa começar a fazer HOJE para ser uma empresa ainda melhor nas próximas décadas?'],
        }));
        resolve(data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
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
    totalResponses: 0
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
    return {
      area,
      enps: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.enps, 0) / aTotal : 0,
      seguranca: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.psychologicalSafety, 0) / aTotal : 0,
      lideranca: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.managerExample, 0) / aTotal : 0,
      identificacao: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.pillarsIdentification, 0) / aTotal : 0,
      reconhecimento: aTotal > 0 ? areaData.reduce((acc, curr) => acc + curr.recognitionFeeling, 0) / aTotal : 0,
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
    totalResponses: total
  };
}
