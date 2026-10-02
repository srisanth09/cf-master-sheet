export function getRatingColor(rating) {
  if (!rating) return { text: 'text-slate-400', bg: 'bg-slate-800/60', border: 'border-slate-700' };
  if (rating < 1200) {
    return { text: 'text-slate-300', bg: 'bg-slate-800/70', border: 'border-slate-700', rank: 'Newbie' };
  }
  if (rating < 1400) {
    return { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-600/40', rank: 'Pupil' };
  }
  if (rating < 1600) {
    return { text: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/40', rank: 'Specialist' };
  }
  if (rating < 1900) {
    return { text: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-500/40', rank: 'Expert' };
  }
  if (rating < 2200) {
    return { text: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-500/40', rank: 'Candidate Master' };
  }
  return { text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-500/40', rank: 'Master' };
}

export function getDifficultyBadge(difficulty) {
  switch (difficulty) {
    case 'Easy':
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    case 'Medium':
      return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    case 'Hard':
      return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    default:
      return 'text-slate-400 border-slate-600 bg-slate-800/40';
  }
}
