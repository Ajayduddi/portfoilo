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
        bio: 'Computer Science graduate with hands-on experience in full-stack ecosystems including React, Angular, Express.js, and SpringBoot. Dedicated to building scalable, high-performance applications and solving complex architectural challenges. Currently leveraging technical depth to train over 2K+ developers while actively contributing to enterprise-grade software solutions.',
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
            studentsTrainted: '2K+',
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
        },
        {
            id: 'training-workshops',
            icon: 'fas fa-chalkboard-teacher',
            title: 'Training & Workshops',
            description: 'Hands-on technical training for students, teams, and developer communities covering full-stack development, Agentic AI workflows, and real-world project building.',
            features: ['Agentic AI', 'Java Full Stack', 'React / Angular', 'Hands-on Labs'],
            color: '#f59e0b'
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
        { name: 'n8n', icon: 'img:/icons/n8n.svg', category: 'tools' },
        { name: 'Sim', icon: 'img:/icons/sim.svg', category: 'tools' },
        { name: 'Figma', icon: 'img:/icons/figma.svg', category: 'tools' }
    ] as Skill[]
};
