const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const app = express();

//Middleware to handle cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
//Connect to Database
connectDB();

//Middleware
app.use(express.json());

//Routes here
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);
//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})