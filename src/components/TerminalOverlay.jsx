const TerminalOverlay = () => {
  return (
    <div className="absolute bottom-3 right-3">
      {/* Terminal Box */}
      <div className="relative w-64 bg-black/70 border border-cyan-500/40 rounded-md p-2 font-mono text-[10px] text-gray-200 shadow-md backdrop-blur-sm">
        
        {/* Status Bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/40 pb-0.5 mb-1">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <p className="text-[9px] text-cyan-400 uppercase tracking-wider">
              SYSTEM ACTIVE
            </p>
          </div>
          <p className="text-[9px] text-gray-400">ID:78412.93</p>
        </div>

        {/* Header */}
        <p className="text-[10px] text-gray-200 mb-1 tracking-tight">
          <span className="text-cyan-400">/</span> WORKOUT ANALYSIS COMPLETE
        </p>

        {/* Workout List */}
        <div className="space-y-0.5 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 w-4 text-right">01</span>
            <span>
              30 min strength training <span className="text-gray-400">(upper body)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 w-4 text-right">02</span>
            <span>
              20 min cardio <span className="text-gray-400">(moderate intensity)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 w-4 text-right">03</span>
            <span>
              10 min flexibility <span className="text-gray-400">(recovery)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalOverlay;
