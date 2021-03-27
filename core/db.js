const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://Kamil:q2e4KYkARz4r4Bq@cluster0.ot3mv.mongodb.net/terminal-management?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

module.exports = db;
module.exports = mongoose;


