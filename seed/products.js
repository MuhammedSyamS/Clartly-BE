require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/Product");

const products = [
  {
    name: "ZEBRONICS SILENCIO 111",
    description: "Wireless Headphone, Hybrid ANC (50dB)...",
    price: 2999,
    category: "Headphones",
    image: "/products/Zebronics.webp",
  },
  {
    name: "SHARAV M1",
    description: "Smart Watch for Men...",
    price: 4999,
    category: "Watches",
    image: "/products/Shavar watch.jpg",
  },
  {
    name: "Rog ASUS",
    description: "ASUS USB, Wired, Wireless Optical Mouse",
    price: 24999,
    category: "Gaming",
    image: "/products/Rog.jpg",
  },
  {
    name: "Portronics SoundDrum P",
    description:
      "20W Portable Bluetooth Speaker with 6-7 hrs Playback Time, Handsfree Calling, USB Slot, Aux-in Port, Type C Charging (Black)",
    price: 1999,
    category: "Speakers",
    image: "/products/Portronics.webp"
  },

  { 
    name: "OnePlus Nord CE5 5G",
    description:
      "OnePlus Nord CE5 | Massive 7100mAh Battery | MediaTek Dimensity 8350 Apex | Powered by OnePlus AI | 8GB + 256GB | Nexus Blue",
    price: 26998,
    category: "Phones",
    image: "/products/OnePlus.webp"
  },

  {
    name: "boAt Rockerz 425 Wireless Bluetooth Headphone",
    description:
      "Wireless Bluetooth Headphone with 25 Hours Playback, ASAP Charge, 40mm Drivers",
    price: 1999,
    category: "Headphones",
    image: "/products/BoAT.jpg"
  },

  { 
    name: "Ultra Smart Watch",
    description:
      "AMOLED 3D Menu Ai Dial SOS Function Smartwatch for Android iOS Bluetooth Call Wireless Charging (Silver)",
    price: 2299,
    category: "Watches",
    image: "/products/Bolt.webp"
  },

  { 
    name: "HP Spectre x360 16",
    description:
      "HP 2023 Newest Envy Laptop, 16 WQXGA Touch-Screen, Intel Core i9 13900H, RTX 4060, 32GB DDR5 RAM, 1TB SSD",
    price: 59999,
    category: "Laptops",
    image: "/products/msl.jpg"
  },

  { 
    name: "Pocket Kick",
    description:
      "Soundfreaq Pocket Kick Wireless Bluetooth Portable Speaker and Speakerphone",
    price: 6000,
    category: "Speakers",
    image: "/products/Pocket-Kick.png"
  },

  { 
    name: "iPhone 16 Plus",
    description:
      "iPhone 16 128 GB: 5G Mobile Phone with Camera Control, A18 Chip and Big Battery Life",
    price: 63999,
    category: "Phones",
    image: "/products/Iphone.jpg"
  },

  { 
    name: "Dell XPS",
    description:
      "16 9640 CORE ULTRA 7 155H, 32GB RAM, 1TB SSD, RTX 4060, Windows 11 Pro",
    price: 199999,
    category: "Laptops",
    image: "/products/Dell.jpg"
  },

  { 
    name: "EvoFox One S",
    description:
      "Universal 3-Mode Wireless Gaming Controller with HallSense Precision Joysticks",
    price: 4999,
    category: "Gaming",
    image: "/products/JoyStickEvo.webp"
  }
];

async function seed() {
  try {
    // Wait for connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Seed products
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
