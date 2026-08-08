require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/book.js");
const path = require("path");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js"); 
app.use(express.static(path.join(__dirname, "/public")));
const Review = require("./models/review.js");
const methodOverride = require("method-override");


const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/oceanofchapters";


main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: [] };
  }
  if (!req.session.wishlist) {
    req.session.wishlist = { items: [] };
  }
  const totalCartCount = req.session.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.cartCount = totalCartCount;
  res.locals.wishlistCount = req.session.wishlist.items.length;
  res.locals.wishlistItems = req.session.wishlist.items.map(id => id.toString());
  res.locals.currentPath = req.path;
  next();
});


// Home Route
app.get("/", wrapAsync(async (req, res) => {
    const featuredBooks = await Book.find({ isHidden: { $ne: true } }).limit(10);
    res.render("home.ejs", { featuredBooks });
}));

// Index / Search / Filter / Sort Route
app.get("/books", wrapAsync(async(req, res) => {
    let query = { isHidden: { $ne: true } };
    const { search, genre, sort, minPrice, maxPrice } = req.query;

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { genre: { $regex: search, $options: "i" } }
        ];
    }

    if (genre) {
        query.genre = { $regex: genre, $options: "i" };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else if (sort === "title_asc") sortOptions.title = 1;
    else if (sort === "newest") sortOptions.releasedate = -1;

    const allBooks = await Book.find(query).sort(sortOptions);
    res.render("books/index.ejs", { allBooks, search, genre, sort, minPrice, maxPrice });
}));


// Live Instant API Search Endpoint
app.get("/api/search", wrapAsync(async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim() === "") {
        return res.json([]);
    }
    const books = await Book.find({
        isHidden: { $ne: true },
        $or: [
            { title: { $regex: q, $options: "i" } },
            { author: { $regex: q, $options: "i" } },
            { genre: { $regex: q, $options: "i" } }
        ]
    }).limit(6).select("title author image price _id genre");
    res.json(books);
}));


// Authors Page Route
app.get("/authors", wrapAsync(async (req, res) => {
    const authors = [
        {
            name: "Colleen Hoover",
            genre: "Romance & Drama",
            bio: "#1 New York Times bestselling author of It Ends With Us and It Starts With Us, known for deeply emotional romance novels.",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
            titles: ["It Ends With Us", "It Starts With Us"],
            badge: "Romance Bestseller",
            badgeColor: "danger",
            searchQuery: "Colleen+Hoover"
        },
        {
            name: "Mercedes Ron",
            genre: "New Adult Romance",
            bio: "Argentine-Spanish author famous for the hit Culpables trilogy (My Fault / Culpa Mía) turned into viral movie adaptations.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            titles: ["My Fault (Culpa Mía)", "Your Fault"],
            badge: "Wattpad Star",
            badgeColor: "warning",
            searchQuery: "Mercedes+Ron"
        },
        {
            name: "H. D. Carlton",
            genre: "Dark Romance & Suspense",
            bio: "International bestselling author of dark romance and psychological suspense filled with thrilling twists and dark mystery.",
            image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
            titles: ["Does It Hurt?", "Haunting Adeline"],
            badge: "Dark Romance Queen",
            badgeColor: "dark",
            searchQuery: "Carlton"
        },
        {
            name: "Karen M. McManus",
            genre: "YA Mystery & Thriller",
            bio: "New York Times bestselling mystery author famous for high-stakes YA murder thrillers that keep readers guessing.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            titles: ["One of Us Is Lying", "Two Can Keep a Secret"],
            badge: "Mystery Queen",
            badgeColor: "info",
            searchQuery: "McManus"
        },
        {
            name: "Taylor Jenkins Reid",
            genre: "Historical Fiction",
            bio: "Acclaimed author of glamorous historical fiction including The Seven Husbands of Evelyn Hugo and Daisy Jones & The Six.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
            titles: ["The Seven Husbands of Evelyn Hugo"],
            badge: "Bestselling Author",
            badgeColor: "primary",
            searchQuery: "Reid"
        },
        {
            name: "Morgan Housel",
            genre: "Finance & Psychology",
            bio: "Former Wall Street Journal columnist and author of the global bestseller The Psychology of Money.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            titles: ["The Psychology of Money"],
            badge: "Finance Guru",
            badgeColor: "success",
            searchQuery: "Morgan+Housel"
        },
        {
            name: "James Clear",
            genre: "Self-Help & Growth",
            bio: "Expert on habits and decision-making, author of the multi-million copy bestseller Atomic Habits.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            titles: ["Atomic Habits"],
            badge: "Habit Expert",
            badgeColor: "secondary",
            searchQuery: "James+Clear"
        },
        {
            name: "Robert T. Kiyosaki",
            genre: "Personal Finance",
            bio: "Renowned investor and author of Rich Dad Poor Dad, the #1 personal finance book of all time.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
            titles: ["Rich Dad Poor Dad"],
            badge: "Legendary Author",
            badgeColor: "primary",
            searchQuery: "Kiyosaki"
        }
    ];
    res.render("authors/index", { authors });
}));

