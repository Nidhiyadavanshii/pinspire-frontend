import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BoardsProvider } from './context/BoardsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import SavedPins from './pages/SavedPins';
import Search from './pages/Search';
import PinDetails from './pages/PinDetails';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import NotFound from './pages/NotFound';
import Admin from "./pages/Admin";

<Route path="/admin" element={<Admin />} />
export default function App() {
  return (
    <AuthProvider>
      <BoardsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pin/:id" element={<PinDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedPins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boards"
            element={
              <ProtectedRoute>
                <Boards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boards/:boardId"
            element={
              <ProtectedRoute>
                <BoardDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BoardsProvider>
    </AuthProvider>
  );
}
