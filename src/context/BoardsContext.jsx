import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BoardsContext = createContext(null);

const DEFAULT_COVERS = [
  '#e60023', '#0076d3', '#00a400', '#ff6900', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
];

function getBoardsKey(userId) {
  return `boards_${userId}`;
}

export function BoardsProvider({ children }) {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);

  // Load boards from localStorage whenever user changes
  useEffect(() => {
    if (!user?.id && !user?.email) { setBoards([]); return; }
    const key = getBoardsKey(user?.id ?? user?.email);
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      setBoards(stored);
    } catch {
      setBoards([]);
    }
  }, [user?.id, user?.email]);

  const persist = useCallback((updated, userId) => {
    const key = getBoardsKey(userId);
    localStorage.setItem(key, JSON.stringify(updated));
    setBoards(updated);
  }, []);

  const createBoard = useCallback((name, description = '') => {
    if (!user) return null;
    const uid = user?.id ?? user?.email;
    const newBoard = {
      id: `board-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      pinIds: [],
      coverColor: DEFAULT_COVERS[Math.floor(Math.random() * DEFAULT_COVERS.length)],
      createdAt: new Date().toISOString(),
    };
    const updated = [newBoard, ...boards];
    persist(updated, uid);
    return newBoard;
  }, [user, boards, persist]);

  const deleteBoard = useCallback((boardId) => {
    if (!user) return;
    const uid = user?.id ?? user?.email;
    const updated = boards.filter(b => b.id !== boardId);
    persist(updated, uid);
  }, [user, boards, persist]);

  const updateBoard = useCallback((boardId, changes) => {
    if (!user) return;
    const uid = user?.id ?? user?.email;
    const updated = boards.map(b => b.id === boardId ? { ...b, ...changes } : b);
    persist(updated, uid);
  }, [user, boards, persist]);

  const addPinToBoard = useCallback((boardId, pinId) => {
    if (!user) return;
    const uid = user?.id ?? user?.email;
    const updated = boards.map(b => {
      if (b.id !== boardId) return b;
      if (b.pinIds.includes(pinId)) return b;
      return { ...b, pinIds: [...b.pinIds, pinId] };
    });
    persist(updated, uid);
  }, [user, boards, persist]);

  const removePinFromBoard = useCallback((boardId, pinId) => {
    if (!user) return;
    const uid = user?.id ?? user?.email;
    const updated = boards.map(b => {
      if (b.id !== boardId) return b;
      return { ...b, pinIds: b.pinIds.filter(id => id !== pinId) };
    });
    persist(updated, uid);
  }, [user, boards, persist]);

  const isPinInBoard = useCallback((boardId, pinId) => {
    const board = boards.find(b => b.id === boardId);
    return board ? board.pinIds.includes(pinId) : false;
  }, [boards]);

  const getBoardById = useCallback((boardId) => {
    return boards.find(b => b.id === boardId) ?? null;
  }, [boards]);

  return (
    <BoardsContext.Provider value={{
      boards,
      createBoard,
      deleteBoard,
      updateBoard,
      addPinToBoard,
      removePinFromBoard,
      isPinInBoard,
      getBoardById,
    }}>
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards() {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error('useBoards must be used within BoardsProvider');
  return ctx;
}

export default BoardsContext;
