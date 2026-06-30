'use client';

import * as React from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setName('');
    setEmail('');
    setMessage('');
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="container max-w-4xl py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question, feature request, or feedback? We would love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <Mail className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">hello@pixelresize.app</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <MessageSquare className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">Response time</h3>
            <p className="mt-1 text-sm text-muted-foreground">We reply within 24 hours on weekdays.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card space-y-4 rounded-2xl p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what is on your mind..."
                rows={5}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
