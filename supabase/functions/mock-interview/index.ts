import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, jobDescription, questions, userAnswers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (action === "generate") {
      // Generate 5 MCQ interview questions based on job description
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are an expert technical interviewer. Generate exactly 5 multiple-choice interview questions based on the given job description. Each question must have exactly 4 options with only one correct answer.

Return ONLY valid JSON in this exact format, no extra text:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation why this is correct"
    }
  ]
}

correctAnswer is the 0-based index of the correct option. Make questions relevant to the job role, covering technical skills, concepts, and best practices mentioned in the job description.`,
            },
            {
              role: "user",
              content: `Generate 5 interview MCQ questions for this job:\n\n${jobDescription}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Credits exhausted. Please add credits." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1];
      
      const parsed = JSON.parse(jsonStr.trim());
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "score") {
      // Score the user's answers
      let correct = 0;
      let skipped = 0;
      const results = questions.map((q: any, i: number) => {
        const userAnswer = userAnswers[i];
        if (userAnswer === null || userAnswer === undefined || userAnswer === -1) {
          skipped++;
          return { questionId: q.id, correct: false, skipped: true, correctAnswer: q.correctAnswer, userAnswer: null, explanation: q.explanation };
        }
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correct++;
        return { questionId: q.id, correct: isCorrect, skipped: false, correctAnswer: q.correctAnswer, userAnswer, explanation: q.explanation };
      });

      const total = questions.length;
      const score = Math.round((correct / total) * 100);

      return new Response(JSON.stringify({
        score,
        correct,
        total,
        skipped,
        results,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("mock-interview error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
