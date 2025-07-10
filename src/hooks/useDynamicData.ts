import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import {
    getWeatherData,
    getInterviewNews,
    getJobMarketData,
    getMotivationalQuote,
    getTrendingTopics,
    type WeatherData,
    type NewsItem,
    type JobMarketData
} from "@/lib/publicApis";

export const useDynamicData = () => {
    // Backend data
    const interviewerStats = useQuery(api.interviews.getInterviewerStats);
    const candidateStats = useQuery(api.interviews.getCandidateStats);
    const recentActivity = useQuery(api.interviews.getRecentActivity);
    const performance = useQuery(api.interviews.getInterviewerPerformance);
    const interviewTips = useQuery(api.interviews.getInterviewTips);
    const interviewResources = useQuery(api.interviews.getInterviewResources);
    const marketInsights = useQuery(api.interviews.getMarketInsights);

    // Public API data
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [jobMarketData, setJobMarketData] = useState<JobMarketData | null>(null);
    const [motivationalQuote, setMotivationalQuote] = useState<{ quote: string; author: string } | null>(null);
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [isLoadingPublicData, setIsLoadingPublicData] = useState(true);

    // Fetch public API data
    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const [weather, news, jobMarket, quote, topics] = await Promise.all([
                    getWeatherData(),
                    getInterviewNews(),
                    getJobMarketData(),
                    getMotivationalQuote(),
                    getTrendingTopics(),
                ]);

                setWeatherData(weather);
                setNewsData(news);
                setJobMarketData(jobMarket);
                setMotivationalQuote(quote);
                setTrendingTopics(topics);
            } catch (error) {
                console.error("Error fetching public data:", error);
            } finally {
                setIsLoadingPublicData(false);
            }
        };

        fetchPublicData();
    }, []);

    // Calculate derived statistics
    const getDerivedStats = () => {
        if (!interviewerStats) return null;

        const totalInterviews = interviewerStats.totalInterviews;
        const completedInterviews = interviewerStats.completedInterviews;
        const candidatesEvaluated = interviewerStats.candidatesEvaluated || interviewerStats.completedInterviews;
        const successRate = totalInterviews > 0 ? (candidatesEvaluated / totalInterviews) * 100 : 0;

        return {
            successRate: Math.round(successRate),
            efficiencyScore: Math.round((parseFloat(interviewerStats.avgRating) * 20) + (successRate * 0.5)),
            weeklyGrowth: interviewerStats.thisWeekInterviews > 0 ? "+" + interviewerStats.thisWeekInterviews : "0",
        };
    };

    // Get personalized insights
    const getPersonalizedInsights = () => {
        if (!interviewerStats || !performance) return [];

        const insights = [];

        if (parseFloat(interviewerStats.avgRating) < 3.5) {
            insights.push({
                type: "warning",
                message: "Consider improving your feedback quality to increase candidate satisfaction",
                action: "Review feedback guidelines",
            });
        }

        if (performance.avgInterviewTime > 60) {
            insights.push({
                type: "info",
                message: "Your interviews are running longer than average. Consider optimizing your process",
                action: "View time management tips",
            });
        }

        if (interviewerStats.pendingReviews > 5) {
            insights.push({
                type: "alert",
                message: "You have several pending reviews. Timely feedback improves candidate experience",
                action: "Complete pending reviews",
            });
        }

        return insights;
    };

    // Get market comparison data
    const getMarketComparison = () => {
        if (!performance || !marketInsights) return null;

        return {
            avgInterviewTime: {
                yours: performance.avgInterviewTime,
                market: marketInsights.averageInterviewDuration,
                difference: performance.avgInterviewTime - marketInsights.averageInterviewDuration,
            },
            totalInterviews: {
                yours: interviewerStats?.totalInterviews || 0,
                market: marketInsights.totalInterviewsThisWeek,
                percentage: interviewerStats ? (interviewerStats.totalInterviews / marketInsights.totalInterviewsThisWeek) * 100 : 0,
            },
        };
    };

    return {
        // Backend data
        interviewerStats,
        candidateStats,
        recentActivity,
        performance,
        interviewTips,
        interviewResources,
        marketInsights,

        // Public API data
        weatherData,
        newsData,
        jobMarketData,
        motivationalQuote,
        trendingTopics,
        isLoadingPublicData,

        // Derived data
        derivedStats: getDerivedStats(),
        personalizedInsights: getPersonalizedInsights(),
        marketComparison: getMarketComparison(),

        // Loading states
        isLoading: !interviewerStats || !candidateStats || isLoadingPublicData,
    };
}; 