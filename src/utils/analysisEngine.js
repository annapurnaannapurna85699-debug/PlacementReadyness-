const SKILL_CATEGORIES = {
    coreCS: ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented Programming', 'DBMS', 'Database Management', 'OS', 'Operating System', 'Computer Networks', 'Networks'],
    languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
    web: ['React', 'Next.js', 'NextJS', 'Node.js', 'NodeJS', 'Express', 'REST', 'API', 'GraphQL', 'Tailwind', 'HTML', 'CSS', 'Vue', 'Angular'],
    data: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'Cassandra', 'Data Science', 'Machine Learning', 'AI'],
    cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Jenkins', 'Cloud'],
    testing: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Testing', 'QA']
};

const ENTERPRISE_LIST = [
    'amazon', 'google', 'meta', 'microsoft', 'apple', 'netflix',
    'tcs', 'infosys', 'wipro', 'hcl', 'accenture', 'ibm',
    'oracle', 'salesforce', 'adobe', 'intel', 'cisco', 'sap'
];

const getCompanyIntel = (companyName) => {
    const name = (companyName || "").toLowerCase();
    const isEnterprise = ENTERPRISE_LIST.some(e => name.includes(e));

    if (isEnterprise) {
        return {
            category: 'Enterprise',
            size: 'Enterprise (2000+)',
            industry: 'Technology Enterprise',
            focus: 'Structured DSA & Core Fundamentals',
            style: 'Standardized'
        };
    }

    return {
        category: 'Startup',
        size: 'Startup (<200)',
        industry: 'Early-stage Technology',
        focus: 'Practical Problem Solving & Stack Depth',
        style: 'Fast-paced'
    };
};

const getRoundMapping = (intel, hasDSA, hasWeb) => {
    if (intel.category === 'Enterprise') {
        return [
            {
                roundTitle: 'Online Assessment',
                focusAreas: ['DSA', 'Aptitude'],
                whyItMatters: 'Checks for baseline problem-solving speed and logical consistency.'
            },
            {
                roundTitle: 'Technical Round 1',
                focusAreas: hasDSA ? ['DSA', 'Complexity'] : ['Core CS Fundamentals'],
                whyItMatters: 'Ensures you can write efficient, maintainable code under pressure.'
            },
            {
                roundTitle: 'Technical Round 2',
                focusAreas: hasWeb ? ['System Design', 'Stack'] : ['Low-level Design'],
                whyItMatters: 'Validates that you truly understand the tools you use and can design systems.'
            },
            {
                roundTitle: 'HR / Managerial',
                focusAreas: ['Culture', 'Behavioral'],
                whyItMatters: 'Confirms long-term alignment with company values and team fit.'
            }
        ];
    }

    return [
        {
            roundTitle: 'Practical Coding',
            focusAreas: hasWeb ? ['Frontend/Fullstack Task'] : ['Algorithm Implementation'],
            whyItMatters: 'Startups need hackers who can ship quality code quickly from day one.'
        },
        {
            roundTitle: 'Tech Deep-Dive',
            focusAreas: ['System Discussion', 'Trade-offs'],
            whyItMatters: 'Tests your ability to reason about trade-offs in a fast-moving environment.'
        },
        {
            roundTitle: 'Culture Fit',
            focusAreas: ['Founder / Team Alignment'],
            whyItMatters: 'Crucial at startups to ensure you enjoy building things together.'
        }
    ];
};

