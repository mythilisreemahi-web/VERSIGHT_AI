import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';

interface AnalysisResultProps {
  result: string | null;
  loading: boolean;
  error: string | null;
}

export function AnalysisResult({ result, loading, error }: AnalysisResultProps) {
  if (loading) {
    return (
      <div className="w-full p-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--color-brand)] animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-1 tracking-tight">Neutralizing Data Layer</h3>
          <p className="text-slate-500 text-sm">Scanning for GAN artifacts and illumination anomalies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
        <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
        <div>
          <h3 className="text-rose-600 font-bold mb-1">Scanner Fault</h3>
          <p className="text-rose-700/80 text-sm whitespace-pre-wrap">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isSuspicious = result.toLowerCase().includes('morphed') || result.toLowerCase().includes('suspicious');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className={`p-8 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors shadow-sm ${
        isSuspicious 
          ? 'bg-rose-50 border-rose-100' 
          : 'bg-emerald-50 border-emerald-100'
      }`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          isSuspicious ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
        }`}>
          {isSuspicious ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
        </div>
        <div className="text-center sm:text-left">
          <h2 className={`text-2xl font-bold tracking-tight mb-1 ${isSuspicious ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isSuspicious ? 'Manipulation Detected' : 'Digital Integrity Verified'}
          </h2>
          <p className={`text-sm font-medium ${isSuspicious ? 'text-rose-500/80' : 'text-emerald-500/80'}`}>
            Neural analysis concludes image is {isSuspicious ? 'highly likely morphed' : 'likely authentic'}.
          </p>
        </div>
        <div className="sm:ml-auto">
           <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
             isSuspicious ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
           }`}>
             Final Assessment
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-10 markdown-body shadow-sm">
        <div className="flex items-center gap-2 mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">
          <ShieldCheck className="w-3 h-3" /> Digital Forensics Report #AIS-{Math.floor(Math.random() * 9000) + 1000}
        </div>
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
