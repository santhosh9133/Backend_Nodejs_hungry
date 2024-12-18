const express = require("express");
const dotenv = require('dotenv'); // dotenv is case-sensitive.
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

// Load environment variables before accessing them
dotenv.config();

// Port configuration
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Replace body-parser with built-in Express JSON parser

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Define routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
    res.send("Welcome to SUBY");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started and running on port ${PORT}`);
});