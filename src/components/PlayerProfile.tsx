import React, { useState } from 'react';
import { X, Star, Award, Save, Edit2, XCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AGE_GROUPS = [
  'Boys U15',
  'Girls U15',
  'Boys U16',
  'Girls U16',
  'Boys U17',
  'Girls U17',
  'Boys U18',
  'Girls U18'
];

interface Assessment {
  date: string;
  ballControl: number;
  attacking: number;
  serving: number;
  setting: number;
  digging: number;
  notes: string;
  callback?: boolean;
}

interface PlayerProfileProps {
  player: {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    primaryPosition: string;
    secondaryPosition?: string;
    previousClub?: string;
    tryingOutFor: string[];
    status?: string;
    rating?: number;
    assessments?: Record<string, Assessment>;
    ballControlAverage?: string;
    attackingAverage?: string;
    servingAverage?: string;
    defenseAverage?: string;
  };
  onClose: () => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({
    ...player,
    tryingOutFor: player.tryingOutFor || [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateAverageScore = (assessmentType: keyof Assessment) => {
    if (!player.assessments || Object.keys(player.assessments).length === 0) {
      return 0;
    }

    const scores = Object.values(player.assessments)
      .map(assessment => assessment[assessmentType])
      .filter((score): score is number => typeof score === 'number');

    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Number((sum / scores.length).toFixed(1));
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-xs';
    
    switch (status.toLowerCase()) {
      case 'callback':
        return 'bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs';
      case 'declined':
        return 'bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs';
      default:
        return 'bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-xs';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPlayer(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    setEditedPlayer(prev => ({
      ...prev,
      tryingOutFor: prev.tryingOutFor?.includes(ageGroup)
        ? prev.tryingOutFor.filter(group => group !== ageGroup)
        : [...(prev.tryingOutFor || []), ageGroup]
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const playerRef = doc(db, 'players', player.id);
      await updateDoc(playerRef, editedPlayer);
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Failed to update player details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {isEditing ? 'Edit Player Details' : player.name}
                {player.rating && player.rating >= 4.5 && (
                  <Star className="h-5 w-5 text-yellow-400" />
                )}
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500 border border-indigo-600 rounded-md"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editedPlayer.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Position</label>
                        <select
                          name="primaryPosition"
                          value={editedPlayer.primaryPosition}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="Setter">Setter</option>
                          <option value="Libero">Libero</option>
                          <option value="Outside Hitter">Outside Hitter</option>
                          <option value="Middle Blocker">Middle Blocker</option>
                          <option value="Opposite Hitter">Opposite Hitter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Secondary Position</label>
                        <select
                          name="secondaryPosition"
                          value={editedPlayer.secondaryPosition}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">None</option>
                          <option value="Setter">Setter</option>
                          <option value="Libero">Libero</option>
                          <option value="Outside Hitter">Outside Hitter</option>
                          <option value="Middle Blocker">Middle Blocker</option>
                          <option value="Opposite Hitter">Opposite Hitter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          name="status"
                          value={editedPlayer.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Primary Position</p>
                        <p className="font-medium">{player.primaryPosition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Secondary Position</p>
                        <p className="font-medium">{player.secondaryPosition || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={getStatusColor(player.status)}>
                          {player.status || 'Pending'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editedPlayer.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editedPlayer.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">
                        <span className="text-gray-500">Email:</span>{' '}
                        <a href={`mailto:${player.email}`} className="text-indigo-600 hover:text-indigo-500">
                          {player.email}
                        </a>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Phone:</span>{' '}
                        <a href={`tel:${player.phone}`} className="text-indigo-600 hover:text-indigo-500">
                          {player.phone}
                        </a>
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Previous Experience</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Previous Club</label>
                      <input
                        type="text"
                        name="previousClub"
                        value={editedPlayer.previousClub}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">
                    <span className="text-gray-500">Previous Club:</span>{' '}
                    {player.previousClub || 'None'}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Trying Out For</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {AGE_GROUPS.map((ageGroup) => (
                      <label
                        key={ageGroup}
                        className="relative flex items-center p-3 rounded-lg border cursor-pointer focus:outline-none"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={editedPlayer.tryingOutFor.includes(ageGroup)}
                          onChange={() => handleAgeGroupChange(ageGroup)}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {ageGroup}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(player.tryingOutFor || []).map((ageGroup) => (
                      <span
                        key={ageGroup}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800"
                      >
                        {ageGroup}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditedPlayer(player);
                      setIsEditing(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Assessment Scores</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Average Ratings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ball Control</p>
                      <p className="font-medium">{player.ballControlAverage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Attacking</p>
                      <p className="font-medium">{player.attackingAverage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Serving</p>
                      <p className="font-medium">{player.servingAverage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Defense</p>
                      <p className="font-medium">{player.defenseAverage || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Assessment History</h4>
                  <div className="space-y-3">
                    {Object.entries(player.assessments || {}).map(([date, assessment]) => (
                      <div key={date} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium">{new Date(assessment.date).toLocaleDateString()}</p>
                          {assessment.callback && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Award className="w-4 h-4 mr-1" />
                              Callback
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="text-gray-500">Ball Control:</span> {assessment.ballControl}</p>
                          <p><span className="text-gray-500">Attacking:</span> {assessment.attacking}</p>
                          <p><span className="text-gray-500">Serving:</span> {assessment.serving}</p>
                          <p><span className="text-gray-500">Setting:</span> {assessment.setting}</p>
                          <p><span className="text-gray-500">Digging:</span> {assessment.digging}</p>
                        </div>
                        {assessment.notes && (
                          <p className="text-sm mt-2">
                            <span className="text-gray-500">Notes:</span> {assessment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;