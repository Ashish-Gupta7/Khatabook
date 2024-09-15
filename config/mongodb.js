const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoDB");

const dbURI = process.env.MONGO_DB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    dbgr(
      `Connected to MongoDB - Host: ${result.connection.host}, Database: ${result.connection.name}`
    );
  })
  .catch((err) => {
    dbgr(`Failed to connect to MongoDB: ${err.message}`);
  });

const db = mongoose.connection;
module.exports = db;
