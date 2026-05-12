import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Twitter, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareDreamButton({ dream }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/SharedDream?id=${dream.id}`;

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(`✨ "${dream.title}" — a dream I recorded on DreamStream`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setOpen(false);
  };

  const shareFacebook = (e) => {
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setOpen(false);
  };

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium"
      >
        <Share2 className="w-4 h-4 mr-1.5" /> Share
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Share dream</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{dream.title}</p>
              </div>

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                {copied ? 'Link copied!' : 'Copy link'}
              </button>

              <button
                onClick={shareTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-sky-50 transition-colors border-t border-slate-100"
              >
                <Twitter className="w-4 h-4 text-sky-500" />
                Share on X / Twitter
              </button>

              <button
                onClick={shareFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors border-t border-slate-100"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Share on Facebook
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}