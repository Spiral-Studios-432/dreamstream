import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <Card className={cn(
      "relative overflow-hidden p-4 sm:p-5 lg:p-6 border-0 shadow-lg",
      gradient || "bg-gradient-to-br from-white to-slate-50"
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 -mr-6 sm:-mr-8 -mt-6 sm:-mt-8 opacity-10">
        {Icon && <Icon className="w-full h-full" />}
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          {Icon && (
            <div className="p-1.5 sm:p-2.5 rounded-xl bg-white/80 shadow-sm">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            </div>
          )}
          <p className="text-xs sm:text-sm font-medium text-slate-600">{title}</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
}