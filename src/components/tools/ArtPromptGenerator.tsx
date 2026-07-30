import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Replace, List, CheckCircle2, RefreshCw, Copy, Layers } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import OtherConverters from "@/components/OtherConverters";

const promptTypes = [
    { value: "character", label: "Character prompt generator" },
    { value: "random", label: "Random drawing ideas" },
    { value: "painting", label: "Painting subjects" },
    { value: "style", label: "Art style prompt" },
    { value: "ai", label: "AI artwork prompt generator" },
    { value: "kids", label: "Kids art prompts" },
];

const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "advanced", label: "Advanced" },
];

const themesList = [
    { value: "none", label: "No Theme (Random)" },
    { value: "fantasy", label: "Fantasy" },
    { value: "scifi", label: "Sci-fi" },
    { value: "nature", label: "Nature" },
    { value: "horror", label: "Horror" },
    { value: "cute", label: "Cute" },
    { value: "anime", label: "Anime" },
    { value: "ghibli", label: "Ghibli style inspired" },
];

// Sample logic for generating prompts based on selections
const generateRandomPrompt = (type: string, difficulty: string, theme: string) => {
    const subjects = {
        character: ["A pirate queen", "A desert wizard", "An alien chef", "A warrior cat", "A robotic knight", "A lost child"],
        random: ["A futuristic city underwater", "A rainy street in Karachi at midnight", "A cup of coffee by a window", "A bicycle in the rain", "A treehouse at sunset"],
        painting: ["A vibrant sunset over a calm ocean", "A snowy mountain peak", "An old abandoned mansion", "A close-up of a blooming sunflower"],
        style: ["A bustling marketplace in watercolor", "An abstract geometric pattern", "A charcoal portrait of an old man"],
        ai: ["A highly detailed neon cyberpunk city, ultra-realistic 8k", "A magical forest with glowing plants, cinematic lighting"],
        kids: ["A flying elephant with balloons", "A cat astronaut on the moon", "A rainbow dinosaur park", "A smiling sun over a happy house"],
    };

    const difficulties = {
        easy: ["doing something simple", "standing still", "in a plain background"],
        medium: ["with interesting lighting", "in motion", "with dynamic pose"],
        advanced: ["with complex background elements", "in an intricate scene with deep perspective", "showing intense emotion and motion"],
    };

    const themesMap: Record<string, string[]> = {
        fantasy: ["in ancient ruins", "wielding a glass staff", "in a magical realm"],
        scifi: ["with a cybernetic arm", "running a bakery on Mars", "in a dystopian future"],
        nature: ["surrounded by dense jungle", "in a serene meadow", "next to a flowing river"],
        horror: ["in a haunted graveyard", "with eerie shadows", "under a blood red moon"],
        cute: ["with big adorable eyes", "surrounded by fluffy bunnies", "eating a giant cookie"],
        anime: ["in Japan anime style", "with spiky hair and glowing aura", "in a high school setting"],
        ghibli: ["inspired by animated fantasy storytelling", "with soft scenic clouds", "in a whimsical countryside"],
    };

    let subjectPool = subjects[type as keyof typeof subjects] || subjects["random"];
    let difficultyPool = difficulties[difficulty as keyof typeof difficulties] || difficulties["easy"];
    
    const randomSubject = subjectPool[Math.floor(Math.random() * subjectPool.length)];
    const randomDifficultyCode = difficultyPool[Math.floor(Math.random() * difficultyPool.length)];
    
    let prompt = `${randomSubject} ${randomDifficultyCode}`;

    if (theme !== "none") {
        let themePool = themesMap[theme] || [];
        if (themePool.length > 0) {
            const randomThemeMod = themePool[Math.floor(Math.random() * themePool.length)];
            prompt += ` ${randomThemeMod}`;
        }
    }

    return prompt + ".";
};

