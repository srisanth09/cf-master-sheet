import React from 'react';
import { Sparkles, RefreshCw, Shuffle, CheckCircle2, Trophy, UserCheck } from 'lucide-react';

export default function Header({
  solvedCount,
  totalCount,
  onOpenSync,
  cfHandle,
  onPickRandom,
  onResetProgress,
  onOpenStats
}) {
  const percent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <header className="border-b border-slate-800/80 bg-[#080b11]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Branding */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400 font-semibold uppercase">
              STRIVER × CODEFORCES
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-[10px] font-mono tracking-wider bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded-full">
              CP EDITION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-heading flex items-center gap-3">
            DSA Master Sheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide mt-0.5">
            16 TOPICS · {totalCount} CURATED CODEFORCES PROBLEMS
          </p>
        </div>

        {/* Action Controls & Solved Pill */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 bg-[#0e1422] p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={onPickRandom}
              title="Pick a random unsolved problem"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Random</span>
            </button>

            <button
              onClick={onOpenSync}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                cfHandle
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 hover:bg-cyan-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Sync with your Codeforces handle"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{cfHandle ? `@${cfHandle}` : 'Sync CF'}</span>
            </button>

            <button
              onClick={onResetProgress}
              title="Reset all solved marks"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Solved Counter Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0f172a]/90 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <div className="text-sm font-semibold tracking-tight">
              <span className="text-emerald-400 font-mono text-base">{solvedCount}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-300 font-mono">{totalCount}</span>
              <span className="text-slate-400 font-normal text-xs ml-1.5 hidden sm:inline">solved</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40 ml-1">
              {percent}%
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
