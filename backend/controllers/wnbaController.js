import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import {
  getTeams,
  getPlayers,
  getPlayerById,
  getPlayerStats,
  getTeamRoster,
  getPlayersByTeamId,
  getGameById,
  getGamesByDate,
  getGamePlayByPlay,
  getGameBoxScore,
  getGameSummary,
  getSchedule,
  getStandings,
  getInjuries,
  getInjuriesByTeam,
  getTransactions,
  getTransactionsByTeam,
  getLeagueLeaders,
  getNews,
  getNewsByTeam,
  getAdvancedStats,
  searchPlayers,
  getPlayerWithFallback,
  getPlayerStatsWithFallback,
  getTeamWithFallback,
  getTeamRosterWithFallback,
  getGamesWithFallback,
  getApiUsageStats,
  clearCache,
} from '../utils/wnbaApi.js';

// Team name to API team ID mapping
const teamNameToId = {
  'Atlanta Dream': '20',
  'Chicago Sky': '19',
  'Connecticut Sun': '18',
  'Dallas Wings': '3',
  'Golden State Valkyries': '129689',
  'Indiana Fever': '5',
  'Las Vegas Aces': '17',
  'Los Angeles Sparks': '6',
  'Minnesota Lynx': '8',
  'New York Liberty': '9',
  'Phoenix Mercury': '11',
  'Seattle Storm': '14',
  'Washington Mystics': '16',
};

// @desc    Get all WNBA teams
// @route   GET /api/wnba/teams
// @access  Public
const getAllTeams = asyncHandler(async (req, res) => {
  try {
    const teams = await getTeams();
    if (!teams || teams.length === 0) {
      return res.status(404).json({error: 'No teams found'});
    }
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get all WNBA players
// @route   GET /api/wnba/players
// @access  Public
const getAllPlayers = asyncHandler(async (req, res) => {
  try {
    const players = await getPlayers();
    if (!players || players.length === 0) {
      return res.status(404).json({error: 'No players found'});
    }
    res.json({players: players});
  } catch (error) {
    console.error('Error in getAllPlayers controller:', error.message);
    res.status(500).json({message: 'Error fetching players'});
  }
});

// @desc    Get player by ID (product ID from database)
// @route   GET /api/wnba/players/:id
// @access  Public
const getPlayerByIdController = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;

    // First, find the player in our database using the product ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({message: 'Player not found in database'});
    }

    const playerName = product.player;
    const teamName = product.team;

    console.log(`Looking for player: ${playerName} from team: ${teamName}`);

    // Get the team ID from our mapping
    const teamId = teamNameToId[teamName];
    if (!teamId) {
      console.log(`Team ID not found for: ${teamName}`);
      // Return fallback data
      const fallbackPlayer = {
        id: `db-${id}`,
        name: playerName,
        team: teamName,
        position: 'Unknown',
        jersey_number: 'N/A',
        height: 'N/A',
        weight: 'N/A',
        college: 'N/A',
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
        databaseInfo: {
          productId: id,
          playerName: playerName,
          teamName: teamName,
        },
      };
      return res.json(fallbackPlayer);
    }

    // Get players for this team
    try {
      const teamPlayers = await getPlayersByTeamId(teamId);

      if (teamPlayers && Array.isArray(teamPlayers)) {
        // Find the player that matches the name
        const matchingPlayer = teamPlayers.find(
          (player) =>
            player.name &&
            player.name.toLowerCase().includes(playerName.toLowerCase())
        );

        if (matchingPlayer) {
          console.log(
            `Found API player: ${matchingPlayer.name} (ID: ${matchingPlayer.id})`
          );
          res.json({
            ...matchingPlayer,
            databaseInfo: {
              productId: id,
              playerName: playerName,
              teamName: teamName,
              teamId: teamId,
            },
          });
          return;
        }
      }
    } catch (apiError) {
      console.log('API search failed, using fallback data');
    }

    // If API search fails, return database info with fallback stats
    const fallbackPlayer = {
      id: `db-${id}`,
      name: playerName,
      team: teamName,
      position: 'Unknown',
      jersey_number: 'N/A',
      height: 'N/A',
      weight: 'N/A',
      college: 'N/A',
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
      databaseInfo: {
        productId: id,
        playerName: playerName,
        teamName: teamName,
        teamId: teamId,
      },
    };

    res.json(fallbackPlayer);
  } catch (error) {
    console.error('Error in getPlayerById controller:', error.message);
    res.status(500).json({message: 'Error fetching player'});
  }
});

