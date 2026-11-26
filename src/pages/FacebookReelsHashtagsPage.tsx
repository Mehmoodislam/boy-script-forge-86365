import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
    Copy,
    Check,
    Hash,
    Sparkles,
    TrendingUp,
    Flame,
    Share2,
    Camera,
    Plane,
    Utensils,
    Dumbbell,
    Shirt,
    Quote,
    Briefcase,
    Gamepad2,
    Smile,
    Store,
    CheckCircle2,
    AlertTriangle,
    Search,
    HelpCircle,
    Info,
    ArrowRight
} from "lucide-react";

interface HashtagCollection {
    id: string;
    title: string;
    category: "popular" | "trending" | "viral" | "quick-copy" | "niche" | "business";
    categoryLabel: string;
    icon: any;
    description: string;
    tags: string[];
}

const COLLECTIONS: HashtagCollection[] = [
    {
        id: "popular",
        title: "Popular Facebook Reels Hashtags",
        category: "popular",
        categoryLabel: "Popular",
        icon: Sparkles,
        description: "Best for general entertainment, lifestyle, and high-visibility short videos.",
        tags: ["#FacebookReels", "#Reels", "#TrendingReels", "#ViralReels", "#ReelsVideo", "#FacebookVideos", "#ShortVideos", "#DailyReels", "#VideoContent", "#ContentCreator"]
    },
    {
        id: "trending",
        title: "Trending Facebook Reels Hashtags",
        category: "trending",
        categoryLabel: "Trending",
        icon: TrendingUp,
        description: "Trending-style tags to capture current platform momentum and broad audiences.",
        tags: ["#Trending", "#TrendingNow", "#FacebookTrending", "#TrendingVideos", "#ReelsTrending", "#ViralContent", "#NewReels", "#PopularReels", "#ReelsDaily", "#ExploreMore"]
    },
    {
        id: "viral",
        title: "Viral Facebook Reels Hashtags",
        category: "viral",
        categoryLabel: "Viral",
        icon: Flame,
        description: "Associated with viral clips, eye-catching moments, and high shareability.",
        tags: ["#ViralReels", "#ViralVideo", "#FacebookReels", "#ReelsViral", "#ViralContent", "#MustWatch", "#TrendingVideo", "#VideoOfTheDay", "#AmazingVideos", "#Entertainment"]
    },
    {
        id: "quick-general",
        title: "1. General Facebook Reels (Quick Pack)",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Hash,
        description: "Handpicked 5-tag core set ready to copy and paste for any everyday Reel.",
        tags: ["#FacebookReels", "#ReelsVideo", "#TrendingReels", "#ViralVideo", "#DailyReels"]
    },
    {
        id: "quick-viral",
        title: "2. Viral Video Hashtags (Quick Pack)",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Flame,
        description: "Punchy combination focused on discoverability and must-watch content.",
        tags: ["#ViralReels", "#ViralContent", "#TrendingVideo", "#FacebookVideos", "#MustWatch"]
    },
    {
        id: "quick-entertainment",
        title: "3. Entertainment & Comedy (Quick Pack)",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Smile,
        description: "Fun, relatable, and funny video hashtag set.",
        tags: ["#Entertainment", "#FunnyVideos", "#ComedyReels", "#FunContent", "#EntertainmentVideos"]
    },
    {
        id: "quick-motivation",
        title: "4. Motivational Reels (Quick Pack)",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Quote,
        description: "Inspiring quotes, success mindsets, and positive thinking clips.",
        tags: ["#Motivation", "#DailyMotivation", "#SuccessMindset", "#PositiveThinking", "#InspirationalVideos"]
    },
    {
        id: "quick-lifestyle",
        title: "5. Lifestyle Reels (Quick Pack)",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Sparkles,
        description: "Daily vlogs, routines, outfit checks, and life aesthetic moments.",
        tags: ["#Lifestyle", "#LifestyleReels", "#DailyLife", "#LifeMoments", "#LifestyleContent"]
    },
    {
        id: "niche-photography",
        title: "Facebook Hashtags for Photography",
        category: "niche",
        categoryLabel: "Photography",
        icon: Camera,
        description: "Describe visual quality, portraits, gear, editing tips, and camera work.",
        tags: ["#Photography", "#PhotoOfTheDay", "#CreativePhotography", "#PortraitPhotography", "#NaturePhotography", "#PhotographyLovers", "#PhotoEditing", "#MobilePhotography"]
    },
    {
        id: "niche-travel",
        title: "Facebook Hashtags for Travel Reels",
        category: "niche",
        categoryLabel: "Travel",
        icon: Plane,
        description: "Attract viewers interested in destinations, road trips, and wanderlust.",
        tags: ["#TravelReels", "#TravelPhotography", "#ExploreTheWorld", "#TravelLovers", "#AdventureTravel", "#Wanderlust", "#TravelDiaries", "#BeautifulDestinations"]
    },
    {
        id: "niche-food",
        title: "Facebook Hashtags for Food Reels",
        category: "niche",
        categoryLabel: "Food & Recipes",
        icon: Utensils,
        description: "Perfect for food creators, home cooks, street food tours, and restaurants.",
        tags: ["#FoodReels", "#FoodLovers", "#CookingVideos", "#EasyRecipes", "#FoodPhotography", "#HomemadeFood", "#RecipeIdeas", "#FoodContent"]
    },
    {
        id: "niche-fitness",
        title: "Facebook Hashtags for Fitness & Workout Videos",
        category: "niche",
        categoryLabel: "Fitness",
        icon: Dumbbell,
        description: "Highlight workouts, gym motivation, home exercises, and healthy habits.",
        tags: ["#FitnessReels", "#WorkoutMotivation", "#FitnessJourney", "#GymLife", "#HomeWorkout", "#HealthyLifestyle", "#FitnessTips", "#WorkoutVideos"]
    },
    {
        id: "niche-fashion",
        title: "Facebook Hashtags for Fashion Reels",
        category: "niche",
        categoryLabel: "Fashion",
        icon: Shirt,
        description: "OOTD, styling tutorials, seasonal looks, and fashion inspiration.",
        tags: ["#FashionReels", "#FashionStyle", "#OutfitIdeas", "#StyleInspiration", "#FashionTrends", "#DailyFashion", "#StreetStyle", "#FashionLovers"]
    },
    {
        id: "niche-quotes",
        title: "Facebook Hashtags for Motivation and Quotes",
        category: "niche",
        categoryLabel: "Motivation",
        icon: Quote,
        description: "Personal growth, entrepreneurial drive, and daily motivational affirmations.",
        tags: ["#MotivationalReels", "#DailyInspiration", "#SuccessQuotes", "#PositiveMindset", "#SelfImprovement", "#NeverGiveUp", "#MotivationDaily", "#GrowthMindset"]
    },
    {
        id: "niche-business",
        title: "Facebook Hashtags for Business and Marketing",
        category: "business",
        categoryLabel: "Business",
        icon: Briefcase,
        description: "Social media marketing, startup tips, client case studies, and business growth.",
        tags: ["#SmallBusiness", "#FacebookMarketing", "#DigitalMarketing", "#BusinessGrowth", "#EntrepreneurLife", "#SocialMediaMarketing", "#MarketingTips", "#OnlineBusiness"]
    },
    {
        id: "niche-gaming",
        title: "Facebook Hashtags for Gaming",
        category: "niche",
        categoryLabel: "Gaming",
        icon: Gamepad2,
        description: "Stream highlights, gameplay clips, esports moments, and gamer community tags.",
        tags: ["#GamingReels", "#GamingCommunity", "#Gameplay", "#GamerLife", "#MobileGaming", "#GamingVideos", "#OnlineGaming", "#GamingContent"]
    },
    {
        id: "niche-comedy",
        title: "Facebook Hashtags for Funny Videos & Memes",
        category: "niche",
        categoryLabel: "Comedy & Memes",
        icon: Smile,
        description: "Relatable sketches, viral memes, comedy edits, and laugh-out-loud moments.",
        tags: ["#FunnyReels", "#ComedyVideos", "#FunnyMemes", "#MemesDaily", "#RelatableMemes", "#Humor", "#FunnyContent", "#ComedyReels"]
    },
    {
        id: "business-local",
        title: "Best Facebook Hashtags for Small Businesses",
        category: "business",
        categoryLabel: "Local Business",
        icon: Store,
        description: "Reach local customers, showcase products, promote launches, and build community trust.",
        tags: ["#SmallBusiness", "#SmallBusinessOwner", "#LocalBusiness", "#BusinessMarketing", "#FacebookBusiness", "#SmallBusinessMarketing", "#Entrepreneurship", "#ShopLocal"]
    }
];

