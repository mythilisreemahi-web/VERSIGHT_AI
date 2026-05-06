/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Info, History, Settings, ExternalLink, Cpu, Database, Activity } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeImage } from './lib/gemini';

export default function App() {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImageFile(file);
    const url = URL.createObjectURL(file);
    setSelectedImageUrl(url);
    setAnalysisResult(null);
    setError(null);
  };

  const handleClear = () => {
    setSelectedImageFile(null);
    if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
    setSelectedImageUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!selectedImageFile) return;

    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(selectedImageFile);
      const result = await analyzeImage(base64, selectedImageFile.type);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-8 gap-12 border-r border-slate-200 bg-white z-50">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <Shield className="w-6 h-6" />
        </div>
        <nav className="flex flex-col gap-8">
          <button className="p-3 rounded-xl text-indigo-600 bg-indigo-50"><Activity className="w-6 h-6" /></button>
          <button className="p-3 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><History className="w-6 h-6" /></button>
          <button className="p-3 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><Settings className="w-6 h-6" /></button>
        </nav>
        <div className="mt-auto">
          <button className="p-3 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><Info className="w-6 h-6" /></button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-20 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 uppercase">Verisight<span className="text-indigo-600 font-bold">.</span>AI</h1>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                System Status: Nominal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500 hidden md:flex">
            <a href="#" className="text-indigo-600">Forensics</a>
            <a href="#" className="hover:text-slate-900 transition-colors">API</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Methodology</a>
            <button className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all">Upgrade to Pro</button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col pt-12 pb-20">
          <div className="max-w-6xl mx-auto px-10 w-full flex flex-col lg:flex-row gap-16">
            <section className="flex-1 space-y-10">
              <header className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Activity className="w-3 h-3" /> Analysis Workspace
                </motion.div>
                <h2 className="text-4xl lg:text-6xl font-light text-slate-800 leading-[1.1] tracking-tight">
                  Unmask digital <br/><span className="text-indigo-600 font-medium">manipulation.</span>
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                  Professional-grade forensics to identify generative AI artifacts, 
                  pixel interpolation, and lighting inconsistencies.
                </p>
              </header>

              <div className="space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                  <div className="relative bg-white rounded-3xl p-2 border border-slate-200">
                    <ImageUploader 
                      onImageSelect={handleImageSelect} 
                      onClear={handleClear}
                      selectedImage={selectedImageUrl}
                    />
                  </div>
                </div>

                {selectedImageFile && !analysisResult && !loading && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={runAnalysis}
                    className="w-full py-5 bg-indigo-600 text-white font-bold text-sm tracking-widest uppercase rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all border-b-4 border-indigo-800"
                  >
                    Run Semantic Forensics Scan
                  </motion.button>
                )}
              </div>

              <AnalysisResult 
                result={analysisResult} 
                loading={loading} 
                error={error} 
              />
            </section>

            {/* Side Info / Guidelines */}
            <aside className="w-full lg:w-[320px] space-y-10 shrink-0">
              <div className="p-10 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Heuristics Engine</h3>
                <ul className="space-y-6">
                  {[
                    { label: "Noise Profile", val: "High Sensitivity" },
                    { label: "Shadow Geometry", val: "Scanning" },
                    { label: "Metadata Link", val: "Encrypted" },
                    { label: "GAN Detection", val: "v4.0 Active" }
                  ].map((item, i) => (
                    <li key={i} className="space-y-2">
                       <div className="flex justify-between text-[11px] font-bold uppercase">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-indigo-600">{item.val}</span>
                       </div>
                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + Math.random() * 40}%` }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                       </div>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <History className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">History Log</div>
                      <div className="text-xs text-slate-600 font-medium tracking-tight">3 scans remaining</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-600 text-white space-y-4 shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Shield className="w-32 h-32" />
                </div>
                <h3 className="font-bold relative z-10">Advanced Lab Access</h3>
                <p className="text-sm text-indigo-100/80 leading-relaxed relative z-10">
                  Join our enterprise program for mass batch analysis and API integration for platform-wide content moderation.
                </p>
                <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-bold tracking-widest uppercase relative z-10">Learn More</button>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 py-10 px-10 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] gap-6">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Latency: 42ms</span>
            <span className="hidden sm:inline">Engine: NeuralCore v2.4</span>
          </div>
          <div>
            © 2026 VeriSight Technologies Inc • All Rights Reserved
          </div>
        </footer>
      </main>

      {/* Decorative Scanner Line */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="fixed left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent z-[100] shadow-[0_0_20px_rgba(79,70,229,0.5)] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

