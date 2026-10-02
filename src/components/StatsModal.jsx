import React from 'react';
import { X, BarChart3, Award, Download, Upload, CheckCircle2 } from 'lucide-react';

export default function StatsModal({
  isOpen,
  onClose,
  topics,
  solvedMap,
  onImportProgress
}) {
  if (!isOpen) return null;

  const totalProblems = topics.reduce((acc, t) => acc + t.totalCount, 0);
  const totalSolved = Object.keys(solvedMap).filter(k => solvedMap[k]).length;

  let easyTotal = 0, easySolved = 0;
  let medTotal = 0, medSolved = 0;
  let hardTotal = 0, hardSolved = 0;

  topics.forEach(t => {
    t.problems.forEach(p => {
      if (p.difficulty === 'Easy') {
        easyTotal++;
        if (solvedMap[p.id]) easySolved++;
      } else if (p.difficulty === 'Medium') {
        medTotal++;
        if (solvedMap[p.id]) medSolved++;
      } else if (p.difficulty === 'Hard') {
        hardTotal++;
        if (solvedMap[p.id]) hardSolved++;
      }
    });
  });

  function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(solvedMap, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "cf_master_sheet_progress.json");
    dlAnchorElem.click();
  }

  function handleImport(e) {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (typeof parsed === 'object') {
            onImportProgress(parsed);
            alert('Progress imported successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-800/60 text-purple-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Progress & Analytics
            </h3>
            <p className="text-xs text-slate-400">
              Detailed breakdown across difficulties and topics
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 mb-4">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 font-mono">Overall Completion</span>
            <span className="text-emerald-400 font-mono font-bold">
              {totalSolved} / {totalProblems} ({totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Breakdown by Difficulty */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* Easy */}
          <div className="bg-[#090d16] p-3 rounded-xl border border-emerald-900/40 text-center">
            <span className="text-[11px] font-semibold uppercase text-emerald-400">Easy</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {easySolved} <span className="text-xs text-slate-500">/ {easyTotal}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%
            </div>
          </div>

          {/* Medium */}
          <div className="bg-[#090d16] p-3 rounded-xl border border-amber-900/40 text-center">
            <span className="text-[11px] font-semibold uppercase text-amber-400">Medium</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {medSolved} <span className="text-xs text-slate-500">/ {medTotal}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0}%
            </div>
          </div>

          {/* Hard */}
          <div className="bg-[#090d16] p-3 rounded-xl border border-rose-900/40 text-center">
            <span className="text-[11px] font-semibold uppercase text-rose-400">Hard</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {hardSolved} <span className="text-xs text-slate-500">/ {hardTotal}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Backup / Export / Import */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Backup or restore:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={exportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
