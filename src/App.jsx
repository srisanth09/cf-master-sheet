import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import TopicView from './components/TopicView';
import CFSyncModal from './components/CFSyncModal';
import StatsModal from './components/StatsModal';
import topicsData from './data/topics.json';
import { Search, ExternalLink, Sparkles, CheckCircle2, Trophy, Flame } from 'lucide-react';

export default function App() {
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [searchGrid, setSearchGrid] = useState('');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [randomProblemToast, setRandomProblemToast] = useState(null);

  // Solved state persisted in localStorage
  const [solvedMap, setSolvedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_sheet_solved');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Codeforces handle persisted in localStorage
  const [cfHandle, setCfHandle] = useState(() => {
    return localStorage.getItem('cf_handle') || '';
  });

  useEffect(() => {
    try {
      localStorage.setItem('cf_sheet_solved', JSON.stringify(solvedMap));
    } catch (e) {
      console.error(e);
    }
  }, [solvedMap]);

  const allProblems = useMemo(() => {
    const list = [];
    topicsData.forEach(t => {
      t.problems.forEach(p => list.push(p));
    });
    return list;
  }, []);

  const totalProblemsCount = allProblems.length;
  const totalSolvedCount = useMemo(() => {
    return Object.keys(solvedMap).filter(k => solvedMap[k]).length;
  }, [solvedMap]);

  function toggleProblem(id) {
    setSolvedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function handleApplySolved(ids) {
    setSolvedMap(prev => {
      const next = { ...prev };
      ids.forEach(id => {
        next[id] = true;
      });
      return next;
    });
  }

  function handleSaveHandle(h) {
    setCfHandle(h);
    localStorage.setItem('cf_handle', h);
  }

  function handleResetProgress() {
    if (window.confirm('Are you sure you want to reset all solved marks on this sheet?')) {
      setSolvedMap({});
      localStorage.removeItem('cf_sheet_solved');
    }
  }

  function handlePickRandom() {
    const unsolved = allProblems.filter(p => !solvedMap[p.id]);
    const pool = unsolved.length > 0 ? unsolved : allProblems;
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    setRandomProblemToast(randomPick);
  }

  const activeTopic = useMemo(() => {
    return topicsData.find(t => t.id === activeTopicId);
  }, [activeTopicId]);

  // Filtered topics for grid search
  const filteredTopics = useMemo(() => {
    if (!searchGrid.trim()) return topicsData;
    const q = searchGrid.toLowerCase().trim();
    return topicsData.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.problems.some(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
    );
  }, [searchGrid]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <Header
        solvedCount={totalSolvedCount}
        totalCount={totalProblemsCount}
        onOpenSync={() => setIsSyncModalOpen(true)}
        cfHandle={cfHandle}
        onPickRandom={handlePickRandom}
        onResetProgress={handleResetProgress}
        onOpenStats={() => setIsStatsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTopic ? (
          <TopicView
            topic={activeTopic}
            solvedMap={solvedMap}
            onToggleProblem={toggleProblem}
            onBack={() => setActiveTopicId(null)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            {/* Hero Quick Banner / Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-white font-heading tracking-tight flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>Topicwise Codeforces Roadmap</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select any topic below to view problems, track solutions, and conquer Competitive Programming!
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchGrid}
                  onChange={(e) => setSearchGrid(e.target.value)}
                  placeholder="Filter topics or questions..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0e1422] border border-slate-800 focus:border-cyan-500/80 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            {/* 16 Topic Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTopics.map((topic) => {
                const topicSolved = topic.problems.filter(p => solvedMap[p.id]).length;
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    solvedCount={topicSolved}
                    onClick={() => setActiveTopicId(topic.id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#06080e] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Curated Codeforces Edition · Inspired by Striver's DSA Sheet · All problems directly linked to{' '}
            <a
              href="https://codeforces.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Codeforces
            </a>
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>16 Topics</span>
            <span>•</span>
            <span>{totalProblemsCount} Problems</span>
            <span>•</span>
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              View Analytics
            </button>
          </div>
        </div>
      </footer>

      {/* Codeforces Handle Sync Modal */}
      <CFSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        allProblems={allProblems}
        onApplySolvedProblems={handleApplySolved}
        currentHandle={cfHandle}
        onSaveHandle={handleSaveHandle}
      />

      {/* Stats & Analytics Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        topics={topicsData}
        solvedMap={solvedMap}
        onImportProgress={(imported) => setSolvedMap(imported)}
      />

      {/* Random Pick Modal / Toast */}
      {randomProblemToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#0e1422] border border-cyan-500/50 rounded-2xl p-4 shadow-2xl shadow-cyan-950/50 animate-bounce-subtle">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Random Challenge Picked!
              </span>
              <h4 className="text-sm font-bold text-white mt-1">
                {randomProblemToast.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                #{randomProblemToast.id} · Rating {randomProblemToast.rating} ({randomProblemToast.difficulty})
              </p>
            </div>
            <button
              onClick={() => setRandomProblemToast(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <a
              href={randomProblemToast.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Solve on Codeforces</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                setActiveTopicId(randomProblemToast.topicId);
                setRandomProblemToast(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              View in Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
