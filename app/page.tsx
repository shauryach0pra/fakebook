'use client';

import React from "react"
import { useState, useEffect } from 'react';
import { AlertCircle, Lock, CircleCheckIcon,CheckCircle2Icon, CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw, ShieldAlert } from 'lucide-react';

type Phase = 'hook' | 'data-grab' | 'reveal';
type RedFlag = {
  id: string;
  title: string;
  description: string;
  position: { top: string; left: string };
};

export default function SocialEngineeringSimulator() {
  const [phase, setPhase] = useState<Phase>('hook');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [maidenName, setMaidenName] = useState('');
  const [countdown, setCountdown] = useState(840); // 14 minutes in seconds
  const [hoveredFlag, setHoveredFlag] = useState<string | null>(null);
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [activeRedFlag, setActiveRedFlag] = useState<string | null>(null);
  const [visualBreakdownPage, setVisualBreakdownPage] = useState<'phase1' | 'phase2'>('phase1');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer
  useEffect(() => {
    if (phase === 'hook' || phase === 'data-grab') {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhase1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    console.log('[v0] PHISHING SIMULATION: User submitted email/password (NOT STORED):', {
      email: email.substring(0, 3) + '***',
      password: '***'
    });

    try {
      // Send OTP to user's email
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setPhase('data-grab');
      } else {
        setErrorMessage(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhase2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    console.log('[v0] PHISHING SIMULATION: User submitted OTP/maiden name (NOT STORED):', {
      otp: '***',
      maidenName: '***'
    });

    try {
      // Verify OTP
      const response = await fetch('/api/send-otp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setPhase('reveal');
      } else {
        setErrorMessage(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSimulation = () => {
    setPhase('hook');
    setEmail('');
    setPassword('');
    setOtp('');
    setMaidenName('');
    setCountdown(840);
    setHoveredFlag(null);
    setErrorMessage('');
  };

  const redFlags: RedFlag[] = [
    {
      id: 'http-url',
      title: 'Insecure HTTP Protocol',
      description: 'Legitimate sites use HTTPS (with the lock icon). HTTP connections are not encrypted and easily intercepted.',
      position: { top: '12px', left: '90px' }
    },
    {
      id: 'suspicious-domain',
      title: 'Suspicious Domain Name',
      description: 'The domain uses hyphens and unofficial naming (fakebook-support-login.com). Real Facebook uses facebook.com.',
      position: { top: '12px', left: '180px' }
    },
    {
      id: 'generic-greeting',
      title: 'Generic Greeting',
      description: 'Legitimate companies address you by name, not "Dear Valued Customer". This indicates a mass phishing campaign.',
      position: { top: '180px', left: '50%' }
    },
    {
      id: 'urgency-banner',
      title: 'Artificial Urgency',
      description: 'Countdown timers and threats create panic to bypass your critical thinking. Legitimate companies don\'t operate this way.',
      position: { top: '130px', left: '50%' }
    },
    {
      id: 'poor-grammar',
      title: 'Poor Grammar',
      description: '"Click for to Update" contains obvious grammatical errors. Professional companies have quality control.',
      position: { top: '480px', left: '50%' }
    },
    {
      id: 'stretched-logo',
      title: 'Distorted Branding',
      description: 'The logo appears stretched and uses slightly wrong colors. Attackers can\'t legally use perfect replicas.',
      position: { top: '90px', left: '50%' }
    },
    {
      id: 'malicious-link',
      title: 'Hidden Malicious URL',
      description: 'Hovering reveals the link points to a .ru domain, not Facebook. Always check where links actually go.',
      position: { top: '550px', left: '50%' }
    },
    {
      id: 'data-overreach',
      title: 'Excessive Data Request',
      description: 'Asking for mother\'s maiden name during a simple password reset is suspicious. This is security question data that enables account takeover.',
      position: { top: '380px', left: '50%' }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mock Browser Chrome */}
      <div className="bg-slate-800 text-white p-2 shadow-lg border-b-2 border-slate-900">
        <div className="w-full px-4 md:px-8">
          {/* Browser Controls */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* URL Bar */}
            <div className="flex-1 bg-slate-900 rounded-lg px-4 py-2 flex items-center gap-2">
              {phase !== 'reveal' && (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-mono text-red-400">
                    http://www.fakebooksupport.com
                  </span>
                </>
              )}
              {phase === 'reveal' && (
                <>
                  <CircleCheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-mono text-green-400">
                    https://securitytraining.com
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Tab */}
          <div className="flex items-center">
            <div className="bg-slate-700 px-4 py-1 rounded-t-lg text-sm flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>{phase === 'reveal' ? 'Security Debrief' : 'Account Recovery - Fakebook'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {/* Phase 1: The Hook */}
        {phase === 'hook' && (
          <div className="min-h-[calc(100vh-120px)] bg-white">
            {/* Urgency Banner */}
            <div className="bg-red-600 text-white py-4 px-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <p className="text-lg font-bold">
                  {'URGENT: Your account will be deleted in ' + formatTime(countdown) + ' minutes if not verified!'}
                </p>
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="w-full max-w-2xl mx-auto py-12 px-6 md:px-8">
              {/* Distorted Logo */}
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-[#3b5898] mb-2" style={{ transform: 'scaleX(1.15)', letterSpacing: '2px', filter: 'hue-rotate(-5deg)' }}>
                  fakebook
                </h1>
              </div>

              {/* Generic Greeting */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2 text-slate-800">Dear Valued Customer,</h2>
                <p className="text-slate-700">
                  We have detected unusual activity on your account. Please verify your identity immediately to prevent permanent deletion.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePhase1Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Grammar Error Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#3b5898] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4373] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending verification code...' : 'Click for to Update'}
                </button>

                {/* Suspicious Link with Hover */}
                <div className="text-center relative">
                  
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Phase 2: Data Grab */}
        {phase === 'data-grab' && (
          <div className="min-h-[calc(100vh-120px)] bg-white">
            {/* Urgency Banner */}
            <div className="bg-red-600 text-white py-4 px-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <p className="text-lg font-bold">
                  {'Time Remaining: ' + formatTime(countdown) + ' minutes'}
                </p>
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="w-full max-w-2xl mx-auto py-12 px-6 md:px-8">
              <div className="text-center mb-8">
                <CheckCircle2Icon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Almost Done :) </h2>
                <p className="text-slate-600">{'We\'ve sent a verification code to your email.'}</p>
              </div>

              <form onSubmit={handlePhase2Submit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Data Overreach */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {"Mother\'s Maiden Name"}
                  </label>
                  <input
                    type="text"
                    value={maidenName}
                    onChange={(e) => setMaidenName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter maiden name"
                    required
                    disabled={isLoading}
                  />
                  
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Complete Verification'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Phase 3: The Reveal */}
        {phase === 'reveal' && (
          <div className="min-h-[calc(100vh-120px)] bg-slate-950 text-white py-12 px-6 md:px-8">
            <div className="w-full max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">{'You\'ve Been Phished :('}</h1>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  {'This was an educational simulation. In a real attack, your credentials would now be compromised. Let\'s examine what happened.'}
                </p>
              </div>

              {/* Security Grade */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 mb-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Security Grade</h2>
                <div className="text-7xl font-bold text-red-500 mb-4">F</div>
                <p className="text-slate-400 text-lg">
                  {'You fell for '}
                  <span className="text-red-400 font-bold">8 critical red flags</span>
                  {'. Here\'s what you missed:'}
                </p>
              </div>

              {/* Red Flags Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {redFlags.map((flag, index) => (
                  <div
                    key={flag.id}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-red-500 transition-all cursor-pointer group"
                    onMouseEnter={() => setHoveredFlag(flag.id)}
                    onMouseLeave={() => setHoveredFlag(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-red-400 group-hover:text-red-300">
                          {flag.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">{flag.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Replica Section */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Visual Breakdown</h2>
                <p className="text-slate-400 text-center mb-6">Hover over the red indicators to see why each element is suspicious</p>
                
                {/* Full-Scale Page View with Browser Chrome */}
                <div className="relative bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
                  {/* Mock Browser Chrome */}
                  <div className="bg-slate-800 text-white p-2 shadow-lg border-b-2 border-slate-900">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        <button className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* URL Bar with Red Flags */}
                      <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1.5 flex items-center gap-2 relative">
                        <div className="relative">
                          <XCircle className="w-4 h-4 text-red-500" />
                          {activeRedFlag === 'http-url-visual' && (
                            <div className="absolute top-full mt-2 left-0 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                              <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="font-bold text-red-400">Insecure HTTP Protocol</p>
                              </div>
                              <p className="text-sm">Legitimate sites use HTTPS (with the lock icon). HTTP connections are not encrypted and easily intercepted.</p>
                            </div>
                          )}
                          <div 
                            className="absolute -inset-2 cursor-pointer border-4 rounded-full animate-pulse border-red-500"
                            onMouseEnter={() => setActiveRedFlag('http-url-visual')}
                            onMouseLeave={() => setActiveRedFlag(null)}
                            onClick={() => setActiveRedFlag(activeRedFlag === 'http-url-visual' ? null : 'http-url-visual')}
                          />
                        </div>
                        <div className="relative flex-1">
                          <span className="text-xs font-mono text-red-400">http://www.fakebooksupport.com</span>
                          {activeRedFlag === 'suspicious-domain-visual' && (
                            <div className="absolute top-full mt-2 left-0 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                              <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="font-bold text-red-400">Suspicious Domain Name</p>
                              </div>
                              <p className="text-sm">The domain uses hyphens and unofficial naming (fakebook-support-login.com). Real Facebook uses facebook.com.</p>
                            </div>
                          )}
                          <div 
                            className="absolute inset-0 cursor-pointer border-4 rounded-lg animate-pulse border-red-500"
                            onMouseEnter={() => setActiveRedFlag('suspicious-domain-visual')}
                            onMouseLeave={() => setActiveRedFlag(null)}
                            onClick={() => setActiveRedFlag(activeRedFlag === 'suspicious-domain-visual' ? null : 'suspicious-domain-visual')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-slate-700 px-3 py-0.5 rounded-t text-xs flex items-center gap-1">
                        <Lock className="w-2 h-2" />
                        <span>Account Recovery - Fakebook</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 1 Content */}
                  {visualBreakdownPage === 'phase1' && (
                    <div className="bg-white">
                      {/* Urgency Banner */}
                      <div className="relative bg-red-600 text-white py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <AlertCircle className="w-5 h-5" />
                          <p className="text-sm font-bold">
                            URGENT: Your account will be deleted in 14:00 minutes if not verified!
                          </p>
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        {activeRedFlag === 'urgency-banner-visual' && (
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                            <div className="flex items-start gap-2 mb-2">
                              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                              <p className="font-bold text-red-400">Artificial Urgency</p>
                            </div>
                            <p className="text-sm">Countdown timers and threats create panic to bypass your critical thinking. Legitimate companies don't operate this way.</p>
                          </div>
                        )}
                        <div 
                          className="absolute inset-0 cursor-pointer border-4 rounded-lg animate-pulse border-red-500"
                          onMouseEnter={() => setActiveRedFlag('urgency-banner-visual')}
                          onMouseLeave={() => setActiveRedFlag(null)}
                          onClick={() => setActiveRedFlag(activeRedFlag === 'urgency-banner-visual' ? null : 'urgency-banner-visual')}
                        />
                      </div>

                      <div className="w-full max-w-2xl mx-auto py-8 px-6 md:px-8">
                        {/* Distorted Logo */}
                        <div className="text-center mb-6 relative">
                          <h1 className="text-4xl font-bold text-[#3b5898] mb-2" style={{ transform: 'scaleX(1.15)', letterSpacing: '2px', filter: 'hue-rotate(-5deg)' }}>
                            fakebook
                          </h1>
                          {activeRedFlag === 'stretched-logo-visual' && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                              <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="font-bold text-red-400">Distorted Branding</p>
                              </div>
                              <p className="text-sm">The logo appears stretched and uses slightly wrong colors. Attackers can't legally use perfect replicas.</p>
                            </div>
                          )}
                          <div 
                            className="absolute inset-0 cursor-pointer border-4 rounded-lg animate-pulse border-red-500"
                            onMouseEnter={() => setActiveRedFlag('stretched-logo-visual')}
                            onMouseLeave={() => setActiveRedFlag(null)}
                            onClick={() => setActiveRedFlag(activeRedFlag === 'stretched-logo-visual' ? null : 'stretched-logo-visual')}
                          />
                        </div>

                        {/* Generic Greeting */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 relative">
                          <h2 className="text-lg font-semibold mb-2 text-slate-900">Dear Valued Customer,</h2>
                          <p className="text-slate-700 text-sm">
                            We have detected unusual activity on your account. Please verify your identity immediately to prevent permanent deletion.
                          </p>
                          {activeRedFlag === 'generic-greeting-visual' && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                              <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="font-bold text-red-400">Generic Greeting</p>
                              </div>
                              <p className="text-sm">Legitimate companies address you by name, not "Dear Valued Customer". This indicates a mass phishing campaign.</p>
                            </div>
                          )}
                          <div 
                            className="absolute inset-0 cursor-pointer border-4 rounded-lg animate-pulse border-red-500"
                            onMouseEnter={() => setActiveRedFlag('generic-greeting-visual')}
                            onMouseLeave={() => setActiveRedFlag(null)}
                            onClick={() => setActiveRedFlag(activeRedFlag === 'generic-greeting-visual' ? null : 'generic-greeting-visual')}
                          />
                        </div>

                        {/* Form */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Enter your email" disabled />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                            <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Enter your password" disabled />
                          </div>
                          
                          {/* Poor Grammar Button */}
                          <div className="relative">
                            <button className="w-full bg-[#3b5898] text-white py-2.5 rounded-lg font-semibold text-sm">
                              Click for to Update
                            </button>
                            {activeRedFlag === 'poor-grammar-visual' && (
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                                <div className="flex items-start gap-2 mb-2">
                                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                  <p className="font-bold text-red-400">Poor Grammar</p>
                                </div>
                                <p className="text-sm">"Click for to Update" contains obvious grammatical errors. Professional companies have quality control.</p>
                              </div>
                            )}
                            <div 
                              className="absolute inset-0 cursor-pointer border-4 rounded-lg animate-pulse border-red-500"
                              onMouseEnter={() => setActiveRedFlag('poor-grammar-visual')}
                              onMouseLeave={() => setActiveRedFlag(null)}
                              onClick={() => setActiveRedFlag(activeRedFlag === 'poor-grammar-visual' ? null : 'poor-grammar-visual')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 2 Content */}
                  {visualBreakdownPage === 'phase2' && (
                    <div className="bg-white">
                      {/* Urgency Banner */}
                      <div className="bg-red-600 text-white py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <AlertCircle className="w-5 h-5" />
                          <p className="text-sm font-bold">Time Remaining: 13:45 minutes</p>
                          <AlertCircle className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="w-full max-w-2xl mx-auto py-8 px-6 md:px-8">
                        <div className="text-center mb-6">
                          <CheckCircle2Icon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <h2 className="text-xl font-bold text-slate-800 mb-2">Almost Done :) </h2>
                          <p className="text-slate-600 text-sm">We've sent a verification code to your email.</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">6-Digit Verification Code</label>
                            <input type="text" placeholder="000000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center text-xl font-mono tracking-widest" disabled />
                          </div>

                          {/* Data Overreach */}
                          <div className="relative bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Mother's Maiden Name</label>
                            <input type="text" placeholder="Enter maiden name" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" disabled />
                            {activeRedFlag === 'data-overreach-visual' && (
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-red-500 text-white p-4 rounded-lg shadow-xl z-50 w-80">
                                <div className="flex items-start gap-2 mb-2">
                                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                  <p className="font-bold text-red-400">Excessive Data Request</p>
                                </div>
                                <p className="text-sm">Asking for mother's maiden name during a simple password reset is suspicious. This is security question data that enables account takeover.</p>
                              </div>
                            )}
                            <div 
                              className="absolute inset-0 cursor-pointer border-4 rounded-lg animate-pulse border-red-500"
                              onMouseEnter={() => setActiveRedFlag('data-overreach-visual')}
                              onMouseLeave={() => setActiveRedFlag(null)}
                              onClick={() => setActiveRedFlag(activeRedFlag === 'data-overreach-visual' ? null : 'data-overreach-visual')}
                            />
                          </div>

                          <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm">
                            Complete Verification
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Navigation */}
                  <div className="flex gap-2 p-3 justify-center bg-slate-800/50 border-t border-slate-700">
                    <button
                      onClick={() => {
                        setVisualBreakdownPage('phase1');
                        setActiveRedFlag(null);
                      }}
                      className={`px-5 py-2 rounded-md font-medium text-xs transition-all my-[35px] ${
                        visualBreakdownPage === 'phase1'
                          ? 'bg-slate-700 text-white border border-slate-600'
                          : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      The Hook
                    </button>
                    <button
                      onClick={() => {
                        setVisualBreakdownPage('phase2');
                        setActiveRedFlag(null);
                      }}
                      className={`px-5 py-2 rounded-md font-medium text-xs transition-all my-[35px] ${
                        visualBreakdownPage === 'phase2'
                          ? 'bg-slate-700 text-white border border-slate-600'
                          : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                       The Trap
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="bg-gradient-to-br from-blue-950 to-slate-900 border rounded-xl p-8 mb-8 bg-slate-900 border-slate-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">Key Security Principles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Always Check the URL</h3>
                      <p className="text-slate-300 text-sm">Look for HTTPS and verify the exact domain name</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Ignore Artificial Urgency</h3>
                      <p className="text-slate-300 text-sm">Legitimate companies never rush you with countdown timers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Hover Before Clicking</h3>
                      <p className="text-slate-300 text-sm">Check where links really go before clicking them</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Question Data Requests</h3>
                      <p className="text-slate-300 text-sm">Be suspicious of unnecessary personal information requests</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <button
                  onClick={resetSimulation}
                  className="hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold text-base transition-all border hover:border-slate-500 inline-flex items-center gap-2 bg-slate-900 border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again ( Now You Know ;) )  
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar (shown on hover of Terms link) */}
      {showStatusBar && phase === 'hook' && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white px-4 py-2 text-sm font-mono border-t-2 border-red-500">
          <span className="text-red-400">⚠️ http://malicious-link.ru/steal</span>
        </div>
      )}
    </div>
  );
}
