import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchCodeforcesProblems() {
  console.log('Fetching problems from Codeforces API...');
  const res = await fetch('https://codeforces.com/api/problemset.problems');
  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error('Codeforces API error: ' + data.comment);
  }

  const problems = data.result.problems;
  const statsList = data.result.problemStatistics;

  const statsMap = new Map();
  for (const s of statsList) {
    statsMap.set(`${s.contestId}-${s.index}`, s.solvedCount);
  }

  // Filter problems that have valid rating and solvedCount
  const validProblems = problems
    .filter(p => p.rating && p.contestId && p.index && p.name)
    .map(p => {
      const key = `${p.contestId}-${p.index}`;
      const solved = statsMap.get(key) || 0;
      let difficulty = 'Easy';
      if (p.rating >= 1600) {
        difficulty = 'Hard';
      } else if (p.rating >= 1200) {
        difficulty = 'Medium';
      } else {
        difficulty = 'Easy';
      }

      return {
        id: `${p.contestId}${p.index}`,
        contestId: p.contestId,
        index: p.index,
        name: p.name,
        rating: p.rating,
        difficulty,
        tags: p.tags || [],
        solvedCount: solved,
        link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`
      };
    });

  console.log(`Loaded ${validProblems.length} valid rated problems.`);

  // 16 Topic definitions matching reference UI
  const topicDefinitions = [
    {
      id: 'arrays',
      title: 'Arrays',
      subtitle: 'Easy → Medium → Hard',
      icon: 'Grid',
      color: '#06b6d4',
      filter: (p) => (p.tags.includes('implementation') || p.tags.includes('data structures')) &&
                     !p.tags.includes('dp') && !p.tags.includes('graphs') && !p.tags.includes('trees')
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      subtitle: '1D, 2D Arrays, Search Space',
      icon: 'Crosshair',
      color: '#a855f7',
      filter: (p) => p.tags.includes('binary search')
    },
    {
      id: 'strings',
      title: 'Strings',
      subtitle: 'Basic and Medium',
      icon: 'Quote',
      color: '#14b8a6',
      filter: (p) => p.tags.includes('strings')
    },
    {
      id: 'two-pointers',
      title: 'Sliding Window & Two Pointer',
      subtitle: 'Combined Problems & Subarrays',
      icon: 'MoveHorizontal',
      color: '#f97316',
      filter: (p) => p.tags.includes('two pointers')
    },
    {
      id: 'recursion',
      title: 'Recursion & Brute Force',
      subtitle: 'PatternWise & Search Space',
      icon: 'RotateCcw',
      color: '#ec4899',
      filter: (p) => (p.tags.includes('brute force') || p.tags.includes('constructive algorithms')) &&
                     p.rating <= 1700 && !p.tags.includes('dp')
    },
    {
      id: 'bit-manipulation',
      title: 'Bit Manipulation',
      subtitle: 'Concepts & Problems',
      icon: 'Binary',
      color: '#eab308',
      filter: (p) => p.tags.includes('bitmasks')
    },
    {
      id: 'stack-queues',
      title: 'Stack & Queues',
      subtitle: 'Learning, Pre/Post-fix, Monotonic',
      icon: 'Layers',
      color: '#0284c7',
      filter: (p) => p.tags.includes('data structures') &&
                     (p.name.toLowerCase().includes('bracket') ||
                      p.name.toLowerCase().includes('parenthes') ||
                      p.name.toLowerCase().includes('stack') ||
                      p.name.toLowerCase().includes('queue') ||
                      p.name.toLowerCase().includes('sequence') ||
                      p.tags.includes('two pointers'))
    },
    {
      id: 'greedy',
      title: 'Greedy Algorithms',
      subtitle: 'Easy, Medium / Hard',
      icon: 'Zap',
      color: '#6366f1',
      filter: (p) => p.tags.includes('greedy') && !p.tags.includes('dp')
    },
    {
      id: 'heaps-priority-queue',
      title: 'Heaps / Priority Queue',
      subtitle: 'Learning, Medium, Hard',
      icon: 'Triangle',
      color: '#ef4444',
      filter: (p) => p.tags.includes('data structures') &&
                     (p.tags.includes('greedy') || p.tags.includes('sortings')) &&
                     p.rating >= 1100
    },
    {
      id: 'math-number-theory',
      title: 'Math & Number Theory',
      subtitle: 'GCD, Primes, Sieve, Modulo',
      icon: 'Percent',
      color: '#10b981',
      filter: (p) => p.tags.includes('math') || p.tags.includes('number theory')
    },
    {
      id: 'binary-trees',
      title: 'Binary Trees & Traversals',
      subtitle: 'Traversals, Medium, Hard',
      icon: 'TreePine',
      color: '#22c55e',
      filter: (p) => p.tags.includes('trees') && (p.tags.includes('dfs and similar') || p.tags.includes('brute force'))
    },
    {
      id: 'bst-sets',
      title: 'Sets, Maps & BST',
      subtitle: 'Concepts and Problems',
      icon: 'Hexagon',
      color: '#7c3aed',
      filter: (p) => p.tags.includes('data structures') && (p.tags.includes('sortings') || p.tags.includes('binary search'))
    },
    {
      id: 'graphs',
      title: 'Graphs',
      subtitle: 'Concepts & Problems, BFS/DFS',
      icon: 'Network',
      color: '#f43f5e',
      filter: (p) => (p.tags.includes('graphs') || p.tags.includes('dfs and similar')) && !p.tags.includes('trees')
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming',
      subtitle: 'Patterns and Classical Problems',
      icon: 'LayoutGrid',
      color: '#f59e0b',
      filter: (p) => p.tags.includes('dp')
    },
    {
      id: 'dsu-trees',
      title: 'Disjoint Set Union (DSU)',
      subtitle: 'Implementation & MST Problems',
      icon: 'GitFork',
      color: '#84cc16',
      filter: (p) => p.tags.includes('dsu')
    },
    {
      id: 'advanced-ds-strings',
      title: 'Advanced DS & Strings',
      subtitle: 'Segment Trees, Tries, Hashing',
      icon: 'Workflow',
      color: '#06b6d4',
      filter: (p) => (p.tags.includes('data structures') || p.tags.includes('strings')) &&
                     (p.tags.includes('trees') || p.tags.includes('divide and conquer') || p.rating >= 1500)
    }
  ];

  const topicsData = [];
  const assignedProblemIds = new Set();

  for (const t of topicDefinitions) {
    // Filter matching problems
    const matching = validProblems.filter(t.filter);

    // Pick top problems sorted by solvedCount descending
    // Split into Easy (800-1100), Medium (1200-1500), Hard (1600-2100)
    const easy = matching
      .filter(p => p.difficulty === 'Easy' && p.solvedCount > 3000)
      .sort((a, b) => b.solvedCount - a.solvedCount);

    const medium = matching
      .filter(p => p.difficulty === 'Medium' && p.solvedCount > 1500)
      .sort((a, b) => b.solvedCount - a.solvedCount);

    const hard = matching
      .filter(p => p.difficulty === 'Hard' && p.rating <= 2100 && p.solvedCount > 800)
      .sort((a, b) => b.solvedCount - a.solvedCount);

    // Pick ~8 easy, ~8 medium, ~6 hard = ~22 problems per topic
    const selected = [
      ...easy.slice(0, 9),
      ...medium.slice(0, 8),
      ...hard.slice(0, 5)
    ];

    // If less than 20, fill with top matching sorted by solvedCount
    if (selected.length < 20) {
      const remaining = matching
        .filter(p => !selected.some(s => s.id === p.id) && p.rating <= 2100)
        .sort((a, b) => b.solvedCount - a.solvedCount);
      selected.push(...remaining.slice(0, 20 - selected.length));
    }

    selected.forEach(p => assignedProblemIds.add(p.id));

    topicsData.push({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      icon: t.icon,
      color: t.color,
      totalCount: selected.length,
      problems: selected.map((p, idx) => ({
        ...p,
        topicId: t.id,
        order: idx + 1
      }))
    });
  }

  const totalProblemsCount = topicsData.reduce((acc, t) => acc + t.totalCount, 0);
  console.log(`Generated ${topicsData.length} topics with ${totalProblemsCount} total problems!`);

  fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, '../src/data/topics.json'),
    JSON.stringify(topicsData, null, 2)
  );

  console.log('Saved to src/data/topics.json successfully!');
}

fetchCodeforcesProblems().catch(err => {
  console.error(err);
  process.exit(1);
});
