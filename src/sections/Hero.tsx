import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DATA } from '../data/portfolio';
import './Hero.css';

// Enhanced Particle Canvas Component
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let particles: Particle[] = [];
        let shapes: FloatingShape[] = [];
        let glowOrbs: GlowOrb[] = [];
        let mouse = { x: -1000, y: -1000 };

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initElements();
        };

        // Track mouse
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        // Particle class
        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '100, 108, 255' : '139, 92, 246';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas!.width) this.x = 0;
                if (this.x < 0) this.x = canvas!.width;
                if (this.y > canvas!.height) this.y = 0;
                if (this.y < 0) this.y = canvas!.height;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx!.fill();
            }
        }

        // Floating geometric shapes
        class FloatingShape {
            x: number;
            y: number;
            size: number;
            rotation: number;
            rotationSpeed: number;
            speedX: number;
            speedY: number;
            type: 'triangle' | 'square' | 'ring' | 'cross';
            opacity: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 20 + 10;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                const types: ('triangle' | 'square' | 'ring' | 'cross')[] = ['triangle', 'square', 'ring', 'cross'];
                this.type = types[Math.floor(Math.random() * types.length)];
                this.opacity = Math.random() * 0.15 + 0.05;
                this.color = Math.random() > 0.5 ? '100, 108, 255' : '139, 92, 246';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.x > canvas!.width + 50) this.x = -50;
                if (this.x < -50) this.x = canvas!.width + 50;
                if (this.y > canvas!.height + 50) this.y = -50;
                if (this.y < -50) this.y = canvas!.height + 50;
            }

            draw() {
                ctx!.save();
                ctx!.translate(this.x, this.y);
                ctx!.rotate(this.rotation);
                ctx!.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx!.lineWidth = 1.5;

                switch (this.type) {
                    case 'triangle':
                        ctx!.beginPath();
                        ctx!.moveTo(0, -this.size);
                        ctx!.lineTo(-this.size * 0.866, this.size * 0.5);
                        ctx!.lineTo(this.size * 0.866, this.size * 0.5);
                        ctx!.closePath();
                        ctx!.stroke();
                        break;
                    case 'square':
                        ctx!.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                        break;
                    case 'ring':
                        ctx!.beginPath();
                        ctx!.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                        ctx!.stroke();
                        break;
                    case 'cross':
                        ctx!.beginPath();
                        ctx!.moveTo(-this.size / 2, 0);
                        ctx!.lineTo(this.size / 2, 0);
                        ctx!.moveTo(0, -this.size / 2);
                        ctx!.lineTo(0, this.size / 2);
                        ctx!.stroke();
                        break;
                }
                ctx!.restore();
            }
        }

        // Glowing orbs
        class GlowOrb {
            x: number;
            y: number;
            baseSize: number;
            size: number;
            pulseSpeed: number;
            pulseOffset: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.baseSize = Math.random() * 80 + 40;
                this.size = this.baseSize;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulseOffset = Math.random() * Math.PI * 2;
                const colors = ['100, 108, 255', '139, 92, 246', '236, 72, 153'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update(time: number) {
                this.size = this.baseSize + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 20;
            }

            draw() {
                const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(${this.color}, 0.15)`);
                gradient.addColorStop(0.5, `rgba(${this.color}, 0.05)`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = gradient;
                ctx!.fill();
            }
        }

        // Initialize elements
        function initElements() {
            particles = [];
            shapes = [];
            glowOrbs = [];

            const particleCount = Math.min(120, Math.floor((canvas!.width * canvas!.height) / 12000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            const shapeCount = Math.min(15, Math.floor((canvas!.width * canvas!.height) / 80000));
            for (let i = 0; i < shapeCount; i++) {
                shapes.push(new FloatingShape());
            }

            const orbCount = Math.min(5, Math.floor((canvas!.width * canvas!.height) / 200000));
            for (let i = 0; i < orbCount; i++) {
                glowOrbs.push(new GlowOrb());
            }
        }

        // Draw connections
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx!.beginPath();
                        ctx!.strokeStyle = `rgba(100, 108, 255, ${0.12 * (1 - distance / 100)})`;
                        ctx!.lineWidth = 0.5;
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.stroke();
                    }
                }

                // Connect to mouse
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 180) {
                    ctx!.beginPath();
                    ctx!.strokeStyle = `rgba(139, 92, 246, ${0.4 * (1 - distance / 180)})`;
                    ctx!.lineWidth = 1.5;
                    ctx!.moveTo(particles[i].x, particles[i].y);
                    ctx!.lineTo(mouse.x, mouse.y);
                    ctx!.stroke();
                }
            }
        }

        let time = 0;

        // Animation loop
        function animate() {
            time++;
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            // Draw glow orbs first (background)
            glowOrbs.forEach(orb => {
                orb.update(time);
                orb.draw();
            });

            // Draw shapes
            shapes.forEach(shape => {
                shape.update();
                shape.draw();
            });

            // Draw particles and connections
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-canvas" />;
}

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo('.hero-greeting', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
                .fromTo('.hero-name', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
                .fromTo('.hero-title-line', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
                .fromTo('.hero-description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
                .fromTo('.hero-badge', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 }, '-=0.4')
                .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
                .fromTo('.hero-visual', { opacity: 0, x: 20, rotationY: -10 }, { opacity: 1, x: 0, rotationY: -10, duration: 0.8 }, '-=0.4')
                .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2');
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero" id="hero" ref={containerRef}>
            {/* Animated Canvas Background */}
            <ParticleCanvas />

            <div className="hero-container">
                <div className="hero-content">
                    {/* Greeting */}
                    <p className="hero-greeting">
                        Hey there! I'm
                    </p>

                    {/* Name */}
                    <h1 className="hero-name">
                        {DATA.profile.name}
                    </h1>

                    {/* Redesigned Glass Chips Tagline */}
                    <div className="hero-badges">
                        <div className="hero-badge glass-card">
                            <span>I </span>
                            <span className="gradient-text">Code</span>
                        </div>
                        <div className="hero-badge glass-card">
                            <span>I </span>
                            <span className="gradient-text">Teach</span>
                        </div>
                        <div className="hero-badge glass-card">
                            <span>I </span>
                            <span className="gradient-text">Build The Future</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="hero-description">
                        I build scalable web applications and train the next generation of developers.
                        Currently helping 500+ students master full-stack development.
                    </p>

                    {/* CTAs */}
                    <div className="hero-cta">
                        <a href="#projects" className="hero-btn hero-btn-primary">
                            View My Work
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#contact" className="hero-btn hero-btn-secondary">
                            Get In Touch
                        </a>
                    </div>
                </div>

                {/* Right Side: Sci-Fi Holographic HUD */}
                <div className="hero-visual">
                    <div className="hud-container">
                        {/* Scanline Overlay */}
                        <div className="hud-scanlines"></div>

                        {/* Profile Scan Ring */}
                        <div className="hud-scan-ring">
                            <div className="scan-ring-outer"></div>
                            <div className="scan-ring-inner"></div>
                            <div className="scan-line-sweep"></div>
                            <div className="scan-center">
                                <i className="fas fa-user-astronaut"></i>
                            </div>
                        </div>

                        {/* Data Panels */}
                        <div className="hud-panel panel-top-left">
                            <div className="panel-header">
                                <span className="blink-dot"></span>
                                <span>SYS_STATUS</span>
                            </div>
                            <div className="panel-content">
                                <span className="status-online">● ONLINE</span>
                            </div>
                        </div>

                        <div className="hud-panel panel-top-right">
                            <div className="panel-header">
                                <span className="blink-dot"></span>
                                <span>SKILLS_DB</span>
                            </div>
                            <div className="panel-content">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '100%' }}></div>
                                </div>
                                <span>LOADED: 100%</span>
                            </div>
                        </div>

                        <div className="hud-panel panel-bottom-left">
                            <div className="panel-header">
                                <span className="blink-dot"></span>
                                <span>METRICS</span>
                            </div>
                            <div className="panel-content metrics">
                                <div><span className="metric-val">{DATA.profile.stats.studentsTrainted}</span> STUDENTS</div>
                                <div><span className="metric-val">{DATA.profile.stats.projects}</span> PROJECTS</div>
                                <div><span className="metric-val">{DATA.profile.stats.technologies}</span> SKILLS</div>
                            </div>
                        </div>

                        <div className="hud-panel panel-bottom-right">
                            <div className="panel-header">
                                <span className="blink-dot"></span>
                                <span>TERMINAL</span>
                            </div>
                            <div className="panel-content terminal">
                                <span className="terminal-line">&gt; init developer.exe</span>
                                <span className="terminal-line">&gt; loading skills...</span>
                                <span className="terminal-line typing">&gt; READY_<span className="cursor">|</span></span>
                            </div>
                        </div>

                        {/* Corner Brackets */}
                        <div className="hud-corner corner-tl"></div>
                        <div className="hud-corner corner-tr"></div>
                        <div className="hud-corner corner-bl"></div>
                        <div className="hud-corner corner-br"></div>
                    </div>
                </div>

                {/* Scroll Hint (Positioned Absolutely at bottom now) */}
                <div className="hero-scroll-hint">
                    <span>Scroll to explore</span>
                    <div className="hero-scroll-indicator">
                        <div className="hero-scroll-dot"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
