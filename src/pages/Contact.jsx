import React, { useState } from "react";
import { Envelope, Phone, MapPin, PaperPlaneTilt, ChatCircleDots } from "@phosphor-icons/react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 bg-(--bg) min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-16 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-(--primary)">Get in Touch</span>
          <h1 className="text-5xl font-black font-(--font-heading) mt-2 text-(--text)">Contact Us</h1>
          <p className="text-(--text-muted) mt-4 max-w-xl mx-auto font-medium">
            Have a question about an order or a specific product? Our team is here to help 24/7.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side: Contact Info */}
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-(--border) hover:border-(--primary) transition-colors group">
                <div className="w-12 h-12 bg-(--primary-glow) text-(--primary) rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Envelope size={24} weight="bold" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest mb-1">Email Us</h3>
                <p className="text-(--text-muted) text-sm font-medium">support@nexcart.com</p>
              </div>

              <div className="p-8 bg-white rounded-3xl border border-(--border) hover:border-(--primary) transition-colors group">
                <div className="w-12 h-12 bg-(--primary-glow) text-(--primary) rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone size={24} weight="bold" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest mb-1">Call Us</h3>
                <p className="text-(--text-muted) text-sm font-medium">+1 (555) 000-1234</p>
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-(--border) flex items-start gap-6">
              <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest mb-1">Visit Our HQ</h3>
                <p className="text-(--text-muted) text-sm font-medium leading-relaxed">
                  123 Commerce Way, Suite 100<br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            {/* Live Chat Teaser */}
            <div className="bg-(--primary) p-8 rounded-3xl text-white flex items-center justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-1">Need instant help?</h3>
                <p className="text-white/80 text-sm">Our live agents are currently online.</p>
              </div>
              <ChatCircleDots size={80} weight="fill" className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-(--border) shadow-(--shadow-sm)">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-(--text-light) mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-neutral-50 border border-(--border) rounded-xl focus:outline-(--primary) focus:bg-white transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-(--text-light) mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 bg-neutral-50 border border-(--border) rounded-xl focus:outline-(--primary) focus:bg-white transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-(--text-light) mb-2">How can we help?</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Your message here..."
                  className="w-full px-5 py-4 bg-neutral-50 border border-(--border) rounded-xl focus:outline-(--primary) focus:bg-white transition-all font-medium resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full bg-(--text) text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-(--primary) transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <PaperPlaneTilt size={18} weight="bold" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;