const express = require("express");
const News = require("../../Models/News");
const app = express();

app.get("api/v1/news", async (req, res) => {
  const news = await News.find();
  if (!news) return res.json({ status: 404, message: "Something is wrong" });
  return res.json(news);
});
