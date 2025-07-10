export interface WeatherData {
    temperature: number;
    condition: string;
    location: string;
}

export interface NewsItem {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: string;
}

export interface JobMarketData {
    totalJobs: number;
    averageSalary: number;
    topSkills: string[];
    trendingRoles: string[];
}

// Weather data for Ahmedabad, India using OpenWeatherMap API
export const getWeatherData = async (): Promise<WeatherData> => {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!API_KEY) {
            throw new Error("OpenWeatherMap API key not found");
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad,IN&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            location: `${data.name}, ${data.sys.country}`,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Fallback to simulated data
        return {
            temperature: 32,
            condition: "Partly Cloudy",
            location: "Ahmedabad, India",
        };
    }
};

// News data focused on Indian tech industry and interviews using NewsAPI
// IMPORTANT: NewsAPI requires an API key and has usage limits on its free tier.
// Ensure NEXT_PUBLIC_NEWSAPI_KEY is set in your environment variables.
export const getInterviewNews = async (): Promise<NewsItem[]> => {
    try {
        const API_KEY = process.env.NEXT_PUBLIC_NEWSAPI_KEY;

        if (!API_KEY) {
            console.warn("NewsAPI key not found. Using simulated news data.");
            throw new Error("NewsAPI key not found");
        }

        // Searching for interview preparation or tech hiring in India
        // Increased pageSize for potentially more relevant articles
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=interview+preparation+india+OR+tech+hiring+india+OR+software+jobs+india&language=en&sortBy=relevancy&pageSize=7&apiKey=${API_KEY}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`News API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            return data.articles.map((article: any) => ({
                title: article.title,
                description: article.description || "No description available",
                url: article.url,
                publishedAt: article.publishedAt,
                source: article.source.name,
            }));
        } else {
            console.warn("NewsAPI returned no articles. Using simulated news data.");
            throw new Error("No articles found from NewsAPI");
        }
    } catch (error) {
        console.error("Error fetching news data:", error);
        // Fallback to simulated data with varied content
        return [
            {
                title: "Top 5 AI Tools for Interview Preparation in 2025",
                description: "Discover how AI-powered platforms are transforming the way job seekers prepare for technical and behavioral interviews in India.",
                url: "https://example.com/ai-interview-tools",
                publishedAt: "2025-07-09T14:00:00Z",
                source: "TechPulse",
            },
            {
                title: "Indian IT Sector Sees Surge in Cloud Computing Roles",
                description: "Demand for cloud architects and engineers is skyrocketing across major Indian tech hubs, driven by digital transformation initiatives.",
                url: "https://example.com/cloud-jobs-india",
                publishedAt: "2025-07-08T11:45:00Z",
                source: "BusinessInsider India",
            },
            {
                title: "Mastering Data Structures and Algorithms for FAANG Interviews",
                description: "An in-depth guide to excelling in DSA rounds, crucial for securing positions at top-tier product-based companies in India.",
                url: "https://example.com/dsa-mastery",
                publishedAt: "2025-07-07T17:00:00Z",
                source: "GeeksForGeeks News",
            },
            {
                title: "Remote Work vs. Office Return: Impact on Indian Tech Hiring",
                description: "A look at how major companies are balancing remote, hybrid, and in-office models, and what it means for job applicants.",
                url: "https://example.com/remote-hybrid-hiring",
                publishedAt: "2025-07-06T09:30:00Z",
                source: "The Times of India Tech",
            },
        ];
    }
};

// Simulated job market data for India
// NOTE: Real-world, comprehensive, and free job market APIs are not readily available.
// This function provides dynamic, simulated data based on common industry characteristics.
export const getJobMarketData = async (): Promise<JobMarketData> => {
    try {
        // Simulate a slight variation in data for a more "live" feel
        const totalJobs = Math.floor(Math.random() * (55000 - 45000 + 1)) + 45000; // Between 45k and 55k
        // Average salary in INR (e.g., 8.5 Lakhs to 9.5 Lakhs per annum)
        const averageSalary = Math.floor(Math.random() * (950000 - 850000 + 1)) + 850000;

        const commonSkills = [
            'Java', 'Python', 'React', 'Node.js', 'AWS', 'Azure', 'GCP',
            'Docker', 'Kubernetes', 'Machine Learning', 'Data Science', 'SQL',
            'NoSQL', 'DevOps', 'Cybersecurity', 'JavaScript', 'TypeScript', 'Spring Boot'
        ];
        const commonRoles = [
            'Software Developer', 'Full Stack Engineer', 'DevOps Engineer',
            'Data Scientist', 'Cloud Engineer', 'Backend Developer',
            'Frontend Developer', 'AI/ML Engineer', 'Product Manager',
            'Solutions Architect'
        ];

        // Randomly select a subset of top skills and trending roles
        const topSkills = [...commonSkills].sort(() => 0.5 - Math.random()).slice(0, 6 + Math.floor(Math.random() * 3));
        const trendingRoles = [...commonRoles].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 2));

        return {
            totalJobs,
            averageSalary,
            topSkills,
            trendingRoles,
        };
    } catch (error) {
        console.error('Error simulating job market data:', error);
        // Fallback to static simulated data if dynamic simulation fails (unlikely)
        return {
            totalJobs: 48000,
            averageSalary: 900000,
            topSkills: ['Python', 'Java', 'React', 'AWS', 'Machine Learning', 'DevOps', 'Cloud', 'SQL'],
            trendingRoles: ['Full Stack Developer', 'Data Scientist', 'Cloud Engineer', 'DevOps Engineer'],
        };
    }
};

// Get motivational quotes (using Quotable API - free, no key needed for basic usage)
// Docs: https://github.com/lukePeavey/quotable
export const getMotivationalQuote = async (): Promise<{ quote: string; author: string }> => {
    try {
        // Fetch a random quote. Can also add tags like: `https://api.quotable.io/random?tags=inspirational|motivation`
        const response = await fetch('https://api.quotable.io/random');

        if (!response.ok) {
            throw new Error(`Quotable API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        // The API returns a single quote object for the /random endpoint
        return {
            quote: data.content,
            author: data.author
        };
    } catch (error) {
        console.error("Error fetching motivational quote:", error);
        // Fallback to static quotes
        const quotes = [
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return randomQuote;
    }
};

// Get trending topics based on recent news and job market data
// Relies on NewsAPI (if key is available) and robust hardcoded keywords.
export const getTrendingTopics = async (): Promise<string[]> => {
    const defaultTrendingTopics = [
        "Artificial Intelligence", "Machine Learning", "Cloud Computing",
        "DevOps", "Cybersecurity", "Data Science", "Full Stack Development",
        "Remote Work", "Hiring Trends India", "Interview Preparation",
        "System Design", "Behavioral Interviewing", "Microservices",
        "Blockchain", "Web3", "Product Management", "Generative AI",
        "Prompt Engineering", "Sustainable Tech", "Tech Layoffs Impact",
        "Upskilling & Reskilling", "Gig Economy Tech", "No-Code/Low-Code Platforms"
    ];

    try {
        const API_KEY = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
        const topicCounts: { [key: string]: number } = {};

        if (API_KEY) {
            // Broader query to catch more general tech/hiring trends
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=tech+trends+OR+hiring+trends+OR+skills+in+india+OR+software+development+future&language=en&sortBy=popularity&pageSize=15&apiKey=${API_KEY}`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`News API error for trending topics: ${response.status} - ${response.statusText}. Details: ${errorText}. Using fallback topics.`);
                return defaultTrendingTopics;
            }

            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                data.articles.forEach((article: any) => {
                    const text = `${article.title} ${article.description || ""}`.toLowerCase();

                    // Check for comprehensive list of keywords
                    defaultTrendingTopics.forEach(keyword => {
                        if (text.includes(keyword.toLowerCase())) {
                            topicCounts[keyword] = (topicCounts[keyword] || 0) + 1;
                        }
                    });
                });

                // Get top trending topics based on frequency in news
                const trending = Object.entries(topicCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10) // Limit to top 10 from news
                    .map(([topic]) => topic);

                // If news-derived topics are few, supplement with more from default list
                if (trending.length < 5) {
                    return Array.from(new Set([...trending, ...defaultTrendingTopics.slice(0, 10)])).slice(0, 10);
                }
                return trending;

            } else {
                console.warn("NewsAPI returned no articles for trending topics. Using fallback topics.");
                return defaultTrendingTopics;
            }
        } else {
            console.warn("NewsAPI key not found for trending topics. Using fallback topics.");
            return defaultTrendingTopics;
        }
    } catch (error) {
        console.error("Error fetching trending topics:", error);
        return defaultTrendingTopics; // Always return a default list on error
    }
};