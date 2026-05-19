const mongoose = require("mongoose");
const Product = require("../models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/assignment3")
.then(() => console.log("DB connected for seeding"))
.catch(err => console.error(err));

const categories = ["Polo", "Casual", "Festive"];

const seedProducts = [];

for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    
    let image = "";
    if (category === "Polo") {
        name = `Signature Polo ${i}`;
        const poloImages = ["product1.webp", "product2.webp", "product3.webp", "product4.webp", "product5.webp", "product6.jpg", "product7.jpg", "product8.webp"];
        image = `/images/${poloImages[i % poloImages.length]}`;
    }
    if (category === "Casual") {
        name = `Heritage Casual Shirt ${i}`;
        const casualImages = ["causal-product1.webp", "causal-product2.webp", "causal-product3.webp", "causal-product4.webp", "causal-product5.webp", "causal-product6.webp", "causal-product7.webp", "causal-product8.webp", "causal-product9.webp", "causal-product10.webp"];
        image = `/images/${casualImages[i % casualImages.length]}`;
    }
    if (category === "Festive") {
        name = `Prestige Shalwar Kameez ${i}`;
        const festiveImages = ["festive-product1.webp", "festive-product2.webp", "festive-product3.webp", "festive-product4.jpg", "festive-product5.webp", "festive-product6.webp", "festive-product7.jpg", "festive-product8.webp", "festive-product9.webp", "festive-product10.jpg"];
        image = `/images/${festiveImages[i % festiveImages.length]}`;
    }

    seedProducts.push({
        name: name,
        price: Math.floor(Math.random() * 5000) + 3000, 
        category: category,
        rating: (Math.random() * 1 + 4).toFixed(1),
        stock: Math.floor(Math.random() * 8) + 1,
        image: image
    });
}

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(seedProducts);
        console.log("Database seeded with 30 products using correct categories!");
    } catch (error) {
        console.error("Seeding error: ", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
