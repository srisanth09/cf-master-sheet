import React from 'react';
import TopicIcon from './TopicIcon';

export default function TopicCard({ topic, solvedCount = 0, onClick }) {
  const percent = topic.totalCount > 0 ? (solvedCount / topic.totalCount) * 100 : 0;
  const isCompleted = solvedCount > 0 && solvedCount === topic.totalCount;

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0e1422]/90 hover:bg-[#121a2d] border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden"
    >
      {/* Top glowing accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] transition-opacity duration-200"
        style={{
          background: `linear-gradient(90deg, transparent, ${topic.color}, transparent)`,
          boxShadow: `0 0 10px ${topic.color}`
        }}
      />

      <div>
        {/* Top Header inside Card: Icon + Count */}
        <div className="flex items-start justify-between mb-4">
          <TopicIcon name={topic.icon} color={topic.color} className="w-5 h-5" />
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80">
            <span className={solvedCount > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {solvedCount}
            </span>
            <span className="text-slate-600">/</span>
            <span>{topic.totalCount}</span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors tracking-tight">
          {topic.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide line-clamp-1">
          {topic.subtitle}
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-5">
        <div className="w-full h-1 bg-slate-800/90 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percent}%`,
              backgroundColor: isCompleted ? '#10b981' : topic.color,
              boxShadow: percent > 0 ? `0 0 8px ${isCompleted ? '#10b981' : topic.color}` : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}
