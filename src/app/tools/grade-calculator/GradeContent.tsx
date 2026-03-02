import { useState, useEffect } from "react";
import { Calculator, Plus, Trash2, RotateCcw, Check } from "lucide-react";
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

export default function GradeCalculator() {
    const [assignments, setAssignments] = useState<Assignment[]>([
        { id: "1", name: "Assignment 1", grade: "", weight: "" },
        { id: "2", name: "Assignment 2", grade: "", weight: "" },
        { id: "3", name: "Final Exam", grade: "", weight: "" },
    ]);

    const [finalGrade, setFinalGrade] = useState<number | null>(null);
    const [totalWeight, setTotalWeight] = useState<number>(0);

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

        assignments.forEach((a) => {
            const grade = parseFloat(a.grade);
            const weight = parseFloat(a.weight);

            if (!isNaN(grade) && !isNaN(weight)) {
                totalWeightedScore += grade * (weight / 100);
                currentTotalWeight += weight;
            }
        });

        setTotalWeight(currentTotalWeight);

        if (currentTotalWeight > 0) {
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

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Grade Calculator Guide - Calculate Test & Final Grades Easily"
                description="Use our free grade calculator to calculate test scores, weighted grades, and your final grade."
                canonicalUrl="https://freeimageprompt.com/tools/grade-calculator"
            />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                            <Calculator className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Grade Calculator
                        </h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Assignments</h2>
                                    <Button variant="outline" size="sm" onClick={resetCalculator}>
                                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6">
                                                <Input
                                                    placeholder="Assignment Name"
                                                    value={assignment.name}
                                                    onChange={(e) => updateAssignment(assignment.id, "name", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Input
                                                    type="number"
                                                    placeholder="Grade %"
                                                    value={assignment.grade}
                                                    onChange={(e) => updateAssignment(assignment.id, "grade", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Weight %"
                                                    value={assignment.weight}
                                                    onChange={(e) => updateAssignment(assignment.id, "weight", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <button onClick={() => removeAssignment(assignment.id)}>
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={addAssignment} className="w-full mt-4">Add Assignment</Button>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-muted-foreground">Current Grade</h3>
                                {finalGrade !== null ? (
                                    <div className={`text-5xl font-bold ${getGradeColor(finalGrade)}`}>
                                        {finalGrade.toFixed(2)}%
                                    </div>
                                ) : (
                                    <div className="text-4xl font-bold text-muted-foreground/30">--</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
