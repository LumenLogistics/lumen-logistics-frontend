import React, { useEffect, useRef } from 'react';

const STATS = [
  { value: '$2.4B+', label: 'Settled On-Chain' },
  { value: '99.97%', label: 'Uptime SLA' },
  { value: '180+', label: 'Countries Covered' },
  { value: '<3s', label: 'Avg Settlement Time' },
];

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 200, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 212, 200, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #071f1e 0%, #040f10 40%, #000 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

      {/* Glowing orb */}
      <div
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,180,160,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* Badge */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 px-6 max-w-[960px] w-full pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,212,200,0.35)] bg-[rgba(0,180,160,0.08)] text-[#00d4c8] text-xs font-medium tracking-widest uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4c8] animate-pulse" />
          Stellar Soroban · Live on Mainnet
        </div>

        <h1
          className="font-normal tracking-[0.03em] leading-[0.92] text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          }}
        >
          SUPPLY CHAIN{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00d4c8 0%, #62ffff 60%, #00a896 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            REIMAGINED
          </span>
        </h1>

        <p
          className="font-light leading-[1.75] text-[rgba(200,230,240,0.7)] max-w-[620px]"
          style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}
        >
          LumenLogistics tokenizes physical cargo on the Stellar blockchain, automating escrow settlements and providing cryptographically verified milestone tracking — from origin to destination.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <a
            href="/signup"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 text-white text-base font-semibold no-underline rounded-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#00d4c8]"
            style={{
              background: 'linear-gradient(135deg, #007a6e 0%, #00a896 100%)',
              boxShadow: '0 0 28px rgba(0,180,160,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-transparent text-[#e5ffff] text-base font-medium no-underline rounded-full cursor-pointer border border-[rgba(0,180,160,0.4)] backdrop-blur-sm transition-all duration-300 hover:border-[#00d4c8] hover:bg-[rgba(0,120,110,0.15)] hover:-translate-y-0.5"
          >
            See How It Works
          </a>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mt-10 max-w-[700px]">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(0,180,160,0.3)] to-transparent" />
          <span className="text-[#00d4c8] text-xs tracking-widest uppercase opacity-60">Live Stats</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(0,180,160,0.3)] to-transparent" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-[700px]">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span
                className="font-bold leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  background: 'linear-gradient(135deg, #00d4c8, #62ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {s.value}
              </span>
              <span className="text-[rgba(180,220,230,0.55)] text-xs tracking-wide text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
