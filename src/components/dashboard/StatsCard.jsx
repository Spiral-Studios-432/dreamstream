import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={cn(
        "relative overflow-hidden p-5 sm:p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300",
        gradient || "bg-gradient-to-br from-white via-slate-50/50 to-white"
      )}>
        <div className="absolute top-0 right-0 w-28 h-28 sm:w-36 sm:h-36 -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 opacity-[0.07]">
          {Icon && <Icon className="w-full h-full" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {Icon && (
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="p-2.5 sm:p-3 rounded-2xl bg-white shadow-md"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </motion.div>
            )}
            <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider">{title}</p>
          </div>
          <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">{value}</p>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">{subtitle}</p>}
        </div>
      </Card>
    </motion.div>
  );
}