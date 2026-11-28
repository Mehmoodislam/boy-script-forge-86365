import React from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { jobListings } from "@/data/jobs-data";
import { Briefcase, MapPin, Calendar, Clock, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";

export default function JobsPage() {
    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title="Latest Overseas Jobs & Visa Opportunities – FreeImagePrompt"
                description="Explore verified overseas jobs in Saudi Arabia, UAE, and Gulf countries. Find labor, packing, technical, and skilled employment opportunities with genuine agency contact information."
                canonicalUrl="https://freeimageprompt.com/jobs"
            />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="mb-10 text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-[1px] w-6 bg-emerald-600"></span>
                            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-emerald-700">
                                VERIFIED OVERSEAS EMPLOYMENT & CAREERS
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1C1917] mb-4">
                            Latest Job Vacancies in Saudi Arabia & Gulf
                        </h1>
                        <p className="text-base md:text-lg text-[#6B645C] max-w-3xl leading-relaxed">
                            Discover verified overseas job advertisements, port vacancies, packing, loading, and skilled technical jobs with full salary packages, contract terms, and official recruiting agency phone numbers and email contacts.
                        </p>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-6">
                        {jobListings.map((job) => (
                            <article
                                key={job.id}
                                className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-8 hover:border-emerald-600/50 hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800">
                                                URGENT HIRING
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFECE6] text-[#6B645C]">
                                                {job.country}
                                            </span>
                                            <span className="text-xs text-[#78716C] flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {job.datePosted}
                                            </span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-[#1C1917] group-hover:text-emerald-700 transition-colors">
                                            <Link to={`/jobs/${job.slug}`}>{job.title}</Link>
                                        </h2>
                                    </div>
                                    <div className="text-left md:text-right shrink-0">
                                        <div className="text-lg md:text-xl font-extrabold text-emerald-700 font-mono">
                                            {job.salary}
                                        </div>
                                        <div className="text-xs text-[#78716C]">Accommodation + Medical Included</div>
                                    </div>
                                </div>

                                <p className="text-sm md:text-base text-[#6B645C] mb-6 leading-relaxed">
                                    {job.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#E6E2D8] text-xs text-[#44403C] mb-6">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{job.dutyHours} (+ Overtime)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{job.agencyName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Contract: {job.contractDuration}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="text-xs text-[#78716C]">
                                        Recruitment Agency: <strong className="text-[#1C1917]">{job.agencyName}</strong> (License: {job.agencyLicense})
                                    </div>
                                    <Link
                                        to={`/jobs/${job.slug}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                                    >
                                        View Full Job Details & Apply
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
