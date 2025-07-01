import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      'mongodb+srv://Malikwar:Warrenboy10@cluster0.ig5hs5u.mongodb.net/malikshop?retryWrites=true&w=majority';

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'malikshop',
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections found:`);
    collections.forEach((collection) => {
      console.log(`   - ${collection.name}`);
    });

    // Check if we have the expected collections
    const expectedCollections = ['users', 'products', 'orders'];
    const foundCollections = collections.map((c) => c.name);

    console.log('\n🔍 Checking expected collections:');
    expectedCollections.forEach((collection) => {
      if (foundCollections.includes(collection)) {
        console.log(`   ✅ ${collection} - Found`);
      } else {
        console.log(`   ❌ ${collection} - Missing`);
      }
    });

    // Count documents in each collection
    console.log('\n📈 Document counts:');
    for (const collection of expectedCollections) {
      if (foundCollections.includes(collection)) {
        const count = await conn.connection.db
          .collection(collection)
          .countDocuments();
        console.log(`   ${collection}: ${count} documents`);
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Database check completed');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

checkDatabase();
