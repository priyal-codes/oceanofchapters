# 🌊 OceanOfChapters — Modern Full-Stack Bookstore Application

[![Live Demo](https://img.shields.io/badge/Live_Demo-https%3A%2F%2Foceanofchapters--ib5o.onrender.com%2F-00C7B7?style=for-the-badge&logo=render&logoColor=white)](https://oceanofchapters-ib5o.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **OceanOfChapters** is a feature-rich, full-stack online bookstore application built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **EJS**. Designed with a modern dark-mode and glassmorphism aesthetic, it offers seamless book catalog browsing, live API search, multi-criteria filter & sort engines, session-backed wishlists, real-time shopping cart management, author showcases, and interactive 5-star reader reviews.

🌐 **Live Application Link**: [https://oceanofchapters-ib5o.onrender.com/](https://oceanofchapters-ib5o.onrender.com/)

---

## ✨ Key Features

- 📖 **Dynamic Book Catalog & Details**: Explore handpicked novels across Romance, Dark Romance, Thrillers, Fantasy, and Self-Help with detailed metadata (page counts, release dates, origin country, author bios).
- ⚡ **Live Instant Autocomplete API**: Server-side JSON search endpoint (`/api/search`) delivering real-time search suggestions as users type.
- 🎛️ **Multi-Criteria Filtering & Sorting**: Filter books by genre tags and custom price ranges (₹0 - ₹1000+), or sort by price (ascending/descending), title, or newest release.
- ❤️ **Session-Backed Wishlist**: Save favorite books with interactive floating heart toggles and persist wishlist items across user sessions with real-time navbar counter updates.
- 🛒 **Shopping Cart & Checkout Engine**: Manage cart items with dynamic quantity increment/decrement, item removal, live total pricing calculation, and randomized order ID checkout confirmation (`OOC-XXXXXX`).
- ✍️ **Meet the Master Storytellers (Authors Directory)**: Dedicated author spotlight showcase (`/authors`) featuring biographies, popular titles, genre badges, and direct catalog filter links.
- 💬 **Interactive Reader Reviews & Ratings**: Submit 5-star rated reviews with feedback comments, automatically populated on book details pages with atomic deletion cleanup (`$pull`).
- 🎨 **Ocean Dark Glassmorphism UI**: High-end visual presentation featuring modern glassmorphic cards, 3D stacked book cover previews, ambient glowing accents, and smooth micro-interactions.
- 📱 **100% Mobile Responsive Layout**: Optimized for desktop monitors, laptops, tablets, and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend Core** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) | RESTful routing, session management, and server middleware |
| **Database & ORM** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) & [Mongoose](https://mongoosejs.com/) | Document database, schemas, data validation, and model references |
| **Templating Engine** | [EJS](https://ejs.co/) & [`ejs-mate`](https://www.npmjs.com/package/ejs-mate) | Modular layout views, boilerplate partials, and dynamic rendering |
| **Styling & UI** | [Bootstrap 5.3](https://getbootstrap.com/) & Vanilla CSS3 | Glassmorphism UI system, custom design tokens, & keyframe animations |
| **Icons & Typography** | [FontAwesome 6](https://fontawesome.com/) & [Google Fonts](https://fonts.google.com/) | Vector icon sets and modern typography (Plus Jakarta Sans / Outfit) |
| **Session & Utilities** | `express-session`, `dotenv`, `method-override` | In-memory/session state handling, environment config, and HTTP verb overrides |
| **Deployment** | [Render](https://render.com/) | Web Service cloud hosting with automated continuous deployment |

---

## 📊 Database Schemas

### 1. Book Schema (`models/book.js`)
```js
{
  title: { type: String, required: true },
  author: String,
  authorImage: { type: String, default: "..." },
  authorBio: { type: String, default: "" },
  description: String,
  image: { type: String, default: "..." },
  price: Number,
  releasedate: Date,
  country: String,
  genre: [String],
  pages: Number,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  isHidden: { type: Boolean, default: false }
}
```

### 2. Review Schema (`models/review.js`)
```js
{
  comment: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🗺️ API & Route Architecture

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Home hero showcase, featured book stack, and author spotlights |
| **GET** | `/books` | Main catalog grid with live search, genre filters, & price sorting |
| **GET** | `/api/search` | JSON endpoint for instant header search autocomplete suggestions |
| **GET** | `/books/:id` | Individual book details page with populated reviews & ratings |
| **POST** | `/books/:id/reviews` | Submit a new rating & review for a book |
| **DELETE** | `/books/:id/reviews/:reviewId` | Delete a review and remove reference from book document |
| **GET** | `/authors` | Dedicated showcase page of featured book authors |
| **GET** | `/wishlist` | User's saved wishlist books page |
| **POST** | `/wishlist/toggle/:id` | Toggle a book in/out of the user's session wishlist |
| **GET** | `/cart` | Shopping cart view displaying items, quantities, & subtotal |
| **POST** | `/cart/add/:id` | Add a book to the session shopping cart |
| **POST** | `/cart/increase/:id` | Increment quantity of an item in the cart |
| **POST** | `/cart/decrease/:id` | Decrement quantity or remove item if zero |
| **POST** | `/cart/remove/:id` | Remove an item completely from the cart |
| **POST** | `/cart/clear` | Empty all items from the cart |
| **GET** | `/checkout` | Checkout form summary page |
| **POST** | `/checkout` | Process order submission and display confirmation page |
| **GET** | `/privacy` | Privacy Policy informational page |
| **GET** | `/terms` | Terms of Service informational page |

---

## 📂 Project Architecture

```text
OceanOfChapters/
├── app.js                   # Main Express application server & routes
├── models/                  # Mongoose MongoDB schemas
│   ├── book.js              # Book data model schema & review refs
│   └── review.js            # Review & rating model schema
├── views/                   # EJS template views
│   ├── layouts/
│   │   └── boilerplate.ejs # Global layout wrapper (HTML shell)
│   ├── includes/
│   │   ├── navbar.ejs      # Header navigation with counters & live search
│   │   └── footer.ejs      # Global footer with navigation & social links
│   ├── books/
│   │   ├── index.ejs       # Catalog grid, filter bar & search view
│   │   └── show.ejs        # Book show page, metadata & review section
│   ├── authors/
│   │   └── index.ejs       # Authors directory & spotlight grid
│   ├── wishlist/
│   │   └── index.ejs       # Wishlist item collection view
│   ├── cart/
│   │   ├── index.ejs       # Cart management & quantity adjust view
│   │   ├── checkout.ejs    # Order checkout form view
│   │   └── success.ejs     # Order success & receipt view
│   ├── info/
│   │   ├── privacy.ejs     # Privacy Policy page
│   │   └── terms.ejs       # Terms of Service page
│   └── home.ejs            # Hero landing section & 3D book showcase
├── public/                  # Static assets
│   ├── css/
│   │   └── style.css       # Custom glassmorphism styles & animation system
│   └── js/
│       └── script.js       # Client-side validation & dynamic UI handlers
├── utils/                   # Async error handling helpers
│   ├── ExpressError.js     # Custom error class
│   └── wrapAsync.js        # Async route wrapper middleware
├── init/                    # Database initialization & seed scripts
│   ├── data.js             # Initial dataset of books & authors
│   └── index.js            # Database seeding execution script
├── .env                     # Environment variables (git-ignored)
├── package.json             # NPM dependencies & operational scripts
└── README.md                # Comprehensive project documentation
```

---

## 💻 Getting Started Locally

Follow these instructions to set up and run **OceanOfChapters** on your local machine:

### 1️⃣ Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI

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
Create a `.env` file in the root folder of the project:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/oceanofchapters?retryWrites=true&w=majority
SESSION_SECRET=oceanofchapters_super_secret_key_123
```

*(If using a local MongoDB instance, set `MONGO_URL=mongodb://127.0.0.1:27017/oceanofchapters`)*

### 5️⃣ Seed the Database
Populate your database with sample book datasets:
```bash
node init/index.js
```

### 6️⃣ Run the Application
Start the server using `npm`:
```bash
npm start
```
*or for development mode:*
```bash
npm run dev
```

Open your browser and visit: **`http://localhost:8080`** 🚀

---

## 🌐 Live Deployment Link

The application is deployed live on Render:  
🔗 **[https://oceanofchapters-ib5o.onrender.com/](https://oceanofchapters-ib5o.onrender.com/)**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">Crafted with ❤️ for book enthusiasts everywhere by <b>Priyal</b>.</p>