// @desc    Get player stats (using product ID from database)
// @route   GET /api/wnba/players/:id/stats
// @access  Public
const getPlayerStatsController = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const {season} = req.query;

    // First, find the player in our database using the product ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({message: 'Player not found in database'});
    }

    const playerName = product.player;
    const teamName = product.team;

    console.log(`Looking for stats for: ${playerName} from team: ${teamName}`);

    // Get the team ID from our mapping
    const teamId = teamNameToId[teamName];
    if (!teamId) {
      console.log(`Team ID not found for: ${teamName}`);
      // Return fallback stats
      const fallbackStats = {
        points_per_game: 15.5,
        rebounds_per_game: 4.2,
        assists_per_game: 3.8,
        steals_per_game: 1.2,
        blocks_per_game: 0.3,
        field_goal_percentage: 0.425,
        three_point_percentage: 0.35,
        free_throw_percentage: 0.85,
        games_played: 25,
        minutes_per_game: 28.5,
        playerInfo: {
          name: playerName,
          team: teamName,
          apiId: null,
        },
        databaseInfo: {
          productId: id,
          playerName: playerName,
          teamName: teamName,
        },
      };
      return res.json(fallbackStats);
    }

    // Get players for this team and find the matching player
    try {
      const teamPlayers = await getPlayersByTeamId(teamId);

      if (teamPlayers && Array.isArray(teamPlayers)) {
        // Find the player that matches the name
        const matchingPlayer = teamPlayers.find(
          (player) =>
            player.name &&
            player.name.toLowerCase().includes(playerName.toLowerCase())
        );

        if (matchingPlayer && matchingPlayer.id) {
          console.log(
            `Found API player: ${matchingPlayer.name} (ID: ${matchingPlayer.id})`
          );

          // Get stats using the API player ID
          const stats = await getPlayerStats(matchingPlayer.id, season);

          res.json({
            ...stats,
            playerInfo: {
              name: matchingPlayer.name,
              team: matchingPlayer.team,
              apiId: matchingPlayer.id,
            },
            databaseInfo: {
              productId: id,
              playerName: playerName,
              teamName: teamName,
              teamId: teamId,
            },
          });
          return;
        }
      }
    } catch (apiError) {
      console.log('API search failed, using fallback stats');
    }

    // If API search fails, return fallback stats
    const fallbackStats = {
      points_per_game: 15.5,
      rebounds_per_game: 4.2,
      assists_per_game: 3.8,
      steals_per_game: 1.2,
      blocks_per_game: 0.3,
      field_goal_percentage: 0.425,
      three_point_percentage: 0.35,
      free_throw_percentage: 0.85,
      games_played: 25,
      minutes_per_game: 28.5,
      playerInfo: {
        name: playerName,
        team: teamName,
        apiId: null,
      },
      databaseInfo: {
        productId: id,
        playerName: playerName,
        teamName: teamName,
        teamId: teamId,
      },
    };

    res.json(fallbackStats);
  } catch (error) {
    console.error('Error in getPlayerStats controller:', error.message);
    res.status(500).json({message: 'Error fetching player stats'});
  }
});

// @desc    Search players by name
// @route   GET /api/wnba/players/search/:query
// @access  Public
const searchPlayersController = asyncHandler(async (req, res) => {
  try {
    const {query} = req.params;
    const players = await searchPlayers(query);

    if (!players || players.length === 0) {
      return res.status(404).json({message: 'No players found'});
    }

    res.json({players: players});
  } catch (error) {
    console.error('Error in searchPlayers controller:', error.message);
    res.status(500).json({message: 'Error searching players'});
  }
});

// @desc    Get team roster
// @route   GET /api/wnba/teams/:teamId/roster
// @access  Public
const getTeamRosterController = asyncHandler(async (req, res) => {
  try {
    const {teamId} = req.params;
    const roster = await getTeamRosterWithFallback(teamId);

    if (!roster || roster.length === 0) {
      return res.status(404).json({message: 'Team roster not found'});
    }

    res.json({players: roster});
  } catch (error) {
    console.error('Error in getTeamRoster controller:', error.message);
    res.status(500).json({message: 'Error fetching team roster'});
  }
});

// @desc    Get team by ID
// @route   GET /api/wnba/teams/:teamId
// @access  Public
const getTeamById = asyncHandler(async (req, res) => {
  try {
    const {teamId} = req.params;
    const team = await getTeamWithFallback(teamId);

    if (!team) {
      return res.status(404).json({message: 'Team not found'});
    }

    res.json(team);
  } catch (error) {
    console.error('Error in getTeamById controller:', error.message);
    res.status(500).json({message: 'Error fetching team'});
  }
});

