'use client';

import { useState, useEffect } from 'react';
import { wellbeingService, WellbeingMetrics, WeeklyAnalytics, DailyScore } from '../../services/wellbeingService';

interface TrendIndicatorProps {
  trend: 'improving' | 'declining' | 'stable';
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend }) => {
  const getIcon = () => {
    switch (trend) {
      case 'improving':
        return '↗️';
      case 'declining':
        return '↘️';
      default:
        return '→';
    }
  };

  const getColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <span className={`${getColor()} font-bold`}>
      {getIcon()} {trend}
    </span>
  );
};

export default function WellbeingScore() {
  const [metrics] = useState<string[]>([
    'Mood',
    'Anxiety',
    'Sleep',
    'Energy',
    'Social Connection'
  ]);

  const [weeklyAnalytics, setWeeklyAnalytics] = useState<WeeklyAnalytics>({
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    moodTrend: 'stable',
    totalExercises: 0
  });

  const [monthlyScores, setMonthlyScores] = useState<DailyScore[]>([]);
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentMetric, setCurrentMetric] = useState<string>(metrics[0]);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const weekly = await wellbeingService.getWeeklyAnalytics();
    const monthly = await wellbeingService.getMonthlyScores();
    setWeeklyAnalytics(weekly);
    setMonthlyScores(monthly);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderMonthlyChart = () => {
    const maxHeight = 150;
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Progress</h3>
        <div className="flex items-end space-x-2 h-[150px]">
          {monthlyScores.slice(-30).map((score, index) => {
            const height = Math.max(20, score.overallScore * maxHeight);
            return (
              <div
                key={score.date}
                className="flex-1 group relative"
                style={{ height: `${height}px` }}
              >
                <div
                  className={`w-full h-full ${
                    score.overallScore >= 0.8 ? 'bg-green-500' :
                    score.overallScore >= 0.6 ? 'bg-blue-500' :
                    score.overallScore >= 0.4 ? 'bg-yellow-500' :
                    'bg-red-500'
                  } rounded-t`}
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {new Date(score.date).toLocaleDateString()}: {Math.round(score.overallScore * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeeklyStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Overview</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            Average Score: <span className={getScoreColor(weeklyAnalytics.averageScore)}>
              {Math.round(weeklyAnalytics.averageScore * 100)}%
            </span>
          </p>
          <p className="text-gray-700">
            Highest Score: <span className="text-green-600">
              {Math.round(weeklyAnalytics.highestScore * 100)}%
            </span>
          </p>
          <p className="text-gray-700">
            Lowest Score: <span className={getScoreColor(weeklyAnalytics.lowestScore)}>
              {Math.round(weeklyAnalytics.lowestScore * 100)}%
            </span>
          </p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Insights</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            Mood Trend: <TrendIndicator trend={weeklyAnalytics.moodTrend} />
          </p>
          <p className="text-gray-700">
            Breathing Sessions: <span className="text-blue-600 font-semibold">
              {weeklyAnalytics.totalExercises}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Wellbeing Score</h2>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((viewOption) => (
            <button
              key={viewOption}
              onClick={() => setView(viewOption)}
              className={`px-4 py-2 rounded-lg ${
                view === viewOption
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view === 'daily' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {metrics.map((metric) => (
              <button
                key={metric}
                onClick={() => setCurrentMetric(metric)}
                className={`p-4 rounded-lg transition-all ${
                  currentMetric === metric
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Score</h3>
              <div className={`text-3xl font-bold ${getScoreColor(scores[currentMetric])}`}>
                {Math.round(scores[currentMetric] * 100)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  scores[currentMetric] >= 0.8 ? 'bg-green-600' :
                  scores[currentMetric] >= 0.6 ? 'bg-blue-600' :
                  scores[currentMetric] >= 0.4 ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${scores[currentMetric] * 100}%` }}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Mood',
                score: scores[currentMetric],
                description: 'Based on your mood tracking'
              },
              {
                name: 'Journal',
                score: scores['Anxiety'],
                description: 'Based on your journal entries'
              },
              {
                name: 'Chat',
                score: scores['Sleep'],
                description: 'Based on your conversations'
              }
            ].map((category) => (
              <div
                key={category.name}
                className="border-2 border-gray-100 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h4>
                  <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                    {Math.round(category.score * 100)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'weekly' && renderWeeklyStats()}
      {view === 'monthly' && renderMonthlyChart()}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Understanding Your Score
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>Scores are calculated based on your mood tracking, journal entries, chat interactions, and breathing exercises</li>
          <li>Higher scores indicate better overall wellbeing</li>
          <li>Scores update automatically as you use different features of the app</li>
          <li>Try to maintain a balanced routine using various features for the best results</li>
        </ul>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>

      <p className="text-gray-600 mt-4">
        Let&apos;s track how you&apos;re feeling to better understand your wellbeing journey.
      </p>
    </div>
  );
} 