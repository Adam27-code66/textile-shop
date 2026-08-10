'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
            Get in Touch
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white">
            CONTACT US
          </h1>
          <p className="mt-4 text-[#A6A6B0] max-w-xl mx-auto">
            Have a question, collaboration idea, or just want to say hey? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="p-8 border border-[#8B3DFF]/30 bg-[#8B3DFF]/[0.05] text-center">
                <Send size={32} className="mx-auto text-[#8B3DFF] mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Message Sent</h2>
                <p className="text-[#A6A6B0]">
                  Thanks — we&apos;ll get back to you.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs text-[#B84DFF] hover:text-[#E23DFF] uppercase tracking-wider transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold tracking-wider uppercase text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF]/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold tracking-wider uppercase text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF]/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold tracking-wider uppercase text-white mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white focus:outline-none focus:border-[#8B3DFF]/50 transition-colors"
                  >
                    <option value="" className="bg-[#13141B]">Select a subject</option>
                    <option value="general" className="bg-[#13141B]">General Inquiry</option>
                    <option value="order" className="bg-[#13141B]">Order Support</option>
                    <option value="returns" className="bg-[#13141B]">Returns &amp; Exchanges</option>
                    <option value="collab" className="bg-[#13141B]">Collaboration</option>
                    <option value="other" className="bg-[#13141B]">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold tracking-wider uppercase text-white mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-white/[0.04] border border-white/[0.08] py-3 px-4 text-sm text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF]/50 transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,61,255,0.3)]"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-white mb-4">
                  Contact Info
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:hello@area51archives.com"
                    className="flex items-start gap-3 text-sm text-[#A6A6B0] hover:text-white transition-colors group"
                  >
                    <Mail size={16} className="text-[#8B3DFF] mt-0.5 shrink-0" />
                    <span>hello@area51archives.com</span>
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="flex items-start gap-3 text-sm text-[#A6A6B0] hover:text-white transition-colors"
                  >
                    <Phone size={16} className="text-[#8B3DFF] mt-0.5 shrink-0" />
                    <span>+91 98765 43210</span>
                  </a>
                  <div className="flex items-start gap-3 text-sm text-[#A6A6B0]">
                    <MapPin size={16} className="text-[#8B3DFF] mt-0.5 shrink-0" />
                    <span>
                      Chennai, Tamil Nadu
                      <br />
                      India
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-8">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-sm text-[#A6A6B0] hover:text-white hover:border-[#B84DFF]/30 transition-all duration-300"
                  >
                    <InstagramIcon size={16} />
                    Instagram
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-sm text-[#A6A6B0] hover:text-white hover:border-[#B84DFF]/30 transition-all duration-300"
                  >
                    <XIcon size={16} />
                    Twitter
                  </a>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-8">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-white mb-4">
                  Hours
                </h3>
                <div className="space-y-1 text-sm text-[#A6A6B0]">
                  <p>Monday – Saturday: 10am – 8pm IST</p>
                  <p>Sunday: 11am – 6pm IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
