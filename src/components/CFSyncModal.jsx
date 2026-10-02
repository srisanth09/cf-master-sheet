import React, { useState } from 'react';
import { X, UserCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function CFSyncModal({
  isOpen,
  onClose,
  allProblems,
  onApplySolvedProblems,
  currentHandle,
  onSaveHandle
}) {
  const [handle, setHandle] = useState(currentHandle || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncResult, setSyncResult] = useState(null);

  if (!isOpen) return null;

  async function handleSync(e) {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setError(null);
    setSyncResult(null);

    try {
      const trimmed = handle.trim();
      const res = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(trimmed)}&from=1&count=10000`);
      const data = await res.json();

      if (data.status !== 'OK') {
        throw new Error(data.comment || 'Failed to fetch user submissions from Codeforces.');
      }

      // Collect unique solved problem IDs (contestId + index)
      const solvedCfKeys = new Set();
      for (const sub of data.result) {
        if (sub.verdict === 'OK' && sub.problem && sub.problem.contestId && sub.problem.index) {
          solvedCfKeys.add(`${sub.problem.contestId}${sub.problem.index}`);
        }
      }

      // Match against sheet problems
      const matchedSolvedIds = [];
      for (const prob of allProblems) {
        if (solvedCfKeys.has(prob.id)) {
          matchedSolvedIds.push(prob.id);
        }
      }

      onApplySolvedProblems(matchedSolvedIds);
      onSaveHandle(trimmed);

      setSyncResult({
        totalUserSolved: solvedCfKeys.size,
        sheetMatched: matchedSolvedIds.length
      });
    } catch (err) {
      setError(err.message || 'An error occurred while syncing with Codeforces.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Sync Codeforces Handle
            </h3>
            <p className="text-xs text-slate-400">
              Auto-check problems you've already solved on Codeforces!
            </p>
          </div>
        </div>

        <form onSubmit={handleSync} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Codeforces Username / Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. tourist, srisanth"
              className="w-full px-4 py-2.5 bg-[#090d16] border border-slate-700 focus:border-cyan-500 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {syncResult && (
            <div className="flex items-start gap-2 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-200">Sync Successful!</p>
                <p className="mt-0.5 text-slate-300">
                  Found <span className="font-mono font-bold text-emerald-400">{syncResult.sheetMatched}</span> solved problems matching this DSA sheet out of {allProblems.length} total.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading || !handle.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Fetching Submissions...' : 'Fetch & Sync'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
