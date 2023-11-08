const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: String,
  password: String
});

module.exports = mongoose.model("users", UserSchema);
