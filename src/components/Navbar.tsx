import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircleDot, ClipboardList } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <CircleDot className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">Apex Volleyball</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {!user && (
              <Link
                to="/register"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/register')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                <span>Register</span>
              </Link>
            )}
            
            {user && (
              <>
                <Link
                  to="/database"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/database')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Players
                </Link>
                <Link
                  to="/teams"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/teams')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Teams
                </Link>
                <Link
                  to="/coach"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/coach')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Coach Portal
                </Link>
                <button
                  onClick={signOut}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;