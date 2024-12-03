import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
}

export const StatsCard = ({ icon, value, label }: StatsCardProps) => {
  return (
    <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 hover:scale-105">
      <div className="text-cyan">{icon}</div>
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
};