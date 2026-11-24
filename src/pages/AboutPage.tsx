import { useState } from 'react';
import { CheckCircle2, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { PageRoute } from '../types/mod';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  onShowToast: (message: string) => void;
}

export function AboutPage({ onNavigate, onShowToast }: AboutPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Mod Submission Review');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please complete your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
    onShowToast('Your message has been sent to the BlockForge curation team.');
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10 space-y-10">
      {/* Intro */}
      <section className="rounded-[24px] border-2 border-[#34323A] bg-[#222127] p-6 sm:p-8 space-y-4">
        <p className="text-xs font-semibold text-[#FF6A5F]">About BlockForge</p>
        <h1 className="font-display text-3xl font-bold text-[#F3F1EC] sm:text-4xl">
          Built for Clean, Safe Minecraft Modding
        </h1>
        <p className="max-w-[68ch] text-[15.5px] leading-relaxed text-[#A8A39A]">
          BlockForge is a curated community archive for Minecraft Java and Bedrock players who
          want trustworthy packages without ad-wall redirects, broken download mirrors, or bloated
          pack pages. Every listing states exact game versions, loader requirements, and verified
          checksums up front.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('mods')}
            className="rounded-full bg-[#D93A30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
          >
            Explore Catalog
          </button>
          <button
            type="button"
            onClick={() => onNavigate('downloads')}
            className="rounded-full border-2 border-[#34323A] bg-[#1C1B20] px-5 py-2.5 text-sm font-semibold text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
          >
            View Install Guides
          </button>
        </div>
      </section>

      {/* Curation Principles */}
      <section className="grid gap-5 md:grid-cols-3" aria-label="Curation standards">
        <div className="rounded-[20px] border-2 border-[#34323A] bg-[#222127] p-6 space-y-2.5">
          <ShieldCheck className="h-6 w-6 text-[#FF6A5F]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-[#F3F1EC]">01. Verified Packages</h2>
          <p className="text-sm leading-relaxed text-[#A8A39A]">
            Every `.jar`, `.mrpack`, `.mcaddon`, and `.mcpack` entry includes SHA-256 verification
            hashes and clear author attribution.
          </p>
        </div>

        <div className="rounded-[20px] border-2 border-[#34323A] bg-[#222127] p-6 space-y-2.5">
          <Cpu className="h-6 w-6 text-[#FF6A5F]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-[#F3F1EC]">02. Performance First</h2>
          <p className="text-sm leading-relaxed text-[#A8A39A]">
            Modpacks and shaders are tested on mid-tier laptops and mobile devices so survival
            servers keep steady tick rates.
          </p>
        </div>

        <div className="rounded-[20px] border-2 border-[#34323A] bg-[#222127] p-6 space-y-2.5">
          <Layers className="h-6 w-6 text-[#FF6A5F]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-[#F3F1EC]">03. Java &amp; Bedrock</h2>
          <p className="text-sm leading-relaxed text-[#A8A39A]">
            Whether you host a Fabric SMP or play Bedrock Realms on mobile and console, editions
            are clearly separated and tagged.
          </p>
        </div>
      </section>

      {/* Supported Formats & Contact Form */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-[22px] border-2 border-[#34323A] bg-[#222127] p-6 lg:col-span-5 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#F3F1EC]">Supported Formats</h2>
          <div className="divide-y divide-[#34323A] text-sm">
            <div className="flex items-center justify-between py-3">
              <span className="font-mono-num font-semibold text-[#FF6A5F]">.jar</span>
              <span className="text-[#A8A39A]">Java Fabric, NeoForge &amp; Forge Mods</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono-num font-semibold text-[#FF6A5F]">.mrpack</span>
              <span className="text-[#A8A39A]">Java Curated Modpack Bundles</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono-num font-semibold text-[#FF6A5F]">.mcaddon</span>
              <span className="text-[#A8A39A]">Bedrock Behavior + Resource Packs</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono-num font-semibold text-[#FF6A5F]">.mcpack</span>
              <span className="text-[#A8A39A]">Bedrock Textures &amp; Deferred Shaders</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono-num font-semibold text-[#FF6A5F]">.zip</span>
              <span className="text-[#A8A39A]">Java Resource Packs &amp; Iris Shaders</span>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border-2 border-[#34323A] bg-[#222127] p-6 lg:col-span-7 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#F3F1EC]">
            Request a Mod or Contact Curators
          </h2>

          {submitted ? (
            <div className="rounded-2xl border border-[#34323A] bg-[#1C1B20] p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#69B578] font-semibold">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <span>Request Received</span>
              </div>
              <p className="text-sm text-[#A8A39A]">
                Thanks, <strong className="text-[#F3F1EC]">{name}</strong>. We have logged your{' '}
                <span className="text-[#F3F1EC]">{topic}</span> inquiry and will reply to{' '}
                <span className="text-[#F3F1EC]">{email}</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="rounded-full border border-[#34323A] bg-[#222127] px-4 py-2 text-xs font-semibold text-[#F3F1EC] hover:border-[#6F6B63] cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="about-name" className="block text-xs font-semibold text-[#F3F1EC]">
                    Your Name
                  </label>
                  <input
                    id="about-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex"
                    className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-sm text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="about-email" className="block text-xs font-semibold text-[#F3F1EC]">
                    Email Address
                  </label>
                  <input
                    id="about-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@example.com"
                    className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-sm text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="about-topic" className="block text-xs font-semibold text-[#F3F1EC]">
                  Topic
                </label>
                <select
                  id="about-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-sm text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
                >
                  <option>Mod Submission Review</option>
                  <option>Version Update Request</option>
                  <option>Bug or Broken Link Report</option>
                  <option>General Feedback</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="about-msg" className="block text-xs font-semibold text-[#F3F1EC]">
                  Message
                </label>
                <textarea
                  id="about-msg"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us which mod, version, or feature you would like to see..."
                  className="w-full rounded-xl border-2 border-[#34323A] bg-[#1C1B20] px-3.5 py-2.5 text-sm text-[#F3F1EC] focus:border-[#FF6A5F] focus:outline-none"
                />
              </div>

              {error && <p className="text-xs font-medium text-[#FF6A5F]">{error}</p>}

              <button
                type="submit"
                className="rounded-full bg-[#D93A30] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#FF6A5F] cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
