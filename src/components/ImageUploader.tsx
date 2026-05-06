import { useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  selectedImage: string | null;
}

export function ImageUploader({ onImageSelect, onClear, selectedImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type.startsWith('image/')) {
        onImageSelect(files[0]);
      }
    }
  }, [onImageSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onImageSelect(files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              relative cursor-pointer border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300
              ${isDragging 
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5 scale-[1.01]' 
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'}
            `}
          >
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleChange}
              accept="image/*"
            />
            <div className="w-16 h-16 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-[var(--color-brand)]" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload Evidence</h3>
            <p className="text-slate-500 text-center max-w-xs text-sm">
              Drag and drop an image or click to browse. <br/> Supported formats: PNG, JPEG, WEBP.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group bg-white p-4 rounded-2xl border border-slate-200 shadow-xl"
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full rounded-lg object-contain max-h-[500px]"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClear}
              className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-600 hover:text-rose-500 transition-colors border border-slate-200 shadow-sm"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 shadow-sm uppercase tracking-widest">
              <ImageIcon className="w-3 h-3" />
              Verified_Preview_Buffer
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
