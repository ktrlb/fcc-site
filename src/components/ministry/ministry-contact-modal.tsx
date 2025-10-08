"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface Leader {
  id: string;
  memberId: string;
  role: string | null;
  isPrimary: boolean;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    preferredName: string | null;
  } | null;
}

interface MinistryContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministryName: string;
  leaders?: Leader[];
  ministryId: string;
}

export function MinistryContactModal({
  isOpen,
  onClose,
  ministryName,
  leaders,
  ministryId,
}: MinistryContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Format contact display name from leaders
  const getContactDisplayName = () => {
    if (leaders && leaders.length > 0) {
      const leaderNames = leaders
        .filter(l => l.member)
        .map(l => {
          const firstName = l.member!.preferredName || l.member!.firstName;
          const lastName = l.member!.lastName;
          return `${firstName} ${lastName}`;
        });
      
      if (leaderNames.length === 1) {
        return leaderNames[0];
      } else if (leaderNames.length === 2) {
        return `${leaderNames[0]} & ${leaderNames[1]}`;
      } else if (leaderNames.length > 2) {
        return `${leaderNames.slice(0, -1).join(', ')} & ${leaderNames[leaderNames.length - 1]}`;
      }
    }
    return 'FCC';
  };

  const contactDisplayName = getContactDisplayName();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/ministry/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ministryId,
          ministryName,
          contactPerson: contactDisplayName,
          leaders: leaders?.map(l => l.memberId) || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-900" />
            Contact {contactDisplayName}
          </DialogTitle>
          <DialogDescription>
            Send a message about <strong>{ministryName}</strong>. Your message will be sent to {contactDisplayName === 'FCC' ? 'the church office' : `${contactDisplayName} and the church office`}.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600">
              {contactDisplayName === 'FCC' ? 'Someone from the church' : contactDisplayName} will get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="email">Your Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="phone">Your Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="message">Your Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="I'm interested in learning more about this ministry..."
                rows={5}
                required
                disabled={isSubmitting}
              />
            </div>

            {submitStatus === 'error' && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-900 hover:bg-indigo-900/90 text-white"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

