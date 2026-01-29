import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I log a dream?",
    answer: "Navigate to the Dreams page using the sidebar menu. Click the 'Log Dream' button, fill in your dream details including the description, mood before and after sleep, and optionally get an AI interpretation. Click Save to store your dream."
  },
  {
    question: "What are credits and how do I earn them?",
    answer: "Credits are DreamStream's in-app currency. You can earn credits by: logging dreams (+10 credits), completing daily reflections (+5 credits), maintaining a streak (+bonus credits), and referring friends. Credits can be used for premium features like advanced AI interpretations."
  },
  {
    question: "How does the AI interpretation work?",
    answer: "Our AI uses advanced language models to analyze your dream content, considering symbols, emotions, and patterns. It provides insights based on common dream interpretation frameworks while personalizing the analysis to your specific dream details."
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes, your data is completely private. Your dreams and reflections are only visible to you. We use encryption to protect your data, and we never share or sell your personal information to third parties."
  },
  {
    question: "How do streaks work?",
    answer: "Streaks track your consecutive days of engagement. Log at least one dream or complete a reflection each day to maintain your streak. Longer streaks earn bonus credits! Missing a day resets your streak to zero."
  },
  {
    question: "Can I edit or delete my dreams?",
    answer: "Yes! Click on any dream to expand it, then use the Edit button to modify details or the Delete button to remove it. Deleted dreams cannot be recovered."
  },
  {
    question: "What are the different tier levels?",
    answer: "DreamStream has three tiers: Free (basic features, 5 AI interpretations/month), Dreamer (unlimited interpretations, advanced analytics), and Visionary (all features plus priority support and exclusive content)."
  },
  {
    question: "How do I contact support?",
    answer: "You can submit a support ticket from this page. Describe your issue, select a category, and our team will respond within 24 hours. You can also use the live chat feature during business hours."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Frequently Asked Questions</h2>
      </div>
      
      {faqs.map((faq, index) => (
        <Card 
          key={index}
          className={cn(
            "border-0 shadow-sm cursor-pointer transition-all duration-200",
            openIndex === index ? "shadow-md ring-1 ring-indigo-100" : "hover:shadow-md"
          )}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-slate-800 pr-4">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </div>
            {openIndex === index && (
              <p className="mt-3 text-slate-600 text-sm leading-relaxed border-t pt-3">
                {faq.answer}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}