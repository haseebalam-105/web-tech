const mongoose = require("mongoose");
const Product = require("../models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/assignment3")
.then(() => console.log("DB connected for seeding"))
.catch(err => console.error(err));

const categories = ["Polo", "Casual", "Festive"];

const seedProducts = [];

for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    
    let name = "";
    if (category === "Polo") name = `Signature Polo ${i}`;
    if (category === "Casual") name = `Heritage Casual Shirt ${i}`;
    if (category === "Festive") name = `Prestige Shalwar Kameez ${i}`;

    seedProducts.push({
        name: name,
        price: Math.floor(Math.random() * 5000) + 3000, 
        category: category,
        rating: (Math.random() * 1 + 4).toFixed(1),
        stock: Math.floor(Math.random() * 8) + 1 
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
