import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import axios from 'axios';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, label, className }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)');
        return;
      }
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (selectedFile: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const token = localStorage.getItem('access_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        onUploadSuccess(response.data.data.url);
      } else {
        setError('การอัปโหลดล้มเหลว');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'การอัปโหลดล้มเหลว');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[120px] ${
          preview ? 'border-primary/50' : 'border-white/10 hover:border-primary/30'
        } bg-black/40`}
      >
        {!preview ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-white/20 mb-2" />
            <p className="text-xs text-white/40">คลิกหรือลากไฟล์เพื่ออัปโหลด (สูงสุด 5MB)</p>
          </>
        ) : (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={clearFile}
                className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-xs text-white font-medium">กำลังอัปโหลด...</span>
              </div>
            )}
            {!uploading && !error && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 text-white">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