const ArtPromptGenerator = () => {
    const [promptType, setPromptType] = useState("character");
    const [difficulty, setDifficulty] = useState("medium");
    const [theme, setTheme] = useState("none");
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const pageTitle = "Art Prompt Generator – Free AI Ideas for Artists";
    const metaDescription = "Use our free Art Prompt Generator to get instant drawing, painting, character, and AI art ideas. No signup needed. Fast, fun, and creative.";

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is an art prompt generator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An art prompt generator creates creative ideas for drawing, painting, journaling, or AI artwork."
                }
            },
            {
                "@type": "Question",
                "name": "Is the art prompt generator free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many art prompt generators are free and require no signup."
                }
            },
            {
                "@type": "Question",
                "name": "Can kids use art prompt generators?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, many tools offer safe and fun prompts designed for children."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use prompts for AI art?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, prompts are commonly used in AI image generation tools."
                }
            },
            {
                "@type": "Question",
                "name": "How often should I use prompts?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Daily use is ideal for building creativity and improving art skills."
                }
            }
        ]
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate a slight delay for better UX
        setTimeout(() => {
            const newPrompt = generateRandomPrompt(promptType, difficulty, theme);
            setGeneratedPrompt(newPrompt);
            setIsGenerating(false);
            toast.success("Prompt generated!");
        }, 500);
    };

    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt);
            toast.success("Prompt copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead title={pageTitle} description={metaDescription} schema={faqSchema} />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-left mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[1px] w-6 bg-rose-500"></span>
                            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-rose-600">
                                FREE TOOL · RUNS IN YOUR BROWSER
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-[#1C1917] leading-tight">
                            Art Prompt Generator – Get Unlimited Creative Ideas Instantly
                        </h1>
                        <p className="text-lg md:text-xl text-[#6B645C] max-w-3xl leading-relaxed mb-6">
                            Stuck staring at a blank canvas? Running out of drawing ideas? Our Art Prompt Generator helps artists, students, designers, and creators generate fresh ideas in seconds.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["100% FREE", "NO SIGNUP", "NO WATERMARK", "FILES NEVER UPLOADED", "UNLIMITED CONVERSIONS"].map((b) => (
                                <span key={b} className="text-[10px] font-mono font-semibold tracking-wider px-3 py-1.5 rounded-full bg-[#EFECE6] text-[#6B645C]">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-10 shadow-sm mb-12 text-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Step 1: Choose Prompt Type</label>
                                <Select value={promptType} onValueChange={setPromptType}>
                                    <SelectTrigger className="w-full bg-background border-border h-12 rounded-xl">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {promptTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Step 2: Pick Difficulty Level</label>
                                <Select value={difficulty} onValueChange={setDifficulty}>
                                    <SelectTrigger className="w-full bg-background border-border h-12 rounded-xl">
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {difficultyLevels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Step 3: Add Theme (Optional)</label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger className="w-full bg-background border-border h-12 rounded-xl">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {themesList.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center mb-8">
                            <Button 
                                onClick={handleGenerate} 
                                disabled={isGenerating}
                                size="lg" 
                                className="w-full md:w-auto px-12 py-6 text-lg rounded-2xl shadow-lg shadow-primary/20 gap-2 font-bold"
                            >
                                <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
                                Step 4: Click Generate
                            </Button>
                        </div>

                        {generatedPrompt && (
                            <div className="bg-accent/5 border border-primary/20 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Your Creative Prompt</h3>
                                <p className="text-2xl md:text-3xl font-medium text-foreground mb-6 leading-relaxed">
                                    "{generatedPrompt}"
                                </p>
                                <Button onClick={handleCopy} variant="outline" className="gap-2 rounded-xl group hover:bg-primary hover:text-primary-foreground border-primary/20">
                                    <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    Copy Prompt
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-xl font-bold text-[#1C1917]">100% Free & Unlimited</h3>
                            <p className="text-[#6B645C] text-sm">
                                Unlimited prompt generation, no signup required. Generate your next masterpiece now — free and instant.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-xl font-bold text-[#1C1917]">Beat Creative Block Fast</h3>
                            <p className="text-[#6B645C] text-sm">
                                No more wasting 30 minutes deciding what to draw. A random artist prompt generator helps you move from thinking to creating.
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-[#E6E2D8] rounded-xl hover:border-[#1C1917] transition-colors">
                            <h3 className="text-xl font-bold text-[#1C1917]">Improve Skill Consistency</h3>
                            <p className="text-[#6B645C] text-sm">
                                Daily prompts help build habits. Consistent output improves your portfolio over time.
                            </p>
                        </div>
                    </div>

                    <div className="prose-editorial text-left space-y-10 border-t border-[#E6E2D8] pt-12">
                        <div className="bg-card/50 p-8 md:p-12 rounded-[2.5rem] border border-border">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Many creators lose momentum because they don’t know what to draw next. That creative block can delay projects, commissions, class assignments, or social media content. This tool solves that problem instantly.
                                    <br /><br />
                                    Try it now — get fresh art prompts with no signup required.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">What Is an Art Prompt Generator?</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    An Art Prompt Generator is an online tool that creates random or themed creative prompts for drawing, painting, digital art, journaling, or AI-generated images. It gives artists a starting point so they can begin creating immediately.
                                </p>
                                
                                <h3 className="text-xl font-bold mb-4">Examples of prompts:</h3>
                                <ul className="space-y-3 mb-8 list-none p-0 text-muted-foreground font-medium">
                                    <li className="flex items-center gap-2">🎨 A futuristic city underwater</li>
                                    <li className="flex items-center gap-2">🎨 A warrior cat guarding ancient ruins</li>
                                    <li className="flex items-center gap-2">🎨 A rainy street in Karachi at midnight</li>
                                    <li className="flex items-center gap-2">🎨 A magical forest in Japan anime style</li>
                                    <li className="flex items-center gap-2">🎨 A robot learning to paint</li>
                                </ul>

                                <h3 className="text-xl font-bold mb-4">These prompts can be used for:</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Traditional sketching</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Digital illustration</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Character design</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Comic creation</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Storyboarding</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> AI image tools like OpenAI image models</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Art journaling</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Daily art challenges</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Why You Need an Artist Prompt Generator</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Creative block happens to beginners and professionals alike. A random artist prompt generator helps you move from thinking to creating.
                                </p>

                                <h3 className="text-2xl font-bold mb-4">Real-Life Use Cases</h3>
                                <ul className="space-y-4 mb-8 list-none p-0 text-muted-foreground">
                                    <li><strong>For Students:</strong> Need to complete an art homework assignment quickly? Use prompts for fast ideas.</li>
                                    <li><strong>For Freelancers:</strong> Need concept ideas for client mood boards or thumbnails? Generate multiple directions fast.</li>
                                    <li><strong>For Social Media Creators:</strong> Need daily post ideas for Instagram or TikTok? Use challenge prompts.</li>
                                    <li><strong>For AI Artists:</strong> Need better prompt-to-image concepts? Use creative combinations instantly.</li>
                                    <li><strong>For Journal Users:</strong> Want emotional reflection prompts? Use art journal prompt ideas.</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Top Features of Our Free Art Prompt Generator</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 list-none p-0 text-muted-foreground font-medium">
                                    <li className="flex items-center gap-2">✅ Free to use</li>
                                    <li className="flex items-center gap-2">✅ No signup required</li>
                                    <li className="flex items-center gap-2">✅ Unlimited prompt generation</li>
                                    <li className="flex items-center gap-2">✅ Works on mobile and desktop</li>
                                    <li className="flex items-center gap-2">✅ Character prompts included</li>
                                    <li className="flex items-center gap-2">✅ Kids-friendly art ideas</li>
                                    <li className="flex items-center gap-2">✅ AI image prompts supported</li>
                                    <li className="flex items-center gap-2">✅ Daily challenge prompts</li>
                                    <li className="flex items-center gap-2">✅ Fast one-click results</li>
                                    <li className="flex items-center gap-2">✅ Private and secure</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Benefits of Using an Art Idea Generator</h2>
                                <ul className="space-y-4 mb-8 list-none p-0 text-muted-foreground">
                                    <li><strong>Beat Creative Block Fast:</strong> No more wasting 30 minutes deciding what to draw.</li>
                                    <li><strong>Improve Skill Consistency:</strong> Daily prompts help build habits.</li>
                                    <li><strong>Explore New Styles:</strong> Try realism, cartoon, anime, abstract, surrealism, and more.</li>
                                    <li><strong>Better Portfolio Growth:</strong> Consistent output improves your portfolio over time.</li>
                                    <li><strong>Great for Beginners:</strong> You don’t need advanced ideas to begin. Even simple prompts help.</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Popular Prompt Categories</h2>
                                <div className="space-y-6 mb-8 text-muted-foreground">
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground mb-2">Random Character Art Prompt Generator</h4>
                                        <p>Create ideas like: Pirate queen with cybernetic arm, Desert wizard with glass staff, Alien chef running a bakery.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground mb-2">Random Art Prompt Generator for Kids</h4>
                                        <p>Safe and fun ideas: Flying elephant with balloons, Cat astronaut on the moon, Rainbow dinosaur park.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground mb-2">Easy Random Art Prompt Generator</h4>
                                        <p>Simple ideas: Cup of coffee by a window, Bicycle in the rain, Treehouse at sunset.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground mb-2">Ghibli Art Style Prompt Generator</h4>
                                        <p>Whimsical prompts inspired by animated fantasy storytelling.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground mb-2">Indian Art Style Prompt Generator</h4>
                                        <p>Blend folk motifs, heritage patterns, temple scenes, color traditions.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">Art Prompt Generator vs Other Tools</h2>
                                <div className="overflow-x-auto mb-12">
                                    <table className="w-full border-collapse border border-border">
                                        <thead>
                                            <tr className="bg-accent/20">
                                                <th className="border border-border p-3 text-left">Feature</th>
                                                <th className="border border-border p-3 text-left">Our Tool</th>
                                                <th className="border border-border p-3 text-left">Generic Randomizer</th>
                                                <th className="border border-border p-3 text-left">AI Text Tool</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-border p-3">Art-focused prompts</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">Limited</td>
                                                <td className="border border-border p-3">Sometimes</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Character ideas</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">No</td>
                                                <td className="border border-border p-3">Yes</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Style prompts</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">No</td>
                                                <td className="border border-border p-3">Yes</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Kids prompts</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">Rare</td>
                                                <td className="border border-border p-3">No</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Instant use</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">Slower</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-border p-3">Free access</td>
                                                <td className="border border-border p-3">Yes</td>
                                                <td className="border border-border p-3">Mixed</td>
                                                <td className="border border-border p-3">Mixed</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h2 className="text-3xl font-bold mb-6">Pro Tips to Get Better Prompts</h2>
                                <ul className="space-y-3 mb-8 text-muted-foreground">
                                    <li><strong>Combine Two Prompts:</strong> Example: “Cyberpunk city” + “lost child”</li>
                                    <li><strong>Use Time Limits:</strong> Create within 20 minutes to boost speed.</li>
                                    <li><strong>Change Medium:</strong> Turn one prompt into watercolor, pencil, or 3D.</li>
                                    <li><strong>Use Seasonal Themes:</strong> Ramadan, Eid, winter, monsoon, summer.</li>
                                    <li><strong>Build a Series:</strong> Use one character in five different prompts.</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid</h2>
                                <ul className="space-y-3 mb-8 list-none p-0 text-muted-foreground">
                                    <li className="flex items-center gap-2">❌ <strong>Waiting for the Perfect Idea:</strong> Start with any prompt and improve while drawing.</li>
                                    <li className="flex items-center gap-2">❌ <strong>Overcomplicating the Scene:</strong> Use simple prompts first.</li>
                                    <li className="flex items-center gap-2">❌ <strong>Ignoring Practice Consistency:</strong> Daily small sketches beat rare big projects.</li>
                                    <li className="flex items-center gap-2">❌ <strong>Copying Without Personalization:</strong> Add your own twist.</li>
                                    <li className="flex items-center gap-2">❌ <strong>Not Saving Good Prompts:</strong> Keep a folder or journal.</li>
                                </ul>

                                <h2 className="text-3xl font-bold mb-6">Why Artists in Pakistan and India Love Prompt Tools</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Creators in Pakistan and India often use mobile devices, student laptops, and budget tablets. A lightweight free prompt generator helps them practice daily without expensive software.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    From school competitions to freelance design gigs, quick inspiration matters.
                                </p>

                                <h2 className="text-3xl font-bold mb-6">Final Thoughts: Use the Best Art Prompt Generator Today</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    If you’re stuck, bored, overwhelmed, or simply want to create more often, an Art Prompt Generator is one of the easiest ways to unlock momentum. You don’t need perfect ideas. You need a starting point.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Whether you need an artist prompt generator, random art prompt generator, AI artwork prompt generator, or art style prompt generator, this tool can help instantly.
                                </p>
                                <p className="mb-8 font-bold text-center text-xl">
                                    👉 Try it now — generate your next art idea in seconds. No signup required.
                                </p>

                                <h2 className="text-3xl font-bold mb-10">People Also Ask (FAQs)</h2>
                                <div className="space-y-8 mb-12">
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">What is an art prompt?</h4>
                                        <p className="text-muted-foreground">An art prompt is a creative suggestion used to inspire drawing, painting, journaling, or digital artwork.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">What is the best free art prompt generator online?</h4>
                                        <p className="text-muted-foreground">The best one gives instant ideas, multiple categories, no signup, and unlimited use.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">Can kids use a random art prompt generator?</h4>
                                        <p className="text-muted-foreground">Yes, kid-friendly prompt modes make drawing fun and educational.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">Can I use prompts for AI image generation?</h4>
                                        <p className="text-muted-foreground">Yes. Prompts work with many prompt-to-image systems.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">How do I get better at drawing with prompts?</h4>
                                        <p className="text-muted-foreground">Practice daily, try timed sketches, and explore different styles.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <OtherConverters />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ArtPromptGenerator;
