import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '', as: Component = 'span' }) => {
  return (
    <Component className={`glitch-wrapper ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="glitch-layer glitch-cyan" aria-hidden="true">{text}</span>
      <span className="glitch-layer glitch-magenta" aria-hidden="true">{text}</span>
    </Component>
  );
};