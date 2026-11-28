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
    Palette,
    TreePine,
    Dog,
    Video,
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
    category: "popular" | "trending" | "quick-copy" | "niche" | "reels" | "business";
    categoryLabel: string;
    icon: any;
    description: string;
    tags: string[];
}

const COLLECTIONS: HashtagCollection[] = [
    {
        id: "most-popular",
        title: "Most Popular Instagram Hashtags",
        category: "popular",
        categoryLabel: "Popular",
        icon: Sparkles,
        description: "Widely used general hashtags for high platform reach and lifestyle content.",
        tags: ["#instagram", "#instagood", "#photooftheday", "#instadaily", "#photography"]
    },
    {
        id: "more-popular",
        title: "Popular Lifestyle & Emotions",
        category: "popular",
        categoryLabel: "Popular",
        icon: Sparkles,
        description: "Classic popular tags for positive, happy, and aesthetic personal photos.",
        tags: ["#love", "#life", "#beautiful", "#picoftheday", "#happy"]
    },
    {
        id: "popular-social",
        title: "Popular Social & Creator Tags",
        category: "popular",
        categoryLabel: "Popular",
        icon: Share2,
        description: "For content creators, digital builders, and online communities.",
        tags: ["#socialmedia", "#contentcreator", "#digitalcreator", "#onlinecommunity", "#creative"]
    },
    {
        id: "trending-general",
        title: "Trending-Style Instagram Hashtags (2026)",
        category: "trending",
        categoryLabel: "Trending",
        icon: TrendingUp,
        description: "Capture trending momentum and feed recommendations across Instagram.",
        tags: ["#trending", "#viral", "#explore", "#newpost", "#contentcreator"]
    },
    {
        id: "trending-reels",
        title: "Trending Instagram Reels Hashtags",
        category: "reels",
        categoryLabel: "Reels",
        icon: Video,
        description: "Short-form video tags specifically tuned for Instagram Reels algorithm.",
        tags: ["#instagramreels", "#reelsvideo", "#reelsinstagram", "#reelscontent", "#shortvideo"]
    },
    {
        id: "trending-creative",
        title: "Creative Content Trends",
        category: "trending",
        categoryLabel: "Trending",
        icon: Flame,
        description: "For eye-catching visual art, creator inspiration, and digital storytelling.",
        tags: ["#creativecontent", "#digitalcreator", "#contentinspiration", "#dailycontent", "#creatorcommunity"]
    },

    // Ready to Copy Sets (5 Tags Max per set - matching 2026 IG best practices)
    {
        id: "quick-general",
        title: "General Instagram Pack",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Hash,
        description: "All-purpose balanced 5-tag pack for daily posts and photos.",
        tags: ["#instagram", "#instagood", "#instadaily", "#photooftheday", "#picoftheday"]
    },
    {
        id: "quick-photo",
        title: "Photo & Photography Pack",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Camera,
        description: "Perfect for high-definition photography, portraits, and mobile shots.",
        tags: ["#photography", "#photooftheday", "#instaphoto", "#photographylovers", "#photo"]
    },
    {
        id: "quick-reels",
        title: "Reels Creator Pack",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Video,
        description: "Ready-to-use 5 tags for short videos and trending Reels.",
        tags: ["#instagramreels", "#reelsvideo", "#reelsinstagram", "#reelscontent", "#reelcreator"]
    },
    {
        id: "quick-lifestyle",
        title: "Lifestyle & Daily Vibes Pack",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Sparkles,
        description: "For daily routines, aesthetic moments, and positive vibes.",
        tags: ["#lifestyle", "#dailyinspiration", "#goodvibes", "#lifestyleblogger", "#everydaylife"]
    },
    {
        id: "quick-creative",
        title: "Creative Community Pack",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Palette,
        description: "For designers, digital artists, and creative influencers.",
        tags: ["#creativecontent", "#contentcreator", "#digitalcreator", "#creativecommunity", "#contentinspiration"]
    },
    {
        id: "quick-brand",
        title: "Personal Brand & Entrepreneur Pack",
        category: "quick-copy",
        categoryLabel: "Copy & Paste",
        icon: Briefcase,
        description: "Targeted tags for coaches, agency owners, and digital entrepreneurs.",
        tags: ["#personalbranding", "#personalbrand", "#entrepreneurlife", "#digitalcreator", "#brandbuilding"]
    },

    // Category Specific Niche Sets
    {
        id: "niche-photography",
        title: "Photography (General)",
        category: "niche",
        categoryLabel: "Photography",
        icon: Camera,
        description: "For professional photographers and photo enthusiasts.",
        tags: ["#photography", "#photographer", "#photooftheday", "#photographylovers", "#instaphoto"]
    },
    {
        id: "niche-portrait",
        title: "Portrait Photography",
        category: "niche",
        categoryLabel: "Photography",
        icon: Camera,
        description: "Close-ups, model shoots, studio lighting, and portraiture.",
        tags: ["#portraitphotography", "#portrait", "#portraitmood", "#portraitphotographer", "#portraitphoto"]
    },
    {
        id: "niche-landscape",
        title: "Landscape & Outdoor Photography",
        category: "niche",
        categoryLabel: "Photography",
        icon: Camera,
        description: "Sceneries, mountains, sunsets, and outdoor photography.",
        tags: ["#landscapephotography", "#naturephotography", "#landscape", "#naturelovers", "#outdoorphotography"]
    },
    {
        id: "niche-street",
        title: "Street & Urban Photography",
        category: "niche",
        categoryLabel: "Photography",
        icon: Camera,
        description: "City life, urban architecture, and authentic street moments.",
        tags: ["#streetphotography", "#streetphoto", "#urbanphotography", "#streetstyle", "#cityphotography"]
    },
    {
        id: "niche-travel-general",
        title: "Travel & Wanderlust",
        category: "niche",
        categoryLabel: "Travel",
        icon: Plane,
        description: "For travel bloggers, tourists, and globe trotters.",
        tags: ["#travel", "#travelgram", "#travelphotography", "#traveltheworld", "#wanderlust"]
    },
    {
        id: "niche-travel-adventure",
        title: "Adventure & Outdoor Travel",
        category: "niche",
        categoryLabel: "Travel",
        icon: Plane,
        description: "Hiking, backpacking, road trips, and outdoor expeditions.",
        tags: ["#adventuretravel", "#adventureawaits", "#exploremore", "#outdooradventures", "#traveladdict"]
    },
    {
        id: "niche-travel-vacation",
        title: "Vacation & Holidays",
        category: "niche",
        categoryLabel: "Travel",
        icon: Plane,
        description: "Resort holidays, beach trips, and weekend getaways.",
        tags: ["#vacation", "#holidayvibes", "#travelmoments", "#beautifuldestinations", "#trip"]
    },
    {
        id: "niche-food-general",
        title: "Food & Foodie",
        category: "niche",
        categoryLabel: "Food",
        icon: Utensils,
        description: "Restaurant reviews, delicious meals, and food styling.",
        tags: ["#food", "#foodie", "#instafood", "#foodphotography", "#foodlover"]
    },
    {
        id: "niche-food-healthy",
        title: "Healthy Food & Nutrition",
        category: "niche",
        categoryLabel: "Food",
        icon: Utensils,
        description: "Clean eating, diet meal preps, and healthy lifestyle recipes.",
        tags: ["#healthyfood", "#healthyeating", "#nutrition", "#healthyrecipes", "#eatwell"]
    },
    {
        id: "niche-food-cooking",
        title: "Home Cooking & Recipes",
        category: "niche",
        categoryLabel: "Food",
        icon: Utensils,
        description: "Homemade dishes, step-by-step cooking, and culinary tips.",
        tags: ["#cooking", "#homemadefood", "#homecooking", "#foodblogger", "#easyrecipes"]
    },
    {
        id: "niche-food-dessert",
        title: "Desserts, Sweets & Baking",
        category: "niche",
        categoryLabel: "Food",
        icon: Utensils,
        description: "Cakes, pastries, sweet treats, and bakery items.",
        tags: ["#dessert", "#dessertlover", "#sweettooth", "#baking", "#dessertphotography"]
    },
    {
        id: "niche-fitness-general",
        title: "Fitness & Motivation",
        category: "niche",
        categoryLabel: "Fitness",
        icon: Dumbbell,
        description: "Daily workouts, transformation journeys, and fitness coaching.",
        tags: ["#fitness", "#fitnessmotivation", "#workout", "#fitlife", "#fitnessjourney"]
    },
    {
        id: "niche-fitness-gym",
        title: "Gym & Strength Training",
        category: "niche",
        categoryLabel: "Fitness",
        icon: Dumbbell,
        description: "Heavy lifting, gym sessions, and bodybuilding content.",
        tags: ["#gym", "#gymlife", "#gymmotivation", "#strengthtraining", "#gymworkout"]
    },
    {
        id: "niche-fitness-yoga",
        title: "Yoga & Mindfulness",
        category: "niche",
        categoryLabel: "Fitness",
        icon: Dumbbell,
        description: "Yoga poses, meditation, breathing exercises, and inner peace.",
        tags: ["#yoga", "#yogalife", "#yogapractice", "#mindandbody", "#yogainspiration"]
    },
    {
        id: "niche-fashion-general",
        title: "Fashion & OOTD",
        category: "niche",
        categoryLabel: "Fashion",
        icon: Shirt,
        description: "Outfit of the day, style looks, and runway trends.",
        tags: ["#fashion", "#fashionstyle", "#fashionblogger", "#styleinspiration", "#ootd"]
    },
    {
        id: "niche-fashion-mens",
        title: "Men's Fashion & Streetwear",
        category: "niche",
        categoryLabel: "Fashion",
        icon: Shirt,
        description: "Men's styling, sneakers, suits, and everyday casual outfits.",
        tags: ["#mensfashion", "#mensstyle", "#menstyle", "#outfitinspiration", "#streetwear"]
    },
    {
        id: "niche-fashion-womens",
        title: "Women's Fashion & Styling",
        category: "niche",
        categoryLabel: "Fashion",
        icon: Shirt,
        description: "Chic outfits, seasonal styling, and wardrobe inspiration.",
        tags: ["#womensfashion", "#fashioninspo", "#styleblogger", "#outfitideas", "#fashiondaily"]
    },
    {
        id: "niche-fashion-beauty",
        title: "Beauty, Makeup & Style",
        category: "niche",
        categoryLabel: "Fashion",
        icon: Shirt,
        description: "Makeup tutorials, skincare routines, and beauty tips.",
        tags: ["#beauty", "#beautyblogger", "#makeuplook", "#beautytips", "#styleinspo"]
    },
    {
        id: "business-entrepreneur",
        title: "Business & Entrepreneurship",
        category: "business",
        categoryLabel: "Business",
        icon: Briefcase,
        description: "Startups, small business owners, and corporate insights.",
        tags: ["#business", "#entrepreneur", "#smallbusiness", "#businessowner", "#entrepreneurlife"]
    },
    {
        id: "business-marketing",
        title: "Digital & Social Media Marketing",
        category: "business",
        categoryLabel: "Business",
        icon: Briefcase,
        description: "Marketing strategies, growth hacking, and social media tips.",
        tags: ["#digitalmarketing", "#socialmediamarketing", "#marketingstrategy", "#onlinemarketing", "#marketingtips"]
    },
    {
        id: "business-smallbiz",
        title: "Small Business Support",
        category: "business",
        categoryLabel: "Business",
        icon: Briefcase,
        description: "Local shops, packaging orders, and community small businesses.",
        tags: ["#smallbusinessowner", "#supportsmallbusiness", "#smallbusinesscommunity", "#shoplocal", "#businessgrowth"]
    },
    {
        id: "business-branding",
        title: "Branding & Brand Identity",
        category: "business",
        categoryLabel: "Business",
        icon: Briefcase,
        description: "Logos, brand strategy, visual aesthetics, and creative business.",
        tags: ["#branding", "#personalbranding", "#brandidentity", "#brandstrategy", "#creativebusiness"]
    },
    {
        id: "niche-art-digital",
        title: "Digital Art & Illustration",
        category: "niche",
        categoryLabel: "Art",
        icon: Palette,
        description: "Procreate drawings, concept art, character design, and 3D.",
        tags: ["#digitalart", "#digitalartist", "#digitalillustration", "#conceptart", "#illustration"]
    },
    {
        id: "niche-art-design",
        title: "Graphic Design & Typography",
        category: "niche",
        categoryLabel: "Art",
        icon: Palette,
        description: "Poster design, typography, logo design, and visual art.",
        tags: ["#graphicdesign", "#graphicdesigner", "#designinspiration", "#logodesign", "#visualdesign"]
    },
    {
        id: "niche-nature",
        title: "Nature & Outdoors",
        category: "niche",
        categoryLabel: "Nature",
        icon: TreePine,
        description: "Wild forests, outdoor trails, natural wonders, and green living.",
        tags: ["#nature", "#naturephotography", "#naturelovers", "#beautifulnature", "#outdoors"]
    },
    {
        id: "niche-nature-wildlife",
        title: "Wildlife & Animals",
        category: "niche",
        categoryLabel: "Nature",
        icon: TreePine,
        description: "Safari photos, wild animals, bird watching, and biodiversity.",
        tags: ["#wildlife", "#wildlifephotography", "#animalphotography", "#wildlifeplanet", "#naturewildlife"]
    },
    {
        id: "niche-motivation",
        title: "Daily Motivation & Mindset",
        category: "niche",
        categoryLabel: "Motivation",
        icon: Quote,
        description: "Inspirational quotes, mental resilience, and positive thoughts.",
        tags: ["#motivation", "#inspiration", "#motivationalquotes", "#mindset", "#success"]
    },
    {
        id: "niche-motivation-growth",
        title: "Self-Improvement & Personal Growth",
        category: "niche",
        categoryLabel: "Motivation",
        icon: Quote,
        description: "Habit building, productivity, and personal development.",
        tags: ["#selfimprovement", "#personalgrowth", "#growthmindset", "#positivehabits", "#selfdevelopment"]
    },
    {
        id: "niche-pets-general",
        title: "Pets & Animal Lovers",
        category: "niche",
        categoryLabel: "Pets",
        icon: Dog,
        description: "Cute pets, funny animal videos, and pet photography.",
        tags: ["#pets", "#petlover", "#petsofinstagram", "#petphotography", "#animalfriends"]
    },
    {
        id: "niche-pets-dogs",
        title: "Dogs & Puppies",
        category: "niche",
        categoryLabel: "Pets",
        icon: Dog,
        description: "Dog breeds, puppy training, dog life, and cute dog moments.",
        tags: ["#dog", "#dogsofinstagram", "#doglover", "#doglife", "#puppylove"]
    },
    {
        id: "niche-pets-cats",
        title: "Cats & Kittens",
        category: "niche",
        categoryLabel: "Pets",
        icon: Dog,
        description: "Kittens, cat behaviors, purrs, and playful feline clips.",
        tags: ["#cat", "#catsofinstagram", "#catlover", "#catlife", "#cutecats"]
    },

    // Reels Specific Sets
    {
        id: "reels-funny",
        title: "Funny & Comedy Reels",
        category: "reels",
        categoryLabel: "Reels",
        icon: Video,
        description: "Humorous clips, relatable skits, and viral comedy audio.",
        tags: ["#funnyreels", "#comedyreels", "#funnyvideos", "#comedycontent", "#humor"]
    },
    {
        id: "reels-educational",
        title: "Educational & Quick Tips Reels",
        category: "reels",
        categoryLabel: "Reels",
        icon: Video,
        description: "How-to guides, educational micro-lessons, and life hacks.",
        tags: ["#educationalcontent", "#learnoninstagram", "#quicktips", "#howto", "#learnsomethingnew"]
    },
    {
        id: "reels-business",
        title: "Business & Marketing Reels",
        category: "reels",
        categoryLabel: "Reels",
        icon: Video,
        description: "Behind the scenes, product demos, and entrepreneurial advice.",
        tags: ["#businessreels", "#marketingtips", "#smallbusiness", "#entrepreneur", "#businesscontent"]
    },
    {
        id: "reels-travel",
        title: "Travel & Adventure Reels",
        category: "reels",
        categoryLabel: "Reels",
        icon: Video,
        description: "Cinematic drone shots, travel transitions, and scenic video clips.",
        tags: ["#travelreels", "#travelvideo", "#travelcontent", "#wanderlust", "#exploremore"]
    }
];

