import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { addPlayer } from '../lib/firestore';
import { useNavigate } from 'react-router-dom';

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

const POSITIONS = [
  'Setter',
  'Libero',
  'Outside Hitter',
  'Middle Blocker',
  'Opposite Hitter'
];

const PlayerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    school: '',
    primaryPosition: '',
    secondaryPosition: '',
    previousClub: '',
    preferredTryoutDate: '',
    additionalNotes: '',
    tryingOutFor: [] as string[]
  });

  const calculateAgeGroup = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const gender = formData.firstName.toLowerCase().startsWith('mr') ? 'Boys' : 'Girls';
    
    if (age <= 15) return `${gender} U15`;
    if (age <= 16) return `${gender} U16`;
    if (age <= 17) return `${gender} U17`;
    return `${gender} U18`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const playerData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        school: formData.school,
        primaryPosition: formData.primaryPosition,
        secondaryPosition: formData.secondaryPosition,
        previousClub: formData.previousClub || 'None',
        preferredTryoutDate: formData.preferredTryoutDate,
        additionalNotes: formData.additionalNotes,
        tryingOutFor: formData.tryingOutFor,
        ageGroup: calculateAgeGroup(formData.birthDate),
        registrationDate: new Date(),
        status: 'pending',
        rating: 0,
        assessments: {},
      };

      await addPlayer(playerData);
      navigate('/database', { 
        state: { 
          message: 'Registration successful! Your information has been added to our database.' 
        } 
      });
    } catch (err) {
      console.error('Error registering player:', err);
      setError('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    setFormData(prev => ({
      ...prev,
      tryingOutFor: prev.tryingOutFor.includes(ageGroup)
        ? prev.tryingOutFor.filter(group => group !== ageGroup)
        : [...prev.tryingOutFor, ageGroup]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tryout Registration</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">School</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Position</label>
              <select
                name="primaryPosition"
                value={formData.primaryPosition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Primary Position</option>
                {POSITIONS.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Position</label>
              <select
                name="secondaryPosition"
                value={formData.secondaryPosition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Secondary Position</option>
                {POSITIONS.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Previous Club</label>
            <input
              type="text"
              name="previousClub"
              value={formData.previousClub}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trying out for
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUPS.map((ageGroup) => (
                <label
                  key={ageGroup}
                  className="relative flex items-center p-3 rounded-lg border cursor-pointer focus:outline-none"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.tryingOutFor.includes(ageGroup)}
                    onChange={() => handleAgeGroupChange(ageGroup)}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {ageGroup}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Tryout Date</label>
            <input
              type="date"
              name="preferredTryoutDate"
              value={formData.preferredTryoutDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anything else we should know?
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Tell us about any additional information that might be relevant..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || formData.tryingOutFor.length === 0}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Submit Registration
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerRegistration;