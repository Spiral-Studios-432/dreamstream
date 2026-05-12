import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

export default function ExportMenu({ dreams }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const exportCSV = () => {
    setLoading('csv');
    const headers = ['Date', 'Title', 'Type', 'Mood Before', 'Mood After', 'Clarity', 'Sleep Quality', 'Tags', 'Content', 'Interpretation'];
    const rows = dreams.map(d => [
      d.dream_date || '',
      `"${(d.title || '').replace(/"/g, '""')}"`,
      d.dream_type || '',
      d.mood_before || '',
      d.mood_after || '',
      d.clarity_rating || '',
      d.sleep_quality || '',
      `"${(d.tags || []).join(', ')}"`,
      `"${(d.content || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(d.interpretation || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dreamstream-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(null);
    setOpen(false);
  };

  const exportPDF = () => {
    setLoading('pdf');
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text('DreamStream Journal', pageW / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on ${new Date().toLocaleDateString()} · ${dreams.length} dreams`, pageW / 2, y, { align: 'center' });
    y += 12;

    // Divider
    doc.setDrawColor(200, 200, 220);
    doc.line(14, y, pageW - 14, y);
    y += 10;

    dreams.forEach((dream, i) => {
      if (y > 260) { doc.addPage(); y = 20; }

      // Dream title
      doc.setFontSize(13);
      doc.setTextColor(30, 30, 60);
      doc.text(`${i + 1}. ${dream.title || 'Untitled'}`, 14, y);
      y += 6;

      // Meta
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 150);
      const meta = [
        dream.dream_date,
        dream.dream_type,
        dream.mood_before ? `Mood before: ${dream.mood_before}` : null,
        dream.mood_after ? `Mood after: ${dream.mood_after}` : null,
        dream.clarity_rating ? `Clarity: ${dream.clarity_rating}/5` : null,
      ].filter(Boolean).join('  ·  ');
      doc.text(meta, 14, y);
      y += 6;

      // Content
      if (dream.content) {
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 80);
        const lines = doc.splitTextToSize(dream.content, pageW - 28);
        lines.slice(0, 8).forEach(line => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 14, y);
          y += 5;
        });
        if (lines.length > 8) { doc.text('...', 14, y); y += 5; }
      }

      // Interpretation
      if (dream.interpretation) {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setTextColor(130, 80, 200);
        doc.text('AI Interpretation:', 14, y);
        y += 5;
        doc.setTextColor(100, 60, 160);
        const iLines = doc.splitTextToSize(dream.interpretation, pageW - 28);
        iLines.slice(0, 5).forEach(line => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 14, y);
          y += 5;
        });
      }

      // Tags
      if (dream.tags?.length) {
        if (y > 265) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 180);
        doc.text(`Tags: ${dream.tags.join(', ')}`, 14, y);
        y += 5;
      }

      y += 6;
      if (y < 270 && i < dreams.length - 1) {
        doc.setDrawColor(220, 220, 235);
        doc.line(14, y, pageW - 14, y);
        y += 8;
      }
    });

    doc.save(`dreamstream-journal-${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(o => !o)}
        disabled={dreams.length === 0}
        className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm rounded-xl"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <button
                onClick={exportCSV}
                disabled={loading === 'csv'}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 transition-colors"
              >
                <Table className="w-4 h-4 text-indigo-500" />
                {loading === 'csv' ? 'Exporting…' : 'Download CSV'}
              </button>
              <button
                onClick={exportPDF}
                disabled={loading === 'pdf'}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-purple-50 transition-colors border-t border-slate-100"
              >
                <FileText className="w-4 h-4 text-purple-500" />
                {loading === 'pdf' ? 'Generating…' : 'Download PDF'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}