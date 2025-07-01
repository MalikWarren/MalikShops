import axios from 'axios';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'wnba-api.p.rapidapi.com';

// Base configuration for all API requests
const apiConfig = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
};

// Cache directory setup
const CACHE_DIR = path.join(__dirname, '../data/cache');
const API_CALLS_LOG_FILE = path.join(CACHE_DIR, 'api_calls.json');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, {recursive: true});
}

// API call tracking
let apiCalls = {calls: [], total: 0, lastReset: new Date().toISOString()};

// Load API calls log
try {
  if (fs.existsSync(API_CALLS_LOG_FILE)) {
    const data = fs.readFileSync(API_CALLS_LOG_FILE, 'utf8');
    apiCalls = JSON.parse(data);
  }
} catch (error) {
  console.error('Error loading API calls log:', error.message);
}

// Log API call
const logApiCall = (endpoint) => {
  const now = new Date();
  apiCalls.calls.push({
    endpoint,
    timestamp: now.toISOString(),
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  // Reset counter if it's a new month
  const lastReset = new Date(apiCalls.lastReset);
  if (
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  ) {
    apiCalls.calls = [];
    apiCalls.lastReset = now.toISOString();
  }

  apiCalls.total = apiCalls.calls.length;

  try {
    fs.writeFileSync(API_CALLS_LOG_FILE, JSON.stringify(apiCalls, null, 2));
  } catch (error) {
    console.error('Error saving API calls log:', error.message);
  }

  console.log(`API Call #${apiCalls.total}/100: ${endpoint}`);

  if (apiCalls.total >= 95) {
    console.warn('⚠️  WARNING: Approaching API limit (95/100 calls used)');
  }
};

// Check if we can make API call
const canMakeApiCall = () => {
  return apiCalls.total < 100;
};

// Helper function to make API requests
const makeApiRequest = async (endpoint, params = {}) => {
  if (!canMakeApiCall()) {
    throw new Error('API limit reached');
  }

  try {
    logApiCall(endpoint);
    const response = await axios.request({
      ...apiConfig,
      url: `https://${RAPIDAPI_HOST}${endpoint}`,
      params,
    });
    return response.data;
  } catch (error) {
    console.error(
      `API Error for ${endpoint}:`,
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

// ===== GAMES ENDPOINTS =====

// Get games by date
const getGamesByDate = async (date) => {
  return await makeApiRequest('/games', {date});
};

// Get game by ID
const getGameById = async (gameId) => {
  return await makeApiRequest(`/games/${gameId}`);
};

// Get game play-by-play
const getGamePlayByPlay = async (gameId) => {
  return await makeApiRequest(`/games/${gameId}/play-by-play`);
};

// Get game box score
const getGameBoxScore = async (gameId) => {
  return await makeApiRequest(`/games/${gameId}/box-score`);
};

// Get game summary
const getGameSummary = async (gameId) => {
  return await makeApiRequest(`/games/${gameId}/summary`);
};

// ===== SCHEDULE ENDPOINTS =====

// Get schedule
const getSchedule = async (season = '2024') => {
  return await makeApiRequest('/schedule', {season});
};

// Get schedule by date
const getScheduleByDate = async (date) => {
  return await makeApiRequest('/schedule', {date});
};

// ===== STANDINGS ENDPOINTS =====

// Get standings
const getStandings = async (season = '2024') => {
  return await makeApiRequest('/standings', {season});
};

// Get standings by date
const getStandingsByDate = async (date) => {
  return await makeApiRequest('/standings', {date});
};

// ===== TEAMS ENDPOINTS =====

// Get all teams
const getTeams = async () => {
  return await makeApiRequest('/team/id', {limit: '70'});
};

// Get team by ID
const getTeamById = async (teamId) => {
  return await makeApiRequest(`/team/id`, {id: teamId});
};

// ===== PLAYERS ENDPOINTS =====

// Get players by team ID
const getPlayersByTeamId = async (teamId) => {
  return await makeApiRequest('/players/id', {teamId: teamId});
};

// Get all players
const getPlayers = async () => {
  try {
    const teams = await getTeams();
    let allPlayers = [];

    if (teams && Array.isArray(teams)) {
      for (const team of teams) {
        if (team.id) {
          try {
            const teamPlayers = await getPlayersByTeamId(team.id);
            if (teamPlayers && Array.isArray(teamPlayers)) {
              allPlayers = allPlayers.concat(teamPlayers);
            }
          } catch (error) {
            console.log(
              `Error fetching players for team ${team.id}:`,
              error.message
            );
          }
        }
      }
    }

    return allPlayers;
  } catch (error) {
    console.error('Error fetching all players:', error.message);
    return [];
  }
};

// Search players by name
const searchPlayers = async (query) => {
  try {
    const allPlayers = await getPlayers();
    if (!allPlayers || !Array.isArray(allPlayers)) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    return allPlayers.filter(
      (player) => player.name && player.name.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching players:', error.message);
    return [];
  }
};

// Get player by ID
const getPlayerById = async (playerId) => {
  return await makeApiRequest('/player', {playerID: playerId});
};

// Get player stats
const getPlayerStats = async (playerId, season = '2024') => {
  return await makeApiRequest('/player-statistic', {playerID: playerId});
};

// ===== TEAM ROSTER ENDPOINTS =====

// Get team roster
const getTeamRoster = async (teamId) => {
  return await getPlayersByTeamId(teamId);
};

// Get team stats
const getTeamStats = async (teamId, season = '2024') => {
  return await makeApiRequest(`/teams/${teamId}/stats`, {season});
};

// ===== INJURIES ENDPOINTS =====

// Get all injuries
const getInjuries = async () => {
  return await makeApiRequest('/injuries');
};

// Get injuries by team
const getInjuriesByTeam = async (teamId) => {
  return await makeApiRequest('/injuries', {team: teamId});
};

// ===== TRANSACTIONS ENDPOINTS =====

// Get all transactions
const getTransactions = async () => {
  return await makeApiRequest('/transactions');
};

// Get transactions by team
const getTransactionsByTeam = async (teamId) => {
  return await makeApiRequest('/transactions', {team: teamId});
};

// ===== STATS ENDPOINTS =====

// Get league leaders
const getLeagueLeaders = async (category, season = '2024') => {
  return await makeApiRequest('/stats/leaders', {category, season});
};

// Get team leaders
const getTeamLeaders = async (teamId, category, season = '2024') => {
  return await makeApiRequest(`/stats/leaders/${teamId}`, {category, season});
};

// ===== NEWS ENDPOINTS =====

// Get news
const getNews = async () => {
  return await makeApiRequest('/news');
};

// Get news by team
const getNewsByTeam = async (teamId) => {
  return await makeApiRequest('/news', {team: teamId});
};

// ===== ADVANCED STATS ENDPOINTS =====

// Get advanced stats for player
const getAdvancedStats = async (playerId, season = '2024') => {
  return await makeApiRequest(`/stats/advanced/${playerId}`, {season});
};

// Get advanced stats for team
const getTeamAdvancedStats = async (teamId, season = '2024') => {
  return await makeApiRequest(`/stats/advanced/team/${teamId}`, {season});
};

// ===== SEASON ENDPOINTS =====

// Get season info
const getSeasonInfo = async (season = '2024') => {
  return await makeApiRequest('/season', {season});
};

// Get season awards
const getSeasonAwards = async (season = '2024') => {
  return await makeApiRequest('/season/awards', {season});
};

// ===== SEARCH ENDPOINTS =====

// Search teams
const searchTeams = async (query) => {
  return await makeApiRequest('/search/teams', {q: query});
};

// ===== MOCK DATA FOR FALLBACK =====

const mockPlayerData = {
  id: 'mock-player-1',
  name: 'Mock Player',
  team: 'Mock Team',
  position: 'G',
  jersey_number: '23',
  height: '6-0',
  weight: '170',
  college: 'Mock University',
  stats: {
    points_per_game: 15.5,
    rebounds_per_game: 4.2,
    assists_per_game: 3.8,
    steals_per_game: 1.2,
    blocks_per_game: 0.3,
    field_goal_percentage: 0.425,
    three_point_percentage: 0.35,
    free_throw_percentage: 0.85,
  },
};

const mockTeamData = {
  id: 'mock-team-1',
  name: 'Mock Team',
  city: 'Mock City',
  conference: 'Eastern',
  division: 'Atlantic',
  wins: 25,
  losses: 15,
  win_percentage: 0.625,
};

// ===== ENHANCED METHODS WITH FALLBACK =====

// Get player with fallback
const getPlayerWithFallback = async (playerId) => {
  try {
    const player = await getPlayerById(playerId);
    return player;
  } catch (error) {
    console.log(`Using mock data for player ${playerId}`);
    return {...mockPlayerData, id: playerId};
  }
};

// Get player stats with fallback
const getPlayerStatsWithFallback = async (playerId, season = '2024') => {
  try {
    const stats = await getPlayerStats(playerId, season);
    return stats;
  } catch (error) {
    console.log(`Using mock stats for player ${playerId}`);
    return mockPlayerData.stats;
  }
};

// Get team with fallback
const getTeamWithFallback = async (teamId) => {
  try {
    const team = await getTeamById(teamId);
    return team;
  } catch (error) {
    console.log(`Using mock data for team ${teamId}`);
    return {...mockTeamData, id: teamId};
  }
};

// Get team roster with fallback
const getTeamRosterWithFallback = async (teamId) => {
  try {
    const roster = await getTeamRoster(teamId);
    return roster;
  } catch (error) {
    console.log(`Using mock roster for team ${teamId}`);
    return [
      {...mockPlayerData, id: 'mock-player-1'},
      {...mockPlayerData, id: 'mock-player-2', name: 'Mock Player 2'},
      {...mockPlayerData, id: 'mock-player-3', name: 'Mock Player 3'},
    ];
  }
};

// Get games with fallback
const getGamesWithFallback = async (date) => {
  try {
    const games = await getGamesByDate(date);
    return games;
  } catch (error) {
    console.log(`Using mock games for date ${date}`);
    return [
      {
        id: 'mock-game-1',
        home_team: 'Mock Home Team',
        away_team: 'Mock Away Team',
        date: date,
        status: 'Final',
        home_score: 85,
        away_score: 78,
      },
    ];
  }
};

// ===== UTILITY METHODS =====

// Get API usage stats
const getApiUsageStats = () => {
  return {
    total: apiCalls.total,
    limit: 100,
    remaining: 100 - apiCalls.total,
    lastReset: apiCalls.lastReset,
  };
};

// Clear cache
const clearCache = () => {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    files.forEach((file) => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    });
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error.message);
  }
};

export {
  // Direct API methods
  getTeams,
  getTeamById,
  getPlayers,
  getPlayersByTeamId,
  getPlayerById,
  getPlayerStats,
  getTeamRoster,
  getGamesByDate,
  getGameById,
  getGamePlayByPlay,
  getGameBoxScore,
  getGameSummary,
  getSchedule,
  getScheduleByDate,
  getStandings,
  getStandingsByDate,
  getTeamStats,
  getInjuries,
  getInjuriesByTeam,
  getTransactions,
  getTransactionsByTeam,
  getLeagueLeaders,
  getTeamLeaders,
  getNews,
  getNewsByTeam,
  getAdvancedStats,
  getTeamAdvancedStats,
  getSeasonInfo,
  getSeasonAwards,
  searchPlayers,
  searchTeams,

  // Methods with fallback
  getPlayerWithFallback,
  getPlayerStatsWithFallback,
  getTeamWithFallback,
  getTeamRosterWithFallback,
  getGamesWithFallback,

  // Utility methods
  getApiUsageStats,
  clearCache,

  // Mock data
  mockPlayerData,
  mockTeamData,
};
