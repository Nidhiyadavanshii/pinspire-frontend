import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Grid, Bookmark, MapPin, Link as LinkIcon, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_PINS } from '../data/dummyPins';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { ToastProvider } from '../components/ToastNotifications';
import PinDetailsModal from '../components/PinDetailsModal';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

function Avatar({ user, size = 96 }) {
  const initials = (user?.fullName || user?.username || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center font-bold text-white rounded-full shrink-0"
      style={{ width: size, height: size, backgroundColor: '#e60023', fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold" style={{ color: '#000000' }}>{value?.toLocaleString?.() ?? value}</p>
      <p className="text-sm mt-0.5" style={{ color: '#62625b' }}>{label}</p>
    </div>
  );
}

function MiniPinCard({ pin, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="relative cursor-pointer overflow-hidden"
      style={{ borderRadius: 12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(pin)}
    >
      <img
        src={pin.image}
        alt={pin.title}
        loading="lazy"
        className="w-full object-cover"
        style={{ aspectRatio: '1 / 1' }}
      />
      {hovered && (
        <div className="absolute inset-0 flex items-end p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}>
          <p className="text-white text-xs font-semibold truncate">{pin.title}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('created');
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const savedPinIds = JSON.parse(localStorage.getItem('savedPins') || '[]');
  const createdPins = ALL_PINS.filter((_, i) => i % 5 === 0).slice(0, user?.totalPins || 12);
  const savedPins = ALL_PINS.filter((p) => savedPinIds.includes(p.id)).slice(0, 20);

  const displayPins = activeTab === 'created' ? createdPins : savedPins;

  const handleSaveBio = () => {
    updateUser({ ...user, bio: editBio });
    setEditing(false);
  };

  const openPin = (pin) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1">
          {/* Cover */}
          <div
            className="w-full h-48 md:h-64 relative"
            style={{ background: 'linear-gradient(135deg, #e60023 0%, #ff6b6b 50%, #ffa07a 100%)' }}
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 0%, transparent 50%)' }} />
          </div>

          {/* Profile info */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="relative -mt-12 flex flex-col items-center text-center">
              <div className="ring-4 ring-white rounded-full">
                <Avatar user={user} size={96} />
              </div>

              <div className="mt-4">
                <h1 className="text-2xl font-bold" style={{ color: '#000000', letterSpacing: '-0.5px' }}>
                  {user?.fullName || 'Anonymous'}
                </h1>
                <p className="text-sm mt-1 font-medium" style={{ color: '#62625b' }}>@{user?.username || 'user'}</p>
              </div>

              {/* Bio */}
              <div className="mt-3 max-w-md">
                {editing ? (
                  <div className="flex flex-col items-center gap-2">
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl text-sm border outline-none resize-none"
                      style={{ borderColor: '#dadad3', color: '#000000' }}
                      placeholder="Tell people about yourself..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveBio}
                        className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: '#e60023' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditing(false); setEditBio(user?.bio || ''); }}
                        className="px-4 py-1.5 rounded-full text-sm font-semibold"
                        style={{ backgroundColor: '#f6f6f3', color: '#000000' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: '#33332e' }}>
                    {user?.bio || 'No bio yet. Click edit to add one.'}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-8">
                <StatItem value={user?.followers ?? 0} label="Followers" />
                <StatItem value={user?.following ?? 0} label="Following" />
                <StatItem value={user?.totalPins ?? createdPins.length} label="Pins" />
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:brightness-95"
                  style={{ backgroundColor: '#f6f6f3', color: '#000000' }}
                >
                  <Settings size={16} />
                  Edit profile
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:brightness-95"
                  style={{ backgroundColor: '#e60023' }}
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b flex gap-1" style={{ borderColor: '#dadad3' }}>
              {[
                { key: 'created', label: 'Created', icon: Grid },
                { key: 'saved', label: 'Saved', icon: Bookmark },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors relative"
                  style={{ color: activeTab === key ? '#000000' : '#62625b' }}
                >
                  <Icon size={16} />
                  {label}
                  {activeTab === key && (
                    <motion.div
                      layoutId="profile-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: '#000000' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Pin grid */}
            <div className="py-6">
              {displayPins.length === 0 ? (
                <div className="text-center py-16">
                  <Bookmark size={48} className="mx-auto mb-3" style={{ color: '#dadad3' }} />
                  <p className="font-semibold" style={{ color: '#62625b' }}>
                    {activeTab === 'saved' ? 'No saved pins yet' : 'No created pins yet'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#91918c' }}>
                    {activeTab === 'saved' ? 'Save pins from your feed to see them here.' : 'Start creating to see your pins here.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {displayPins.map((pin) => (
                    <MiniPinCard key={pin.id} pin={pin} onClick={openPin} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </main>

        <PinDetailsModal pin={selectedPin} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedPin(null), 250); }} />
        <ScrollToTopButton />
      </div>
    </ToastProvider>
  );
}
