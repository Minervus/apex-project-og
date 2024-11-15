import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { Player } from '../types/player';

// Players Collection
export const addPlayer = async (playerData: Omit<Player, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'players'), playerData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const getPlayers = async (pageSize = 15, startAfterDoc = null): Promise<Player[]> => {
  try {
    let q = query(
      collection(db, 'players'),
      orderBy('name'),
      limit(pageSize)
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Player[];
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
};

export const getPlayerById = async (id: string): Promise<Player | null> => {
  try {
    const docRef = doc(db, 'players', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Player;
    }
    return null;
  } catch (error) {
    console.error('Error getting player:', error);
    throw error;
  }
};

// Teams Collection
export const addTeam = async (teamData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'teams'), teamData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding team:', error);
    throw error;
  }
};

export const getTeams = async (pageSize = 15, startAfterDoc = null) => {
  try {
    let q = query(
      collection(db, 'teams'),
      orderBy('name'),
      limit(pageSize)
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting teams:', error);
    throw error;
  }
};

// Assessments Collection
export const addAssessment = async (assessmentData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'assessments'), {
      ...assessmentData,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding assessment:', error);
    throw error;
  }
};

export const getPlayerAssessments = async (playerId: string) => {
  try {
    const q = query(
      collection(db, 'assessments'),
      where('playerId', '==', playerId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting player assessments:', error);
    throw error;
  }
};

// Tryouts Collection
export const getTodaysPlayers = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'tryouts'),
      where('date', '>=', today),
      where('date', '<', new Date(today.getTime() + 86400000))
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting today\'s players:', error);
    throw error;
  }
};

export const addTryoutRegistration = async (registrationData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'tryouts'), {
      ...registrationData,
      registrationDate: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding tryout registration:', error);
    throw error;
  }
};