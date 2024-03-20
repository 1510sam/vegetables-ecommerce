const sessionStorage = require("node-sessionstorage");
const User = require("../Models/account");
const sessionstorage = require("node-sessionstorage");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jwt_secret = "fkacmwlfkawnclamxkj()31232n12j2kl12h2";
const handelLogin = (req, res) => {
  return res.render("login", { message: null });
};

const handelRegister = (req, res) => {
  res.render("register");
};

const registerUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    addess: req.body.address,
    phonenuber: req.body.phonenumber,
  });

  try {
    await user.save();
    req.session.message = {
      type: "success",
      message: "User added successfully !",
    };
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const users = await User.findOne({ email, password });
    if (users) {
      sessionStorage.setItem("admin_login", req.body.email);
      return res.redirect("/dashbroad");
    } else {
      return res.render("login", { message: "Invalid username or password" });
    }
  } catch (error) {}
};

const logoutUser = async (req, res) => {
  sessionStorage.removeItem("admin_login");
  return res.redirect("/");
};

const registerApi = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    // const oldUser = User.findOne({ email });
    // if (oldUser) {
    //   return res.status(200).json({ error: "Email Exists" });
    // }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginApi = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, Jwt_secret);

      if (res.status(201)) {
        return res.json({ status: "ok", data: token });
      } else {
        return res.json({ error: "error" });
      }
    }
    return res.json({ status: "error", error: "Invalid Password" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userData = async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, Jwt_secret);
    const userEmail = user.email;
    await User.findOne({ email: userEmail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((err) => {
        res.send({ status: "error", data: err });
      });
  } catch (error) {}
};

module.exports = {
  handelLogin,
  handelRegister,
  registerUser,
  loginUser,
  logoutUser,
  registerApi,
  loginApi,
  userData,
};
