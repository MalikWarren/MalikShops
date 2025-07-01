import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import colors from 'colors';
import users from './data/users.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';
import fs from 'fs';
import path from 'path';

const wnbaTeams = [
  'Atlanta Dream',
  'Chicago Sky',
  'Connecticut Sun',
  'Dallas Wings',
  'Indiana Fever',
  'Las Vegas Aces',
  'Los Angeles Sparks',
  'Minnesota Lynx',
  'New York Liberty',
  'Phoenix Mercury',
  'Seattle Storm',
  'Washington Mystics',
  'Golden State Valkyries',
];

const topPlayers = {
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

// Load WNBA player UUID mapping
const playerMappingPath = path.join(
  path.resolve(),
  'backend',
  'utils',
  'wnbaPlayerUUIDs.json'
);
let playerMapping = {};
try {
  playerMapping = JSON.parse(fs.readFileSync(playerMappingPath, 'utf-8'));
} catch (e) {
  console.warn(
    'Could not load wnbaPlayerUUIDs.json, proceeding without mapping.'
  );
}

// Helper to normalize player names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, '');
}

const generateJerseyData = () => {
  const jerseyData = [];

  wnbaTeams.forEach((team) => {
    topPlayers[team].forEach((player) => {
      // Find best match in playerMapping using normalized names
      let foundMapping;
      for (const key in playerMapping) {
        const [apiPlayer, apiTeam] = key.split('-');
        if (
          normalizeName(apiPlayer) === normalizeName(player) &&
          normalizeName(apiTeam) === normalizeName(team)
        ) {
          foundMapping = playerMapping[key];
          break;
        }
      }
      jerseyData.push({
        name: `${player} Jersey`,
        team: team,
        player: player,
        wnbaPlayerId: foundMapping ? foundMapping.playerId : undefined,
        image: `/images/headshots/${team
          .toLowerCase()
          .replace(/\s+/g, '-')}/${player
          .toLowerCase()
          .replace(/\s+/g, '-')}.jpg`,
        description: `Official ${team} jersey featuring ${player}. Made with high-quality, breathable material perfect for game day or everyday wear.`,
        brand: team,
        category: 'WNBA Jerseys',
        price: 89.99,
        countInStock: 50,
        isFeatured: Math.random() < 0.3,
        numReviews: Math.floor(Math.random() * 50),
        rating: (4 + Math.random()).toFixed(1),
        reviews: [],
      });
    });
  });

  return jerseyData;
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const jerseyData = generateJerseyData();
    const sampleProducts = jerseyData.map((product) => {
      return {...product, user: adminUser};
    });

    await Product.insertMany(sampleProducts);

    console.log('WNBA Jersey Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
