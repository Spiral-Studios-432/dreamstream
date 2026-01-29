import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const initialMessages = [
  {
    role: 'assistant',
    content: "Hi! I'm DreamBot, your AI support assistant. How can I help you today? I can answer questions about dream logging, credits, features, and more!"
  }
];

export default function LiveChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are DreamBot, a helpful and friendly AI support assistant for DreamStream - a dream journal and interpretation app. 

Key features of DreamStream:
- Dream logging with mood tracking before and after sleep
- AI-powered dream interpretations
- Daily reflection prompts that earn credits
- Credits system (earn by logging dreams +10, reflections +5, streaks give bonus)
- Three tiers: Free, Dreamer, Visionary
- Privacy-focused - all data is encrypted and private
- Streak system for consecutive daily engagement

User question: ${userMessage}

Provide a helpful, concise, and friendly response. If you don't know something specific, suggest they submit a support ticket for personalized help.`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <Card className="border-0 shadow-lg flex flex-col h-[500px]">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Live Chat Support
          <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">AI Powered</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t bg-slate-50">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border-slate-200 bg-white"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}