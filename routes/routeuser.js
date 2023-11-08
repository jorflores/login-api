const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const verifyToken = require("../middleware/verify");
const bcrypt = require("bcrypt");

// Registration Endpoint
app.post("/add", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email || password) {
      return res.status(401).json({ message: "email o contraseña no fueron proporcionados" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "El correo ya se encuentra registrado" });
    }

    let hashed_password = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email: email,
      password: hashed_password,
    });
    await newUser.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Revisamos si el usuario existe.
    const user = await User.findOne({ email });

    // Revisamos si el usuario no existe y si la contraseña no es la misma
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Credenciales incorrectas", login: false, token:{} });
    }

    // Generamos el token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, userId: user._id },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({message:"Login exitoso", login: true, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error", login: false,token:{} });
  }
});

app.get("/protected", verifyToken, (req, res) => {
  console.log(req.user.userId);
  res.status(200).json({ message: "Acceso permitido", login: true });
});



module.exports = app;
