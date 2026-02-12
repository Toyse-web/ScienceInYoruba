// seed.js - Run once to initialize database
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Topic from "./models/Topic.js";
import Article from "./models/Article.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log("Seeding database...");

    // Clear existing data (optional - be careful!)
    // await User.deleteMany({});
    // await Topic.deleteMany({});
    // await Article.deleteMany({});
    
    // Check if admin exists
    const adminExists = await User.findOne({ role: "admin" });
    
    if (!adminExists) {
      // Create admin user
      const admin = await User.create({
        name: "System Admin",
        email: process.env.ADMIN_EMAIL || "admin@scienceinyoruba.org",
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
        yorubaProficiency: "fluent"
      });
      console.log(`Admin user created: ${admin.email}`);
    }

    // Create sample topics
    const topics = [
      {
        name: { yo: "Ìmọ́lẹ̀", en: "Light" },
        description: { yo: "Ìtumò àti àwọn ìṣe ìmọ́lẹ̀", en: "Properties and behavior of light" },
        icon: "💡",
        color: "#3498db",
        isFeatured: true,
        order: 1
      },
      {
        name: { yo: "Àwọn Ẹ̀dá Ọ̀fun", en: "Human Body" },
        description: { yo: "Ìṣẹ̀lẹ̀ àti ìṣòro ẹ̀dá ọ̀fun", en: "Human anatomy and physiology" },
        icon: "👤",
        color: "#e74c3c",
        isFeatured: true,
        order: 2
      },
      {
        name: { yo: "Ilẹ̀ Ayé", en: "Earth Science" },
        description: { yo: "Nípa ilẹ̀ ayé àti àwọn òṣùpá", en: "Study of Earth and planets" },
        icon: "🌍",
        color: "#2ecc71",
        isFeatured: true,
        order: 3
      }
    ];

    const createdTopics = await Topic.insertMany(topics);
    console.log(`${createdTopics.length} topics created`);

    console.log("Seeding completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Run: npm run dev (to start server)");
    console.log("2. Visit: http://localhost:5000/api/health");
    console.log("3. Use admin credentials to login");
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();