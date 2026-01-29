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
    
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a dream interpretation expert. Analyze this dream and provide a meaningful, insightful interpretation. Be supportive and thoughtful.

Dream Title: ${formData.title}
Dream Content: ${formData.content}
Mood before sleep: ${formData.mood_before}
Mood upon waking: ${formData.mood_after}
Dream type: ${formData.dream_type}

Provide a 2-3 paragraph interpretation focusing on:
1. Key symbols and their potential meanings
2. Emotional themes and what they might represent
3. Actionable insights or reflections`,
    });
    
    handleChange('interpretation', result);
    setInterpreting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <Card className="border-0 shadow-2xl max-w-2xl mx-auto">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {editDream ? 'Edit Dream' : 'Log New Dream'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Dream Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Give your dream a title..."
                className="border-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Dream Date</label>
              <Input
                type="date"
                value={formData.dream_date}
                onChange={(e) => handleChange('dream_date', e.target.value)}
                className="border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Dream Description</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Describe your dream in detail... Include colors, people, places, emotions, and any symbols you remember."
              className="min-h-[150px] border-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Dream Type</label>
              <Select value={formData.dream_type} onValueChange={(v) => handleChange('dream_type', v)}>
                <SelectTrigger className="border-slate-200">
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
            </div>
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

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">AI Interpretation</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={getInterpretation}
                disabled={interpreting || !formData.content.trim()}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                {interpreting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Interpreting...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Get Interpretation</>
                )}
              </Button>
            </div>
            {formData.interpretation && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-slate-700 text-sm whitespace-pre-wrap">
                {formData.interpretation}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {saving ? 'Saving...' : (editDream ? 'Update Dream' : 'Save Dream')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}