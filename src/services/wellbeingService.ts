export interface WeeklyAnalytics {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  totalExercises: number;
}

export interface DailyScore {
  date: string;
  overallScore: number;
}

class WellbeingService {
  async getWeeklyAnalytics(): Promise<WeeklyAnalytics> {
    // Mock data
    return {
      averageScore: 0.75,
      highestScore: 0.9,
      lowestScore: 0.6,
      moodTrend: 'improving',
      totalExercises: 5
    };
  }

  async getMonthlyScores(): Promise<DailyScore[]> {
    // Mock data - last 30 days
    const scores: DailyScore[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      scores.push({
        date: date.toISOString(),
        overallScore: 0.5 + Math.random() * 0.5 // Random score between 0.5 and 1
      });
    }
    return scores;
  }
}

export const wellbeingService = new WellbeingService(); 