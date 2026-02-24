export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    tech: string[];
    image: string;
    link: string;
    github?: string;
    color: string;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string[];
    type: 'work' | 'education';
}

export interface Skill {
    name: string;
    icon: string;
    category: 'frontend' | 'backend' | 'tools' | 'languages';
}

export interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[];
    color: string;
}


export const DATA = {
    profile: {
        name: 'Ajay Duddi',
        title: 'Full Stack Developer',
        subtitle: 'Building Digital Experiences That Matter',
        bio: 'Computer Science graduate with hands-on experience in full-stack ecosystems including React, Angular, Express.js, and SpringBoot. Dedicated to building scalable, high-performance applications and solving complex architectural challenges. Currently leveraging technical depth to train over 1K+ developers while actively contributing to enterprise-grade software solutions.',
        email: 'ajayduddi.work@gmail.com',
        location: 'Hyderabad, India',
        available: true,
        socials: {
            linkedin: 'https://www.linkedin.com/in/Ajayduddi/',
            github: 'https://github.com/Ajayduddi',
            leetcode: 'https://leetcode.com/u/Ajayduddi/',
            code360: 'https://www.naukri.com/code360/profile/2dfd421c-a637-4508-bce2-2aa3bcabc2db',
            hackerrank: 'https://www.hackerrank.com/profile/ajayprofessional',
            codechef: 'https://www.codechef.com/users/ajayduddi',
            geeksforgeeks: 'https://www.geeksforgeeks.org/profile/ajayprofesd5f1'
        },
        stats: {
            studentsTrainted: '1K+',
            projects: '5+',
            technologies: '15+'
        }
    },

    services: [
        {
            id: 'websites',
            icon: 'img:/icons/html5.svg',
            title: 'Website Development',
            description: 'Custom, responsive websites built with modern technologies. From landing pages to complex multi-page sites, designed for performance and user experience.',
            features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Modern UI/UX'],
            color: '#e34f26'
        },
        {
            id: 'webapps',
            icon: 'img:/icons/react.svg',
            title: 'Web Applications',
            description: 'Full-stack web applications tailored to your business needs. Scalable, secure, and built with the latest frameworks and best practices.',
            features: ['React / Angular', 'Node.js / Laravel', 'Database Design', 'Authentication'],
            color: '#61dafb'
        },
        {
            id: 'api',
            icon: 'img:/icons/nodejs.svg',
            title: 'API Development',
            description: 'RESTful APIs and backend services that power your applications. Clean, documented, and built for reliability and scalability.',
            features: ['RESTful Design', 'Documentation', 'Security', 'Performance'],
            color: '#339933'
        }
    ] as Service[],

    skills: [
        { name: 'React', icon: 'img:/icons/react.svg', category: 'frontend' },
        { name: 'Angular', icon: 'img:/icons/angular.svg', category: 'frontend' },
        { name: 'TypeScript', icon: 'img:/icons/typescript.svg', category: 'languages' },
        { name: 'JavaScript', icon: 'img:/icons/javascript.svg', category: 'languages' },
        { name: 'HTML5', icon: 'img:/icons/html5.svg', category: 'frontend' },
        { name: 'CSS3', icon: 'img:/icons/css3.svg', category: 'frontend' },
        { name: 'Node.js', icon: 'img:/icons/nodejs.svg', category: 'backend' },
        { name: 'Express.js', icon: 'img:/icons/express.svg', category: 'backend' },
        { name: 'Spring Boot', icon: 'img:/icons/spring.svg', category: 'backend' },
        { name: 'Laravel', icon: 'img:/icons/laravel.svg', category: 'backend' },
        { name: 'Python', icon: 'img:/icons/python.svg', category: 'languages' },
        { name: 'Java', icon: 'img:/icons/java.svg', category: 'languages' },
        { name: 'MySQL', icon: 'img:/icons/mysql.svg', category: 'backend' },
        { name: 'MongoDB', icon: 'img:/icons/mongodb.svg', category: 'backend' },
        { name: 'Git', icon: 'img:/icons/git.svg', category: 'tools' },
        { name: 'Figma', icon: 'img:/icons/figma.svg', category: 'tools' }
    ] as Skill[],

    projects: [
        {
            id: 'sms-gpt',
            title: 'SMS GPT',
            description: 'AI-powered SMS assistant providing real-time, context-aware responses without internet.',
            longDescription: 'Co-developed an SMS-based conversational AI system providing real-time, context-aware responses without internet access. Integrated Google Gemini AI for natural language processing and PyAutoGUI for automated SMS handling.',
            tech: ['Python', 'Google Gemini AI', 'PyAutoGUI', 'NLP'],
            image: 'https://rustfs-api.ajayduddi.site/portfolio/smsgpt.jpg',
            link: 'https://smsgpt.ajayduddi.site/',
            color: '#10b981'
        },
        {
            id: 'coding-club',
            title: 'PU Coding Club',
            description: 'Comprehensive coding club management platform facilitating student enrollment and administrative control.',
            longDescription: 'A centralized platform designed to streamline coding club operations. Students can easily enroll in their interested tracks, while admins have full control to manage classrooms, clubs, and track attendance efficiently.',
            tech: ['Solid.js', 'Node.js', 'MongoDB', 'Express.js'],
            image: 'https://rustfs-api.ajayduddi.site/portfolio/pu.codingclub.space.png',
            link: 'https://pu.codingclub.space',
            color: '#8b5cf6'
        },
        {
            id: 'pu-code-hackathon',
            title: 'PU Code Hackathon 3.0',
            description: 'Official website for a 36-hour intensive coding challenge featuring 100+ problem statements across AI, Blockchain, IoT, and more.',
            longDescription: 'Developed the official event website for PU CODE HACKATHON 3.0 - a 36-hour intensive coding challenge hosted by the Faculty of Engineering and Technology at Parul University.',
            tech: ['React', 'TypeScript', 'Tailwind CSS'],
            image: 'https://rustfs-api.ajayduddi.site/portfolio/pucodehackathon.jpg',
            link: 'https://codehackathon.paruluniversity.ac.in/',
            color: '#f97316'
        },
        {
            id: 'support-board',
            title: 'Support Board',
            description: 'Enterprise ticketing system with real-time monitoring and role-based access control.',
            longDescription: 'Developed a comprehensive system to streamline ticket handling and improve internal support workflows. Features centralized dashboard, real-time monitoring, role-based access control, and secure authentication using Passport.js.',
            tech: ['Node.js', 'MongoDB', 'JavaScript', 'Passport.js'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            link: 'https://ajayduddi.github.io/Ticketing-Tool/',
            color: '#3b82f6'
        },
        {
            id: 'medilab',
            title: 'Medilab System',
            description: 'Laboratory management system with appointment scheduling and report generation.',
            longDescription: 'Developed a responsive lab management system to streamline operations and enhance patient management. Built with React and Material UI, featuring appointment scheduling, patient data management, and report generation.',
            tech: ['React', 'Material UI', 'JavaScript'],
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
            link: 'https://github.com/Ajayduddi/Medilab',
            github: 'https://github.com/Ajayduddi/Medilab',
            color: '#ef4444'
        }
    ] as Project[],

    experience: [
        {
            id: 'codetantra',
            role: 'Technical Trainer',
            company: 'CodeTantra, Hyderabad',
            duration: 'Present',
            description: [
                'Led technical training sessions for 500+ students on programming fundamentals',
                'Focused on full-stack development and practical problem-solving strategies',
                'Specialized in Java and Java-FullStack technologies'
            ],
            type: 'work'
        },
        {
            id: 'wisetech',
            role: 'Full Stack Developer (Part-time)',
            company: 'Wise Tech Board (Remote)',
            duration: 'Mar 2024 - Aug 2024',
            description: [
                'Part-time role during college studies',
                'Contributed to client-based web applications - Aadhya Tax Solution and Finapp',
                'Developed third-party authentication and dynamic data validation',
                'Implemented performance-optimized admin dashboard'
            ],
            type: 'work'
        },
        {
            id: 'prahansoft',
            role: 'Frontend Developer Intern',
            company: 'PrahanSoft, Narasaraopet',
            duration: 'May 2023 - Jul 2023',
            description: [
                'Internship - Summer 2023',
                'Developed intuitive interface for laboratory management system using React',
                'Built appointment scheduling and patient data management features',
                'Used Material UI and React Shades for enhanced UX'
            ],
            type: 'work'
        },
        {
            id: 'jntuk',
            role: 'B.Tech in Computer Science',
            company: 'University College of Engineering, JNTUK',
            duration: '2021 - 2025',
            description: [
                'GPA: 8.08/10',
                'Focus on software development, algorithms, and system design'
            ],
            type: 'education'
        }
    ] as Experience[]
};
