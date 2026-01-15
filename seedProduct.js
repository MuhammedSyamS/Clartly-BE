const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./src/models/Product");

dotenv.config();

const products = [
  {
    name: "ZEBRONICS SILENCIO 111",
    description:
      "Wireless Headphone, Hybrid ANC (50dB), 55Hrs Backup, Transparency Mode, 40mm Titanium Drivers",
    price: 2999,
    category: "Headphones",
    image: "/products/Zebronics.webp",
  },
  {
    name: "SHARAV M1",
    description:
      "Smart Watch for Men Women, Bluetooth Smartwatch Touch Screen",
    price: 4999,
    category: "Watches",
    image: "/products/Shavar watch.jpg",
  },
  {
    name: "Rog ASUS",
    description:
      "ASUS USB, Wired, Radio Frequency, Wireless Optical Sensor Mouse",
    price: 24999,
    category: "Gaming",
    image: "/products/Rog.jpg",
  },
  {
    name: "Portronics SoundDrum P",
    description:
      "20W Portable Bluetooth Speaker with Handsfree Calling",
    price: 1999,
    category: "Speakers",
    image: "/products/Portronics.webp",
  },
  {
    name: "OnePlus Nord CE5 5G",
    description:
      "7100mAh Battery, MediaTek Dimensity 8350, 8GB RAM, 256GB Storage",
    price: 26998,
    category: "Phones",
    image: "/products/OnePlus.webp",
  },
  {
    name: "boAt Rockerz 425",
    description:
      "Wireless Bluetooth Headphone with 25 Hours Playback",
    price: 1999,
    category: "Headphones",
    image: "/products/BoAT.jpg",
  },
  {
    name: "Ultra Smart Watch",
    description:
      "AMOLED Display, Bluetooth Call, Wireless Charging",
    price: 2299,
    category: "Watches",
    image: "/products/Bolt.webp",
  },
  {
    name: "HP Spectre x360 16",
    description:
      "Intel Core i9, RTX 4060, 32GB RAM, 1TB SSD",
    price: 59999,
    category: "Laptops",
    image: "/products/msl.jpg",
  },
  {
    name: "Pocket Kick",
    description:
      "Wireless Bluetooth Portable Speaker and Speakerphone",
    price: 6000,
    category: "Speakers",
    image: "/products/Pocket-Kick.png",
  },
  {
    name: "iPhone 16 Plus",
    description:
      "A18 Chip, Camera Control, Big Battery Life",
    price: 63999,
    category: "Phones",
    image: "/products/Iphone.jpg",
  },
  {
    name: "Dell XPS",
    description:
      "Core Ultra 7, 32GB RAM, RTX 4060, Windows 11 Pro",
    price: 199999,
    category: "Laptops",
    image: "/products/Dell.jpg",
  },
  {
    name: "EvoFox One S",
    description:
      "Universal 3-Mode Wireless Gaming Controller",
    price: 4999,
    category: "Gaming",
    image: "/products/JoyStickEvo.webp",
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();
    console.log("Old products removed");

    await Product.insertMany(products);
    console.log("Products seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedProducts();
