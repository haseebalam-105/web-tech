# Dynamic Product Catalog 

This project upgrades a static e-commerce HTML/CSS interface into a fully dynamic, database-driven web application. It uses the MERN stack (specifically MongoDB, Express, and EJS) to manage and render product data dynamically while preserving the original UI aesthetics.

## 🚀 Features
- **Dynamic Database:** All products are fetched directly from MongoDB via Mongoose.
- **Server-Side Pagination:** Displays 8 items per page, dynamically calculating Next/Prev links and page counts.
- **Advanced Filtering:** Users can filter products by:
  - Name (Search bar)
  - Category (Polo, Casual, Festive)
  - Price Range (Min/Max limits)
- **Sorting Mechanisms:** Sort by Price (Low to High / High to Low) and Rating.
- **Query Combination:** All filters, sorting, and pagination work together simultaneously using URL query parameters.
- **Intelligent EJS Rendering:** Keeps the strict Mongoose schema (`name`, `price`, `category`, `rating`, `stock`) while dynamically resolving image file paths and CSS hover effects on the fly.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend Template:** EJS (Embedded JavaScript)
- **Styling:** Vanilla CSS (No external frameworks)

## 📋 Project Structure
```text
📦 Assignment3
 ┣ 📂 controllers       # Contains productController.js for query & pagination logic
 ┣ 📂 models            # Contains the Mongoose Product schema
 ┣ 📂 public            # Static files (CSS, Images, JS)
 ┣ 📂 routes            # Contains productRoutes.js mapping GET /products
 ┣ 📂 seed              # Database seeding script (generates 30 dynamic items)
 ┣ 📂 views             # EJS templates (index.ejs, error.ejs)
 ┗ 📜 server.js         # Express app entry point
```

## ⚙️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed the database:**
   *(Ensure your local MongoDB instance is running before executing this!)*
   ```bash
   node seed/seed.js
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **View the Application:**
   Open your browser and navigate to `http://localhost:3000`.
