import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <Card className={cn(
      "relative overflow-hidden p-6 border-0 shadow-lg",
      gradient || "bg-gradient-to-br from-white to-slate-50"
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10">
        {Icon && <Icon className="w-full h-full" />}
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-white/80 shadow-sm">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
          )}
          <p className="text-sm font-medium text-slate-600">{title}</p>
        </div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
}