const CATEGORY_TABS = [
    { id: "all", label: "All Collections" },
    { id: "popular", label: "Popular" },
    { id: "trending", label: "Trending" },
    { id: "viral", label: "Viral" },
    { id: "quick-copy", label: "Copy & Paste Packs" },
    { id: "niche", label: "By Niche" },
    { id: "business", label: "Business" },
];

export default function FacebookReelsHashtagsPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedTag, setCopiedTag] = useState<string | null>(null);

    const filteredCollections = useMemo(() => {
        return COLLECTIONS.filter((col) => {
            const matchesTab = activeTab === "all" || col.category === activeTab;
            const matchesQuery =
                !searchQuery.trim() ||
                col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                col.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                col.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesTab && matchesQuery;
        });
    }, [activeTab, searchQuery]);

    const handleCopyAll = (collection: HashtagCollection) => {
        const textToCopy = collection.tags.join(" ");
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(collection.id);
        toast.success(`Copied ${collection.tags.length} hashtags to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopySingle = (tag: string) => {
        navigator.clipboard.writeText(tag);
        setCopiedTag(tag);
        toast.success(`Copied ${tag}`);
        setTimeout(() => setCopiedTag(null), 1500);
    };

    // Schemas
    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://freeimageprompt.com/facebook-reels-hashtags/"
        },
        "headline": "Best Facebook Reels Hashtags in 2026: Trending, Viral & Copy-Paste Tags",
        "description": "Discover the best Facebook Reels hashtags for different niches, including trending, viral, business, fitness, travel, food and entertainment hashtags.",
        "image": [
            "https://freeimageprompt.com/og-share.png"
        ],
        "datePublished": "2026-11-26",
        "dateModified": "2026-11-26",
        "author": {
            "@type": "Organization",
            "name": "FreeImagePrompt Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "FreeImagePrompt",
            "logo": {
                "@type": "ImageObject",
                "url": "https://freeimageprompt.com/favicon.png"
            }
        },
        "articleSection": "Social Media Marketing",
        "keywords": [
            "Facebook Reels Hashtags",
            "Best Facebook Reels Hashtags",
            "Trending Facebook Hashtags",
            "Viral Facebook Reels Hashtags",
            "Facebook Reels Hashtags Copy and Paste"
        ],
        "inLanguage": "en"
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://freeimageprompt.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://freeimageprompt.com/tools"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Facebook Reels Hashtags",
                "item": "https://freeimageprompt.com/facebook-reels-hashtags/"
            }
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What are the best hashtags for Facebook Reels in 2026?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best hashtags for Facebook Reels are relevant to your video's topic and audience. Examples include #FacebookReels, #ReelsVideo, #TrendingReels and niche-specific hashtags."
                }
            },
            {
                "@type": "Question",
                "name": "Which hashtags can make Facebook Reels go viral?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "There is no hashtag that guarantees viral reach. You can explore relevant tags such as #ViralReels, #TrendingVideo, and #FacebookReels, but video quality, originality, and viewer engagement are also important."
                }
            },
            {
                "@type": "Question",
                "name": "How many hashtags should I use on Facebook Reels?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Start with a small number of relevant hashtags, such as 2 to 5. Choose hashtags that accurately describe your Reel instead of adding unrelated popular tags."
                }
            },
            {
                "@type": "Question",
                "name": "Do hashtags help Facebook Reels get more views?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hashtags can help categorize public content and make its topic clearer, but they do not guarantee more views or viral reach. Content quality and audience engagement also matter."
                }
            },
            {
                "@type": "Question",
                "name": "Can I copy and paste hashtags into Facebook Reels?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. You can copy and paste relevant hashtag sets, but always select hashtags that match the subject of your Reel."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use Instagram hashtags on Facebook Reels?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many hashtags are used across both platforms. However, you should choose tags based on your content and the audience you want to reach rather than copying every Instagram hashtag."
                }
            },
            {
                "@type": "Question",
                "name": "Should I put hashtags in the caption or comments?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Adding relevant hashtags directly to the main caption is a straightforward approach. It also keeps the topic context together with your video description."
                }
            },
            {
                "@type": "Question",
                "name": "Are trending hashtags better than niche hashtags?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Not always. Broad hashtags may have more posts, but niche-specific hashtags can describe your content more accurately and attract a more relevant audience."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title="Best Facebook Reels Hashtags for 2026 (Copy & Paste) — FreeImagePrompt"
                description="Find the best Facebook Reels hashtags for 2026. Explore trending, viral and niche hashtags for videos, posts and different content categories."
                canonicalUrl="https://freeimageprompt.com/facebook-reels-hashtags/"
                schema={[blogPostingSchema, breadcrumbSchema, faqSchema]}
            />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-[#78716C] mb-6 font-mono">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/tools" className="hover:text-primary transition-colors">Tools</Link>
                        <span>/</span>
                        <span className="text-[#1C1917] font-semibold">Facebook Reels Hashtags</span>
                    </div>

                    {/* Header */}
                    <div className="text-left mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold mb-4">
                            <Hash className="h-3.5 w-3.5 text-emerald-600" />
                            <span>UPDATED FOR 2026 • 100% FREE READY-TO-COPY TAGS</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#1C1917] leading-tight">
                            Best Facebook Reels Hashtags for 2026 (Copy & Paste)
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed">
                            Facebook Reels have become a popular way for creators, businesses, and everyday users to share short videos and reach new audiences. Explore handpicked trending, viral, and niche hashtags with 1-click copy functionality.
                        </p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 md:p-6 mb-10 shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
                                <Input
                                    type="text"
                                    placeholder="Search tags or niches (e.g. travel, viral, food, fitness)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-[#FAF9F5] border-[#E6E2D8] focus-visible:ring-emerald-500 text-sm h-11"
                                />
                            </div>
                            <span className="text-xs font-mono text-[#78716C] self-center">
                                Showing {filteredCollections.length} collections
                            </span>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                            {CATEGORY_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                        activeTab === tab.id
                                            ? "bg-[#1C1917] text-white shadow-sm"
                                            : "bg-[#FAF9F5] text-[#6B645C] hover:bg-[#EFECE6] border border-[#E6E2D8]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Hashtag Cards Grid */}
                    <div className="space-y-6 mb-16">
                        {filteredCollections.map((col) => {
                            const IconComponent = col.icon;
                            const isAllCopied = copiedId === col.id;

                            return (
                                <div
                                    key={col.id}
                                    className="bg-white border border-[#E6E2D8] rounded-2xl p-5 md:p-6 hover:border-[#1C1917] transition-all shadow-sm"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#F0EBE0]">
                                        <div className="flex items-start sm:items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="text-lg md:text-xl font-bold text-[#1C1917]">
                                                        {col.title}
                                                    </h2>
                                                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-200 text-emerald-700 bg-emerald-50">
                                                        {col.tags.length} TAGS
                                                    </Badge>
                                                </div>
                                                <p className="text-xs md:text-sm text-[#78716C] mt-0.5">
                                                    {col.description}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleCopyAll(col)}
                                            size="sm"
                                            className={`gap-2 shrink-0 text-xs font-semibold ${
                                                isAllCopied
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    : "bg-[#1C1917] hover:bg-black text-white"
                                            }`}
                                        >
                                            {isAllCopied ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5" />
                                                    Copied All!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5" />
                                                    Copy All Tags
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Individual Pills (Click to copy single) */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {col.tags.map((tag) => {
                                            const isSingleCopied = copiedTag === tag;
                                            return (
                                                <button
                                                    key={tag}
                                                    onClick={() => handleCopySingle(tag)}
                                                    title="Click to copy single hashtag"
                                                    className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-mono transition-all border ${
                                                        isSingleCopied
                                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                            : "bg-[#FAF9F5] text-[#1C1917] border-[#E6E2D8] hover:border-emerald-500 hover:bg-emerald-50/50"
                                                    }`}
                                                >
                                                    <span className="font-semibold">{tag}</span>
                                                    {isSingleCopied ? (
                                                        <Check className="h-3 w-3 text-white" />
                                                    ) : (
                                                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity text-[#78716C]" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="text-[11px] text-[#A8A29E] mt-3 font-mono flex items-center gap-1">
                                        <Info className="h-3 w-3" />
                                        <span>Tip: Click any single tag to copy it individually, or "Copy All Tags" for the entire set.</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Editorial Content & Guide Sections */}
                    <div className="space-y-12 border-t border-[#E6E2D8] pt-12 text-[#374151]">
                        {/* Section: Overview */}
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                                How to Choose the Best Facebook Reels Hashtags in 2026
                            </h2>
                            <p className="text-[#6B645C] leading-relaxed text-base md:text-lg">
                                Finding the best Facebook Reels hashtags is not always easy. Some hashtags are too broad, while others may not match your content or target audience. Start with tags that genuinely describe your video and its subject. A smart combination of general Reels hashtags and topic-specific keywords helps Facebook's recommendation algorithm categorize your video accurately.
                            </p>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm leading-relaxed flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong>Golden Rule of Hashtagging:</strong> Always select hashtags that genuinely match your Reel rather than stuffing every popular tag. Irrelevant hashtags can confuse the distribution algorithm and cause viewers to scroll away quickly.
                                </div>
                            </div>
                        </div>

                        {/* Section: How Many Hashtags */}
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                                How Many Hashtags Should You Use on Facebook Reels?
                            </h2>
                            <p className="text-[#6B645C] leading-relaxed">
                                There is no universally proven number of hashtags that guarantees better reach on Facebook. However, using a small selection of relevant hashtags is a practical starting point. Many social media guides recommend testing around <strong>2 to 5 hashtags</strong> rather than adding long lists of unrelated tags.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-[#E6E2D8] bg-[#FAF9F5]">
                                    <h3 className="font-bold text-sm text-[#1C1917] mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        General Reels
                                    </h3>
                                    <p className="text-xs text-[#6B645C]">Choose a few relevant video-related hashtags like #FacebookReels and #ShortVideos.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-[#E6E2D8] bg-[#FAF9F5]">
                                    <h3 className="font-bold text-sm text-[#1C1917] mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        Business Reels
                                    </h3>
                                    <p className="text-xs text-[#6B645C]">Use industry, product, and location-specific hashtags such as #LocalBakery or #ShopLocal.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-[#E6E2D8] bg-[#FAF9F5]">
                                    <h3 className="font-bold text-sm text-[#1C1917] mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        Educational Videos
                                    </h3>
                                    <p className="text-xs text-[#6B645C]">Select hashtags directly related to the skill or concept being explained.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-[#E6E2D8] bg-[#FAF9F5]">
                                    <h3 className="font-bold text-sm text-[#1C1917] mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        Entertainment Reels
                                    </h3>
                                    <p className="text-xs text-[#6B645C]">Combine a content-category hashtag with relevant comedy or meme tags.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section: How to Find Trending Hashtags */}
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                                How to Find Trending Facebook Reels Hashtags
                            </h2>
                            <p className="text-[#6B645C] leading-relaxed">
                                Finding relevant hashtags requires more than copying a static list. You should also understand what people are currently posting and searching for across Facebook:
                            </p>

                            <div className="space-y-4">
                                {[
                                    {
                                        step: "1",
                                        title: "Use Facebook Search",
                                        desc: "Open Facebook and search for a keyword related to your video. Explore public posts and Reels to see which hashtags top creators use around that topic."
                                    },
                                    {
                                        step: "2",
                                        title: "Research Similar Creators",
                                        desc: "Find creators who publish content in your niche. Observe their consistent hashtag patterns and identify tags that perform well."
                                    },
                                    {
                                        step: "3",
                                        title: "Explore Niche-Specific Hashtags",
                                        desc: "Don't focus only on broad terms like #Viral or #Trending. Search for specific topics such as fitness, cooking, travel, photography, or technology."
                                    },
                                    {
                                        step: "4",
                                        title: "Use Hashtag Research Tools",
                                        desc: "Online platforms like Best-Hashtags, HashtagsForLikes, and keyword tools provide related search terms and popularity metrics."
                                    },
                                    {
                                        step: "5",
                                        title: "Review Your Facebook Professional Insights",
                                        desc: "Review your Facebook Page or professional dashboard. Inspect views, reach, retention rate, and audience demographics across different tag tests."
                                    }
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E2D8]">
                                        <span className="w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-[#1C1917] mb-1">{item.title}</h3>
                                            <p className="text-sm text-[#6B645C] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: Do Hashtags Work in 2026? */}
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                                Do Facebook Reels Hashtags Actually Work in 2026?
                            </h2>
                            <p className="text-[#6B645C] leading-relaxed">
                                <strong>Yes, hashtags still help categorize public Facebook content</strong> and make related posts easier to discover. When someone clicks or searches a hashtag, Facebook shows public content associated with that topic.
                            </p>
                            <p className="text-[#6B645C] leading-relaxed">
                                However, hashtags are not a magic shortcut to viral success. Facebook's algorithm prioritizes viewer retention, watch time, shares, and content originality above all else. For this reason, hashtags should support your content strategy rather than become the only focus of it.
                            </p>
                        </div>

                        {/* Section: Common Mistakes */}
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-6">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                                Common Facebook Hashtag Mistakes to Avoid
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { t: "1. Using unrelated hashtags", d: "Adding popular tags that have nothing to do with your video does not increase reach — it triggers spam flags." },
                                    { t: "2. Adding too many hashtags", d: "Pasting 30 hashtags clutters your caption and dilutes topic signals. Keep it concise (2–5 tags)." },
                                    { t: "3. Copy-pasting identical tags on every Reel", d: "Your video topics change, so your hashtags should adapt specifically to each video." },
                                    { t: "4. Ignoring niche-specific keywords", d: "A specific hashtag like #TravelPhotography targets interested viewers much better than broad tags like #Viral." },
                                    { t: "5. Expecting hashtags to guarantee views", d: "Hashtags categorize content; they cannot fix poor audio, blurry video, or boring hooks." }
                                ].map((m, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                                        <h3 className="font-bold text-sm text-rose-900">{m.t}</h3>
                                        <p className="text-xs text-rose-800/80 leading-relaxed">{m.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: FAQ Accordion */}
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <HelpCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                                        Frequently Asked Questions About Facebook Reels Hashtags
                                    </h2>
                                    <p className="text-xs md:text-sm text-[#78716C]">
                                        Clear answers to common questions about hashtag strategy, views, and best practices.
                                    </p>
                                </div>
                            </div>

                            <Accordion type="single" collapsible className="w-full divide-y divide-[#E6E2D8]">
                                <AccordionItem value="faq-1" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        What are the best hashtags for Facebook Reels in 2026?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Some useful hashtags to explore include #FacebookReels, #ReelsVideo, #TrendingReels, #ViralVideo, and #ContentCreator. The best selection depends on your video's subject and target audience.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-2" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        Which hashtags can make Facebook Reels go viral?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        There is no hashtag that guarantees viral reach. You can explore relevant tags such as #ViralReels, #TrendingVideo, and #FacebookReels, but video quality, originality, and viewer engagement are also important.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-3" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        How many hashtags should I use on Facebook Reels?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Start with a small group of approximately 2–5 relevant hashtags and test different combinations. Facebook does not provide a universal hashtag count that guarantees better performance.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-4" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        Do Facebook hashtags help increase views?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Hashtags can help describe and categorize public content, making related posts easier to find. However, they do not guarantee more views. Audience interest and content performance are important factors too.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-5" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        Can I use Instagram hashtags on Facebook Reels?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Yes, many hashtags are used across both platforms. However, you should choose tags based on your content and the audience you want to reach rather than copying every Instagram hashtag.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-6" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        Should I put hashtags in the caption or comments?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Adding relevant hashtags directly to the main caption is a straightforward approach. It also keeps the topic context together with your video description.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-7" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        Are trending hashtags better than niche hashtags?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Not always. Broad hashtags may have more posts, but niche-specific hashtags can describe your content more accurately and attract a more relevant audience.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="faq-8" className="border-b border-[#E6E2D8]">
                                    <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline">
                                        How can I find hashtags for my Facebook video?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-[#6B645C] leading-relaxed">
                                        Search for your video's main topic on Facebook, explore similar public Reels, review related hashtags, and use hashtag research tools to discover additional ideas.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Section: Final Thoughts & CTA */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917]">
                                Final Thoughts
                            </h2>
                            <p className="text-[#6B645C] max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                                Finding the best Facebook Reels hashtags is about choosing relevant tags that describe your content and help people understand what your videos are about. Start with the hashtag collections above, choose the ones that match your next Reel, and focus on creating engaging short-form videos.
                            </p>
                            <div className="pt-2 flex justify-center gap-3">
                                <Link to="/tools">
                                    <Button className="gap-2 bg-[#1C1917] text-white hover:bg-black">
                                        Explore More Free Tools <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
