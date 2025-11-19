import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ChatPage } from './pages/ChatPage';
import { useAuthStore } from './store/authStore';
import { supabase } from './supabaseClient';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  const { setSession, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession, checkSession]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;
