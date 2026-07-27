# 🌊 OceanOfChapters — Modern Full-Stack Bookstore Application

[![Live Demo](https://img.shields.io/badge/Live_Demo-https%3A%2F%2Foceanofchapters--ib5o.onrender.com%2F-00C7B7?style=for-the-badge&logo=render&logoColor=white)](https://oceanofchapters-ib5o.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

> **OceanOfChapters** is a feature-rich, full-stack online bookstore platform built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **EJS**. Designed with a modern, glassmorphism aesthetic, it offers seamless book browsing, multi-criteria filtering, persistent wishlists, shopping carts, author spotlights, and interactive reader reviews.

🌐 **Live Application Link**: [https://oceanofchapters-ib5o.onrender.com/](https://oceanofchapters-ib5o.onrender.com/)

---

## ✨ Key Features

- 📖 **Dynamic Book Catalog**: Browse handpicked novels across genres like Romance, Dark Romance, Thriller, Fantasy, and Self-Help.
- 🔍 **Instant Search & Autocomplete**: Real-time search by book title, author, or genre with instant suggestions.
- 🎛️ **Advanced Filtering & Sorting**: Filter by genre tags and price ranges (₹0 - ₹1000+), or sort by price (Low to High, High to Low).
- ❤️ **Interactive Wishlist System**: Toggle saved books with floating heart badges on cover images and persist across user sessions.
- 🛒 **Shopping Cart & Order Checkout**: Real-time item quantity adjustment, price calculation, and order confirmation generation.
- ✍️ **Meet the Master Storytellers (Authors Directory)**: Dedicated `/authors` showcase page with author biographies, popular titles, and live author search filter.
- 💬 **Book Reviews & Ratings**: Submit reader reviews with 5-star ratings and manage user feedback.
- 🎨 **Glassmorphism & 3D Hero UI**: Modern dark theme hero section featuring dynamic 3D floating book showcases, glassmorphism badges, and smooth micro-animations.
- 📱 **100% Mobile Responsive**: Fully adapted layout for mobile phones, tablets, laptops, and desktop screens.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database & ORM** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Mongoose](https://mongoosejs.com/) |
| **Templating Engine** | [EJS (Embedded JavaScript)](https://ejs.co/), `ejs-mate` |
| **Styling & Icons** | [Bootstrap 5.3](https://getbootstrap.com/), Vanilla CSS3, [FontAwesome 6](https://fontawesome.com/) |
| **Session Management** | `express-session`, `dotenv` |
| **Deployment & Hosting** | [Render Web Services](https://render.com/) |

---

## 📂 Project Architecture

```text
OceanOfChapters/
├── app.js                   # Primary Express application server & routes
├── models/
│   ├── book.js              # Mongoose Schema for Books
│   └── review.js            # Mongoose Schema for Reviews
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs # Main layout wrapper with header/footer
│   ├── includes/
│   │   ├── navbar.ejs      # Header navigation bar with search & counters
│   │   └── footer.ejs      # Global footer with social links & legal pages
│   ├── books/
│   │   ├── index.ejs       # Catalog grid, search, filter & sort page
│   │   └── show.ejs        # Book details, pricing & review section
│   ├── authors/
│   │   └── index.ejs       # All authors directory & live filter page
│   ├── wishlist/
│   │   └── index.ejs       # User saved books wishlist page
│   ├── cart/
│   │   ├── index.ejs       # Shopping cart management page
│   │   ├── checkout.ejs    # Order checkout form
│   │   └── success.ejs     # Order confirmation success page
│   ├── info/
│   │   ├── privacy.ejs     # Privacy Policy page
│   │   └── terms.ejs       # Terms of Service page
│   └── home.ejs            # Hero showcase, 3D book stack & authors spotlight
├── public/
│   ├── css/
│   │   └── style.css       # Design tokens, custom animations & utilities
│   └── js/
│       └── script.js       # Client-side validation & UI interactions
├── init/
│   ├── data.js             # Initial database seed dataset
│   └── index.js            # Database seeding script
├── .env                     # Environment variables configuration
└── package.json             # Node.js dependencies & scripts
```

---

## 💻 Getting Started Locally

Follow these steps to run **OceanOfChapters** locally on your machine:

### 1️⃣ Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB installed locally OR a MongoDB Atlas cluster URL

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/priyal-codes/oceanofchapters.git
cd oceanofchapters
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.whzfqsa.mongodb.net/oceanofchapters?retryWrites=true&w=majority
SESSION_SECRET=oceanofchapters_super_secret_key_123
```

### 5️⃣ Seed the Database
Populate your database with sample books:
```bash
node init/index.js
```

### 6️⃣ Start the Local Server
```bash
node app.js
```

Open your browser and navigate to **[http://localhost:8080](http://localhost:8080)** 🎉

---

## 🌐 Live Deployment Link

The application is deployed live on Render:  
🔗 **[https://oceanofchapters-ib5o.onrender.com/](https://oceanofchapters-ib5o.onrender.com/)**

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for book lovers everywhere by <b>Priyal</b>.</p>
