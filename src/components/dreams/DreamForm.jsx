import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Sparkles, Loader2 } from 'lucide-react';
import MoodSelector from '../ui/MoodSelector';
import StarRating from '../ui/StarRating';
import { base44 } from '@/api/base44Client';

const dreamTypes = [
  { value: 'normal', label: 'Normal Dream' },
  { value: 'lucid', label: 'Lucid Dream' },
  { value: 'nightmare', label: 'Nightmare' },
  { value: 'recurring', label: 'Recurring Dream' },
  { value: 'vivid', label: 'Vivid Dream' },
  { value: 'prophetic', label: 'Prophetic Dream' },
  { value: 'other', label: 'Other' },
];

export default function DreamForm({ onClose, onSave, editDream }) {
  const [formData, setFormData] = useState(editDream || {
    title: '',
    content: '',
    mood_before: 'neutral',
    mood_after: 'neutral',
    dream_type: 'normal',
    clarity_rating: 3,
    sleep_quality: 3,
    dream_date: new Date().toISOString().split('T')[0],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [interpreting, setInterpreting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [personalContext, setPersonalContext] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    handleChange('tags', formData.tags.filter(t => t !== tag));
  };

  const getInterpretation = async () => {
    if (!formData.content.trim()) return;
    setInterpreting(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert dream analyst with deep knowledge of Jungian psychology, symbolism, and dream interpretation. Analyze this dream comprehensively and provide meaningful insights.

**DREAM DETAILS:**
Title: ${formData.title}
Content: ${formData.content}
Mood Before Sleep: ${formData.mood_before}
Mood Upon Waking: ${formData.mood_after}
Dream Type: ${formData.dream_type}
Tags: ${formData.tags.join(', ') || 'none'}
${personalContext.trim() ? `\n**PERSONAL CONTEXT PROVIDED BY THE DREAMER:**\n${personalContext}\n\nIMPORTANT: Use this personal context heavily to tailor your interpretation. Reference specific life events, personal symbol meanings, or circumstances the dreamer has shared. Make the insights feel deeply personal and directly relevant to their current situation rather than generic.` : ''}

**ANALYSIS STRUCTURE:**
Provide a detailed interpretation with the following sections:

🔮 **Key Symbols & Their Meanings:**
Identify the most significant symbols in the dream and explain their potential psychological and archetypal meanings.${personalContext.trim() ? ' Where the dreamer has provided personal meanings for symbols, prioritise those over generic interpretations.' : ' Consider cultural, personal, and universal symbolism.'}

💭 **Emotional Themes:**
Analyze the emotional landscape of the dream. What do the mood shifts (from ${formData.mood_before} to ${formData.mood_after}) suggest? What underlying feelings or anxieties might be surfacing?${personalContext.trim() ? ' Connect these to the personal context shared.' : ''}

🧠 **Psychological Insights:**
Explore what the dream might reveal about the dreamer's subconscious mind${personalContext.trim() ? ', directly referencing their current life circumstances they have described' : ', current life circumstances, unresolved conflicts, or personal growth opportunities'}.

✨ **Actionable Reflections:**
Offer 2-3 thoughtful questions or reflections the dreamer can contemplate.${personalContext.trim() ? ' Ground these in the specific context they have shared to make them immediately actionable.' : ' These should help them connect the dream to their waking life.'}

Keep the tone warm, supportive, and insightful. Aim for 3-4 paragraphs total.`,
      });
      
      handleChange('interpretation', result);
    } catch (error) {
      handleChange('interpretation', 'Unable to generate interpretation. Please try again.');
    }
    
    setInterpreting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <Card className="border-0 shadow-2xl max-w-2xl mx-auto max-h-[90vh] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">
            {editDream ? 'Edit Dream' : 'Log New Dream'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 overflow-y-auto flex-1">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Dream Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Give your dream a title..."
                className="border-slate-200 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Dream Date</label>
              <Input
                type="date"
                value={formData.dream_date}
                onChange={(e) => handleChange('dream_date', e.target.value)}
                className="border-slate-200 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Dream Description</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Describe your dream in detail..."
              className="min-h-[120px] sm:min-h-[150px] border-slate-200 text-sm sm:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <MoodSelector 
              value={formData.mood_before} 
              onChange={(v) => handleChange('mood_before', v)} 
              label="Mood Before Sleep"
            />
            <MoodSelector 
              value={formData.mood_after} 
              onChange={(v) => handleChange('mood_after', v)} 
              label="Mood Upon Waking"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-3">
              <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Dream Type</label>
              <Select value={formData.dream_type} onValueChange={(v) => { handleChange('dream_type', v); if (v !== 'other') handleChange('dream_type_custom', ''); }}>
                <SelectTrigger className="border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dreamTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.dream_type === 'other' && (
                <Input
                  value={formData.dream_type_custom || ''}
                  onChange={(e) => handleChange('dream_type_custom', e.target.value)}
                  placeholder="Describe your dream type..."
                  className="border-slate-200 text-sm mt-2"
                />
              )}
            </div>
            <div className="sm:col-span-3 grid grid-cols-2 gap-4">
              <StarRating 
                value={formData.clarity_rating} 
                onChange={(v) => handleChange('clarity_rating', v)} 
                label="Dream Clarity"
              />
              <StarRating 
                value={formData.sleep_quality} 
                onChange={(v) => handleChange('sleep_quality', v)} 
                label="Sleep Quality"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags (e.g., flying, water, family)"
                className="border-slate-200"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI Dream Interpretation
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Optionally share personal context to get a more tailored interpretation — recent life events, stress, or what specific symbols mean to you.
              </p>
              <Textarea
                value={personalContext}
                onChange={(e) => setPersonalContext(e.target.value)}
                placeholder="e.g. I've been stressed about a job change lately. Water usually represents anxiety for me. My grandmother passed away last month..."
                className="min-h-[80px] border-slate-200 text-sm bg-indigo-50/30 placeholder:text-slate-400 resize-none"
              />
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={getInterpretation}
              disabled={interpreting || !formData.content.trim()}
              className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-semibold"
            >
              {interpreting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing your dream...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> {formData.interpretation ? 'Re-interpret Dream' : 'Interpret Dream'}</>
              )}
            </Button>
            {formData.interpretation && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                {formData.interpretation}
              </div>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 text-sm sm:text-base">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm sm:text-base"
            >
              {saving ? 'Saving...' : (editDream ? 'Update Dream' : 'Save Dream')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}