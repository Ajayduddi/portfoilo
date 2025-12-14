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

export const DATA = {
    profile: {
        name: 'Ajay Duddi',
        title: 'Full Stack Developer',
        subtitle: 'Building Digital Experiences That Matter',
        bio: 'Computer Science graduate with hands-on experience in full-stack development using React, Laravel, Angular and MySQL. Passionate about building scalable applications and solving complex problems. Currently working as a Technical Trainer while seeking opportunities to grow as a Software Developer.',
        email: 'ajayduddi.work@gmail.com',
        phone: '+91 9014404336',
        location: 'Hyderabad, India',
        available: true,
        socials: {
            linkedin: 'https://www.linkedin.com/in/Ajayduddi/',
            github: 'https://github.com/Ajayduddi',
            leetcode: 'https://leetcode.com/u/Ajayduddi/',
            code360: 'https://www.naukri.com/code360/profile/2dfd421c-a637-4508-bce2-2aa3bcabc2db'
        },
        stats: {
            studentsTrainted: '500+',
            projects: '4+',
            technologies: '15+'
        }
    },

    skills: [
        { name: 'React', icon: 'fab fa-react', category: 'frontend' },
        { name: 'Angular', icon: 'fab fa-angular', category: 'frontend' },
        { name: 'TypeScript', icon: 'fas fa-code', category: 'languages' },
        { name: 'JavaScript', icon: 'fab fa-js-square', category: 'languages' },
        { name: 'HTML5', icon: 'fab fa-html5', category: 'frontend' },
        { name: 'CSS3', icon: 'fab fa-css3-alt', category: 'frontend' },
        { name: 'Node.js', icon: 'fab fa-node-js', category: 'backend' },
        { name: 'Express.js', icon: 'fas fa-server', category: 'backend' },
        { name: 'Spring Boot', icon: 'fas fa-leaf', category: 'backend' },
        { name: 'Laravel', icon: 'fab fa-laravel', category: 'backend' },
        { name: 'Python', icon: 'fab fa-python', category: 'languages' },
        { name: 'Java', icon: 'fab fa-java', category: 'languages' },
        { name: 'MySQL', icon: 'fas fa-database', category: 'backend' },
        { name: 'MongoDB', icon: 'fas fa-database', category: 'backend' },
        { name: 'Git', icon: 'fab fa-git-alt', category: 'tools' },
        { name: 'Figma', icon: 'fab fa-figma', category: 'tools' }
    ] as Skill[],

    projects: [
        {
            id: 'sms-gpt',
            title: 'SMS GPT',
            description: 'AI-powered SMS assistant providing real-time, context-aware responses without internet.',
            longDescription: 'Co-developed an SMS-based conversational AI system providing real-time, context-aware responses without internet access. Integrated Google Gemini AI for natural language processing and PyAutoGUI for automated SMS handling.',
            tech: ['Python', 'Google Gemini AI', 'PyAutoGUI', 'NLP'],
            image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
            link: 'https://github.com/Ajayduddi',
            color: '#10b981'
        },
        {
            id: 'support-board',
            title: 'Support Board',
            description: 'Enterprise ticketing system with real-time monitoring and role-based access control.',
            longDescription: 'Developed a comprehensive system to streamline ticket handling and improve internal support workflows. Features centralized dashboard, real-time monitoring, role-based access control, and secure authentication using Passport.js.',
            tech: ['Node.js', 'MongoDB', 'JavaScript', 'Passport.js'],
            image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
            link: 'https://ajayduddi.github.io/Ticketing-Tool/',
            color: '#3b82f6'
        },
        {
            id: 'medilab',
            title: 'Medilab System',
            description: 'Laboratory management system with appointment scheduling and report generation.',
            longDescription: 'Developed a responsive lab management system to streamline operations and enhance patient management. Built with React and Material UI, featuring appointment scheduling, patient data management, and report generation.',
            tech: ['React', 'Material UI', 'JavaScript'],
            image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200',
            link: 'https://github.com/Ajayduddi/Medilab',
            github: 'https://github.com/Ajayduddi/Medilab',
            color: '#ef4444'
        }
        // {
        //     id: 'portfolio-v1',
        //     title: 'Portfolio Website',
        //     description: 'Modern portfolio with glassmorphism design and smooth animations.',
        //     longDescription: 'A responsive portfolio website showcasing my projects and skills. Built with modern web technologies including HTML5, CSS3, and JavaScript with smooth animations and interactive elements.',
        //     tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
        //     image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200',
        //     link: 'https://ajayduddi-portfolio.netlify.app/',
        //     color: '#8b5cf6'
        // }
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
            role: 'Full Stack Developer',
            company: 'Wise Tech Board (Remote)',
            duration: 'Mar 2024 - Aug 2024',
            description: [
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
                'GPA: 8.13/10',
                'Focus on software development, algorithms, and system design'
            ],
            type: 'education'
        }
    ] as Experience[]
};
