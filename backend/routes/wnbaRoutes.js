import express from 'express';
import {
  getAllTeams,
  getAllPlayers,
  getPlayerById,
  getPlayerStats,
  searchPlayers,
  getTeamRoster,
  getTeamById,
  getGameById,
  getGamesByDate,
  getGamePlayByPlay,
  getGameBoxScore,
  getGameSummary,
  getSchedule,
  getStandings,
  getInjuries,
  getTransactions,
  getLeagueLeaders,
  getNews,
  getApiUsage,
  clearCache,
} from '../controllers/wnbaController.js';

const router = express.Router();

// API Usage and Cache Management
router.get('/usage', getApiUsage);
router.post('/clear-cache', clearCache);

// Teams routes
router.get('/teams', getAllTeams);
router.get('/teams/:teamId', getTeamById);
router.get('/teams/:teamId/roster', getTeamRoster);

// Players routes
router.get('/players', getAllPlayers);
router.get('/players/:id', getPlayerById);
router.get('/players/:id/stats', getPlayerStats);
router.get('/players/search/:query', searchPlayers);

// Games routes
router.get('/games/:id', getGameById);
router.get('/games/date/:date', getGamesByDate);
router.get('/games/:id/play-by-play', getGamePlayByPlay);
router.get('/games/:id/box-score', getGameBoxScore);
router.get('/games/:id/summary', getGameSummary);

// Schedule and Standings
router.get('/schedule', getSchedule);
router.get('/standings', getStandings);

// Stats and Leaders
router.get('/leaders', getLeagueLeaders);

// News and Information
router.get('/news', getNews);
router.get('/injuries', getInjuries);
router.get('/transactions', getTransactions);

export default router;