// Privacy & Terms Routes
app.get("/privacy", (req, res) => {
    res.render("info/privacy.ejs");
});

app.get("/terms", (req, res) => {
    res.render("info/terms.ejs");
});



//Show Route
app.get("/books/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const book = await Book.findById(id).populate("reviews");
    if (!book) {
        throw new ExpressError(404, "Book Not Found!");
    }
    res.render("books/show.ejs", { book });
}));

//Wishlist Page Route
app.get("/wishlist", wrapAsync(async (req, res) => {
  const wishlist = req.session.wishlist || { items: [] };
  const books = await Book.find({ _id: { $in: wishlist.items } });
  res.render("wishlist/index", { books });
}));

//Toggle Wishlist Item Route
app.post("/wishlist/toggle/:id", wrapAsync(async (req, res) => {
  const bookId = req.params.id;
  if (!req.session.wishlist) {
    req.session.wishlist = { items: [] };
  }
  const index = req.session.wishlist.items.findIndex(id => id.toString() === bookId);
  let isWishlisted = false;
  if (index > -1) {
    req.session.wishlist.items.splice(index, 1);
    isWishlisted = false;
  } else {
    req.session.wishlist.items.push(bookId);
    isWishlisted = true;
  }
  req.session.save(() => {
    if (req.xhr || (req.headers.accept && req.headers.accept.includes("application/json")) || req.get("X-Requested-With") === "XMLHttpRequest") {
      return res.json({
        success: true,
        isWishlisted,
        wishlistCount: req.session.wishlist.items.length,
        bookId
      });
    }
    const backUrl = req.get("Referrer") || "/wishlist";
    res.redirect(backUrl);
  });
}));

//Cart Route
app.get("/cart", wrapAsync(async (req, res) => {
  const cart = req.session.cart;

  const populatedItems = [];
  for (let item of cart.items) {
    const book = await Book.findById(item.book);
    if (book) {
      populatedItems.push({
        book,
        quantity: item.quantity
      });
    }
  }
  res.render("cart/index", { cart: { items: populatedItems } });
}));

//Add Cart Route (Redirects back to Referrer)
app.post("/cart/add/:id", wrapAsync(async (req, res) => {
  const bookId = req.params.id;
  const cart = req.session.cart;

  const existingItem = cart.items.find(
    item => item.book.toString() === bookId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ book: bookId, quantity: 1 });
  }

  req.session.cart = cart;
  const backUrl = req.get("Referrer") || "/cart";
  res.redirect(backUrl);
}));

// Checkout Route
app.get("/checkout", wrapAsync(async (req, res) => {
  const cart = req.session.cart;
  const populatedItems = [];
  let total = 0;

  for (let item of cart.items) {
    const book = await Book.findById(item.book);
    if (book) {
      populatedItems.push({ book, quantity: item.quantity });
      total += book.price * item.quantity;
    }
  }

  res.render("cart/checkout.ejs", { cart: { items: populatedItems }, total });
}));

// Process Checkout Order Route
app.post("/checkout", wrapAsync(async (req, res) => {
  // Clear cart upon successful checkout order
  req.session.cart = { items: [] };
  res.render("cart/success.ejs", { orderId: "OOC-" + Math.floor(100000 + Math.random() * 900000) });
}));




//Clear Cart
app.post("/cart/clear", (req, res) => {
  req.session.cart = { items: [] };
  res.redirect("/cart");
});

//increase quantity
app.post("/cart/increase/:id", wrapAsync(async (req, res) => {
  const bookId = req.params.id;
  const cart = req.session.cart;

  const item = cart.items.find(i => i.book === bookId);
  if (item) item.quantity++;

  req.session.cart = cart;
  res.redirect("/cart");
}));

// decrease quantity
app.post("/cart/decrease/:id", wrapAsync(async (req, res) => {
  const bookId = req.params.id;
  const cart = req.session.cart;

  const item = cart.items.find(i => i.book === bookId);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i => i.book !== bookId);
    }
  }

  req.session.cart = cart;
  res.redirect("/cart");
}));

// remove item
app.post("/cart/remove/:id", wrapAsync(async (req, res) => {
  const bookId = req.params.id;
  const cart = req.session.cart;

  cart.items = cart.items.filter(i => i.book !== bookId);
  req.session.cart = cart;

  res.redirect("/cart");
}));

//Reviews - Post Route
app.post("/books/:id/reviews", wrapAsync(async(req, res) => {
  let book = await Book.findById(req.params.id);
  if (!book) {
      throw new ExpressError(404, "Book Not Found!");
  }
  let newReview = new Review(req.body.review);

  book.reviews.push(newReview);

  await newReview.save();
  await book.save();

  res.redirect(`/books/${book._id}`);
}));


// Delete Review Route
app.delete("/books/:id/reviews/:reviewId",
  wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;

    await Book.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/books/${id}`);
  })
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let {statusCode=500, message="Something went wrong!"} = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});