export const analyzeJD = (company = "", role = "", jdText) => {
    if (!jdText || jdText.trim().length <= 0) {
        throw new Error("JD text is required");
    }

    const normalizedJD = jdText.toLowerCase();
    const extractedSkills = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };

    let totalDetectedCount = 0;
    let detectedCategoriesCount = 0;

    // 1. Skill Extraction
    Object.entries(SKILL_CATEGORIES).forEach(([category, keywords]) => {
        const found = keywords.filter(kw =>
            normalizedJD.includes(kw.toLowerCase())
        );
        if (found.length > 0) {
            extractedSkills[category] = found;
            detectedCategoriesCount++;
            totalDetectedCount += found.length;
        }
    });

    // Fallback if no skills detected
    if (totalDetectedCount === 0) {
        extractedSkills.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    // 2. Base Score Calculation
    let score = 35;
    score += Math.min(detectedCategoriesCount * 5, 30);
    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jdText.length > 800) score += 10;
    score = Math.min(score, 100);

    // 3. Company Intel & Round Mapping
    const intel = getCompanyIntel(company);
    const roundMapping = getRoundMapping(
        intel,
        normalizedJD.includes('dsa') || extractedSkills.coreCS.length > 0,
        extractedSkills.web.length > 0 || extractedSkills.languages.length > 0
    );

    // 4. Round-wise Checklist
    const checklist = [];
    if (intel.category === 'Enterprise') {
        checklist.push({ roundTitle: 'OA', items: ['Practice 10 Hard DSA', 'Mock Aptitude Test'] });
        checklist.push({ roundTitle: 'Technical', items: ['Complexity Analysis', 'Core CS Fundamentals'] });
    } else {
        checklist.push({ roundTitle: 'Practical', items: ['Build a small feature', 'Code walkthrough'] });
        checklist.push({ roundTitle: 'Discussion', items: ['Trade-offs', 'Architecture'] });
    }
    checklist.push({ roundTitle: 'HR', items: ['STAR Method', 'Company News'] });

    // 5. 7-Day Plan
    const plan7Days = [
        { day: 'Day 1', focus: 'CS Fundamentals', tasks: ['Revise Hashing/Sorting', 'DBMS Normalization'] },
        { day: 'Day 2', focus: 'DSA Implementation', tasks: ['Solve 3 Medium LeetCode', 'Time Complexity Analysis'] },
        { day: 'Day 3', focus: 'Project Review', tasks: ['STAR elevator pitch', 'Deep dive into tech stack'] },
        { day: 'Day 4', focus: 'Mock OA', tasks: ['Timed coding challenges', 'Logic puzzles'] },
        { day: 'Day 5', focus: 'System Design', tasks: ['Project architecture', 'Scaling basics'] },
        { day: 'Day 6', focus: 'Behavioral', tasks: ['Company values', 'Common HR questions'] },
        { day: 'Day 7', focus: 'Final Revision', tasks: ['Read short notes', 'Mental preparation'] }
    ];

    // 6. Likely Interview Questions
    const questions = [
        "Can you explain your final year project?",
        "Tell me about a time you solved a hard bug.",
        "Why do you want to work at this company?",
        "How do you learn new techs?",
        "What is your approach to teamwork?"
    ];
    if (totalDetectedCount > 0) {
        questions.push(`How do you handle performance in ${extractedSkills.web[0] || extractedSkills.languages[0] || 'your core stack'}?`);
        questions.push(`Explain a deep concept in ${extractedSkills.languages[0] || extractedSkills.coreCS[0]}.`);
    }

    const now = new Date().toISOString();

    return {
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills,
        roundMapping,
        checklist,
        plan7Days,
        questions: questions.slice(0, 10),
        baseScore: score,
        finalScore: score,
        skillConfidenceMap: {},
        companyIntel: intel // keeping this for internal usage
    };
};

export const saveToHistory = (analysis) => {
    const history = getHistory();
    history.unshift(analysis);
    localStorage.setItem('placement_history', JSON.stringify(history.slice(0, 20)));
};

export const getHistory = () => {
    try {
        const raw = localStorage.getItem('placement_history');
        const history = raw ? JSON.parse(raw) : [];
        // Basic schema check
        return history.filter(item => item && item.id && item.jdText);
    } catch (e) {
        console.error("Corrupted history detected", e);
        return [];
    }
};

export const getAnalysisById = (id) => {
    const history = getHistory();
    return history.find(h => h.id === id);
};

export const updateAnalysis = (updatedAnalysis) => {
    const history = getHistory();
    const index = history.findIndex(h => h.id === updatedAnalysis.id);
    if (index !== -1) {
        const entry = history[index];

        // Ensure finalScore calc is stable
        let bonus = 0;
        Object.values(updatedAnalysis.skillConfidenceMap).forEach(status => {
            if (status === 'know') bonus += 2;
            else bonus -= 2;
        });

        updatedAnalysis.finalScore = Math.min(100, Math.max(0, updatedAnalysis.baseScore + bonus));
        updatedAnalysis.updatedAt = new Date().toISOString();

        history[index] = updatedAnalysis;
        localStorage.setItem('placement_history', JSON.stringify(history));
    }
};
