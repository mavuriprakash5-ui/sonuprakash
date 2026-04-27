import React, { useState } from 'react';
import { MusicPlayer } from './components/MusicPlayer.tsx';
import { SnakeGame } from './components/SnakeGame.tsx';
import { GlitchText } from './components/GlitchText.tsx';

const App: React.FC = () => {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-end mb-6 border-b-2 border-cyan-500 pb-2 relative z-10">
        <div>
          <div className="text-magenta-500 text-sm tracking-widest mb-1">TERMINAL_ID: 0x8F9A</div>
          <GlitchText text="SYS.MAIN_INTERFACE" as="h1" className="text-3xl md:text-5xl font-bold text-cyan-400" />
        </div>
        <div className="text-right">
          <div className="text-cyan-600 text-sm">ENTITY.SCORE</div>
          <div className="text-4xl text-magenta-400 font-bold leading-none">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Info / Decorative */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="border border-cyan-500/50 p-4 bg-dark/50">
            <h3 className="text-magenta-400 border-b border-magenta-500/50 pb-1 mb-2">CONTROLS</h3>
            <ul className="text-cyan-500 text-sm space-y-2">
              <li><span className="text-white">[W/A/S/D]</span> OR <span className="text-white">[ARROWS]</span> : NAVIGATE</li>
              <li><span className="text-white">[SPACE]</span> : INIT / REBOOT</li>
            </ul>
          </div>
          
          <div className="border border-cyan-500/50 p-4 bg-dark/50 flex-grow">
            <h3 className="text-magenta-400 border-b border-magenta-500/50 pb-1 mb-2">SYS.LOG</h3>
            <div className="text-cyan-700 text-xs space-y-1 font-mono opacity-70">
              <p>> BOOT SEQUENCE INITIATED...</p>
              <p>> LOADING NEURAL NETWORKS...</p>
              <p>> AUDIO MODULE ONLINE.</p>
              <p>> AWAITING USER INPUT.</p>
              <p className="animate-pulse text-magenta-500">> WARNING: GLITCH DETECTED.</p>
            </div>
          </div>
        </div>

        {/* Center Column: Game */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <div className="w-full max-w-lg relative">
            {/* Decorative corner brackets */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-magenta-500"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-magenta-500"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-magenta-500"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-magenta-500"></div>
            
            <SnakeGame onScoreChange={setScore} />
          </div>
        </div>

        {/* Right Column (Mobile) / Bottom (Desktop): Music Player */}
        <div className="lg:col-span-3 lg:mt-4">
           <MusicPlayer />
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mt-8 text-center text-cyan-800 text-xs relative z-10">
        <p>V 2.0.4 // UNAUTHORIZED ACCESS LOGGED</p>
      </footer>
    </div>
  );
};

export default App;