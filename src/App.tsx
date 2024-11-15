import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayerRegistration from './pages/PlayerRegistration';
import PlayerDatabase from './pages/PlayerDatabase';
import CoachDashboard from './pages/CoachDashboard';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import { CircleDot } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<PlayerRegistration />} />
            <Route path="/database" element={
              <ProtectedRoute>
                <PlayerDatabase />
              </ProtectedRoute>
            } />
            <Route path="/coach" element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="/teams/:id" element={
              <ProtectedRoute>
                <TeamDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner py-6 mt-12">
          <div className="container mx-auto px-4 flex items-center justify-center space-x-2">
            <CircleDot className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-600">© 2024 Apex Volleyball. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;