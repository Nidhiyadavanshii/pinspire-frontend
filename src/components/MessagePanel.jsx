import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Sparkles, Image as ImageIcon, MessageCircle } from 'lucide-react';

const seedImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'Sarah',
    role: 'Interior designer',
    unread: 2,
    preview: 'I found a few gorgeous mood boards for your new project.',
    avatar: 'S',
    images: seedImages.slice(0, 2),
    messages: [
      { id: 1, sender: 'them', text: 'Your next board is looking amazing. I pinned a few fresh ideas for you.' },
      { id: 2, sender: 'you', text: 'Perfect! Send them over.' },
    ],
  },
  {
    id: 'conv-2',
    name: 'Mina',
    role: 'Fashion curator',
    unread: 0,
    preview: 'These outfits would fit your aesthetic really well.',
    avatar: 'M',
    images: seedImages.slice(1, 3),
    messages: [
      { id: 1, sender: 'them', text: 'I gathered a few style inspirations that fit your vibe.' },
    ],
  },
  {
    id: 'conv-3',
    name: 'Noah',
    role: 'Travel creator',
    unread: 1,
    preview: 'Weekend escapes and scenic cafes are ready to explore.',
    avatar: 'N',
    images: seedImages.slice(2, 4),
    messages: [
      { id: 1, sender: 'them', text: 'I have a beautiful trip idea for your next save.' },
    ],
  },
];

function MessageBubble({ message }) {
  const isMine = message.sender === 'you';
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${isMine ? 'bg-[#e60023] text-white' : 'bg-[#f6f6f3] text-[#262622]'}`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default function MessagePanel({ isOpen, onClose }) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [draft, setDraft] = useState('');

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) || conversations[0],
    [activeId, conversations]
  );

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMessage = { id: Date.now(), sender: 'you', text: draft.trim() };
    const replyMessage = {
      id: Date.now() + 1,
      sender: 'them',
      text: 'Absolutely — I just added a fresh idea set for you. ✨',
    };

    setConversations((prev) => prev.map((conversation) =>
      conversation.id === activeId
        ? {
            ...conversation,
            preview: draft.trim(),
            messages: [...conversation.messages, newMessage, replyMessage],
          }
        : conversation
    ));
    setDraft('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-end bg-black/25 p-3 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex h-[85vh] w-full max-w-5xl overflow-hidden rounded-[24px] border border-[#dadad3] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hidden w-[320px] border-r border-[#f0f0eb] bg-[#fcfcfa] lg:block">
              <div className="border-b border-[#f0f0eb] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#000000]">Messages</p>
                    <p className="text-sm text-[#62625b]">Your creative circle</p>
                  </div>
                  <button onClick={onClose} className="rounded-full p-2 hover:bg-[#f6f6f3]">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 p-3">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveId(conversation.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${activeConversation?.id === conversation.id ? 'bg-[#fff0f2]' : 'hover:bg-[#f6f6f3]'}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e60023] font-bold text-white">
                      {conversation.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[#000000]">{conversation.name}</p>
                        {conversation.unread > 0 && (
                          <span className="rounded-full bg-[#e60023] px-2 py-0.5 text-[10px] font-bold text-white">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-[#62625b]">{conversation.preview}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-[#f0f0eb] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e60023] font-bold text-white">
                    {activeConversation?.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#000000]">{activeConversation?.name}</p>
                    <p className="text-sm text-[#62625b]">{activeConversation?.role}</p>
                  </div>
                </div>
                <button onClick={onClose} className="rounded-full p-2 hover:bg-[#f6f6f3]">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-[#fffdfb] p-4">
                <div className="rounded-2xl border border-[#f0f0eb] bg-white p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#e60023]">
                    <Sparkles size={14} />
                    Auto-curated inspiration
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {activeConversation?.images?.map((image, index) => (
                      <img key={`${image}-${index}`} src={image} alt="Inspiration" className="h-24 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                </div>

                {activeConversation?.messages?.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              <div className="border-t border-[#f0f0eb] p-3">
                <div className="mb-2 flex flex-wrap gap-2">
                  {['Share ideas', 'Send mood board', 'New inspo'].map((chip) => (
                    <button key={chip} onClick={() => setDraft(chip)} className="rounded-full bg-[#f6f6f3] px-3 py-1.5 text-xs font-semibold text-[#262622]">
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#dadad3] px-3 py-2">
                  <MessageCircle size={16} className="text-[#62625b]" />
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button onClick={handleSend} className="rounded-full bg-[#e60023] p-2 text-white">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
