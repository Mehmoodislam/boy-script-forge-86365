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
    ExternalLink,
    Palette,
    Award
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
            value: job.agencyLicense || job.agencyName
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
                addressCountry: "SA"
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F8F3] text-[#1C1917] font-sans">
            <SEOHead
                title={`${job.metaTitle || job.title} | FreeImagePrompt Jobs`}
                description={job.metaDescription || job.description}
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
                                {job.country.toUpperCase()}
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
                            {job.description}
                        </p>
                    </div>

                    {/* Quick Highlights Banner */}
                    <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 md:p-8 mb-10 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                            <div>
                                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                                    SALARY PACKAGE
                                </span>
                                <div className="text-xl md:text-2xl font-extrabold font-mono text-white">
                                    {job.salary}
                                </div>
                                <span className="text-xs text-emerald-200">Tax-Free Overseas Income</span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                                    {job.minExperience ? "EXPERIENCE" : "DUTY & OVERTIME"}
                                </span>
                                <div className="text-xl md:text-2xl font-bold text-white">
                                    {job.minExperience ? `${job.minExperience} Minimum` : job.dutyHours}
                                </div>
                                <span className="text-xs text-emerald-200">
                                    {job.portfolioRequired ? "Professional Portfolio Required" : job.overtime}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                                    LOCATION & VISA
                                </span>
                                <div className="text-xl md:text-2xl font-bold text-white">
                                    {job.location}
                                </div>
                                <span className="text-xs text-emerald-200">Employment Visa</span>
                            </div>
                        </div>
                    </div>

                    {/* Newspaper Ad Proof Image (If available) */}
                    {job.newspaperAdImage && (
                        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-4 md:p-6 mb-10 shadow-sm text-center">
                            <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-[#78716C] px-2">
                                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                    <FileText className="w-3.5 h-3.5" />
                                    Official Advertisement Proof
                                </span>
                                <span>Verified Overseas Vacancy</span>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-[#E6E2D8] bg-black">
                                <img
                                    src={job.newspaperAdImage}
                                    alt={`${job.title} Newspaper Ad`}
                                    className="w-full max-h-[450px] object-contain mx-auto"
                                />
                            </div>
                            <p className="text-xs text-[#78716C] mt-2 italic">
                                Original verified recruitment advertisement for {job.title}.
                            </p>
                        </div>
                    )}

                    {/* Article Content / Structured Details */}
                    <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 md:p-10 mb-10 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-4">Saudi Arabia Job Details</h2>
                            <p className="text-[#6B645C] mb-4 text-sm md:text-base">
                                Here are the important details of this overseas recruitment opportunity:
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
                                    <div key={idx} className="p-5 bg-[#FAF9F5] border border-[#E6E2D8] rounded-xl">
                                        <h3 className="font-bold text-[#1C1917] text-lg mb-2 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-mono">
                                                {idx + 1}
                                            </span>
                                            {pos.title}
                                        </h3>
                                        <p className="text-sm text-[#6B645C] leading-relaxed">
                                            {pos.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Special Calligraphy Styles Section (If Arabic Calligrapher job) */}
                        {job.calligraphyStyles && (
                            <div>
                                <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-3">Required Arabic Calligraphy Styles</h2>
                                <p className="text-sm text-[#6B645C] mb-4">
                                    Candidates applying for the calligrapher position should have expertise in traditional Arabic scripts:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl">
                                        <strong className="text-emerald-800 text-base block mb-1">1. Thuluth (ثلث)</strong>
                                        <p className="text-xs text-[#6B645C]">A traditional Arabic calligraphy style known for its artistic lettering, curved elegance, and grand architectural compositions.</p>
                                    </div>
                                    <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl">
                                        <strong className="text-emerald-800 text-base block mb-1">2. Diwani (ديواني)</strong>
                                        <p className="text-xs text-[#6B645C]">A decorative Ottoman Arabic script commonly recognized for its flowing, cursive, and artistic overlapping appearance.</p>
                                    </div>
                                    <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl">
                                        <strong className="text-emerald-800 text-base block mb-1">3. Naskh (نسخ)</strong>
                                        <p className="text-xs text-[#6B645C]">A widely used Arabic script with clear, balanced lettering and high legibility, standard in Quranic and official texts.</p>
                                    </div>
                                    <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl">
                                        <strong className="text-emerald-800 text-base block mb-1">4. Ruq'ah (رقعة)</strong>
                                        <p className="text-xs text-[#6B645C]">A practical, structured Arabic handwriting script known for its simplicity, straight geometric lines, and speed.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Software & Requirements */}
                        {job.requiredSoftware && (
                            <div>
                                <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-3">Required Software & Technical Skills</h2>
                                <p className="text-sm text-[#6B645C] mb-4">
                                    Candidates must demonstrate professional mastery of industry-standard Adobe creative tools:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E6E2D8]">
                                        <Palette className="w-5 h-5 text-blue-600 shrink-0" />
                                        <div>
                                            <strong className="text-[#1C1917] block">Adobe Photoshop</strong>
                                            <span className="text-xs text-[#6B645C]">Photo editing, mockups, digital calligraphy retouching</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E6E2D8]">
                                        <Award className="w-5 h-5 text-amber-600 shrink-0" />
                                        <div>
                                            <strong className="text-[#1C1917] block">Adobe Illustrator</strong>
                                            <span className="text-xs text-[#6B645C]">Vectorizing Arabic calligraphy, branding, logo design</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Eligibility Criteria */}
                        <div className="pt-4 border-t border-[#E6E2D8]">
                            <h2 className="text-2xl font-bold font-sans text-[#1C1917] mb-3">Eligibility Criteria & Requirements</h2>
                            <ul className="space-y-2.5 text-sm text-[#44403C]">
                                {job.minExperience && (
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>Minimum Experience:</strong> At least {job.minExperience} of verified professional experience in the relevant field.</span>
                                    </li>
                                )}
                                {job.portfolioRequired && (
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>Creative Portfolio:</strong> A solid portfolio (Behance, PDF, Google Drive link, or image samples) showcasing previous designs or calligraphy artwork is mandatory.</span>
                                    </li>
                                )}
                                {job.benefits.map((b, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
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
                                Contact the recruiting agency directly for inquiries, portfolio review, and interview appointments:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="text-xs font-mono uppercase text-[#78716C]">Agency Name & Details</div>
                                    <div className="font-bold text-[#1C1917] text-base">{job.agencyName}</div>
                                    <div className="text-xs text-emerald-700 font-semibold">{job.agencyType}</div>
                                    {job.agencyLicense && (
                                        <div className="text-xs text-[#78716C] font-mono">{job.agencyLicense}</div>
                                    )}
                                </div>

                                <div className="p-4 bg-white border border-[#E6E2D8] rounded-xl space-y-2">
                                    <div className="text-xs font-mono uppercase text-[#78716C]">Office Address</div>
                                    <div className="text-sm text-[#1C1917] font-medium flex items-start gap-1.5">
                                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{job.agencyAddress}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Numbers & Emails */}
                            <div className="bg-white border border-[#E6E2D8] rounded-xl p-5 mb-6">
                                <div className="text-xs font-mono uppercase text-[#78716C] mb-3">
                                    Official Contact & Inquiry Numbers
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    {job.phoneNumbers.map((phone, idx) => (
                                        <a
                                            key={idx}
                                            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
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

                                <div className="pt-3 border-t border-[#E6E2D8] space-y-2">
                                    <div className="text-xs font-mono uppercase text-[#78716C]">
                                        Official Application Email Addresses:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.emails.map((em, idx) => (
                                            <a
                                                key={idx}
                                                href={`mailto:${em}?subject=Application for ${job.title}&body=Dear ${job.agencyName} Team,%0D%0A%0D%0AI am applying for the ${job.title} position in Saudi Arabia.%0D%0A%0D%0AFull Name:%0D%0AContact Number:%0D%0APortfolio / Work Link:%0D%0ACity / Country:%0D%0A`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold transition-colors"
                                            >
                                                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                                                <span>{em}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* How to Apply Steps */}
                            <div>
                                <h3 className="font-bold text-base text-[#1C1917] mb-2">
                                    How to Apply for this Saudi Arabia Job?
                                </h3>
                                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[#44403C] mb-6">
                                    <li>Prepare an updated professional CV highlighting your experience.</li>
                                    <li>Attach your Arabic calligraphy samples, portfolio PDF, or design link.</li>
                                    <li>Email your application directly to <code className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">{job.emails[0]}</code>.</li>
                                    <li>You can also apply online through the official portal link below.</li>
                                </ol>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                    {job.applyLink && (
                                        <a
                                            href={job.applyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md transition-all group"
                                        >
                                            <span>🟢 APPLY ONLINE NOW</span>
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:${job.emails[0]}?subject=Application for ${job.title}&body=Dear ${job.agencyName} Team,%0D%0A%0D%0AI am applying for the ${job.title} position in Saudi Arabia.%0D%0A%0D%0AFull Name:%0D%0AContact Number:%0D%0APortfolio / Work Link:%0D%0ACity / Country:%0D%0A`}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#E6E2D8] hover:border-emerald-600 text-[#1C1917] font-bold text-base shadow-sm transition-all"
                                    >
                                        <Mail className="w-4 h-4 text-emerald-700" />
                                        <span>EMAIL UPDATED CV</span>
                                    </a>
                                </div>
                                <p className="text-xs text-[#78716C] mt-3 text-center italic">
                                    Confirm all recruitment details and employment terms directly with {job.agencyName} before making any commitments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
