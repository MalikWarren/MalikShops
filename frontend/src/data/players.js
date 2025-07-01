const seattleJerseyNumbers = {
  'Alysha Clark': '21',
  'Nneka Ogwumike': '30',
  'Skylar Diggins': '4',
  'Erica Wheeler': '17',
  'Lexie Brown': '15',
  'Gabby Williams': '5',
  'Katie Lou Samuelson': '33',
  'Ezi Magbegor': '13',
  'Zia Cooke': '1',
  'Dominique Malonga': '25',
};

const positions = ['Guard', 'Forward', 'Center'];

const teams = {
  'Atlanta Dream': [
    'Rhyne Howard',
    'Maya Caldwell',
    'Allisha Gray',
    'Nia Coffey',
    'Brionna Jones',
    'Jordin Canada',
    'Brittney Griner',
    'Naz Hillmon',
    'Te-Hina Paopao',
    'Taylor Thierry',
    'Shatori Walker-Kimbrough',
  ],
  'Chicago Sky': [
    'Rebecca Allen',
    'Angel Reese',
    'Courtney Vandersloot',
    'Ariel Atkins',
    'Rachel Banham',
    'Kamilla Cardoso',
    'Moriah Jefferson',
    'Kia Nurse',
    'Michaela Onyenwere',
    'Hailey Van Lith',
    'Maddy Westbeld',
    'Elizabeth Williams',
  ],
  'Connecticut Sun': [
    'Lindsay Allen',
    'Jaelyn Brown',
    'Tina Charles',
    'Kariata Diaby',
    'Bria Hartley',
    'Leila Lacan',
    'Marina Mabrey',
    'Rayah Marshall',
    'Aneesah Morrow',
    'Olivia Nelson-Ododa',
    'Haley Peters',
    'Saniya Rivers',
    'Jacy Sheldon',
  ],
  'Dallas Wings': [
    'Paige Bueckers',
    'DiJonai Carrington',
    'Luisa Geiselsoder',
    'Tyasha Harris',
    'Myisha Hines-Allen',
    'Aziaha James',
    'Teaira McCowan',
    'Arike Ogunbowale',
    'JJ Quinerly',
    'Maddy Siegrist',
    'Li Yueru',
  ],
  'Golden State Valkyries': [
    'Laeticia Amihere',
    'Monique Billings',
    'Veronica Burton',
    'Kaitlyn Chen',
    'Temi Fagbenle',
    'Tiffany Hayes',
    'Carla Leite',
    'Kate Martin',
    'Janelle Salaun',
    'Stephanie Talbot',
    'Kayla Thornton',
    'Julie Vanloo',
    'Cecilia Zandalasini',
  ],
  'Indiana Fever': [
    'Aliyah Boston',
    'Caitlin Clark',
    'Sydney Colson',
    'Sophie Cunningham',
    'Damiris Dantas',
    'Natasha Howard',
    'Lexie Hull',
    'Kelsey Mitchell',
    'Makayla Timpson',
    'Brianna Turner',
  ],
  'Las Vegas Aces': [
    'Kierstan Bell',
    'Dana Evans',
    'Chelsea Gray',
    'Megan Gustafson',
    'Joyner Holmes',
    'Jewell Loyd',
    'Aaliyah Nye',
    'Cheyenne Parker-Tyus',
    'Kiah Stokes',
    "A'ja Wilson",
    'Jackie Young',
    'NaLyssa Smith',
  ],
  'Los Angeles Sparks': [
    'Julie Allemand',
    'Sarah Ashlee Barker',
    'Cameron Brink',
    'Rae Burrell',
    'Emma Cannon',
    'Sania Feagin',
    'Dearica Hamby',
    'Rickea Jackson',
    'Shey Peddy',
    'Kelsey Plum',
    'Mercedes Russell',
    'Odyssey Sims',
    'Azura Stevens',
  ],
  'Minnesota Lynx': [
    'Bridget Carleton',
    'Napheesa Collier',
    'Natisha Hiedeman',
    'Maria Kliundikova',
    'Anastasiia Olairi Kosu',
    'Kayla McBride',
    'Diamond Miller',
    'Alissa Pili',
    'Karlie Samuelson',
    'Jessica Shepard',
    'Alanna Smith',
    'Courtney Williams',
  ],
  'New York Liberty': [
    'Kennedy Burke',
    'Natasha Cloud',
    'Marquesha Davis',
    'Leonie Fiebich',
    'Rebekah Gardner',
    'Isabelle Harrison',
    'Sabrina Ionescu',
    'Marine Johannes',
    'Jonquel Jones',
    'Nyara Sabally',
    'Jaylyn Sherrod',
    'Breanna Stewart',
  ],
  'Phoenix Mercury': [
    'Monique Akoa Makani',
    'Kalani Brown',
    'Kahleah Copper',
    'Lexi Held',
    'Natasha Mack',
    'Murjanatu Musa',
    'Satou Sabally',
    'Alyssa Thomas',
    'Kathryn Westbeld',
    'Sami Whitcomb',
  ],
  'Seattle Storm': [
    'Lexie Brown',
    'Alysha Clark',
    'Zia Cooke',
    'Skylar Diggins',
    'Ezi Magbegor',
    'Dominique Malonga',
    'Nneka Ogwumike',
    'Katie Lou Samuelson',
    'Erica Wheeler',
    'Gabby Williams',
  ],
  'Washington Mystics': [
    'Georgia Amoore',
    'Shakira Austin',
    'Sonia Citron',
    'Stefanie Dolson',
    'Aaliyah Edwards',
    'Emily Engstler',
    'Kiki Iriafen',
    'Sika Kone',
    'Jade Melbourne',
    'Lucy Olsen',
    'Sug Sutton',
    'Brittney Sykes',
  ],
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const players = [];
// Realistic WNBA stat ranges based on actual player performance
function getRandomStat(min, max, decimals = 1) {
  return +(Math.random() * (max - min) + min).toFixed(decimals);
}

// Generate realistic stats based on player position and name
export function generateRealisticStats(playerName, team) {
  // Base stats for different positions
  const guardStats = {
    points: getRandomStat(8, 22, 1),
    rebounds: getRandomStat(2, 6, 1),
    assists: getRandomStat(3, 8, 1),
    steals: getRandomStat(0.5, 2.5, 1),
    blocks: getRandomStat(0.1, 1.2, 1),
    fgPct: getRandomStat(38, 52, 1),
    threePtPct: getRandomStat(28, 42, 1),
    ftPct: getRandomStat(75, 92, 1),
    games: getRandomStat(25, 40, 0),
    minutes: getRandomStat(22, 35, 1),
  };

  const forwardStats = {
    points: getRandomStat(10, 24, 1),
    rebounds: getRandomStat(4, 10, 1),
    assists: getRandomStat(1.5, 5, 1),
    steals: getRandomStat(0.8, 2.8, 1),
    blocks: getRandomStat(0.3, 2.5, 1),
    fgPct: getRandomStat(42, 58, 1),
    threePtPct: getRandomStat(25, 40, 1),
    ftPct: getRandomStat(70, 88, 1),
    games: getRandomStat(25, 40, 0),
    minutes: getRandomStat(24, 36, 1),
  };

  const centerStats = {
    points: getRandomStat(12, 26, 1),
    rebounds: getRandomStat(6, 14, 1),
    assists: getRandomStat(1, 4, 1),
    steals: getRandomStat(0.5, 2, 1),
    blocks: getRandomStat(0.8, 3.5, 1),
    fgPct: getRandomStat(45, 62, 1),
    threePtPct: getRandomStat(20, 35, 1),
    ftPct: getRandomStat(65, 85, 1),
    games: getRandomStat(25, 40, 0),
    minutes: getRandomStat(26, 38, 1),
  };

  // Special adjustments for known star players
  const starPlayers = {
    'Caitlin Clark': {
      points: getRandomStat(18, 25, 1),
      assists: getRandomStat(6, 10, 1),
      threePtPct: getRandomStat(35, 45, 1),
    },
    "A'ja Wilson": {
      points: getRandomStat(20, 28, 1),
      rebounds: getRandomStat(8, 12, 1),
      blocks: getRandomStat(1.5, 3.5, 1),
      fgPct: getRandomStat(50, 60, 1),
    },
    'Breanna Stewart': {
      points: getRandomStat(18, 26, 1),
      rebounds: getRandomStat(7, 11, 1),
      blocks: getRandomStat(1, 2.5, 1),
      fgPct: getRandomStat(45, 55, 1),
    },
    'Jewell Loyd': {
      points: getRandomStat(16, 24, 1),
      threePtPct: getRandomStat(32, 42, 1),
      ftPct: getRandomStat(80, 92, 1),
    },
    'Sabrina Ionescu': {
      points: getRandomStat(15, 22, 1),
      assists: getRandomStat(5, 9, 1),
      rebounds: getRandomStat(4, 7, 1),
      threePtPct: getRandomStat(30, 40, 1),
    },
    'Napheesa Collier': {
      points: getRandomStat(16, 24, 1),
      rebounds: getRandomStat(6, 10, 1),
      steals: getRandomStat(1.5, 3, 1),
      fgPct: getRandomStat(45, 55, 1),
    },
    'Arike Ogunbowale': {
      points: getRandomStat(18, 26, 1),
      assists: getRandomStat(3, 6, 1),
      steals: getRandomStat(1, 2.5, 1),
    },
    'Chelsea Gray': {
      points: getRandomStat(12, 18, 1),
      assists: getRandomStat(5, 8, 1),
      fgPct: getRandomStat(42, 52, 1),
    },
    'Skylar Diggins': {
      points: getRandomStat(15, 22, 1),
      assists: getRandomStat(4, 7, 1),
      threePtPct: getRandomStat(30, 40, 1),
    },
    'Nneka Ogwumike': {
      points: getRandomStat(14, 20, 1),
      rebounds: getRandomStat(6, 10, 1),
      fgPct: getRandomStat(48, 58, 1),
    },
  };

  // Determine position based on name patterns or random assignment
  let position;
  let baseStats;

  // Check if player is a known star
  if (starPlayers[playerName]) {
    // Use star player adjustments
    const starAdjustments = starPlayers[playerName];

    // Determine position for star players
    if (
      [
        'Caitlin Clark',
        'Sabrina Ionescu',
        'Chelsea Gray',
        'Skylar Diggins',
      ].includes(playerName)
    ) {
      position = 'Guard';
      baseStats = {...guardStats, ...starAdjustments};
    } else if (
      ['Breanna Stewart', 'Napheesa Collier', 'Nneka Ogwumike'].includes(
        playerName
      )
    ) {
      position = 'Forward';
      baseStats = {...forwardStats, ...starAdjustments};
    } else if (["A'ja Wilson"].includes(playerName)) {
      position = 'Center';
      baseStats = {...centerStats, ...starAdjustments};
    } else {
      // Default for other star players
      position = 'Forward';
      baseStats = {...forwardStats, ...starAdjustments};
    }
  } else {
    // Random position assignment for non-star players
    const positionRoll = Math.random();
    if (positionRoll < 0.4) {
      position = 'Guard';
      baseStats = guardStats;
    } else if (positionRoll < 0.8) {
      position = 'Forward';
      baseStats = forwardStats;
    } else {
      position = 'Center';
      baseStats = centerStats;
    }
  }

  return {stats: baseStats, position};
}
Object.entries(teams).forEach(([team, playerList]) => {
  playerList.forEach((player) => {
    let jerseyNumber = null;
    if (team === 'Seattle Storm' && seattleJerseyNumbers[player]) {
      jerseyNumber = seattleJerseyNumbers[player];
    } else {
      jerseyNumber = Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0');
    }

    const playerId = `${slugify(team)}-${slugify(player)}`;
    const {stats, position} = generateRealisticStats(player, team);

    players.push({
      id: playerId,
      _id: playerId, // Add _id for better compatibility with cart and favorites
      name: player,
      team,
      jerseyNumber,
      image: `/images/headshots/${slugify(team)}/${slugify(player)}.jpg`,
      position: position,
      price: 89.99,
      countInStock: 50,
      rating: 4.5,
      numReviews: 20,
      description: `Official ${team} jersey featuring ${player}.`,
      stats: stats,
    });
  });
});

export default players;
