/**
 * Mock data seeder for LoveOS
 * Run this script to populate the database with sample users and profiles
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Profile = require('./models/Profile');
const Match = require('./models/Match');

const mockUsers = [
  {
    email: 'sarah.chen@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Chen',
    dateOfBirth: new Date('1995-03-15'),
    gender: 'female',
    interestedIn: ['male', 'non-binary'],
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    }
  },
  {
    email: 'michael.rodriguez@example.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    dateOfBirth: new Date('1992-07-22'),
    gender: 'male',
    interestedIn: ['female'],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    }
  },
  {
    email: 'emma.thompson@example.com',
    password: 'password123',
    firstName: 'Emma',
    lastName: 'Thompson',
    dateOfBirth: new Date('1998-11-08'),
    gender: 'female',
    interestedIn: ['male', 'female'],
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    }
  },
  {
    email: 'alex.kim@example.com',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Kim',
    dateOfBirth: new Date('1994-05-12'),
    gender: 'non-binary',
    interestedIn: ['male', 'female', 'non-binary'],
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA'
    }
  },
  {
    email: 'james.wilson@example.com',
    password: 'password123',
    firstName: 'James',
    lastName: 'Wilson',
    dateOfBirth: new Date('1991-09-30'),
    gender: 'male',
    interestedIn: ['female'],
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA'
    }
  }
];

const mockProfiles = [
  {
    bio: 'Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new cuisines. Looking for someone to explore the world with!',
    interests: ['hiking', 'photography', 'travel', 'coffee', 'cooking'],
    hobbies: ['rock climbing', 'yoga', 'reading'],
    occupation: 'Software Engineer',
    education: 'Computer Science, Stanford University',
    height: 165,
    relationshipGoals: 'serious',
    values: ['adventure', 'family', 'growth', 'authenticity'],
    personality: {
      openness: 85,
      conscientiousness: 75,
      extraversion: 70,
      agreeableness: 80,
      neuroticism: 30
    },
    loveLanguages: {
      wordsOfAffirmation: 30,
      actsOfService: 20,
      receivingGifts: 10,
      qualityTime: 30,
      physicalTouch: 10
    },
    communicationStyle: {
      directness: 70,
      emotionalExpression: 80,
      conflictResolution: 75,
      humor: 85
    },
    lifestyle: {
      socialActivity: 75,
      adventure: 90,
      routine: 40,
      workLifeBalance: 70
    },
    quizCompleted: true
  },
  {
    bio: 'Creative soul with a passion for music and art. I believe in the power of deep conversations and meaningful connections.',
    interests: ['music', 'art', 'poetry', 'meditation', 'nature'],
    hobbies: ['guitar', 'painting', 'writing'],
    occupation: 'Graphic Designer',
    education: 'Fine Arts, UCLA',
    height: 180,
    relationshipGoals: 'serious',
    values: ['creativity', 'spirituality', 'authenticity', 'growth'],
    personality: {
      openness: 90,
      conscientiousness: 60,
      extraversion: 50,
      agreeableness: 85,
      neuroticism: 40
    },
    loveLanguages: {
      wordsOfAffirmation: 40,
      actsOfService: 15,
      receivingGifts: 5,
      qualityTime: 35,
      physicalTouch: 5
    },
    communicationStyle: {
      directness: 60,
      emotionalExpression: 90,
      conflictResolution: 80,
      humor: 70
    },
    lifestyle: {
      socialActivity: 50,
      adventure: 60,
      routine: 30,
      workLifeBalance: 80
    },
    quizCompleted: true
  },
  {
    bio: 'Fitness enthusiast and entrepreneur. Love challenges and helping others achieve their goals. Looking for a partner who shares my drive and ambition.',
    interests: ['fitness', 'entrepreneurship', 'travel', 'wine', 'books'],
    hobbies: ['crossfit', 'cooking', 'sailing'],
    occupation: 'Business Owner',
    education: 'MBA, Wharton',
    height: 170,
    relationshipGoals: 'marriage',
    values: ['ambition', 'health', 'family', 'success'],
    personality: {
      openness: 60,
      conscientiousness: 95,
      extraversion: 80,
      agreeableness: 70,
      neuroticism: 25
    },
    loveLanguages: {
      wordsOfAffirmation: 20,
      actsOfService: 40,
      receivingGifts: 10,
      qualityTime: 20,
      physicalTouch: 10
    },
    communicationStyle: {
      directness: 90,
      emotionalExpression: 60,
      conflictResolution: 85,
      humor: 75
    },
    lifestyle: {
      socialActivity: 80,
      adventure: 70,
      routine: 80,
      workLifeBalance: 60
    },
    quizCompleted: true
  },
  {
    bio: 'Tech innovator and environmental advocate. Passionate about using technology to solve real-world problems and make a positive impact.',
    interests: ['technology', 'environment', 'sustainability', 'gaming', 'anime'],
    hobbies: ['programming', 'gardening', 'board games'],
    occupation: 'Product Manager',
    education: 'Engineering, MIT',
    height: 175,
    relationshipGoals: 'serious',
    values: ['innovation', 'sustainability', 'equality', 'learning'],
    personality: {
      openness: 80,
      conscientiousness: 85,
      extraversion: 40,
      agreeableness: 75,
      neuroticism: 35
    },
    loveLanguages: {
      wordsOfAffirmation: 25,
      actsOfService: 30,
      receivingGifts: 15,
      qualityTime: 25,
      physicalTouch: 5
    },
    communicationStyle: {
      directness: 75,
      emotionalExpression: 50,
      conflictResolution: 70,
      humor: 80
    },
    lifestyle: {
      socialActivity: 40,
      adventure: 50,
      routine: 70,
      workLifeBalance: 75
    },
    quizCompleted: true
  },
  {
    bio: 'Outdoor enthusiast and community volunteer. Love connecting with people and making a difference in my community. Seeking a genuine connection.',
    interests: ['volunteering', 'outdoor activities', 'community', 'dogs', 'crafts'],
    hobbies: ['hiking', 'pottery', 'volunteering'],
    occupation: 'Social Worker',
    education: 'Social Work, University of Texas',
    height: 168,
    relationshipGoals: 'serious',
    values: ['community', 'service', 'family', 'authenticity'],
    personality: {
      openness: 70,
      conscientiousness: 80,
      extraversion: 75,
      agreeableness: 90,
      neuroticism: 20
    },
    loveLanguages: {
      wordsOfAffirmation: 20,
      actsOfService: 50,
      receivingGifts: 5,
      qualityTime: 20,
      physicalTouch: 5
    },
    communicationStyle: {
      directness: 70,
      emotionalExpression: 85,
      conflictResolution: 90,
      humor: 70
    },
    lifestyle: {
      socialActivity: 85,
      adventure: 60,
      routine: 60,
      workLifeBalance: 80
    },
    quizCompleted: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loveos');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Match.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (let i = 0; i < mockUsers.length; i++) {
      const userData = mockUsers[i];
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.firstName} ${user.lastName}`);
    }

    // Create profiles
    const createdProfiles = [];
    for (let i = 0; i < createdUsers.length; i++) {
      const profileData = {
        ...mockProfiles[i],
        userId: createdUsers[i]._id
      };
      const profile = new Profile(profileData);
      profile.calculateCompletion();
      await profile.save();
      createdProfiles.push(profile);
      console.log(`Created profile for: ${createdUsers[i].firstName} ${createdUsers[i].lastName}`);
    }

    // Update users to mark profiles as complete
    for (let i = 0; i < createdUsers.length; i++) {
      createdUsers[i].isProfileComplete = true;
      await createdUsers[i].save();
    }

    // Create some sample matches
    const compatibilityEngine = require('./utils/compatibilityEngine');
    
    // Create matches between users
    for (let i = 0; i < createdProfiles.length; i++) {
      for (let j = i + 1; j < createdProfiles.length; j++) {
        const profile1 = createdProfiles[i];
        const profile2 = createdProfiles[j];
        
        const compatibility = compatibilityEngine.calculateCompatibility(profile1, profile2);
        
        const match = new Match({
          user1: profile1.userId,
          user2: profile2.userId,
          compatibilityScore: compatibility.compatibilityScore,
          compatibilityBreakdown: compatibility.compatibilityBreakdown,
          explanation: compatibility.explanation,
          isHighQuality: compatibility.isHighQuality,
          status: 'potential'
        });
        
        await match.save();
        console.log(`Created match between ${createdUsers[i].firstName} and ${createdUsers[j].firstName} (${compatibility.compatibilityScore}% compatible)`);
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: sarah.chen@example.com, Password: password123');
    console.log('Email: michael.rodriguez@example.com, Password: password123');
    console.log('Email: emma.thompson@example.com, Password: password123');
    console.log('Email: alex.kim@example.com, Password: password123');
    console.log('Email: james.wilson@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
