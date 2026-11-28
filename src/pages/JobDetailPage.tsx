import React from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { jobListings } from "@/data/jobs-data";
import {
    MapPin,
    Calendar,
    Clock,
    Phone,
    Mail,
    Building2,
    ShieldCheck,
    CheckCircle2,
    FileText,
    ArrowLeft,
    ExternalLink
} from "lucide-react";

export default function JobDetailPage() {
    const { slug } = useParams();
    const job = jobListings.find((j) => j.slug === slug || j.id === slug) || jobListings[0];

    const PAGE_URL = `https://freeimageprompt.com/jobs/${job.slug}`;

    const jobSchema = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        identifier: {
            "@type": "PropertyValue",
            name: job.agencyName,
            value: job.agencyLicense
        },
        datePosted: "2026-11-28",
        validThrough: "2027-11-28",
        employmentType: "FULL_TIME",
        hiringOrganization: {
            "@type": "Organization",
            name: job.company,
            sameAs: "https://freeimageprompt.com"
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Dammam",
                addressRegion: "Eastern Province",
                addressCountry: "SA"
            }
        },
        baseSalary: {
            "@type": "MonetaryAmount",
            currency: "SAR",
            value: {
                "@type": "QuantitativeValue",
                value: 1200,
                unitText: "MONTH"
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title={`${job.title} | FreeImagePrompt Jobs`}
                description={`Urgent hiring for Loading, Unloading and Packing workers in Dammam, Saudi Arabia. Salary: 1,000 + 200 SAR with accommodation, medical, transport. Agency: Workers Haven.`}
                canonicalUrl={PAGE_URL}
                schema={jobSchema}
            />
            <Navigation />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Back Link */}
                    <div className="mb-6">
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to All Jobs
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-left mb-8">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase bg-emerald-600 text-white">
                                URGENT OVERSEAS HIRING
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[#EFECE6] text-[#6B645C]">
                                SAUDI ARABIA
                            </span>
                            <span className="text-xs text-[#78716C] flex items-center gap-1 font-mono">
                                <Calendar className="w-3.5 h-3.5" />
                                Posted: {job.datePosted}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C1917] mb-4 leading-tight">
                            {job.title}
                        </h1>

                        <p className="text-base md:text-lg text-[#6B645C] leading-relaxed">
                            Are you looking for a job opportunity in Saudi Arabia? An urgent recruitment opportunity is available for <strong>Loading, Unloading, and Packing Workers</strong> at Dammam Saudi Port. Workers Haven, an overseas recruitment agency, is advertising vacancies for individuals interested in working in Saudi Arabia.
                        </p>
                    </div>

                    {/* Quick Highlights Banner */}
                    <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 md:p-8 mb-10 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                            <div>
                                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                                    SALARY PACKAGE
                                </span>
                                <div className="text-2xl md:text-3xl font-extrabold font-mono text-white">
                                    1,000 + 200 SAR
                                </div>
                                <span className="text-xs text-emerald-200">Total 1,200 Saudi Riyals</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                                    DUTY & OVERTIME
                                </span>
                                <div className="text-xl md:text-2xl font-bold text-white">
                                    8 Hours Daily
                                </div>
                                <span className="text-xs text-emerald-200">+ Overtime Available</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                                    CONTRACT PERIOD
                                </span>
                                <div className="text-xl md:text-2xl font-bold text-white">
                                    2 Years
                                </div>
                                <span className="text-xs text-emerald-200">Renewable Agreement</span>
                            </div>
                        </div>
                    </div>

                    {/* Newspaper Ad Proof Image */}
                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 md:p-6 mb-10 shadow-sm text-center">
                        <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#78716C] px-2">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                <FileText className="w-3.5 h-3.5" />
                                Official Newspaper Advertisement
                            </span>
                            <span>Overseas Employment Ad</span>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-[#E6E2D8] bg-black">
                            <img
                                src={job.newspaperAdImage}
                                alt="Saudi Arabia Dammam Port Loading Unloading Packing Jobs Newspaper Ad"
                                className="w-full max-h-[450px] object-contain mx-auto"
                            />
                        </div>
                        <p className="text-xs text-[#78716C] mt-2 italic">
                            Original verified newspaper advertisement for Dammam Saudi Port workers by Workers Haven OEP.
                        </p>
                    </div>

                    {/* Article Content / Structured Details */}
                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-10 mb-10 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Saudi Arabia Job Details</h2>
                            <p className="text-[#6B645C] mb-4 text-sm md:text-base">
                                Here are the important verified details of this overseas employment opportunity:
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse text-left border border-[#E6E2D8] rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-[#FAF9F5] border-b border-[#E6E2D8] text-xs font-mono uppercase text-[#78716C]">
                                            <th className="p-3 w-1/3">Job Information</th>
                                            <th className="p-3">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E2D8]">
                                        {job.detailsTable.map((row, idx) => (
                                            <tr key={idx} className={idx % 2 === 1 ? "bg-[#FAF9F5]/40" : ""}>
                                                <td className="p-3 font-semibold text-[#1C1917]">{row.label}</td>
                                                <td className="p-3 text-[#44403C] font-medium">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Available Positions */}
                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Available Job Positions in Saudi Arabia</h2>
                            <p className="text-[#6B645C] mb-4 text-sm">
                                The recruitment advertisement mentions the following work categories:
                            </p>

                            <div className="space-y-4">
                                {job.positions.map((pos, idx) => (
                                    <div key={idx} className="p-4 bg-[#FAF9F5] border border-[#E6E2D8] rounded-xl">
                                        <h3 className="font-bold text-[#1C1917] text-base mb-1">
                                            {idx + 1}. {pos.title}
                                        </h3>
                                        <p className="text-sm text-[#6B645C] leading-relaxed">
                                            {pos.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Salary Package */}
                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-3">Salary Package – 1,000 + 200 SAR</h2>
                            <p className="text-sm md:text-base text-[#6B645C] mb-3 leading-relaxed">
                                One of the important highlights of this Saudi Arabia job opportunity is its advertised salary package. Selected workers will receive:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#44403C]">
                                <li><strong>Basic advertised salary:</strong> 1,000 SAR</li>
                                <li><strong>Additional allowance:</strong> 200 SAR</li>
                                <li><strong>Total advertised package:</strong> 1,200 SAR (Saudi Riyals)</li>
                            </ul>
                        </div>

                        {/* Working Hours & Facilities */}
                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-3">Working Hours, Overtime & Facilities</h2>
                            <p className="text-sm md:text-base text-[#6B645C] mb-4 leading-relaxed">
                                According to the recruitment advertisement, the daily duty schedule is <strong>8 hours</strong>, with overtime available. This opportunity is suitable for individuals interested in working in the loading, unloading, and packing sectors in Saudi Arabia.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 p-3 bg-[#FAF9F5] rounded-lg border border-[#E6E2D8]">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span><strong>Accommodation:</strong> Provided by company</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-[#FAF9F5] rounded-lg border border-[#E6E2D8]">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span><strong>Medical:</strong> Medical facilities included</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-[#FAF9F5] rounded-lg border border-[#E6E2D8]">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span><strong>Transportation:</strong> Free transport provided</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-[#FAF9F5] rounded-lg border border-[#E6E2D8]">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span><strong>Labor Rights:</strong> Per Saudi Labor Laws</span>
                                </div>
                            </div>
                        </div>

                        {/* Contract & Experience */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E6E2D8]">
                            <div>
                                <h3 className="font-bold text-[#1C1917] text-base mb-2">Contract Duration</h3>
                                <p className="text-sm text-[#6B645C]">
                                    The advertised employment contract has a duration of <strong>2 years</strong>. Candidates should review the employment contract and confirm its terms before accepting the job offer.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1C1917] text-base mb-2">Experience Requirements</h3>
                                <p className="text-sm text-[#6B645C]">
                                    The original recruitment advertisement does not clearly mention a specific experience requirement or minimum qualification. Fresh and experienced workers may apply.
                                </p>
                            </div>
                        </div>

                        {/* Official Contact Box */}
                        <div className="bg-[#FAF9F5] border-2 border-emerald-600/30 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-5 h-5 text-emerald-700" />
                                <h2 className="text-xl md:text-2xl font-bold text-[#1C1917]">
                                    Recruitment Agency Contact Information
                                </h2>
                            </div>
                            <p className="text-sm text-[#6B645C] mb-6">
                                Contact the licensed recruiting agency directly for inquiries, document submissions, and interview dates:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="text-xs font-mono uppercase text-[#78716C]">Agency Name & License</div>
                                    <div className="font-bold text-[#1C1917] text-base">{job.agencyName}</div>
                                    <div className="text-xs text-emerald-700 font-semibold">{job.agencyType}</div>
                                    <div className="text-xs text-[#78716C] font-mono">{job.agencyLicense}</div>
                                </div>

                                <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="text-xs font-mono uppercase text-[#78716C]">Office Address</div>
                                    <div className="text-sm text-[#1C1917] font-medium flex items-start gap-1.5">
                                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{job.agencyAddress}</span>
                                    </div>
                                    <div className="text-xs text-[#78716C]">Principal: {job.company}</div>
                                </div>
                            </div>

                            {/* Phone Numbers & Email */}
                            <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 mb-6">
                                <div className="text-xs font-mono uppercase text-[#78716C] mb-3">
                                    Phone & Mobile Numbers for Inquiries
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    {job.phoneNumbers.map((phone, idx) => (
                                        <a
                                            key={idx}
                                            href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                                            className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FAF9F5] hover:bg-emerald-50 border border-[#E6E2D8] hover:border-emerald-500 transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <span className="font-mono font-bold text-sm text-[#1C1917] group-hover:text-emerald-700">
                                                {phone}
                                            </span>
                                        </a>
                                    ))}
                                </div>

                                <div className="pt-3 border-t border-[#E6E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-sm text-[#44403C]">
                                        <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Email CV / Documents:</span>
                                    </div>
                                    <a
                                        href={`mailto:${job.email}`}
                                        className="font-mono font-bold text-emerald-700 hover:underline text-sm"
                                    >
                                        {job.email}
                                    </a>
                                </div>
                            </div>

                            {/* How to Apply Steps */}
                            <div>
                                <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                    How to Apply for Loading, Unloading and Packing Jobs in Saudi Arabia?
                                </h3>
                                <p className="text-sm text-[#6B645C] mb-3">
                                    If you are interested in these Saudi Arabia job vacancies:
                                </p>
                                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[#44403C] mb-6">
                                    <li>Prepare your updated CV, passport copy, and recent passport-size photos.</li>
                                    <li>Send your resume directly to <code className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">{job.email}</code>.</li>
                                    <li>Call the recruitment agency numbers listed above to confirm interview and test schedules.</li>
                                    <li>Visit the agency office at <em>Grand Hotel Plaza, Davis Road, Lahore</em> during office hours with original documents.</li>
                                </ol>

                                <div className="text-center pt-2">
                                    <a
                                        href={`mailto:${job.email}?subject=Application for Loading, Unloading & Packing Job in Dammam&body=Dear Workers Haven Team,%0D%0A%0D%0AI am applying for the Loading/Unloading/Packing position in Dammam, Saudi Arabia.%0D%0A%0D%0AName:%0D%0APhone:%0D%0APassport Number:%0D%0ACity:%0D%0A`}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md transition-all group"
                                    >
                                        <span>APPLY NOW VIA EMAIL</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    <p className="text-xs text-[#78716C] mt-2 italic">
                                        Confirm all recruitment details and visa terms directly with Workers Haven before making any financial commitments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
