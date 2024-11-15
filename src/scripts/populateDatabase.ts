import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mockPlayers } from '../data/mockPlayers';
import { mockTeams } from '../data/mockTeams';
import { todaysPlayers } from '../data/mockTodaysPlayers';

const populateDatabase = async () => {
  try {
    // Populate Players Collection
    console.log('Populating players collection...');
    for (const player of mockPlayers) {
      await addDoc(collection(db, 'players'), {
        name: player.name,
        position: player.position,
        age: player.age,
        ageGroup: player.ageGroup,
        height: player.height,
        rating: player.rating,
        previousTeam: player.previousTeam,
        assessments: player.assessments || {},
        createdAt: new Date()
      });
    }
    console.log('Players collection populated successfully');

    // Populate Teams Collection
    console.log('Populating teams collection...');
    for (const team of mockTeams) {
      await addDoc(collection(db, 'teams'), {
        name: team.name,
        owner: team.owner,
        headCoach: team.headCoach,
        ageGroup: team.ageGroup,
        players: team.players,
        createdAt: new Date()
      });
    }
    console.log('Teams collection populated successfully');

    // Populate Tryouts Collection
    console.log('Populating tryouts collection...');
    for (const ageGroup of todaysPlayers) {
      for (const wave of ageGroup.waves) {
        for (const player of wave.players) {
          await addDoc(collection(db, 'tryouts'), {
            playerId: player.id,
            name: player.name,
            position: player.position,
            team: player.team,
            ageGroup: player.ageGroup,
            wave: player.wave,
            tryoutTime: player.tryoutTime,
            date: new Date(),
            assessments: player.assessments || {},
            createdAt: new Date()
          });
        }
      }
    }
    console.log('Tryouts collection populated successfully');

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

// Execute the population
populateDatabase();