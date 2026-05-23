'use client';

export default function TechBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* Base void */}
      <div className="absolute inset-0" style={{ background: 'var(--bg-void)' }} />

      {/* Animated tech grid */}
      <div className="absolute inset-0 tech-grid opacity-100" />

      {/* Radial glow — cyan top-left */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Radial glow — violet bottom-right */}
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full animate-pulse-glow delay-500"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-[1px] opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--cyan) 30%, var(--cyan) 70%, transparent 100%)',
          animation: 'scanline 8s linear infinite',
          top: 0,
        }}
      />

      {/* Floating GPU silhouette — top right */}
      <div
        className="absolute top-12 right-16 w-48 h-28 animate-float opacity-[0.06]"
        style={{ animationDelay: '0s' }}
      >
        <GpuSilhouette />
      </div>

      {/* Floating CPU silhouette — bottom left */}
      <div
        className="absolute bottom-20 left-16 w-32 h-32 animate-float opacity-[0.05]"
        style={{ animationDelay: '2s' }}
      >
        <CpuSilhouette />
      </div>

      {/* Circuit traces — top */}
      <svg
        className="absolute top-0 left-0 w-full opacity-[0.06]"
        height="200"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <path d="M0 40 L200 40 L220 60 L500 60 L520 40 L800 40 L820 20 L1200 20" stroke="var(--cyan)" strokeWidth="1" fill="none" />
        <path d="M0 100 L150 100 L170 80 L400 80 L420 100 L700 100 L720 120 L1200 120" stroke="var(--cyan)" strokeWidth="0.5" fill="none" />
        <path d="M0 160 L300 160 L320 140 L600 140 L620 160 L1200 160" stroke="var(--cyan)" strokeWidth="0.5" fill="none" />
        {/* Junction dots */}
        <circle cx="200" cy="40" r="2.5" fill="var(--cyan)" />
        <circle cx="500" cy="60" r="2.5" fill="var(--cyan)" />
        <circle cx="800" cy="40" r="2.5" fill="var(--cyan)" />
        <circle cx="150" cy="100" r="1.5" fill="var(--cyan)" />
        <circle cx="400" cy="80" r="1.5" fill="var(--cyan)" />
        <circle cx="300" cy="160" r="1.5" fill="var(--cyan)" />
      </svg>

      {/* Circuit traces — bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.06]"
        height="200"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ transform: 'scaleY(-1)' }}
      >
        <path d="M0 40 L200 40 L220 60 L500 60 L520 40 L800 40 L820 20 L1200 20" stroke="var(--violet)" strokeWidth="1" fill="none" />
        <path d="M0 100 L350 100 L370 80 L600 80 L620 100 L900 100 L920 120 L1200 120" stroke="var(--violet)" strokeWidth="0.5" fill="none" />
        <circle cx="200" cy="40" r="2.5" fill="var(--violet)" />
        <circle cx="500" cy="60" r="2.5" fill="var(--violet)" />
        <circle cx="350" cy="100" r="1.5" fill="var(--violet)" />
      </svg>

      {/* Scanline texture */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
        }}
      />
    </div>
  );
}

function GpuSilhouette() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="160" height="80" rx="6" stroke="var(--cyan)" strokeWidth="2" />
      <rect x="35" y="35" width="60" height="50" rx="3" stroke="var(--cyan)" strokeWidth="1.5" />
      <rect x="105" y="35" width="60" height="50" rx="3" stroke="var(--cyan)" strokeWidth="1.5" />
      {/* Fans */}
      <circle cx="65" cy="60" r="18" stroke="var(--cyan)" strokeWidth="1" />
      <circle cx="135" cy="60" r="18" stroke="var(--cyan)" strokeWidth="1" />
      <circle cx="65" cy="60" r="4" fill="var(--cyan)" />
      <circle cx="135" cy="60" r="4" fill="var(--cyan)" />
      {/* PCIe connector */}
      <rect x="2" y="85" width="18" height="20" rx="2" stroke="var(--cyan)" strokeWidth="1.5" />
      {/* Connectors */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={40 + i * 8} y="5" width="4" height="16" rx="1" stroke="var(--cyan)" strokeWidth="1" />
      ))}
    </svg>
  );
}

function CpuSilhouette() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="70" height="70" rx="4" stroke="var(--cyan)" strokeWidth="2" />
      <rect x="35" y="35" width="50" height="50" rx="2" stroke="var(--cyan)" strokeWidth="1" />
      {/* Pins left */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`l${i}`} x1="0" y1={32 + i * 9} x2="25" y2={32 + i * 9} stroke="var(--cyan)" strokeWidth="1" />
      ))}
      {/* Pins right */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`r${i}`} x1="95" y1={32 + i * 9} x2="120" y2={32 + i * 9} stroke="var(--cyan)" strokeWidth="1" />
      ))}
      {/* Pins top */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`t${i}`} x1={32 + i * 9} y1="0" x2={32 + i * 9} y2="25" stroke="var(--cyan)" strokeWidth="1" />
      ))}
      {/* Pins bottom */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`b${i}`} x1={32 + i * 9} y1="95" x2={32 + i * 9} y2="120" stroke="var(--cyan)" strokeWidth="1" />
      ))}
      {/* Core grid */}
      <line x1="35" y1="60" x2="85" y2="60" stroke="var(--cyan)" strokeWidth="0.5" />
      <line x1="60" y1="35" x2="60" y2="85" stroke="var(--cyan)" strokeWidth="0.5" />
    </svg>
  );
}
