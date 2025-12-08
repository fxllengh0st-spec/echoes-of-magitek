import React from 'react';

export const FFWindow: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`ff-window p-3 text-white text-shadow overflow-hidden ${className}`}>
    {title && (
      <div className="absolute -top-3 left-4 bg-[#161a42] px-2 text-gray-300 text-sm border border-gray-600 rounded">
        {title}
      </div>
    )}
    {children}
  </div>
);

export const HandCursor: React.FC<{ active?: boolean }> = ({ active = true }) => {
  if (!active) return <span className="w-6 inline-block"></span>;
  return <span className="cursor-hand text-white mr-2 text-xl drop-shadow-md">☞</span>;
};

export const RetroButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  disabled?: boolean;
  selected?: boolean;
}> = ({ onClick, children, disabled, selected = false }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`w-full text-left px-2 py-1 flex items-center transition-colors text-xl md:text-2xl font-vt323 uppercase tracking-wide
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10'}
        ${selected ? 'bg-white/20' : ''}
      `}
    >
      <HandCursor active={selected} />
      <span className={selected ? "text-yellow-200" : "text-white"}>{children}</span>
    </button>
  );
};

export const RetroLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-400 border-l-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-blue-400 rounded-full animate-spin direction-reverse"></div>
    </div>
    <p className="text-xl animate-pulse text-yellow-200">Consultando o Cristal...</p>
  </div>
);