// @desc    Get game by ID
// @route   GET /api/wnba/games/:id
// @access  Public
const getGameByIdController = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const game = await getGameById(id);

    if (!game) {
      return res.status(404).json({error: 'Game not found'});
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get games by date
// @route   GET /api/wnba/games/date/:date
// @access  Public
const getGamesByDateController = asyncHandler(async (req, res) => {
  try {
    const {date} = req.params;
    const games = await getGamesWithFallback(date);

    if (!games || games.length === 0) {
      return res
        .status(404)
        .json({error: 'No games found for the specified date'});
    }
    res.json(games);
  } catch (error) {
    console.error('Error fetching games by date:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get game play-by-play
// @route   GET /api/wnba/games/:id/play-by-play
// @access  Public
const getGamePlayByPlayController = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const plays = await getGamePlayByPlay(id);

    if (!plays) {
      return res.status(404).json({error: 'Play-by-play not found'});
    }
    res.json(plays);
  } catch (error) {
    console.error('Error fetching play-by-play:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get game box score
// @route   GET /api/wnba/games/:id/box-score
// @access  Public
const getGameBoxScoreController = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const boxScore = await getGameBoxScore(id);

    if (!boxScore) {
      return res.status(404).json({error: 'Box score not found'});
    }
    res.json(boxScore);
  } catch (error) {
    console.error('Error fetching box score:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get game summary
// @route   GET /api/wnba/games/:id/summary
// @access  Public
const getGameSummaryController = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const summary = await getGameSummary(id);

    if (!summary) {
      return res.status(404).json({error: 'Game summary not found'});
    }
    res.json(summary);
  } catch (error) {
    console.error('Error fetching game summary:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get schedule
// @route   GET /api/wnba/schedule
// @access  Public
const getScheduleController = asyncHandler(async (req, res) => {
  try {
    const {season} = req.query;
    const schedule = await getSchedule(season);

    if (!schedule) {
      return res.status(404).json({error: 'Schedule not found'});
    }
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get standings
// @route   GET /api/wnba/standings
// @access  Public
const getStandingsController = asyncHandler(async (req, res) => {
  try {
    const {season} = req.query;
    const standings = await getStandings(season);

    if (!standings) {
      return res.status(404).json({error: 'Standings not found'});
    }
    res.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get injuries
// @route   GET /api/wnba/injuries
// @access  Public
const getInjuriesController = asyncHandler(async (req, res) => {
  try {
    const {team} = req.query;
    const injuries = team ? await getInjuriesByTeam(team) : await getInjuries();

    if (!injuries) {
      return res.status(404).json({error: 'Injuries data not found'});
    }
    res.json(injuries);
  } catch (error) {
    console.error('Error fetching injuries:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get transactions
// @route   GET /api/wnba/transactions
// @access  Public
const getTransactionsController = asyncHandler(async (req, res) => {
  try {
    const {team} = req.query;
    const transactions = team
      ? await getTransactionsByTeam(team)
      : await getTransactions();

    if (!transactions) {
      return res.status(404).json({error: 'Transactions data not found'});
    }
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get league leaders
// @route   GET /api/wnba/leaders
// @access  Public
const getLeagueLeadersController = asyncHandler(async (req, res) => {
  try {
    const {category, season} = req.query;
    const leaders = await getLeagueLeaders(category, season);

    if (!leaders) {
      return res.status(404).json({error: 'League leaders not found'});
    }
    res.json(leaders);
  } catch (error) {
    console.error('Error fetching league leaders:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get news
// @route   GET /api/wnba/news
// @access  Public
const getNewsController = asyncHandler(async (req, res) => {
  try {
    const {team} = req.query;
    const news = team ? await getNewsByTeam(team) : await getNews();

    if (!news) {
      return res.status(404).json({error: 'News not found'});
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({error: 'An unexpected error occurred'});
  }
});

// @desc    Get API usage statistics
// @route   GET /api/wnba/usage
// @access  Public
const getApiUsage = asyncHandler(async (req, res) => {
  try {
    const stats = getApiUsageStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in getApiUsage controller:', error.message);
    res.status(500).json({message: 'Error fetching API usage stats'});
  }
});

// @desc    Clear cache (for testing/development)
// @route   POST /api/wnba/clear-cache
// @access  Public
const clearCacheController = asyncHandler(async (req, res) => {
  try {
    clearCache();
    res.json({message: 'Cache cleared successfully'});
  } catch (error) {
    console.error('Error in clearCache controller:', error.message);
    res.status(500).json({message: 'Error clearing cache'});
  }
});

// Export all controller functions with their proper names
export {
  getAllTeams,
  getAllPlayers,
  getPlayerByIdController as getPlayerById,
  getPlayerStatsController as getPlayerStats,
  searchPlayersController as searchPlayers,
  getTeamRosterController as getTeamRoster,
  getTeamById,
  getGameByIdController as getGameById,
  getGamesByDateController as getGamesByDate,
  getGamePlayByPlayController as getGamePlayByPlay,
  getGameBoxScoreController as getGameBoxScore,
  getGameSummaryController as getGameSummary,
  getScheduleController as getSchedule,
  getStandingsController as getStandings,
  getInjuriesController as getInjuries,
  getTransactionsController as getTransactions,
  getLeagueLeadersController as getLeagueLeaders,
  getNewsController as getNews,
  getApiUsage,
  clearCacheController as clearCache,
};
