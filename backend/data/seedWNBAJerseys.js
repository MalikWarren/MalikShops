import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const wnbaTeams = [
  'Atlanta Dream',
  'Chicago Sky',
  'Connecticut Sun',
  'Dallas Wings',
  'Golden State Valkyries',
  'Indiana Fever',
  'Las Vegas Aces',
  'Los Angeles Sparks',
  'Minnesota Lynx',
  'New York Liberty',
  'Phoenix Mercury',
  'Seattle Storm',
  'Washington Mystics',
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

const jerseyData = [];

// Jersey number mappings for Seattle Storm players
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

// Generate jersey data for each team and player, using headshot image as the product image
wnbaTeams.forEach((team) => {
  topPlayers[team].forEach((player) => {
    // Get jersey number for Seattle Storm players, otherwise use a random number
    let jerseyNumber = null;
    if (team === 'Seattle Storm' && seattleJerseyNumbers[player]) {
      jerseyNumber = seattleJerseyNumbers[player];
    } else {
      // Generate a random jersey number between 0-99 for other teams
      jerseyNumber = Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0');
    }

    jerseyData.push({
      name: `${player} Jersey`,
      team: team,
      player: player,
      image: `/images/headshots/${team
        .toLowerCase()
        .replace(/\s+/g, '-')}/${player
        .toLowerCase()
        .replace(/\s+/g, '-')}.jpg`, // Use headshot as the image
      description: `Official ${team} jersey featuring ${player}. Made with high-quality, breathable material perfect for game day or everyday wear.`,
      price: 89.99,
      countInStock: 50,
      isFeatured: Math.random() < 0.3, // Randomly feature some jerseys
      numReviews: Math.floor(Math.random() * 50),
      rating: (4 + Math.random()).toFixed(1),
      reviews: [],
      jerseyNumber: jerseyNumber,
    });
  });
});

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(jerseyData);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
