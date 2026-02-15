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

const MockInterview = () => {
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
      if (data?.error) throw new Error(data.error);
      setQuestions(data.questions);
      setUserAnswers(new Array(data.questions.length).fill(-1));
      setCurrentQ(0);
      setSelectedOption(null);
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
      // All done, score it
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
    setUserAnswers([]);
    setCurrentQ(0);
    setSelectedOption(null);
    setScoreResult(null);
    setJobDescription("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <>
      <SEOHead
        title="AI Mock Interview Practice | FreeImagePrompt"
        description="Practice for your next job interview with AI-generated MCQ questions. Get instant scores and improve your interview skills."
        canonicalUrl="https://freeimageprompt.com/tools/mock-interview"
      />
      <Navigation />
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          {/* INPUT PHASE */}
          {phase === "input" && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" /> AI-Powered Mock Interview
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Ace Your Next <span className="text-primary">Interview</span>
              </h1>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Paste your job description and practice with AI-generated interview questions
              </p>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-left shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Job Description</h2>
                </div>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[180px] resize-none bg-background border-border text-sm mb-2"
                />
                <p className="text-xs text-muted-foreground mb-5">
                  Example: We are looking for a Senior React Developer with 5+ years of experience in building scalable web applications. Must have expertise in TypeScript, state management, and modern CSS frameworks...
                </p>
                <div className="flex justify-end">
                  <Button onClick={handleStart} size="lg" className="gap-2 rounded-xl">
                    Start Interview <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> 5 Tailored Questions</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Instant Scoring</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Skip & Restart</span>
              </div>
            </div>
          )}

          {/* LOADING PHASE */}
          {(phase === "loading" || phase === "scoring") && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute inset-0 h-24 w-24 rounded-full border-2 border-primary/30 animate-spin" style={{ borderTopColor: "hsl(var(--primary))" }} />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {phase === "loading" ? "Preparing Your Interview" : "Calculating Your Score"}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {phase === "loading"
                  ? "AI is analyzing the job description and crafting personalized questions..."
                  : "Evaluating your answers..."}
              </p>
              {phase === "loading" && (
                <div className="space-y-3 text-sm text-primary">
                  <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-pulse" /> Analyzing job requirements</p>
                  <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-pulse" /> Generating relevant questions</p>
                  <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-pulse" /> Creating answer options</p>
                </div>
              )}
            </div>
          )}

          {/* QUIZ PHASE */}
          {phase === "quiz" && questions.length > 0 && (
            <div>
              {/* Progress */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
                <Button variant="ghost" size="sm" onClick={handleRestart} className="gap-1 text-muted-foreground hover:text-destructive">
                  <RotateCcw className="h-4 w-4" /> Restart
                </Button>
              </div>
              <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
                <h2 className="text-xl font-semibold mb-6">{questions[currentQ].question}</h2>

                <div className="space-y-3 mb-8">
                  {questions[currentQ].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedOption === idx
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/40 hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          selectedOption === idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-sm font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={handleSkip} className="gap-1 text-muted-foreground">
                    <SkipForward className="h-4 w-4" /> Skip
                  </Button>
                  <Button onClick={handleAnswer} disabled={selectedOption === null} className="gap-2 rounded-xl">
                    {currentQ < questions.length - 1 ? "Next Question" : "Finish Interview"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* RESULTS PHASE */}
          {phase === "results" && scoreResult && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-1">Interview Complete!</h2>
                <p className="text-muted-foreground">Here's how you performed</p>
              </div>

              {/* Score Card */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg mb-8">
                <p className={`text-6xl font-bold ${getScoreColor(scoreResult.score)}`}>{scoreResult.score}%</p>
                <p className="text-muted-foreground mt-2">Overall Score</p>
                <div className="flex justify-center gap-8 mt-6 text-sm">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" /> {scoreResult.correct} Correct
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="h-5 w-5" /> {scoreResult.total - scoreResult.correct - scoreResult.skipped} Wrong
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <SkipForward className="h-5 w-5" /> {scoreResult.skipped} Skipped
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4 mb-8">
                {scoreResult.results.map((r, i) => (
                  <div key={i} className={`bg-card border rounded-xl p-5 ${r.correct ? "border-green-500/30" : r.skipped ? "border-border" : "border-red-500/30"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                        r.correct ? "bg-green-500/10 text-green-500" : r.skipped ? "bg-muted text-muted-foreground" : "bg-red-500/10 text-red-500"
                      }`}>
                        {r.correct ? <CheckCircle2 className="h-4 w-4" /> : r.skipped ? <SkipForward className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{questions[i].question}</p>
                        {!r.skipped && r.userAnswer !== null && (
                          <p className={`text-xs ${r.correct ? "text-green-500" : "text-red-500"}`}>
                            Your answer: {questions[i].options[r.userAnswer]}
                          </p>
                        )}
                        {!r.correct && (
                          <p className="text-xs text-primary mt-1">
                            Correct: {questions[i].options[r.correctAnswer]}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{r.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={handleRestart} variant="outline" className="gap-2 rounded-xl">
                  <RotateCcw className="h-4 w-4" /> Try Again
                </Button>
                <Button onClick={() => { setPhase("input"); setScoreResult(null); setQuestions([]); }} className="gap-2 rounded-xl">
                  New Interview <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <section className="container mx-auto px-4 max-w-4xl mt-16">
          <div className="bg-card border border-border rounded-2xl p-8 prose prose-sm dark:prose-invert max-w-none">
            <h2>AI Mock Interview Practice - Prepare for Your Dream Job</h2>
            <p>Our AI-powered mock interview tool helps you prepare for job interviews by generating tailored multiple-choice questions based on real job descriptions. Whether you're a software developer, data analyst, designer, or any other professional, this tool adapts to your target role.</p>
            
            <h3>How It Works</h3>
            <ol>
              <li><strong>Paste Your Job Description</strong> – Copy the job posting you're applying for and paste it into the text area above.</li>
              <li><strong>AI Generates Questions</strong> – Our AI analyzes the job requirements and creates 5 relevant interview questions with 4 answer options each.</li>
              <li><strong>Answer or Skip</strong> – Take your time to answer each question. You can skip questions you're unsure about.</li>
              <li><strong>Get Your Score</strong> – After completing all questions, you'll receive a detailed score with explanations for each answer.</li>
              <li><strong>Restart Anytime</strong> – Not satisfied? Restart the interview or try with a different job description.</li>
            </ol>

            <h3>Why Practice with AI Mock Interviews?</h3>
            <ul>
              <li>Build confidence before your actual interview</li>
              <li>Identify knowledge gaps in your technical skills</li>
              <li>Learn from detailed explanations of correct answers</li>
              <li>Practice as many times as you want, completely free</li>
              <li>Questions are tailored to the specific job you're applying for</li>
            </ul>

            <h3>Tips for Better Interview Preparation</h3>
            <p>Use this tool alongside your regular interview preparation. Review the explanations for questions you got wrong, study the relevant topics, and retake the interview to track your improvement. The more you practice, the more confident you'll feel during your actual interview.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MockInterview;
