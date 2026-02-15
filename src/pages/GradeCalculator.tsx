import { useState, useEffect } from "react";
import { Calculator, Plus, Trash2, RotateCcw, Save, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Assignment {
    id: string;
    name: string;
    grade: string;
    weight: string;
}

const GradeCalculator = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([
        { id: "1", name: "Assignment 1", grade: "", weight: "" },
        { id: "2", name: "Assignment 2", grade: "", weight: "" },
        { id: "3", name: "Final Exam", grade: "", weight: "" },
    ]);

    const [finalGrade, setFinalGrade] = useState<number | null>(null);
    const [totalWeight, setTotalWeight] = useState<number>(0);

    // Calculate grade whenever inputs change
    useEffect(() => {
        calculateGrade();
    }, [assignments]);

    const addAssignment = () => {
        setAssignments([
            ...assignments,
            {
                id: Date.now().toString(),
                name: `Assignment ${assignments.length + 1}`,
                grade: "",
                weight: "",
            },
        ]);
    };

    const removeAssignment = (id: string) => {
        if (assignments.length > 1) {
            setAssignments(assignments.filter((a) => a.id !== id));
        } else {
            toast.error("You need at least one assignment");
        }
    };

    const updateAssignment = (id: string, field: keyof Assignment, value: string) => {
        setAssignments(
            assignments.map((a) => (a.id === id ? { ...a, [field]: value } : a))
        );
    };

    const resetCalculator = () => {
        setAssignments([
            { id: "1", name: "Assignment 1", grade: "", weight: "" },
            { id: "2", name: "Assignment 2", grade: "", weight: "" },
            { id: "3", name: "Final Exam", grade: "", weight: "" },
        ]);
        setFinalGrade(null);
        setTotalWeight(0);
        toast.success("Calculator reset!");
    };

    const calculateGrade = () => {
        let totalWeightedScore = 0;
        let currentTotalWeight = 0;
        let allValid = true;

        assignments.forEach((a) => {
            const grade = parseFloat(a.grade);
            const weight = parseFloat(a.weight);

            if (!isNaN(grade) && !isNaN(weight)) {
                totalWeightedScore += grade * (weight / 100);
                currentTotalWeight += weight;
            } else if (a.grade !== "" || a.weight !== "") {
                // If one field is filled but not the other, or invalid info
                allValid = false;
            }
        });

        setTotalWeight(currentTotalWeight);

        if (currentTotalWeight > 0) {
            // Logic: If total weight is not 100%, we show current average based on weight entered
            // Or we can calculate what they need (future feature)
            // For now, let's show the weighted average normalized to the weight entered
            const weightedAverage = (totalWeightedScore * 100) / (currentTotalWeight / 100) / 100;
            setFinalGrade(weightedAverage);
        } else {
            setFinalGrade(null);
        }
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return "text-green-500";
        if (grade >= 80) return "text-blue-500";
        if (grade >= 70) return "text-yellow-500";
        if (grade >= 60) return "text-orange-500";
        return "text-red-500";
    };

    const getLetterGrade = (grade: number) => {
        if (grade >= 93) return "A";
        if (grade >= 90) return "A-";
        if (grade >= 87) return "B+";
        if (grade >= 83) return "B";
        if (grade >= 80) return "B-";
        if (grade >= 77) return "C+";
        if (grade >= 73) return "C";
        if (grade >= 70) return "C-";
        if (grade >= 67) return "D+";
        if (grade >= 63) return "D";
        if (grade >= 60) return "D-";
        return "F";
    };

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Grade Calculator Guide - Calculate Test & Final Grades Easily | FreeImagePrompt"
                description="Use our free grade calculator to calculate test scores, weighted grades, and your final grade. Perfect for school, college, and university students."
                canonicalUrl="https://freeimageprompt.com/tools/grade-calculator"
                keywords="grade calculator, grade calculator, final grade calculator, calculate final grade, weighted grade calculator, calculate grade, test grade calculator, weighted grade calculator, gpa calculator, calculate my grade, college grade calculator, final grade calculator"
            />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                            <Calculator className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            How to Calculate Every Test Grade and Final Grade with Confidence
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-5xl mx-auto">
                            A grade calculator is one of the simplest and most powerful ways to understand your academic progress. Whether you want to estimate a test grade, predict your final grade, or plan what score you need on an exam, the right calculator can save time and stress. This article is worth reading because it explains not just how to calculate grades, but also how grading works in real classrooms, from quizzes and homework to weighted finals.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Calculator Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Assignments</h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetCalculator}
                                        className="gap-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {/* Headers */}
                                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground px-1">
                                        <div className="col-span-5 md:col-span-6">Assignment Name</div>
                                        <div className="col-span-3 md:col-span-2 text-center">Grade (%)</div>
                                        <div className="col-span-3 md:col-span-3 text-center">Weight (%)</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {/* Rows */}
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="col-span-5 md:col-span-6">
                                                <Input
                                                    placeholder="e.g. Homework 1"
                                                    value={assignment.name}
                                                    onChange={(e) => updateAssignment(assignment.id, "name", e.target.value)}
                                                    className="bg-background/50"
                                                />
                                            </div>
                                            <div className="col-span-3 md:col-span-2">
                                                <Input
                                                    type="number"
                                                    placeholder="85"
                                                    value={assignment.grade}
                                                    onChange={(e) => updateAssignment(assignment.id, "grade", e.target.value)}
                                                    className="text-center bg-background/50"
                                                />
                                            </div>
                                            <div className="col-span-3 md:col-span-3">
                                                <Input
                                                    type="number"
                                                    placeholder="20"
                                                    value={assignment.weight}
                                                    onChange={(e) => updateAssignment(assignment.id, "weight", e.target.value)}
                                                    className="text-center bg-background/50"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    onClick={() => removeAssignment(assignment.id)}
                                                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <Button
                                        onClick={addAssignment}
                                        variant="secondary"
                                        className="w-full gap-2 py-6 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Assignment
                                    </Button>
                                </div>
                            </div>

                            {/* Pro Tips Section */}
                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    How it works
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Enter your assignments along with their grades and weights. The calculator
                                    automatically computes your current average based on the weights you've
                                    entered so far. Make sure your weights add up to 100 for a complete course grade!
                                </p>
                            </div>
                        </div>

                        {/* Result Column */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-primary/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

                                    <h3 className="text-lg font-semibold text-muted-foreground mb-1">Current Grade</h3>

                                    {finalGrade !== null ? (
                                        <div className="space-y-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-5xl font-bold ${getGradeColor(finalGrade)}`}>
                                                    {finalGrade.toFixed(2)}%
                                                </span>
                                                <span className={`text-2xl font-bold text-muted-foreground`}>
                                                    ({getLetterGrade(finalGrade)})
                                                </span>
                                            </div>

                                            <div className="space-y-2 pt-4 border-t border-border">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Total Weight</span>
                                                    <span className="font-medium">{totalWeight}%</span>
                                                </div>
                                                {totalWeight < 100 && (
                                                    <div className="flex justify-between text-sm text-orange-500">
                                                        <span>Warning</span>
                                                        <span>Weight is {100 - totalWeight}% short</span>
                                                    </div>
                                                )}
                                                {totalWeight > 100 && (
                                                    <div className="flex justify-between text-sm text-red-500">
                                                        <span>Error</span>
                                                        <span>Weight is {totalWeight - 100}% over</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-4xl font-bold text-muted-foreground/30">--</p>
                                            <p className="text-sm text-muted-foreground mt-2">Enter grades to calculate</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold px-2">Common Grade Scales</h3>
                                    <div className="bg-card border border-border rounded-xl divide-y divide-border">
                                        <div className="flex justify-between p-3 text-sm">
                                            <span>A</span>
                                            <span className="font-medium text-muted-foreground">93 - 100%</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span>A-</span>
                                            <span className="font-medium text-muted-foreground">90 - 92%</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span>B+</span>
                                            <span className="font-medium text-muted-foreground">87 - 89%</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span>B</span>
                                            <span className="font-medium text-muted-foreground">83 - 86%</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span>C</span>
                                            <span className="font-medium text-muted-foreground">73 - 76%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section SEO */}
                    <article className="mt-16 prose prose-lg dark:prose-invert max-w-none">
                        
                        <p className="text-muted-foreground  text-lg">Below, you’ll find a clear outline and in-depth explanations that help any student make sense of scores, percentages, and letters-without complicated math.</p>
                        <br />

                        <div className="box border-2 border-gray-200 dark:border-gray-800 rounded-lg p-4">
                            <h2 className="text-2xl font-semibold text-foreground mb-2">Article Outline</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">Grade Calculator: What Is It and Why Does It Matter?</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">How Does a Grade Calculator Work?</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">What Is a Grade and How Is It Measured?</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">How Do You Calculate a Test Grade Correctly?</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">What Is a Weighted Grade and Why Is Weight Important?</h2> 
                            <h2 className="text-2xl font-semibold text-foreground mb-2">How to Calculate a Final Grade Step by Step</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">Final Grade Calculator: When Should You Use One?</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">How Do Percentage and Letter Grade Systems Compare?</h2>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">How to Find the Grade Needed on a Final Exam</h2> 
                            <h2 className="text-2xl font-semibold text-foreground mb-2">Grade Calculators in School, High School, College, and University</h2>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mt-6 mb-2">Grade Calculator: What Is It and Why Does It Matter?</h2>
                        <p className="text-muted-foreground  text-lg">
                            A grade calculator is a digital or manual tool designed to help you calculate academic results based on scores you earn during a course. Instead of guessing, you can type in your results and instantly see your grade or projected outcome. Many students rely on a free grade calculator to keep track of performance throughout the term.
                        </p>
                        <p>This kind of calculator matters because grades are often based on multiple components. A single test, a quiz, or homework rarely tells the whole story. Using a calculator helps you understand the overall result by combining every score into one clear answer.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">How Does a Grade Calculator Work?</h2>
                        <p className="text-muted-foreground  text-lg">At its core, a calculator works by taking the number of points you earned and dividing it by the total possible points. This creates a percentage, which can then be converted into a letter or numeric result. This method is the base of most grading systems. </p>
                        <ol className="mt-2 px-4">
                            <li className="text-muted-foreground  text-lg">**Enter Assignment Name:** Add a label like "Midterm" or "Project 1".</li>
                            <li className="text-muted-foreground  text-lg">**Enter Grade:** Put in the percentage you received (or expect to receive).</li>
                            <li className="text-muted-foreground  text-lg">**Enter Weight:** Input how much that assignment counts towards your final grade.</li>
                            <li className="text-muted-foreground  text-lg">**Add More:** Click "Add Assignment" to include all parts of your syllabus.</li>
                            <li className="text-muted-foreground  text-lg">**Results:** Your current grade updates automatically as you type.</li>
                        </ol>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">What Is a Grade and How Is It Measured?</h2>
                        <p className="text-muted-foreground  text-lg">A grade represents how well a student met learning goals during an assessment. Teachers measure performance using tests, assignments, and exams, then assign a grade based on a defined grading scale.</p>
                        <p className="mt-2">This scale may be numerical, percentage-based, or based on letters. A grading system ensures fairness by using the same standards for everyone in a class. Understanding how grades are measured helps you see where improvement is possible.</p>
                    
                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">How Do You Calculate a Test Grade Correctly?</h2>
                        <p className="text-muted-foreground  text-lg">To calculate a test grade, you divide the points earned by the points possible. For example, if a student got 45 out of 50, the result is 90 percent. This answer tells you how well you performed on that specific test.</p>
                        <p className="text-muted-foreground  text-lg">This calculation also helps identify how many questions a student got wrong and where mistakes occurred. Knowing this makes it easier to prepare for the next exam and improve future results.</p>
                        
                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">What Is a Weighted Grade and Why Is Weight Important?</h2>
                        <p className="text-muted-foreground  text-lg">A weighted grade is a score that takes into account how much each assignment counts toward the final result. Not all work is equally important, so weighting ensures that major tests and projects have a greater impact on your overall grade.</p>
                        <p className="text-muted-foreground  text-lg">Understanding weight is crucial because it shows you where you need to focus your effort. A small quiz might be worth only 5% of your grade, while a final exam could be worth 30%. Without weighting, your final score would not accurately reflect your performance.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">How to Calculate a Final Grade Step by Step</h2>
                        <p className="text-muted-foreground  text-lg">To calculate a final grade, you need to know the weight of each assignment and the score you received. The formula is simple: multiply each score by its weight, then add the results together. This gives you your final grade.</p>
                        <p className="text-muted-foreground  text-lg">For example, if a student has three assignments worth 20%, 30%, and 50% of the grade, and scored 80%, 90%, and 100% respectively, the calculation is as follows:</p>
                        <p className="mt-2 px-4 text-muted-foreground  text-lg">
                            (0.20 × 80) + (0.30 × 90) + (0.50 × 100) = 89%
                        </p>
                        <p className="text-muted-foreground  text-lg">This shows that the student earned a final grade of 89%.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Final Grade Calculator: When Should You Use One?</h2>
                        <p className="text-muted-foreground  text-lg">A final grade calculator is useful in many situations. Students can use it to track progress throughout the term, plan for exams, and understand how different scores affect their overall result. Teachers can also use calculators to quickly calculate grades for their classes.</p>
                        <p className="text-muted-foreground  text-lg">Using a calculator helps you stay organized and informed about your academic performance. It also allows you to see how changes in your scores might impact your final standing.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">How Do Percentage and Letter Grade Systems Compare?</h2>
                        <p className="text-muted-foreground  text-lg">Percentage and letter grade systems are two common ways to measure academic performance. Percentages provide a precise numerical value, while letter grades offer a simpler, more general overview.</p>
                        <p className="text-muted-foreground  text-lg">In many schools, percentages are converted to letter grades using a standard scale. For example, 90-100% is usually an A, 80-89% is a B, and so on. Understanding both systems helps you interpret your results accurately.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">How to Find the Grade Needed on a Final Exam</h2>
                        <p className="text-muted-foreground  text-lg">If you know your current grade and the weight of the final exam, you can calculate the score needed to achieve a desired final result. The formula is: (Desired Grade - Current Grade × (1 - Exam Weight)) ÷ Exam Weight.</p>
                        <p className="text-muted-foreground  text-lg">For example, if a student has a 75% average and the final exam is worth 20% of the grade, they would need to score approximately 85% on the final to achieve a B (80%) overall.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Grade Calculators in School, High School, College, and University</h2>
                        <p className="text-muted-foreground  text-lg">Grade calculators are used at all levels of education. In elementary school, they help young students understand basic scoring concepts. In high school, they assist with tracking progress toward graduation requirements.</p>
                        <p className="text-muted-foreground  text-lg">At the college and university level, calculators are essential for managing complex grading schemes and ensuring students meet course and program standards. Regardless of the level, a calculator provides clarity and control over academic performance.</p>

                        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Key Takeaways: What to Remember About Grade Calculators</h2>
                        <ul className="px-3">
                            <li className="text-muted-foreground  text-lg">A grade calculator helps you understand scores without complex math</li>
                            <li className="text-muted-foreground  text-lg">Grades are based on points, percentages, and a defined grading scale</li>
                            <li className="text-muted-foreground  text-lg">Weighted categories can change how much each assignment affects the result</li>
                            <li className="text-muted-foreground  text-lg">Calculators help determine your grade needed before a final exam</li>
                            <li className="text-muted-foreground  text-lg">TUsing a calculator allows better planning and smarter study decisions</li>
                        </ul>
                        <p className="text-muted-foreground  text-lg mt-2">By learning how to calculate grades and interpret results, every student can approach exams and assessments with more confidence and control.</p>
                        </article>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GradeCalculator;
