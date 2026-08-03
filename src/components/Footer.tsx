import React from 'react';
import DelcaLogo from './DelcaLogo';

export default function Footer() {
  return (
    <footer className="mt-12 pt-6 pb-8 border-t border-white/10 text-slate-400 text-xs z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        {/* Left Brand block */}
        <div className="flex items-center space-x-3">
          <DelcaLogo badge={true} className="h-8" />
          <div>
            <div className="font-display font-bold text-white text-sm">
              DELCA VisionTech
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              Agentic AI Customer Intelligence Platform
            </div>
          </div>
        </div>

        {/* Center / Right Copyright and Disclaimer */}
        <div className="text-center md:text-right space-y-1">
          <div className="flex items-center justify-center md:justify-end space-x-2 text-[11px] font-mono text-slate-300">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[9px] font-bold">
              Prototype Version 2.4
            </span>
            <span>Copyright © {new Date().getFullYear()} DELCA VisionTech. All Rights Reserved.</span>
          </div>
          <p className="text-[10px] text-slate-400 italic">
            Prototype developed for demonstration and evaluation purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
