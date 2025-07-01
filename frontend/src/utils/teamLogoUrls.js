// WNBA Team Colors and Logo URLs
export const TEAM_COLORS = {
  'Atlanta Dream': {
    primary: '#e53e3e',
    secondary: '#fed7d7',
    accent: '#c53030',
  },
  'Chicago Sky': {
    primary: '#3182ce',
    secondary: '#bee3f8',
    accent: '#2c5282',
  },
  'Connecticut Sun': {
    primary: '#f6ad55',
    secondary: '#fef5e7',
    accent: '#c05621',
  },
  'Dallas Wings': {
    primary: '#9f7aea',
    secondary: '#e9d8fd',
    accent: '#553c9a',
  },
  'Golden State Valkyries': {
    primary: '#f56565',
    secondary: '#fed7d7',
    accent: '#c53030',
  },
  'Indiana Fever': {
    primary: '#ed8936',
    secondary: '#fef5e7',
    accent: '#c05621',
  },
  'Las Vegas Aces': {
    primary: '#38b2ac',
    secondary: '#b2f5ea',
    accent: '#2c7a7b',
  },
  'Los Angeles Sparks': {
    primary: '#ed64a6',
    secondary: '#fed7e2',
    accent: '#b83280',
  },
  'Minnesota Lynx': {
    primary: '#4299e1',
    secondary: '#bee3f8',
    accent: '#2b6cb0',
  },
  'New York Liberty': {
    primary: '#48bb78',
    secondary: '#c6f6d5',
    accent: '#2f855a',
  },
  'Phoenix Mercury': {
    primary: '#ed8936',
    secondary: '#fef5e7',
    accent: '#c05621',
  },
  'Seattle Storm': {
    primary: '#805ad5',
    secondary: '#e9d8fd',
    accent: '#553c9a',
  },
  'Washington Mystics': {
    primary: '#e53e3e',
    secondary: '#fed7d7',
    accent: '#c53030',
  },
};

export const TEAM_LOGOS = {
  'Atlanta Dream': '/images/teams/atlanta-dream.png',
  'Chicago Sky': '/images/teams/chicago-sky.png',
  'Connecticut Sun': '/images/teams/connecticut-sun.png',
  'Dallas Wings': '/images/teams/dallas-wings.png',
  'Golden State Valkyries': '/images/teams/golden-state-valkyries.png',
  'Indiana Fever': '/images/teams/indiana-fever.png',
  'Las Vegas Aces': '/images/teams/las-vegas-aces.png',
  'Los Angeles Sparks': '/images/teams/los-angeles-sparks.png',
  'Minnesota Lynx': '/images/teams/minnesota-lynx.png',
  'New York Liberty': '/images/teams/new-york-liberty.png',
  'Phoenix Mercury': '/images/teams/phoenix-mercury.png',
  'Seattle Storm': '/images/teams/seattle-storm.png',
  'Washington Mystics': '/images/teams/washington-mystics.png',
};

export const TEAM_HEADSHOTS = {
  'Atlanta Dream': '/images/headshots/atlanta-dream/',
  'Chicago Sky': '/images/headshots/chicago-sky/',
  'Connecticut Sun': '/images/headshots/connecticut-sun/',
  'Dallas Wings': '/images/headshots/dallas-wings/',
  'Golden State Valkyries': '/images/headshots/golden-state-valkyries/',
  'Indiana Fever': '/images/headshots/indiana-fever/',
  'Las Vegas Aces': '/images/headshots/las-vegas-aces/',
  'Los Angeles Sparks': '/images/headshots/los-angeles-sparks/',
  'Minnesota Lynx': '/images/headshots/minnesota-lynx/',
  'New York Liberty': '/images/headshots/new-york-liberty/',
  'Phoenix Mercury': '/images/headshots/phoenix-mercury/',
  'Seattle Storm': '/images/headshots/seattle-storm/',
  'Washington Mystics': '/images/headshots/washington-mystics/',
};

// Helper function to get team colors
export const getTeamColors = (teamName) => {
  return (
    TEAM_COLORS[teamName] || {
      primary: '#6b7280',
      secondary: '#f3f4f6',
      accent: '#374151',
    }
  );
};

// Helper function to get team logo URL
export const getTeamLogo = (teamName) => {
  return TEAM_LOGOS[teamName] || '/images/teams/default-team.png';
};

// Helper function to get team headshots directory
export const getTeamHeadshotsDir = (teamName) => {
  return TEAM_HEADSHOTS[teamName] || '/images/headshots/default/';
};

// Helper function to format team name for URLs
export const formatTeamNameForUrl = (teamName) => {
  return teamName.toLowerCase().replace(/\s+/g, '-');
};

// Helper function to get team name from URL format
export const getTeamNameFromUrl = (teamUrl) => {
  return teamUrl
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Team information
export const TEAM_INFO = {
  'Atlanta Dream': {
    founded: 2008,
    arena: 'Gateway Center Arena',
    location: 'Atlanta, Georgia',
    conference: 'Eastern',
  },
  'Chicago Sky': {
    founded: 2006,
    arena: 'Wintrust Arena',
    location: 'Chicago, Illinois',
    conference: 'Eastern',
  },
  'Connecticut Sun': {
    founded: 1999,
    arena: 'Mohegan Sun Arena',
    location: 'Uncasville, Connecticut',
    conference: 'Eastern',
  },
  'Dallas Wings': {
    founded: 1998,
    arena: 'College Park Center',
    location: 'Arlington, Texas',
    conference: 'Western',
  },
  'Golden State Valkyries': {
    founded: 2025,
    arena: 'Chase Center',
    location: 'San Francisco, California',
    conference: 'Western',
  },
  'Indiana Fever': {
    founded: 2000,
    arena: 'Gainbridge Fieldhouse',
    location: 'Indianapolis, Indiana',
    conference: 'Eastern',
  },
  'Las Vegas Aces': {
    founded: 1997,
    arena: 'Michelob ULTRA Arena',
    location: 'Las Vegas, Nevada',
    conference: 'Western',
  },
  'Los Angeles Sparks': {
    founded: 1997,
    arena: 'Crypto.com Arena',
    location: 'Los Angeles, California',
    conference: 'Western',
  },
  'Minnesota Lynx': {
    founded: 1999,
    arena: 'Target Center',
    location: 'Minneapolis, Minnesota',
    conference: 'Western',
  },
  'New York Liberty': {
    founded: 1997,
    arena: 'Barclays Center',
    location: 'Brooklyn, New York',
    conference: 'Eastern',
  },
  'Phoenix Mercury': {
    founded: 1997,
    arena: 'Footprint Center',
    location: 'Phoenix, Arizona',
    conference: 'Western',
  },
  'Seattle Storm': {
    founded: 2000,
    arena: 'Climate Pledge Arena',
    location: 'Seattle, Washington',
    conference: 'Western',
  },
  'Washington Mystics': {
    founded: 1998,
    arena: 'Entertainment & Sports Arena',
    location: 'Washington, D.C.',
    conference: 'Eastern',
  },
};

export default {
  TEAM_COLORS,
  TEAM_LOGOS,
  TEAM_HEADSHOTS,
  TEAM_INFO,
  getTeamColors,
  getTeamLogo,
  getTeamHeadshotsDir,
  formatTeamNameForUrl,
  getTeamNameFromUrl,
};