const FAQS = [
    {
        q: "What are the best hashtags for Instagram?",
        a: "The best Instagram hashtags are the ones that accurately describe your content and match your target audience. Examples include #photography for photography posts, #travel for travel content, and #fitness for workout-related posts. Choose niche-relevant tags rather than generic overly competitive tags."
    },
    {
        q: "What are the most popular Instagram hashtags?",
        a: "Commonly used broad hashtags include #instagram, #instagood, #love, #photooftheday, #photography, and #instadaily. Their popularity can change, so check Instagram for current usage and always combine them with specific topic tags."
    },
    {
        q: "How many hashtags should I use on Instagram?",
        a: "Instagram currently allows up to 5 hashtags on a post or Reel in its modern interface. Instagram officially advises creators to use 3 to 5 highly relevant, descriptive hashtags rather than loading captions with 30 generic tags."
    },
    {
        q: "Do hashtags help you get more followers on Instagram?",
        a: "Relevant hashtags help categorize your content so it appears when people search for topics or view hashtag topics. However, they do not guarantee new followers. Good visuals, clear captions, audience engagement, and consistency are essential."
    },
    {
        q: "What are the best hashtags for Instagram Reels?",
        a: "The best hashtags for Reels depend on the video's subject. Examples include #instagramreels, #reelsvideo, #travelreels, #funnyreels, and #businessreels. Choose tags that genuinely describe what occurs in the video clip."
    },
    {
        q: "Are Instagram hashtags still effective in 2026?",
        a: "Yes, hashtags remain valuable for SEO and topic classification on Instagram. Instagram's search and recommendation algorithms use hashtags alongside your caption keywords and audio to understand and rank your content."
    },
    {
        q: "Should I use popular or niche hashtags?",
        a: "A balanced selection works best. Broad popular hashtags describe high-level topics, while niche hashtags connect with highly engaged, specific communities where your content is much more likely to rank."
    },
    {
        q: "How can I find trending Instagram hashtags?",
        a: "Search relevant keywords in the Instagram Explore tab, review high-performing posts from creators in your niche, and test research tools like Inflact or Keyword Tool. Always verify that a trending tag genuinely matches your post."
    },
    {
        q: "Can I copy and paste Instagram hashtags?",
        a: "Yes! You can copy and paste ready-made sets from this page directly into your caption or first comment. Make sure to adhere to the five-hashtag limit and adjust them according to your specific photo or video."
    },
    {
        q: "Do hashtags work for private Instagram accounts?",
        a: "No. If your account is set to private, your posts will not appear publicly on hashtag feeds or explore pages for people who do not already follow you. Your account must be public for hashtags to aid discovery."
    }
];

