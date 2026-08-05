import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../config/api';
import { CATEGORIES_LIST } from '../data/pinsStore';
import { createUserPin } from '../data/pinsStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ToastProvider } from '../components/ToastNotifications';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const validate = () => {
    const errs = {};
    if (!preview) errs.image = 'Please select an image';
    if (!title.trim()) errs.title = 'Title is required';
    if (!category) errs.category = 'Please select a category';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const createdPin = createUserPin({
        title,
        description,
        category,
        image: preview || undefined,
        user: user?.username || 'you',
        userFullName: user?.fullName || user?.username || 'You',
        userId: user?.id || 'me',
      });

      try {
        await apiPost('/api/pins/create', {
          title,
          description,
          category,
          imageUrl: preview || undefined,
          image: preview || undefined,
          userId: createdPin.id,
        });
      } catch (backendError) {
        console.warn('Backend pin create unavailable, using local persistence instead:', backendError);
      }

      window.dispatchEvent(new CustomEvent('pins:updated', { detail: { pin: createdPin } }));

      await new Promise((r) => setTimeout(r, 800));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1200);
    } catch (error) {
      setLoading(false);
      setErrors({ submit: error.message || 'Unable to publish your pin right now.' });
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setErrors({});
    navigate(-1);
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000', letterSpacing: '-0.8px' }}>Create Pin</h1>
            <p className="text-sm mb-8" style={{ color: '#62625b' }}>Share your ideas with the world</p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Image upload area */}
              <div className="lg:col-span-2">
                <div
                  className="relative flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer min-h-[360px]"
                  style={{
                    border: `2px dashed ${dragOver ? '#e60023' : errors.image ? '#e60023' : '#dadad3'}`,
                    backgroundColor: dragOver ? '#fff5f5' : '#f6f6f3',
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !preview && fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />

                  {preview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-2xl"
                        style={{ minHeight: 360 }}
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: '#ffffff' }}
                      >
                        <X size={16} style={{ color: '#000000' }} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                        className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-md"
                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                      >
                        Change image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-8 text-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e5e5e0' }}>
                        <UploadIcon size={24} style={{ color: '#62625b' }} />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: '#000000' }}>Click to upload</p>
                        <p className="text-sm mt-1" style={{ color: '#62625b' }}>or drag and drop</p>
                        <p className="text-xs mt-2" style={{ color: '#91918c' }}>PNG, JPG, GIF up to 20MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.image && <p className="mt-1 text-xs font-medium" style={{ color: '#e60023' }}>{errors.image}</p>}
              </div>

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#33332e' }}>Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a title"
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
                    style={{ borderColor: errors.title ? '#e60023' : '#dadad3', color: '#000000', backgroundColor: '#ffffff' }}
                    onFocus={(e) => (e.target.style.borderColor = '#e60023')}
                    onBlur={(e) => (e.target.style.borderColor = errors.title ? '#e60023' : '#dadad3')}
                  />
                  {errors.title && <p className="mt-1 text-xs font-medium" style={{ color: '#e60023' }}>{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#33332e' }}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Tell everyone what your Pin is about"
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all resize-none"
                    style={{ borderColor: '#dadad3', color: '#000000', backgroundColor: '#ffffff' }}
                    onFocus={(e) => (e.target.style.borderColor = '#e60023')}
                    onBlur={(e) => (e.target.style.borderColor = '#dadad3')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#33332e' }}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all appearance-none"
                    style={{ borderColor: errors.category ? '#e60023' : '#dadad3', color: category ? '#000000' : '#91918c', backgroundColor: '#ffffff' }}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs font-medium" style={{ color: '#e60023' }}>{errors.category}</p>}
                </div>

                {errors.submit && (
                  <p className="text-xs font-medium" style={{ color: '#e60023' }}>{errors.submit}</p>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <motion.button
                    type="submit"
                    disabled={loading || success}
                    whileHover={{ scale: loading || success ? 1 : 1.01 }}
                    whileTap={{ scale: loading || success ? 1 : 0.98 }}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                    style={{ backgroundColor: success ? '#22c55e' : '#e60023' }}
                  >
                    {success ? (
                      <><Check size={16} /> Published!</>
                    ) : loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Publishing...</>
                    ) : (
                      <><UploadIcon size={16} /> Publish</>
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-95"
                    style={{ backgroundColor: '#f6f6f3', color: '#000000' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
