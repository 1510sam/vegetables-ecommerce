const express = require("express");
const router = express.Router();
const Category = require("../Models/Category");
const Prodcucts = require("../Models/prodcucts");
const News = require("../Models/News");
const connectDB = require("../Config/connectDB");
const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3307,
  password: "",
  database: "vegetable_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.get("/api/category", async (req, res) => {
  try {
    const sql = "SELECT * FROM categories ";
    connection.query(sql, (err, result) => {
      if (err) return res.json({ Message: "error" });
      return res.json(result);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get("/api/category=:id", async (req, res) => {
  try {
    const sql = "SELECT * FROM priductsses WHERE categoryId = ?";
    const id = req.params.id;
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.json({ Message: "Error in SQL query" });
      }
      return res.json(result);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get("/api/products", async (req, res) => {
  try {
    const products = await Prodcucts.find().populate("categoryId");
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/api/products/sql", async (req, res) => {
  try {
    const sql = "SELECT * FROM priductsses ";
    connection.query(sql, (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.json({ Message: "Error in SQL query" });
      }
      return res.json(result);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get("/api/products/:id", (req, res) => {
  try {
    const sql = "SELECT * FROM priductsses WHERE id = ?";
    const id = req.params.id;
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.json({ Message: "Error in SQL query" });
      }
      return res.json(result);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

router.get("/api/products/search/:name", async (req, res) => {
  const sql = `SELECT * FROM priductsses WHERE name = ?`;
  const name = req.params.name;
  connection.query(sql, [name], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

router.get("/api/News", async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/api/News/sql", async (req, res) => {
  try {
    const sql = "SELECT * FROM news";
    connection.query(sql, (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.json({ Message: "Error in SQL query" });
      }
      return res.json(result);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
