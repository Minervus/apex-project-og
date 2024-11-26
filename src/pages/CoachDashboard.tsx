import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronRight, Users, ClipboardCheck, ClipboardList, Star, ArrowRight, XCircle, SquareAsterisk } from 'lucide-react';
import { usePlayers } from '../hooks/useFirestore';
import CoachPlayerTableHeader from '../components/CoachPlayerTableHeader';
import CoachPlayerTableRow from '../components/CoachPlayerTableRow';
import type { Player } from '../types/player';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase.ts/'; // Adjust this import path based on your firebase config location
import { auth } from '../lib/firebase'; 
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  // Add this near your other state declarations
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { players, loading, error } = usePlayers(playersPerPage, currentPage);

  const groupedPlayers = players.reduce((groups: { [key: string]: Player[] }, player) => {
    const ageGroup = player.ageGroup || 'Unassigned';
    if (!groups[ageGroup]) {
      groups[ageGroup] = [];
    }
    groups[ageGroup].push(player);
    return groups;
  }, {});

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };
  
  
  
  const calculateSectionAverage = (categoryName: string) => {
    const sectionAssessments = Object.entries(assessments)
      .filter(([key]) => key.startsWith(categoryName))
      .map(([_, value]) => value.rating);

    if (sectionAssessments.length === 0) return null;

    const requiredSubcategories = assessmentCategories
      .find(cat => cat.name === categoryName)?.subcategories.length || 0;
      
    if (sectionAssessments.length < requiredSubcategories) return null;

    const sum = sectionAssessments.reduce((acc, rating) => acc + rating, 0);
    return (sum / sectionAssessments.length).toFixed(1);
  };

  const calculateOverallRating = () => {
    const categories = ['Ball Control', 'Attacking', 'Serving', 'Defense'];
    const averages = categories
      .map(category => calculateSectionAverage(category))
      .filter((avg): avg is string => avg !== null);

    if (averages.length < categories.length) return null;
    
    return (averages.reduce((sum, avg) => sum + parseFloat(avg), 0) / averages.length).toFixed(1);
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
        ballControlAverage: calculateSectionAverage('Ball Control') || 'Unassessed',
        attackingAverage: calculateSectionAverage('Attacking') || 'Unassessed',
        servingAverage: calculateSectionAverage('Serving') || 'Unassessed',
        defenseAverage: calculateSectionAverage('Defense') || 'Unassessed'
      };
      
      const newAssessment = {
        date: new Date(),
        status: status,
        notes: notes,
        overallRating: calculateOverallRating() || 'Unassessed',
        categoryAverages: {
          ballControl: calculateSectionAverage('Ball Control') || 'Unassessed',
          attacking: calculateSectionAverage('Attacking') || 'Unassessed',
          serving: calculateSectionAverage('Serving') || 'Unassessed',
          defense: calculateSectionAverage('Defense') || 'Unassessed'
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

    // Show success modal
    setShowSuccessModal(true);

    // Reset form after a short delay
    setTimeout(() => {
      setSelectedPlayer(null);
      setAssessments({});
      setNotes('');
      setStatus(null);
      setShowSuccessModal(false);
    }, 2000);

  } catch (error) {
    console.error('Error updating player:', error);
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
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-4 divide-x divide-gray-200">
          {/* Total Players */}
          <div className="px-4 first:pl-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">{players.length}</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="px-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <ClipboardList className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-gray-900">
                  {players.filter(p => !p.status || p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          {/* Callbacks */}
          <div className="px-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <ClipboardCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Callbacks</p>
                <p className="text-lg font-semibold text-gray-900">
                  {players.filter(p => p.status === 'callback').length}
                </p>
              </div>
            </div>
          </div>

          {/* Declined */}
          <div className="px-4 last:pr-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Declined</p>
                <p className="text-lg font-semibold text-gray-900">
                  {players.filter(p => p.status === 'declined').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Players List */}
        <div>
      <h2 className="text-xl font-semibold mb-4">Players</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex flex-col h-[600px]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <CoachPlayerTableHeader
                sortConfig={sortConfig}
                onSort={(key) => setSortConfig({
                  key,
                  direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                })}
              />
              <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
                {Object.entries(groupedPlayers).map(([ageGroup, groupPlayers]) => (
                  <React.Fragment key={ageGroup}>
                    {/* Age Group Header */}
                    <tr 
                      className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleGroup(ageGroup)}
                    >
                      <td colSpan={3} className="px-6 py-3">
                        <div className="flex items-center">
                          {expandedGroups.has(ageGroup) ? (
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                          )}
                          <span className="font-medium text-gray-900">
                            {ageGroup} ({groupPlayers.length} players)
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Player Rows */}
                    {expandedGroups.has(ageGroup) && groupPlayers.map((player) => (
                      <CoachPlayerTableRow
                        key={player.id}
                        player={player}
                        onClick={setSelectedPlayer}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
                    {calculateOverallRating() !== null ? (
                      <div className="col-span-2">
                        <span className="text-gray-500">Overall Rating:</span>
                        <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md font-medium">
                          {calculateOverallRating()}/5.0
                        </span>
                      </div>
                    ) : (
                      <div className="col-span-2">
                        <span className="text-gray-500">Overall Rating:</span>
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                          Unassessed
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

                {/* Scrollable Assessment Categories */}
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {assessmentCategories.map((category) => (
                    <div key={category.name} className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2 sticky top-0 bg-white z-10">
                        <h3 className="font-medium text-lg">{category.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Average Rating:</span>
                          <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {calculateSectionAverage(category.name) || 'Unassessed'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {subcategory}
                            </label>
                            <select
                              onChange={(e) => handleAssessmentChange(category.name, subcategory, e.target.value)}
                              value={assessments[`${category.name}-${subcategory}`]?.rating || ''}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option value="">Unassessed</option>
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
                </div>

                <div className="space-y-2 pt-4 border-t">
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

                <div className="flex justify-end pt-4">
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="bg-white rounded-lg p-6 shadow-xl z-10 transform transition-all ease-in-out duration-1500">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32"> {/* Adjust size as needed */}
                <DotLottieReact
                  src="https://lottie.host/185ff7ef-f3ff-437f-b72c-296ea529ab57/qcgMVlr6Bn.lottie"
                  loop
                  autoplay
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Assessment Saved Successfully
                </h3>
                <p className="text-sm text-gray-500">
                  The player assessment has been updated.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;