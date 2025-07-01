// Player mapping to match our database players with WNBA API players
// This helps ensure we get the right player data from the API

const playerMappings = {
  // Atlanta Dream
  'Maya Caldwell': 'maya-caldwell',
  'Rhyne Howard': 'rhyne-howard',
  'Allisha Gray': 'allisha-gray',
  'Cheyenne Parker': 'cheyenne-parker',
  'Tina Thompson': 'tina-thompson',

  // Chicago Sky
  'Candace Parker': 'candace-parker',
  'Kahleah Copper': 'kahleah-copper',
  'Diamond DeShields': 'diamond-deshields',
  'Azurá Stevens': 'azura-stevens',
  'Courtney Vandersloot': 'courtney-vandersloot',

  // Connecticut Sun
  'DeWanna Bonner': 'dewanna-bonner',
  'Brionna Jones': 'brionna-jones',
  'Alyssa Thomas': 'alyssa-thomas',
  'Jasmine Thomas': 'jasmine-thomas',
  'Natisha Hiedeman': 'natisha-hiedeman',

  // Dallas Wings
  'Arike Ogunbowale': 'arike-ogunbowale',
  'Satou Sabally': 'satou-sabally',
  'Isabelle Harrison': 'isabelle-harrison',
  'Marina Mabrey': 'marina-mabrey',
  'Allisha Gray': 'allisha-gray',

  // Indiana Fever
  'Caitlin Clark': 'caitlin-clark',
  'Aliyah Boston': 'aliyah-boston',
  'Kelsey Mitchell': 'kelsey-mitchell',
  'NaLyssa Smith': 'nalyssa-smith',
  'Victoria Vivians': 'victoria-vivians',

  // Las Vegas Aces
  "A'ja Wilson": 'aja-wilson',
  'Chelsea Gray': 'chelsea-gray',
  'Kelsey Plum': 'kelsey-plum',
  'Jackie Young': 'jackie-young',
  'Candace Parker': 'candace-parker',

  // Los Angeles Sparks
  'Nneka Ogwumike': 'nneka-ogwumike',
  'Chiney Ogwumike': 'chiney-ogwumike',
  'Kristi Toliver': 'kristi-toliver',
  'Amanda Zahui B.': 'amanda-zahui-b',
  'Lexie Brown': 'lexie-brown',

  // Minnesota Lynx
  'Sylvia Fowles': 'sylvia-fowles',
  'Napheesa Collier': 'napheesa-collier',
  'Kayla McBride': 'kayla-mcbride',
  'Damiris Dantas': 'damiris-dantas',
  'Crystal Dangerfield': 'crystal-dangerfield',

  // New York Liberty
  'Breanna Stewart': 'breanna-stewart',
  'Sabrina Ionescu': 'sabrina-ionescu',
  'Betnijah Laney': 'betnijah-laney',
  'Stefanie Dolson': 'stefanie-dolson',
  'Rebecca Allen': 'rebecca-allen',

  // Phoenix Mercury
  'Diana Taurasi': 'diana-taurasi',
  'Skylar Diggins-Smith': 'skylar-diggins-smith',
  'Brittney Griner': 'brittney-griner',
  'Sophie Cunningham': 'sophie-cunningham',
  'Shey Peddy': 'shey-peddy',

  // Seattle Storm
  'Sue Bird': 'sue-bird',
  'Breanna Stewart': 'breanna-stewart',
  'Jewell Loyd': 'jewell-loyd',
  'Alysha Clark': 'alysha-clark',
  'Stephanie Talbot': 'stephanie-talbot',

  // Washington Mystics
  'Elena Delle Donne': 'elena-delle-donne',
  'Ariel Atkins': 'ariel-atkins',
  'Natasha Cloud': 'natasha-cloud',
  'Myisha Hines-Allen': 'myisha-hines-allen',
  'Tianna Hawkins': 'tianna-hawkins',

  // Golden State Valkyries (Expansion Team)
  'Kelsey Plum': 'kelsey-plum',
  'Jackie Young': 'jackie-young',
  "A'ja Wilson": 'aja-wilson',
  'Chelsea Gray': 'chelsea-gray',
  'Candace Parker': 'candace-parker',
};

// Function to get WNBA API player ID from our database player name
const getWNBAPlayerId = (playerName) => {
  return playerMappings[playerName] || null;
};

// Function to get our database player name from WNBA API player ID
const getDatabasePlayerName = (wnbaPlayerId) => {
  for (const [dbName, apiId] of Object.entries(playerMappings)) {
    if (apiId === wnbaPlayerId) {
      return dbName;
    }
  }
  return null;
};

// Function to search for similar player names
const findSimilarPlayer = (playerName) => {
  const normalizedName = playerName.toLowerCase().replace(/[^a-z\s]/g, '');

  for (const dbName of Object.keys(playerMappings)) {
    const normalizedDbName = dbName.toLowerCase().replace(/[^a-z\s]/g, '');

    if (
      normalizedName.includes(normalizedDbName) ||
      normalizedDbName.includes(normalizedName)
    ) {
      return dbName;
    }
  }

  return null;
};

export {
  playerMappings,
  getWNBAPlayerId,
  getDatabasePlayerName,
  findSimilarPlayer,
};
