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
        title="Common Interview Questions & Answers - Job Interview Guide | FreeImagePrompt"
        description="Prepare for your job interview with common interview questions and answers. Learn how to give a good answer, impress interviewers, and stand out."
        canonicalUrl="https://freeimageprompt.com/tools/mock-interview"
      />
      <Navigation />
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 mt-10">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          {/* INPUT PHASE */}
          {phase === "input" && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" /> AI-Powered Mock Interview
              </div>
              <p className="text-4xl md:text-5xl font-bold mb-3">
                Ace Your Next <span className="text-primary">Interview</span>
              </p>
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
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedOption === idx
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/40 hover:bg-accent/5"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${selectedOption === idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
                      <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${r.correct ? "bg-green-500/10 text-green-500" : r.skipped ? "bg-muted text-muted-foreground" : "bg-red-500/10 text-red-500"
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
        {/* Content Section SEO */}
        <article className="mt-16 prose prose-lg dark:prose-invert max-w-4xl m-auto">

            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                 Common Interview Questions and Answers: How to Give a Good Answer in a Job Interview
            </h1>
           
        <p className="text-muted-foreground text-lg max-w-5xl mx-auto">
          An interview question can shape the outcome of your job interview. Employers use
          common interview questions to evaluate your skills, experience, and personality.
          This guide explains why interviewers ask certain questions and how to prepare
          strong, confident answers that help you stand out.
        </p>
          <p className="text-muted-foreground text-lg">
            Below is a structured breakdown of common job interview questions, why employers
            ask them, and how you can answer effectively without sounding rehearsed.
          </p>

          <div className="border-2 border-gray-200 dark:border-gray-800 rounded-lg p-4 mt-6">
            <h2 className="text-2xl font-semibold mb-2">Article Outline</h2>
            <ul className="list-disc pl-5">
              <li>Interview Question Basics: What Are Employers Really Asking?</li>
              <li>Tell Me About a Time You Faced a Challenge</li>
              <li>Why Do You Want to Work Here?</li>
              <li>Questions About Your Current Job or Position</li>
              <li>Tell Me About a Time You Disagreed at Work</li>
              <li>What Kind of Work Environment Do You Prefer?</li>
              <li>Common Interview Questions About Strengths and Weakness</li>
              <li>Questions About Your Last Job and Work History</li>
              <li>Salary Expectations and Current Salary</li>
              <li>Questions to Ask at the End of a Job Interview</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Interview Question Basics: What Are Employers Really Asking?</h2>
          <p className="text-muted-foreground text-lg">
            Every interview question is designed to reveal something specific. The interviewer
            or hiring manager wants to know if your skills and mindset align with the job
            description and company goals.
          </p>
          <p className="text-muted-foreground text-lg">
            Understanding why employers ask certain questions helps you answer confidently
            and position yourself as a strong candidate.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Tell Me About a Time You Faced a Challenge</h2>
          <p className="text-muted-foreground text-lg">
            “Tell me about a time” questions are behavioral questions that evaluate how you
            respond to real workplace situations. Interviewers look for problem-solving,
            accountability, and learning.
          </p>
          <p className="text-muted-foreground text-lg">
            Use the STAR method to structure your answer and choose an example relevant to
            the role you are applying for.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Why Do You Want to Work Here?</h2>
          <p className="text-muted-foreground text-lg">
            This question helps interviewers measure motivation and cultural fit. A strong
            answer shows you understand the company’s mission and values.
          </p>
          <p className="text-muted-foreground text-lg">
            Connect your skills and career goals with what the organization offers to show
            genuine interest.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Questions About Your Current Job or Position</h2>
          <p className="text-muted-foreground text-lg">
            Interviewers ask about your current job to understand your responsibilities,
            growth, and experience.
          </p>
          <p className="text-muted-foreground text-lg">
            Focus on achievements and skills relevant to the new role while remaining
            professional about your current employer.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Tell Me About a Time You Disagreed at Work</h2>
          <p className="text-muted-foreground text-lg">
            Questions about disagreement assess teamwork and communication skills. Employers
            want to see that you handle conflict respectfully.
          </p>
          <p className="text-muted-foreground text-lg">
            Explain how you listened, communicated clearly, and worked toward a solution.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">What Kind of Work Environment Do You Prefer?</h2>
          <p className="text-muted-foreground text-lg">
            This question helps determine if you are the right fit for the company culture.
          </p>
          <p className="text-muted-foreground text-lg">
            Be honest while highlighting adaptability and collaboration.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Common Interview Questions About Strengths and Weakness</h2>
          <p className="text-muted-foreground text-lg">
            When asked about strengths, focus on skills relevant to the position. When asked
            about weaknesses, show self-awareness and improvement.
          </p>
          <p className="text-muted-foreground text-lg">
            Avoid vague answers and provide examples that demonstrate growth.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Questions About Your Last Job and Work History</h2>
          <p className="text-muted-foreground text-lg">
            Employers ask about your last job to understand your career progression and
            decision-making.
          </p>
          <p className="text-muted-foreground text-lg">
            Emphasize learning experiences and how they prepared you for the next role.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Salary Expectations and Current Salary</h2>
          <p className="text-muted-foreground text-lg">
            Salary questions help employers determine alignment with their budget.
          </p>
          <p className="text-muted-foreground text-lg">
            Research market rates and provide a reasonable salary range rather than a fixed
            number.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Questions to Ask at the End of a Job Interview</h2>
          <p className="text-muted-foreground text-lg">
            Asking thoughtful questions shows interest and preparation.
          </p>
          <p className="text-muted-foreground text-lg">
            Ask about growth opportunities, team structure, or performance expectations.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Key Takeaways</h2>
          <ul className="list-disc pl-5">
            <li className="text-muted-foreground">Understand the intent behind every interview question</li>
            <li className="text-muted-foreground">Use real examples instead of memorized answers</li>
            <li className="text-muted-foreground">Align responses with the role you are applying for</li>
            <li className="text-muted-foreground">Prepare smart questions for the end of the interview</li>
            <li className="text-muted-foreground">Confidence and clarity leave a strong impression</li>
          </ul>

        </article>
      </main>
      <Footer />
    </>
  );
};

export default MockInterview;
