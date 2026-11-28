export interface JobListing {
    id: string;
    slug: string;
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    location: string;
    country: string;
    company: string;
    agencyName: string;
    agencyType: string;
    agencyLicense?: string;
    agencyAddress: string;
    phoneNumbers: string[];
    emails: string[];
    salary: string;
    dutyHours?: string;
    overtime?: string;
    contractDuration?: string;
    minExperience?: string;
    requiredSoftware?: string[];
    calligraphyStyles?: string[];
    portfolioRequired?: boolean;
    benefits: string[];
    datePosted: string;
    newspaperAdImage?: string;
    description: string;
    applyLink?: string;
    positions: {
        title: string;
        description: string;
    }[];
    detailsTable: {
        label: string;
        value: string;
    }[];
    contentHtml?: string;
}

export const jobListings: JobListing[] = [
    {
        id: "arabic-calligrapher-graphic-designer-jobs-saudi-arabia",
        slug: "arabic-calligrapher-graphic-designer-jobs-saudi-arabia",
        title: "Arabic Calligrapher & Graphic Designer Jobs in Saudi Arabia – Urgent Hiring",
        metaTitle: "Arabic Calligrapher & Graphic Designer Jobs in Saudi Arabia",
        metaDescription: "Apply for Arabic Calligrapher and Graphic Designer jobs in Saudi Arabia. Minimum 3 years of experience, Photoshop, Illustrator and professional portfolio required.",
        location: "Saudi Arabia",
        country: "Saudi Arabia",
        company: "Leading Creative Studio / Agency in Saudi Arabia",
        agencyName: "Teleport Manpower Consultant",
        agencyType: "Overseas Recruitment & Manpower Consultant",
        agencyAddress: "House # FA-224A, Sultan Street, Near Sultan Arcade Plaza, Extension Area, Sector I-8/4, Faizabad, Islamabad 44000, Pakistan",
        phoneNumbers: [
            "051-4800594",
            "+92 332 5130002"
        ],
        emails: [
            "jobs@teleportmanpower.com",
            "teleportmanpower@gmail.com"
        ],
        salary: "Attractive Salary Package (Negotiable based on experience)",
        minExperience: "3 Years",
        requiredSoftware: [
            "Adobe Photoshop",
            "Adobe Illustrator"
        ],
        calligraphyStyles: [
            "Thuluth",
            "Diwani",
            "Naskh",
            "Ruq'ah"
        ],
        portfolioRequired: true,
        benefits: [
            "Attractive Salary Package",
            "International career growth in Saudi Arabia",
            "Opportunity to work with premium creative projects",
            "Visa & employment facilities according to Saudi labor regulations"
        ],
        datePosted: "November 28, 2026",
        applyLink: "https://jobs.teleportmanpower.com/jobs/we-are-hiring-arabic-calligrapher-graphic-designer-for-ksa/",
        description: "Teleport Manpower Consultant is inviting applications from skilled professionals with strong expertise in Arabic calligraphy, graphic design, and creative software. Minimum 3 years of experience and a professional portfolio are required.",
        positions: [
            {
                title: "Arabic Calligrapher",
                description: "Candidates with professional Arabic calligraphy skills are encouraged to apply for this position. Applicants should have at least three years of experience in Arabic calligraphy and knowledge of different traditional Arabic writing styles including Thuluth, Diwani, Naskh, and Ruq'ah. Applicants should be able to demonstrate their calligraphy skills through previous creative work and a professional portfolio."
            },
            {
                title: "Graphic Designer",
                description: "Experienced graphic designers with strong creative and technical abilities are also required for this opportunity. Candidates must have good knowledge of professional graphic design software, particularly Adobe Photoshop and Adobe Illustrator, creativity, attention to detail, and a portfolio showcasing previous design projects."
            }
        ],
        detailsTable: [
            { label: "Job Title", value: "Arabic Calligrapher & Graphic Designer" },
            { label: "Job Location", value: "Saudi Arabia" },
            { label: "Salary", value: "Attractive Salary Package" },
            { label: "Minimum Experience", value: "3 Years" },
            { label: "Required Software", value: "Adobe Photoshop & Illustrator" },
            { label: "Calligraphy Styles", value: "Thuluth, Diwani, Naskh, Ruq'ah" },
            { label: "Portfolio", value: "Required (Artwork / Design Samples)" },
            { label: "Recruitment Agency", value: "Teleport Manpower Consultant" },
            { label: "Application Method", value: "Email Updated CV & Portfolio / Online Link" },
            { label: "Agency Office", value: "Faizabad, Islamabad, Pakistan" }
        ]
    },
    {
        id: "loading-unloading-packing-jobs-saudi-arabia-dammam",
        slug: "loading-unloading-packing-jobs-saudi-arabia-dammam",
        title: "Loading, Unloading & Packing Jobs in Saudi Arabia – Urgent Hiring in Dammam",
        metaTitle: "Loading, Unloading & Packing Jobs in Saudi Arabia – Dammam",
        metaDescription: "Urgent recruitment for Loading, Unloading, and Packing Workers at Dammam Saudi Port. 1,000 + 200 SAR with accommodation, medical and transport provided.",
        location: "Dammam, Saudi Arabia",
        country: "Saudi Arabia",
        company: "شركة الجسور (Al Jisoor Company) / Dammam Saudi Port",
        agencyName: "Workers Haven",
        agencyType: "Overseas Employment Promoters (OEP)",
        agencyLicense: "OEP LIC# MPD/3015/LHR (PE/L/629592, 629584 Dt: 26/01/2021)",
        agencyAddress: "20-LG, Grand Hotel Plaza, 9-A Davis Road, Lahore, Pakistan",
        phoneNumbers: [
            "0300-4247868",
            "0300-4800710",
            "0321-9458510",
            "042-36375505"
        ],
        emails: [
            "haven.2010@yahoo.com"
        ],
        salary: "1,000 + 200 SAR (Total: 1,200 Saudi Riyals)",
        dutyHours: "8 Hours Daily",
        overtime: "Available (+ Overtime)",
        contractDuration: "2 Years",
        benefits: [
            "Free Accommodation provided by company",
            "Full Medical facilities included",
            "Free Transport provided",
            "Overtime opportunities available",
            "All other rights according to Saudi Labor Laws"
        ],
        datePosted: "November 28, 2026",
        newspaperAdImage: "/jobs-dammam-loading-unloading-workers.jpg",
        description: "Urgent recruitment opportunities for Loading, Unloading, and Packing Workers at Dammam Saudi Port through Workers Haven Overseas Recruiting Agency.",
        positions: [
            {
                title: "Loading Workers",
                description: "Loading workers are required to handle and load goods, packages, and other materials as part of daily port operations. The work involves organizing and moving items according to workplace instructions."
            },
            {
                title: "Unloading Workers",
                description: "Unloading workers assist with removing goods and packages from trucks and other transportation vehicles. They help organize materials and ensure that unloading activities are completed efficiently."
            },
            {
                title: "Packing Workers",
                description: "Packing workers are responsible for packing goods and preparing packages for storage or transportation. Their work involves organizing items and handling packaging activities according to operational requirements."
            }
        ],
        detailsTable: [
            { label: "Job Title", value: "Loading / Unloading / Packing Worker" },
            { label: "Job Location", value: "Dammam, Saudi Arabia" },
            { label: "Workplace", value: "Saudi Port (شرکۃ الجسور)" },
            { label: "Salary Package", value: "1,000 + 200 SAR (Total 1,200 SAR)" },
            { label: "Duty Schedule", value: "8 Hours Daily" },
            { label: "Overtime", value: "Available (+ Overtime)" },
            { label: "Contract Period", value: "2 Years" },
            { label: "Accommodation", value: "Provided by Company" },
            { label: "Medical Facilities", value: "Provided" },
            { label: "Transportation", value: "Provided" },
            { label: "Other Benefits", value: "According to Saudi Labor Laws" },
            { label: "Recruiting Agency", value: "Workers Haven (OEP)" },
            { label: "License Number", value: "OEP LIC# MPD/3015/LHR" },
            { label: "Office Location", value: "Lahore, Pakistan" }
        ]
    }
];
