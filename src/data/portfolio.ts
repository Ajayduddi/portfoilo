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
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
            link: 'https://github.com/Ajayduddi',
            color: '#10b981'
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
                'GPA: 8.13/10',
                'Focus on software development, algorithms, and system design'
            ],
            type: 'education'
        }
    ] as Experience[]
};
