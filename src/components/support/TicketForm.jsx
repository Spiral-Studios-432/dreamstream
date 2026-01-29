import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const categories = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'account', label: 'Account & Profile' },
  { value: 'billing', label: 'Billing & Credits' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

export default function TicketForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'technical',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    await base44.entities.SupportTicket.create({
      ...formData,
      status: 'open',
      priority: 'medium',
    });
    
    setSubmitting(false);
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Ticket Submitted!</h3>
          <p className="text-slate-600 mb-4">
            We've received your support request and will respond within 24 hours.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSubmitted(false);
              setFormData({ subject: '', message: '', category: 'technical' });
            }}
          >
            Submit Another Ticket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-600" />
          Submit a Support Ticket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
            <Select 
              value={formData.category} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subject</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief description of your issue"
              className="border-slate-200"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Please describe your issue in detail..."
              className="min-h-[150px] border-slate-200"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}