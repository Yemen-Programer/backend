const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const contentRoutes = require("./routes/contentRoutes");
const userRoutes = require('./routes/UserRoutes');
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes')
const voteRoutes = require('./routes/voteRoutes')
const WishlistRoutes = require('./routes/wishlistRoutes')
const Search = require('./routes/search')
const app = express();

// Middleware
app.use(cors({
  origin: 'https://saudiheritage2-five.vercel.app', // عنوان الفرونت إند بالضبط
  credentials: true, // السماح بإرسال الكوكيز
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


// خدمة الملفات الثابتة للصور
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/content", contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/votes', voteRoutes);
app.use('/wishlist', WishlistRoutes);
app.use('/search', Search);
// Route أساسي
app.get("/", (req, res) => {
  res.json({ message: "Heritage Content Management API" });
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// تشغيل السيرفر
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

module.exports = app;
