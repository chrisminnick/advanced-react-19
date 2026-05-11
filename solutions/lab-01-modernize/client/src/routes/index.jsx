import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login.jsx';
import Signup from '../components/Signup.jsx';
import Logout from '../components/Logout.jsx';
import Chat from '../components/Chat.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
