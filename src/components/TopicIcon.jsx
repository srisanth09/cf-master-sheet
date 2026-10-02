import React from 'react';
import {
  Grid,
  Crosshair,
  Quote,
  MoveHorizontal,
  RotateCcw,
  Binary,
  Layers,
  Zap,
  Triangle,
  Percent,
  TreePine,
  Hexagon,
  Network,
  LayoutGrid,
  GitFork,
  Workflow
} from 'lucide-react';

const iconMap = {
  Grid,
  Crosshair,
  Quote,
  MoveHorizontal,
  RotateCcw,
  Binary,
  Layers,
  Zap,
  Triangle,
  Percent,
  TreePine,
  Hexagon,
  Network,
  LayoutGrid,
  GitFork,
  Workflow
};

export default function TopicIcon({ name, color, className = "w-5 h-5" }) {
  const IconComponent = iconMap[name] || Grid;
  return (
    <div
      className="flex items-center justify-center rounded-lg p-2 transition-transform duration-200 group-hover:scale-110"
      style={{
        backgroundColor: `${color}18`,
        color: color
      }}
    >
      <IconComponent className={className} strokeWidth={2.2} />
    </div>
  );
}
