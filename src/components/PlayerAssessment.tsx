import React, { useState } from 'react';
import { Star, Activity } from 'lucide-react';
import { Player, ScoreCategory } from '../types';

interface PlayerAssessmentProps {
  player: Player | null;
  onSave: (updatedPlayer: Player) => void;
}

export default function PlayerAssessment({ player, onSave }: PlayerAssessmentProps) {
  const [scores, setScores] = useState<Record<ScoreCategory, number>>(
    player?.scores || {} as Record<ScoreCategory, number>
  );
  const [notes, setNotes] = useState(player?.notes || '');
  const [status, setStatus] = useState<'callback' | 'decline'>('callback');

  const scoreCategories: ScoreCategory[] = [
    'serving',
    'passing',
    'setting',
    'hitting',
    'blocking',
    'communication'
  ];

  if (!player) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Select a player from the list to begin assessment</p>
      </div>
    );
  }

  const handleScoreChange = (category: ScoreCategory, score: number) => {
    setScores(prev => ({
      ...prev,
      [category]: score
    }));
  };

  const handleSubmit = () => {
    const newAssessment = {
      scores,
      notes,
      status,
      assessedAt: new Date().toISOString(),
      assessedBy: 'Coach Name' // Replace with actual coach name from context
    };

    const updatedPlayer = {
      ...player,
      status, // Update the player's status
      assessments: [
        ...(player.assessments || []),
        newAssessment
      ]
    };

    onSave(updatedPlayer);
  };

  return (
    <div className="p-6 bg-gray-50 border-t border-gray-200">
      {/* Skills Assessment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Skills Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoreCategories.map((category) => (
            <div key={category} className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-600 capitalize mb-2">{category}</h4>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScoreChange(category, score)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        score <= (scores[category] || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coach's Notes */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Coach's Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add your assessment notes here..."
        />
      </div>

      {/* Status Selection */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Decision</h3>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setStatus('callback')}
            className={`px-4 py-2 rounded-md ${
              status === 'callback'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Callback
          </button>
          <button
            type="button"
            onClick={() => setStatus('decline')}
            className={`px-4 py-2 rounded-md ${
              status === 'decline'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Decline
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Assessment
        </button>
      </div>
    </div>
  );
}