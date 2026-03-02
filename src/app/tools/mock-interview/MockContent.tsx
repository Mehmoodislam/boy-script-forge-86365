import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Brain, Sparkles, RotateCcw, SkipForward, CheckCircle2, XCircle, Trophy, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface ScoreResult {
    score: number;
    correct: number;
    total: number;
    skipped: number;
    results: {
        questionId: number;
        correct: boolean;
        skipped: boolean;
        correctAnswer: number;
        userAnswer: number | null;
        explanation: string;
    }[];
}

type Phase = "input" | "loading" | "quiz" | "scoring" | "results";

export default function MockInterview() {
    const [phase, setPhase] = useState<Phase>("input");
    const [jobDescription, setJobDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(number | -1)[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
    const { toast } = useToast();

    const handleStart = async () => {
        if (!jobDescription.trim()) {
            toast({ title: "Please enter a job description", variant: "destructive" });
            return;
        }
        setPhase("loading");
        try {
            const { data, error } = await supabase.functions.invoke("mock-interview", {
                body: { action: "generate", jobDescription },
            });
            if (error) throw error;
            setQuestions(data.questions);
            setUserAnswers(new Array(data.questions.length).fill(-1));
            setPhase("quiz");
        } catch (err: any) {
            toast({ title: "Error generating questions", description: err.message, variant: "destructive" });
            setPhase("input");
        }
    };

    const handleAnswer = () => {
        if (selectedOption === null) return;
        const newAnswers = [...userAnswers];
        newAnswers[currentQ] = selectedOption;
        setUserAnswers(newAnswers);
        goNext(newAnswers);
    };

    const handleSkip = () => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQ] = -1;
        setUserAnswers(newAnswers);
        goNext(newAnswers);
    };

    const goNext = async (answers: (number | -1)[]) => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setSelectedOption(null);
        } else {
            setPhase("scoring");
            try {
                const { data, error } = await supabase.functions.invoke("mock-interview", {
                    body: { action: "score", questions, userAnswers: answers },
                });
                if (error) throw error;
                setScoreResult(data);
                setPhase("results");
            } catch (err: any) {
                toast({ title: "Error scoring", description: err.message, variant: "destructive" });
                setPhase("quiz");
            }
        }
    };

    const handleRestart = () => {
        setPhase("input");
        setQuestions([]);
        setJobDescription("");
    };

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Mock Interview - Practice with AI"
                description="Prepare for your job interview with AI-generated questions."
                canonicalUrl="https://freeimageprompt.com/tools/mock-interview"
            />
            <Navigation />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {phase === "input" && (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Mock Interview</h1>
                            <Textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste job description..."
                                className="mb-4 h-48"
                            />
                            <Button onClick={handleStart}>Start Interview</Button>
                        </div>
                    )}
                    {phase === "loading" && <div className="text-center">Analysing Job Description...</div>}
                    {phase === "quiz" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">{questions[currentQ].question}</h2>
                            {questions[currentQ].options.map((opt, idx) => (
                                <button key={idx} onClick={() => setSelectedOption(idx)} className={`w-full p-4 mb-2 border rounded ${selectedOption === idx ? "bg-primary/20" : ""}`}>
                                    {opt}
                                </button>
                            ))}
                            <div className="flex justify-between mt-4">
                                <Button variant="ghost" onClick={handleSkip}>Skip</Button>
                                <Button onClick={handleAnswer} disabled={selectedOption === null}>Next</Button>
                            </div>
                        </div>
                    )}
                    {phase === "results" && scoreResult && (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">Score: {scoreResult.score}%</h2>
                            <Button onClick={handleRestart} className="mt-4">Try Again</Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
