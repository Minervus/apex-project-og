import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Users, ClipboardCheck, ClipboardList, Star, ArrowRight, XCircle, SquareAsterisk } from 'lucide-react';
import { usePlayers } from '../hooks/useFirestore';
import CoachPlayerTableHeader from '../components/CoachPlayerTableHeader';
import CoachPlayerTableRow from '../components/CoachPlayerTableRow';
import type { Player } from '../types/player';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase.ts/'; // Adjust this import path based on your firebase config location
import { auth } from '../lib/firebase'; 

interface Assessment {
  rating: number;
  notes?: string;
}

interface Assessments {
  [key: string]: Assessment;
}

const assessmentCategories = [
  {
    name: 'Ball Control',
    subcategories: ['Setting', 'Passing', 'Pepper']
  },
  {
    name: 'Attacking',
    subcategories: ['Left Side', 'Right Side', 'Middle']
  },
  {
    name: 'Serving',
    subcategories: ['Accuracy', 'Power', 'Consistency']
  },
  {
    name: 'Defense',
    subcategories: ['Digging', 'Blocking', 'Positioning']
  }
];

const CoachDashboard = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [assessments, setAssessments] = useState<Assessments>({});
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'callback' | 'declined' | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as const });
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 15;

  const { players, loading, error } = usePlayers(playersPerPage, currentPage);

  const calculateSectionAverage = (categoryName: string) => {
    const sectionAssessments = Object.entries(assessments)
      .filter(([key]) => key.startsWith(categoryName))
      .map(([_, value]) => value.rating);

    if (sectionAssessments.length === 0) return null;

    const sum = sectionAssessments.reduce((acc, rating) => acc + rating, 0);
    return (sum / sectionAssessments.length).toFixed(1);
  };

  const calculateOverallRating = () => {
    const categories = ['Ball Control', 'Attacking', 'Serving', 'Defense'];
    const averages = categories
      .map(category => calculateSectionAverage(category))
      .filter((avg): avg is string => avg !== null)
      .map(avg => parseFloat(avg));

    if (averages.length === 0) return null;
    return (averages.reduce((sum, avg) => sum + avg, 0) / averages.length).toFixed(1);
  };

  const handleAssessmentChange = (category: string, subcategory: string, value: string) => {
    setAssessments(prev => ({
      ...prev,
      [`${category}-${subcategory}`]: {
        rating: parseInt(value),
        notes: prev[`${category}-${subcategory}`]?.notes || ''
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer || !auth.currentUser) return;

    try {
      const sectionAverages = {
        ballControlAverage: calculateSectionAverage('Ball Control'),
        attackingAverage: calculateSectionAverage('Attacking'),
        servingAverage: calculateSectionAverage('Serving'),
        defenseAverage: calculateSectionAverage('Defense')
      };
      
      const newAssessment = {
        date: new Date(),
        status: status,
        notes: notes,
        overallRating: calculateOverallRating(),
        categoryAverages: {
          ballControl: calculateSectionAverage('Ball Control'),
          attacking: calculateSectionAverage('Attacking'),
          serving: calculateSectionAverage('Serving'),
          defense: calculateSectionAverage('Defense')
        },
        assessedBy: auth.currentUser.email
      };

      const playerRef = doc(db, 'players', selectedPlayer.id);
      await updateDoc(playerRef, {
        status: status,
        assessments: arrayUnion(newAssessment),
        notes: notes,
        overallRating: calculateOverallRating(),
        ...sectionAverages
      });

      // Reset form
      setSelectedPlayer(null);
      setAssessments({});
      setNotes('');
      setStatus(null);
    } catch (error) {
      console.error('Error updating player:', error);
      // Optionally add error handling UI feedback here
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Players</p>
              <p className="text-2xl font-semibold text-gray-900">{players.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {players.filter(p => !p.status || p.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <ClipboardList className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Callbacks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {players.filter(p => p.status === 'callback').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-semibold text-gray-900">
                {players.filter(p => p.status === 'declined').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Players</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <CoachPlayerTableHeader
                  sortConfig={sortConfig}
                  onSort={(key) => setSortConfig({
                    key,
                    direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                  })}
                />
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => (
                    <CoachPlayerTableRow
                      key={player.id}
                      player={player}
                      onClick={setSelectedPlayer}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assessment Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Assessment Form</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {selectedPlayer ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Player Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="h-10 w-10 flex-shrink-0">
          {selectedPlayer.imageUrl ? (
              <img
                src={selectedPlayer.imageUrl}
                alt={`${selectedPlayer.name}'s profile`}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to User icon if image fails to load
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-indigo-100', 'flex', 'items-center', 'justify-center');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<div class="h-5 w-5 text-indigo-600"><svg>...</svg></div>';
                  e.currentTarget.parentElement?.appendChild(icon);
                }}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
            )}
          </div>
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 text-gray-900">{selectedPlayer.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Primary Position:</span>
                      <span className="ml-2 text-gray-900">{selectedPlayer.primaryPosition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Secondary Position:</span>
                      <span className="ml-2 text-gray-900">{selectedPlayer.secondaryPosition || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedPlayer.status === 'callback' ? 'bg-green-100 text-green-800' :
                        selectedPlayer.status === 'declined' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedPlayer.status || 'Pending'}
                      </span>
                    </div>
                    {calculateOverallRating() && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Overall Rating:</span>
                        <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md font-medium">
                          {calculateOverallRating()}/5.0
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Player Status Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Callback</p>
                        <p className="text-sm text-green-600">Advance to next round</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="sr-only peer"
                        checked={status === 'callback'}
                        onChange={() => setStatus('callback')}
                        name="playerStatus"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">Decline</p>
                        <p className="text-sm text-red-600">End tryout process</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="sr-only peer"
                        checked={status === 'declined'}
                        onChange={() => setStatus('declined')}
                        name="playerStatus"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>

                {/* Assessment Categories */}
                {assessmentCategories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      {calculateSectionAverage(category.name) && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Average Rating:</span>
                          <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {calculateSectionAverage(category.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {subcategory}
                          </label>
                          <select
                            required
                            onChange={(e) => handleAssessmentChange(category.name, subcategory, e.target.value)}
                            value={assessments[`${category.name}-${subcategory}`]?.rating || ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="">Select Rating</option>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <option key={rating} value={rating}>
                                {rating} - {
                                  rating === 1 ? 'Needs Improvement' :
                                  rating === 2 ? 'Fair' :
                                  rating === 3 ? 'Good' :
                                  rating === 4 ? 'Very Good' :
                                  'Excellent'
                                }
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add any additional observations or comments..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Assessment
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a player from the list to begin assessment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;