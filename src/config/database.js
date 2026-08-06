const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = 3000;

// MongoDB connection string URL
const databaseUrl = 'mongodb+srv://namastedev:i6tu8hf2aLf5_dd@namastenode.izq2yge.mongodb.net/?appName=NamasteNode';

// Connect to MongoDB using Mongoose
mongoose.connect(databaseUrl)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server only after database connection is successful
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });