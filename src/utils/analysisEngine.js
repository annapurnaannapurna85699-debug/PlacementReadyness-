const SKILL_CATEGORIES = {
    'Core CS': ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented Programming', 'DBMS', 'Database Management', 'OS', 'Operating System', 'Computer Networks', 'Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
    'Web': ['React', 'Next.js', 'NextJS', 'Node.js', 'NodeJS', 'Express', 'REST', 'API', 'GraphQL', 'Tailwind', 'HTML', 'CSS', 'Vue', 'Angular'],
    'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'Cassandra', 'Data Science', 'Machine Learning', 'AI'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Jenkins', 'Cloud'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Testing', 'QA']
};

const BASE_CHECKLIST = {
    'Round 1: Aptitude / Basics': [
        'Solve 20 Quant problems on time/speed/distance',
        'Practice 15 Logical Reasoning puzzles',
        'Revise Data Interpretation charts',
        'Review basic Probability and Statistics',
        'Take a timed 30-min aptitude mock test'
    ],
    'Round 2: DSA + Core CS': [
        'Practice 5 medium-level Linked List/Tree problems',
        'Revise Big O notation and Complexity Analysis',
        'Explain ACID properties and Indexing in DBMS',
        'Describe Process Lifecycle and Threading in OS',
        'Review 3-way handshake in TCP/IP'
    ],
    'Round 3: Tech Interview (Projects + Stack)': [
        'Prepare 2-minute elevator pitch for your top project',
        'Identify 3 key technical challenges faced in projects',
        'Sketch high-level architecture diagram for your project',
        'Review best practices for your primary technology stack',
        'Prepare to explain design decisions (Why X over Y?)'
    ],
    'Round 4: Managerial / HR': [
        'Prepare "Tell me about yourself" (Professional focus)',
        'Use STAR method for a behavioral conflict scenario',
        'Identify 3 strengths with specific examples',
        'Research company values and recent news',
        'Prepare 3 thoughtful questions for the interviewer'
    ]
};

const BASE_QUESTIONS = [
    "Can you explain your final year project in detail?",
    "Tell me about a time you faced a difficult bug and how you solved it.",
    "Which programming language do you prefer and why?",
    "How do you handle working in a team with conflicting opinions?",
    "What is your approach to learning a new technology quickly?"
];

const SKILL_SPECIFIC_QUESTIONS = {
    'SQL': ["Explain the difference between JOIN and UNION.", "What is normalization and why do we use it?"],
    'React': ["Explain the React component lifecycle or Hooks.", "How does the Virtual DOM improve performance?"],
    'DSA': ["Explain the pros and cons of QuickSort vs MergeSort.", "How would you detect a cycle in a directed graph?"],
    'Node.js': ["Explain the event loop in Node.js.", "What is the difference between setImmediate() and process.nextTick()?"],
    'Docker': ["What is the difference between an Image and a Container?", "How do you optimize a Dockerfile for production?"],
    'Java': ["Explain JVM, JRE, and JDK.", "Difference between abstract class and interface in Java 8+."]
};

export const analyzeJD = (company, role, jdText) => {
    const normalizedJD = jdText.toLowerCase();
    const extractedSkills = {};
    let totalDetectedCount = 0;
    let detectedCategories = 0;

    // 1. Skill Extraction
    Object.entries(SKILL_CATEGORIES).forEach(([category, keywords]) => {
        const found = keywords.filter(kw =>
            normalizedJD.includes(kw.toLowerCase())
        );
        if (found.length > 0) {
            extractedSkills[category] = found;
            detectedCategories++;
            totalDetectedCount += found.length;
        }
    });

    const finalSkills = Object.keys(extractedSkills).length > 0
        ? extractedSkills
        : { 'General': ['General fresher stack'] };

    // 2. Readiness Score
    let score = 35;
    score += Math.min(detectedCategories * 5, 30);
    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jdText.length > 800) score += 10;
    score = Math.min(score, 100);

    // 3. Round-wise Checklist (Adaptive)
    const checklist = JSON.parse(JSON.stringify(BASE_CHECKLIST));
    if (extractedSkills['Web']) {
        checklist['Round 3: Tech Interview (Projects + Stack)'].unshift(`Revise ${extractedSkills['Web'][0]} fundamentals and common pitalls`);
    }
    if (extractedSkills['Core CS']) {
        checklist['Round 2: DSA + Core CS'].unshift(`Practice advanced ${extractedSkills['Core CS'][0]} concepts`);
    }

    // 4. 7-Day Plan (Adaptive)
    const plan = [
        { day: 'Day 1–2: Basics + Core CS', tasks: ['Revise Hashing and Sorting', 'Review OS Scheduling Algorithms', 'DBMS Normalization basics'] },
        { day: 'Day 3–4: DSA + Coding Practice', tasks: ['Solve 5 LeetCode Mediums', 'Practice whiteboard coding', 'Analyze Time/Space complexity'] },
        { day: 'Day 5: Project + Resume Alignment', tasks: ['Perfect the STAR responses', 'Review core architectural metrics', 'Update resume for keywords'] },
        { day: 'Day 6: Mock Interview Questions', tasks: ['Record yourself answering HR questions', 'Do a peer-to-peer technical mock', 'Review weak tech areas'] },
        { day: 'Day 7: Final Revision', tasks: ['Read through revision notes', 'Quickly review company news', 'Meditation and prep for game day'] }
    ];

    if (extractedSkills['Web']) {
        plan[0].tasks.push(`Revise ${extractedSkills['Web'][0]} Component Architecture`);
    }
    if (extractedSkills['Cloud/DevOps']) {
        plan[2].tasks.push(`Review ${extractedSkills['Cloud/DevOps'][0]} deployment flows`);
    }

    // 5. Likely Interview Questions
    const questions = [...BASE_QUESTIONS];
    Object.keys(SKILL_SPECIFIC_QUESTIONS).forEach(skill => {
        if (normalizedJD.includes(skill.toLowerCase())) {
            questions.push(...SKILL_SPECIFIC_QUESTIONS[skill]);
        }
    });

    // Shuffle and take top 10
    const finalQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills: finalSkills,
        plan,
        checklist,
        questions: finalQuestions,
        readinessScore: score,
        baseReadinessScore: score,
        skillConfidenceMap: {}
    };
};

export const saveToHistory = (analysis) => {
    const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
    history.unshift(analysis);
    localStorage.setItem('placement_history', JSON.stringify(history.slice(0, 20))); // Keep last 20
};

export const getHistory = () => {
    return JSON.parse(localStorage.getItem('placement_history') || '[]');
};

export const getAnalysisById = (id) => {
    const history = getHistory();
    return history.find(h => h.id === id);
};

export const updateAnalysis = (updatedAnalysis) => {
    const history = getHistory();
    const index = history.findIndex(h => h.id === updatedAnalysis.id);
    if (index !== -1) {
        history[index] = updatedAnalysis;
        localStorage.setItem('placement_history', JSON.stringify(history));
    }
};
