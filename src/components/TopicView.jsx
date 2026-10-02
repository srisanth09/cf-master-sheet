import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ExternalLink, Check, Filter, Sparkles } from 'lucide-react';
import TopicIcon from './TopicIcon';
import { getRatingColor, getDifficultyBadge } from '../utils/cfColors';

export default function TopicView({
  topic,
  solvedMap,
  onToggleProblem,
  onBack
}) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const topicSolvedCount = useMemo(() => {
    return topic.problems.filter(p => solvedMap[p.id]).length;
  }, [topic, solvedMap]);

  const filteredProblems = useMemo(() => {
    return topic.problems.filter(p => {
      // Search
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));

      // Difficulty
      const matchDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;

      // Status
      const isSolved = !!solvedMap[p.id];
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Solved' && isSolved) ||
        (statusFilter === 'Unsolved' && !isSolved);

      return matchSearch && matchDiff && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'rating-asc') return a.rating - b.rating;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'solved-desc') return b.solvedCount - a.solvedCount;
      return a.order - b.order;
    });
  }, [topic, search, difficultyFilter, statusFilter, sortBy, solvedMap]);

  const percent = topic.totalCount > 0 ? Math.round((topicSolvedCount / topic.totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700/80 bg-[#0e1422] hover:bg-slate-800 text-slate-200 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <TopicIcon name={topic.icon} color={topic.color} className="w-5 h-5" />

          <div>
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                {topic.title}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {topic.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Topic Solved Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs bg-[#0e1422] border border-slate-800 px-3.5 py-1.5 rounded-lg text-slate-300">
          <span className="text-emerald-400 font-semibold">{topicSolvedCount}</span>
          <span className="text-slate-600">/</span>
          <span>{topic.totalCount} solved</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400">{percent}%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by name, ID (e.g. 71A), or tags..."
            className="w-full pl-10 pr-4 py-2 bg-[#0e1422] border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Filters */}
          <div className="flex items-center bg-[#0e1422] p-1 rounded-xl border border-slate-800">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
              const active = difficultyFilter === diff;
              return (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? diff === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : diff === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : diff === 'Hard'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-slate-700/60 text-white border border-slate-600/50'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0e1422] border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-cyan-500/60"
          >
            <option value="All">All Status</option>
            <option value="Unsolved">Unsolved Only</option>
            <option value="Solved">Solved Only</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0e1422] border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-cyan-500/60"
          >
            <option value="default">Default Order</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="solved-desc">Most Solved First</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="mt-5 border border-slate-800/80 rounded-2xl overflow-hidden bg-[#0c101a]/70 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-mono uppercase text-slate-400 bg-[#0e1422]/90 tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-24">CF ID</th>
                <th className="py-3 px-4 min-w-[240px]">PROBLEM</th>
                <th className="py-3 px-4 w-28 text-center">RATING</th>
                <th className="py-3 px-4 w-28 text-center">DIFFICULTY</th>
                <th className="py-3 px-4 hidden lg:table-cell">TAGS</th>
                <th className="py-3 px-4 w-16 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No Codeforces problems match your active search or filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const isSolved = !!solvedMap[prob.id];
                  const ratingStyle = getRatingColor(prob.rating);
                  const diffClass = getDifficultyBadge(prob.difficulty);

                  return (
                    <tr
                      key={prob.id}
                      className={`hover:bg-[#121929]/70 transition-colors ${
                        isSolved ? 'bg-emerald-950/10' : ''
                      }`}
                    >
                      {/* Order Index */}
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">
                        {prob.order}
                      </td>

                      {/* CF ID with Link */}
                      <td className="py-3 px-4">
                        <a
                          href={prob.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>#{prob.id}</span>
                        </a>
                      </td>

                      {/* Problem Title */}
                      <td className="py-3 px-4">
                        <a
                          href={prob.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/link inline-flex items-center gap-1.5 font-medium transition-colors ${
                            isSolved
                              ? 'text-slate-400 line-through'
                              : 'text-slate-100 hover:text-cyan-300'
                          }`}
                        >
                          <span>{prob.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-70 text-cyan-400 transition-opacity" />
                        </a>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-mono text-xs px-2.5 py-0.5 rounded-md border ${ratingStyle.bg} ${ratingStyle.text} ${ratingStyle.border}`}
                          title={`Rating ${prob.rating} (${ratingStyle.rank})`}
                        >
                          {prob.rating}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${diffClass}`}>
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {prob.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {prob.tags.length > 3 && (
                            <span className="text-[10px] text-slate-500 px-1 py-0.5">
                              +{prob.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Solved Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleProblem(prob.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            isSolved
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                              : 'border-slate-700 bg-slate-900/80 hover:border-slate-500 text-transparent'
                          }`}
                          aria-label={`Mark ${prob.name} as solved`}
                        >
                          <Check className={`w-4 h-4 stroke-[3] ${isSolved ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
