const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const app = express();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");

// app.get('/', (req, res) => res.send('Hellu !'));

const port = process.env.PORT || 8000;
// const origin = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : '';

dotenv.config();
//CONNECT MONGODB
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connect to MongoDB");
});

// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);

const server = http.createServer(app);
server.listen(port, () => console.log(`Server started on port ${port}`));
