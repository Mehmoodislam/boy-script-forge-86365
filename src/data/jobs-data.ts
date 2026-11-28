export interface JobListing {
    id: string;
    slug: string;
    title: string;
    location: string;
    country: string;
    company: string;
    agencyName: string;
    agencyType: string;
    agencyLicense: string;
    agencyAddress: string;
    phoneNumbers: string[];
    email: string;
    salary: string;
    dutyHours: string;
    overtime: string;
    contractDuration: string;
    benefits: string[];
    datePosted: string;
    newspaperAdImage: string;
    description: string;
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
        id: "loading-unloading-packing-jobs-saudi-arabia-dammam",
        slug: "loading-unloading-packing-jobs-saudi-arabia-dammam",
        title: "Loading, Unloading & Packing Jobs in Saudi Arabia – Urgent Hiring in Dammam",
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
        email: "haven.2010@yahoo.com",
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
