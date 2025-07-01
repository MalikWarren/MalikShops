import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
  console.error('Missing RAPIDAPI_KEY or RAPIDAPI_HOST environment variables');
  process.exit(1);
}

const api = axios.create({
  baseURL: 'https://wnba-api.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
});

const discoverTeamIds = async () => {
  const teams = [];

  // Try different team ID ranges to find active WNBA teams
  for (let i = 1; i <= 20; i++) {
    try {
      console.log(`Testing team ID: ${i}`);
      const response = await api.get(`/wnbateamplayers`, {
        params: {teamid: i.toString()},
      });

      if (response.data && response.data.team) {
        const team = response.data.team;
        console.log(`Found team: ${team.displayName} (ID: ${i})`);
        console.log(`  Location: ${team.location}`);
        console.log(`  Abbreviation: ${team.abbreviation}`);
        console.log(`  Is Active: ${team.isActive}`);
        console.log(`  Players: ${team.athletes ? team.athletes.length : 0}`);

        teams.push({
          id: i,
          name: team.displayName,
          location: team.location,
          abbreviation: team.abbreviation,
          isActive: team.isActive,
          playerCount: team.athletes ? team.athletes.length : 0,
        });
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`Team ID ${i}: Not found`);
      } else {
        console.log(
          `Team ID ${i}: Error - ${
            error.response?.data?.error || error.message
          }`
        );
      }
    }
  }

  return teams;
};

const main = async () => {
  try {
    console.log('Discovering WNBA team IDs...');
    console.log(`Using API: ${RAPIDAPI_HOST}`);

    const teams = await discoverTeamIds();

    console.log('\n=== DISCOVERED TEAMS ===');
    teams.forEach((team) => {
      console.log(
        `${team.id}: ${team.location} ${team.name} (${team.abbreviation}) - Active: ${team.isActive} - Players: ${team.playerCount}`
      );
    });

    console.log('\n=== ACTIVE TEAMS ONLY ===');
    const activeTeams = teams.filter((team) => team.isActive);
    activeTeams.forEach((team) => {
      console.log(
        `${team.id}: ${team.location} ${team.name} (${team.abbreviation})`
      );
    });
  } catch (error) {
    console.error('Error in main function:', error);
  }
};

main();
