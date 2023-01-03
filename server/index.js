const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

app.get('/', (req, res) => res.send('Hellu !'));

const port = process.env.PORT || 8000;

dotenv.config();
//CONNECT MONGODB
mongoose.connect(process.env.MONGODB_URL, () => {
	console.log('Connect to MongoDB');
});

app.listen(port, () => console.log(`Server started on port ${port}`));