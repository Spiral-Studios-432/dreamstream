import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageCircle, Send } from 'lucide-react';
import FAQSection from '../components/support/FAQSection';
import TicketForm from '../components/support/TicketForm';
import LiveChat from '../components/support/LiveChat';

export default function Support() {
  const [activeTab, setActiveTab] = useState('faq');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">How can we help?</h1>
          <p className="text-slate-600">Find answers or reach out to our support team</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Live Chat</span>
            </TabsTrigger>
            <TabsTrigger value="ticket" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Ticket</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <FAQSection />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <LiveChat />
          </TabsContent>

          <TabsContent value="ticket" className="mt-6">
            <div className="max-w-xl mx-auto">
              <TicketForm />
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Need immediate assistance? Our support team is available Monday - Friday, 9am - 6pm EST.
          </p>
          <p className="text-indigo-600 font-medium mt-2">support@dreamstream.app</p>
        </div>
      </div>
    </div>
  );
}