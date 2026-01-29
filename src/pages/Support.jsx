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
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-indigo-200">
            <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">How can we help?</h1>
          <p className="text-sm sm:text-base text-slate-600">Find answers or reach out to our support team</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white shadow-sm h-auto">
            <TabsTrigger value="faq" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">FAQs</span>
              <span className="sm:hidden">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Live Chat</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="ticket" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Ticket</span>
              <span className="sm:hidden">Ticket</span>
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