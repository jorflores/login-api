const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/routeuser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_DB =process.env.MONGO_DB || "mongodb://127.0.0.1:27017/api_login_android";
dbConnect();

app.use(express.json());
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Servidor de NodeJS en el puerto: ${PORT}`);
});

function dbConnect() {
  if (process.env.MONGO_DB) {
    console.log("Conectado en MongoDB Cloud!");
  } else {
    console.log(`Conectado a instancia local de MongoDB : ${MONGO_DB}`);
  }

  mongoose.connect(MONGO_DB).then(() => console.log("Conexión exitosa!"));
}