export default function InstagramHashtagsPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredCollections = useMemo(() => {
        return COLLECTIONS.filter((c) => {
            const matchesCategory =
                selectedCategory === "all" ||
                c.category === selectedCategory ||
                (selectedCategory === "niche" && c.category === "niche");

            const matchesSearch =
                searchQuery.trim() === "" ||
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const handleCopyAll = (collection: HashtagCollection) => {
        const textToCopy = collection.tags.join(" ");
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(collection.id);
        toast.success(`Copied ${collection.tags.length} hashtags to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopySingle = (tag: string) => {
        navigator.clipboard.writeText(tag);
        toast.success(`Copied ${tag}`);
    };

    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Best Hashtags for Instagram in 2026: Popular, Trending & Copy-and-Paste Tags",
            description: "Find the best hashtags for Instagram in 2026. Explore popular, trending and copy-and-paste hashtags for Reels, photography, travel, fitness, food and more.",
            url: "https://freeimageprompt.com/best-hashtags-for-instagram",
            author: { "@type": "Organization", name: "FreeImagePrompt" },
            publisher: {
                "@type": "Organization",
                name: "FreeImagePrompt",
                logo: { "@type": "ImageObject", url: "https://freeimageprompt.com/logo.png" }
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://freeimageprompt.com/best-hashtags-for-instagram/" },
            datePublished: "2026-11-28",
            dateModified: "2026-11-28"
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://freeimageprompt.com/"
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Best Hashtags for Instagram",
                    item: "https://freeimageprompt.com/best-hashtags-for-instagram/"
                }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a
                }
            }))
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title="Best Hashtags for Instagram 2026: Popular & Trending Tags"
                description="Find the best hashtags for Instagram in 2026. Explore popular, trending and copy-and-paste hashtags for Reels, photography, travel, fitness, food and more."
                canonicalUrl="https://freeimageprompt.com/best-hashtags-for-instagram"
                schema={schema}
            />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-left mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[1px] w-6 bg-pink-500"></span>
                            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-pink-600">
                                INSTAGRAM GROWTH TOOL · UPDATED FOR 2026
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-[#1C1917] leading-tight">
                            Best Hashtags for Instagram in 2026
                        </h1>
                        <p className="prose-editorial text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed mb-6">
                            Trending, viral, and ready-to-copy hashtag sets to increase your reach on Instagram posts,
                            Reels, carousels, and stories. Hand-curated for maximum engagement across every niche.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["1-CLICK COPY", "UPDATED FOR 2026", "REELS OPTIMIZED", "5-TAG COMPLIANT", "NO SIGNUP"].map((badge) => (
                                <span key={badge} className="text-[10px] font-mono font-semibold tracking-wider px-3 py-1.5 rounded-full bg-[#EFECE6] text-[#6B645C]">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Filter & Search Bar */}
                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-5 md:p-6 mb-10 shadow-sm space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
                            <Input
                                placeholder="Search by niche or keyword (e.g. photography, travel, viral, food, gym, reels)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#FAF9F5] border-[#E6E2D8] text-sm focus-visible:ring-pink-500"
                            />
                        </div>

                        {/* Category Filter Chips */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E6E2D8]">
                            {[
                                { id: "all", label: "All Hashtags" },
                                { id: "popular", label: "🔥 Popular" },
                                { id: "trending", label: "📈 Trending" },
                                { id: "reels", label: "🎥 Reels" },
                                { id: "quick-copy", label: "⚡ Copy & Paste Packs" },
                                { id: "niche", label: "🎯 Niche Categories" },
                                { id: "business", label: "💼 Business & Marketing" },
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => setSelectedCategory(btn.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                                        selectedCategory === btn.id
                                            ? "bg-[#1C1917] text-white shadow-sm"
                                            : "bg-[#FAF9F5] text-[#6B645C] hover:bg-[#EFECE6] hover:text-[#1C1917]"
                                    }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hashtag Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {filteredCollections.map((col) => {
                            const IconComponent = col.icon;
                            const isCopied = copiedId === col.id;

                            return (
                                <div
                                    key={col.id}
                                    className="bg-white border border-[#E6E2D8] rounded-2xl p-6 shadow-sm hover:border-pink-500/50 hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-mono font-semibold uppercase text-[#78716C]">
                                                    {col.categoryLabel}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-mono text-[#78716C] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E6E2D8]">
                                                {col.tags.length} Tags
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg text-[#1C1917] mb-1">
                                            {col.title}
                                        </h3>
                                        <p className="text-xs text-[#6B645C] mb-4">
                                            {col.description}
                                        </p>

                                        {/* Hashtag Pills */}
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {col.tags.map((tag, tIdx) => (
                                                <button
                                                    key={tIdx}
                                                    onClick={() => handleCopySingle(tag)}
                                                    title="Click to copy single tag"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF9F5] hover:bg-pink-50 border border-[#E6E2D8] hover:border-pink-300 text-xs font-mono text-[#1C1917] hover:text-pink-600 transition-colors cursor-pointer group"
                                                >
                                                    <span>{tag}</span>
                                                    <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-pink-600" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Copy All Button */}
                                    <Button
                                        onClick={() => handleCopyAll(col)}
                                        className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all ${
                                            isCopied
                                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                : "bg-[#1C1917] hover:bg-pink-600 text-white shadow-sm"
                                        }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied to Clipboard!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy All Hashtags
                                            </>
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Educational In-Depth Guide Content */}
                    <div className="prose-editorial text-left space-y-12 border-t border-[#E6E2D8] pt-12">
                        {/* Section 1: Intro & Guidelines */}
                        <section className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold font-sans text-[#1C1917]">
                                How to Choose the Best Hashtags for Instagram
                            </h2>
                            <p>
                                Finding the best hashtags for Instagram can make it easier for people to understand what your content is about and discover posts related to their interests. Whether you share photos, Instagram Reels, travel videos, fitness tips, food content, or business updates, choosing relevant hashtags is an essential part of your content strategy.
                            </p>
                            <p>
                                However, using random popular hashtags is not always the best approach. The right hashtags should describe your content, match your niche, and connect with the audience you want to reach.
                            </p>
                        </section>

                        {/* Section 2: 5-Step Strategy */}
                        <section className="space-y-4">
                            <h3 className="text-xl md:text-2xl font-bold font-sans text-[#1C1917]">
                                5-Step Instagram Hashtag Strategy
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-[#1C1917]">
                                        <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs flex items-center justify-center font-mono">1</span>
                                        Understand Your Post Topic
                                    </div>
                                    <p className="text-xs text-[#6B645C] leading-relaxed">
                                        Start by identifying the main subject of your photo, video, or Reel. If you post a home workout, fitness tags are far more effective than general lifestyle tags.
                                    </p>
                                </div>
                                <div className="p-5 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-[#1C1917]">
                                        <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs flex items-center justify-center font-mono">2</span>
                                        Combine Broad & Niche Tags
                                    </div>
                                    <p className="text-xs text-[#6B645C] leading-relaxed">
                                        Broad hashtags describe general topics (#photography), while niche hashtags explain the exact context (#portraitmood). This combination keeps your post discoverable and grounded.
                                    </p>
                                </div>
                                <div className="p-5 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-[#1C1917]">
                                        <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs flex items-center justify-center font-mono">3</span>
                                        Research Hashtag Relevance
                                    </div>
                                    <p className="text-xs text-[#6B645C] leading-relaxed">
                                        Search tags on Instagram before posting. Check if recent posts match your quality standards and whether creators in your niche are genuinely active under that tag.
                                    </p>
                                </div>
                                <div className="p-5 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-[#1C1917]">
                                        <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs flex items-center justify-center font-mono">4</span>
                                        Use Location-Specific Tags
                                    </div>
                                    <p className="text-xs text-[#6B645C] leading-relaxed">
                                        For travel, local businesses, or events, location hashtags (e.g. #NewYorkTravel, #LondonCoffee) attract nearby customers and engaged local audiences.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Rules & Limits */}
                        <section className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 space-y-4">
                            <h3 className="text-xl font-bold font-sans text-[#1C1917] flex items-center gap-2">
                                <Info className="w-5 h-5 text-pink-600" />
                                How Many Hashtags Should You Use on Instagram in 2026?
                            </h3>
                            <p className="text-sm md:text-base text-[#6B645C]">
                                Instagram currently allows <strong>up to five hashtags</strong> on a post or Reel. The platform has officially moved away from older practices where creators loaded captions with 20 or 30 generic tags.
                            </p>
                            <div className="p-4 bg-[#FAF9F5] border-l-4 border-pink-500 rounded-r-lg text-sm text-[#44403C]">
                                <strong className="text-[#1C1917]">Golden Rule:</strong> Five is a maximum, not an obligation. Using 3 to 4 tightly targeted tags that describe your exact content delivers far better algorithmic classification than filling space with irrelevant tags.
                            </div>
                        </section>

                        {/* Section 4: Do Hashtags Still Work? */}
                        <section className="space-y-4">
                            <h3 className="text-xl md:text-2xl font-bold font-sans text-[#1C1917]">
                                Do Instagram Hashtags Still Work in 2026?
                            </h3>
                            <p>
                                Yes, hashtags continue to play an important role in Instagram content organization and topic discovery. They help categorize posts and connect them with relevant explore feeds and search queries.
                            </p>
                            <p>
                                However, hashtags are one component of Instagram SEO. For true organic growth, pair your hashtags with:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#6B645C]">
                                <li><strong>Clear Captions:</strong> Write natural sentences that include primary search keywords.</li>
                                <li><strong>High-Resolution Visuals:</strong> Bright lighting, clear subject contrast, and crisp audio on Reels.</li>
                                <li><strong>Audience Retention:</strong> Hook viewers in the first 2 seconds of your video to maximize watch time.</li>
                                <li><strong>Consistent Posting Schedule:</strong> Regular publishing signals active authority to the recommendation engine.</li>
                            </ul>
                        </section>

                        {/* Section 5: Common Mistakes */}
                        <section className="space-y-4">
                            <h3 className="text-xl md:text-2xl font-bold font-sans text-[#1C1917] flex items-center gap-2 text-rose-600">
                                <AlertTriangle className="w-6 h-6" />
                                Common Instagram Hashtag Mistakes to Avoid
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { title: "Using Irrelevant Popular Tags", desc: "Do not add tags like #viral or #love to food or business posts. Algorithms penalize posts that mislead searchers." },
                                    { title: "Repeating the Same Hashtag Block", desc: "Copy-pasting the exact identical 5 tags across every single post can trigger spam filters. Rotate tags according to each post." },
                                    { title: "Ignoring Niche Keywords", desc: "Super-broad tags with 500M+ posts have high velocity, meaning your post gets buried in seconds. Niche tags keep you visible longer." },
                                    { title: "Neglecting Caption Text", desc: "Hashtags alone cannot save a blank caption. Provide context, ask a question, and describe what is happening in the image." }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 bg-white border border-[#E6E2D8] rounded-xl flex items-start gap-3">
                                        <span className="text-rose-500 font-bold font-mono text-sm">✕</span>
                                        <div>
                                            <strong className="text-sm text-[#1C1917] block mb-0.5">{item.title}</strong>
                                            <p className="text-xs text-[#6B645C]">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 6: FAQ Accordion */}
                        <section className="space-y-6 pt-6 border-t border-[#E6E2D8]">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-pink-600" />
                                <h3 className="text-2xl font-bold font-sans text-[#1C1917]">
                                    Frequently Asked Questions About Instagram Hashtags
                                </h3>
                            </div>

                            <Accordion type="single" collapsible className="w-full space-y-3">
                                {FAQS.map((faq, idx) => (
                                    <AccordionItem
                                        key={idx}
                                        value={`faq-${idx}`}
                                        className="bg-white border border-[#E6E2D8] rounded-xl px-5 py-1"
                                    >
                                        <AccordionTrigger className="text-left font-bold text-sm md:text-base text-[#1C1917] hover:no-underline hover:text-pink-600">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-xs md:text-sm text-[#6B645C] leading-relaxed pt-2 pb-4">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>

                        {/* Related Social & Media Tools */}
                        <section className="pt-8 border-t border-[#E6E2D8]">
                            <h3 className="text-2xl font-bold font-sans text-[#1C1917] mb-6">
                                Related Social Media & Creative Tools
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Link
                                    to="/facebook-reels-hashtags"
                                    className="p-5 bg-white border border-[#E6E2D8] rounded-xl hover:border-pink-500 transition-colors group block"
                                >
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-pink-600 font-bold block mb-1">
                                        SOCIAL TOOL
                                    </span>
                                    <h4 className="font-bold text-[#1C1917] group-hover:text-pink-600 transition-colors text-sm mb-1">
                                        Facebook Reels Hashtags
                                    </h4>
                                    <p className="text-xs text-[#78716C]">
                                        Trending & viral copy-paste tags for FB video reach in 2026.
                                    </p>
                                </Link>

                                <Link
                                    to="/tools/image-dpi-checker"
                                    className="p-5 bg-white border border-[#E6E2D8] rounded-xl hover:border-pink-500 transition-colors group block"
                                >
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-pink-600 font-bold block mb-1">
                                        IMAGE UTILITY
                                    </span>
                                    <h4 className="font-bold text-[#1C1917] group-hover:text-pink-600 transition-colors text-sm mb-1">
                                        Image DPI Checker
                                    </h4>
                                    <p className="text-xs text-[#78716C]">
                                        Verify resolution, dimensions, and 300 DPI readiness for social uploads.
                                    </p>
                                </Link>

                                <Link
                                    to="/blog/image-to-storyboard-to-video-ai-prompts"
                                    className="p-5 bg-white border border-[#E6E2D8] rounded-xl hover:border-pink-500 transition-colors group block"
                                >
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-pink-600 font-bold block mb-1">
                                        AI VIDEO GUIDE
                                    </span>
                                    <h4 className="font-bold text-[#1C1917] group-hover:text-pink-600 transition-colors text-sm mb-1">
                                        Image to Video AI Prompts
                                    </h4>
                                    <p className="text-xs text-[#78716C]">
                                        Create cinematic video sequences and storyboards for Reels and Shorts.
                                    </p>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
