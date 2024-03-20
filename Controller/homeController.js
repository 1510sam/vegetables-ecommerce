const express = require("express");
const User = require("../Models/account");
const News = require("../Models/News");
const handleHomepage = async (req, res) => {
  const dataUser = await User.countDocuments();
  const dataNews = await News.countDocuments();
  return res.render("index.ejs", {
    data: dataUser,
    news: dataNews,
    title: "home page",
    image:
      "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
    css: "style.css",
  });
};

module.exports = {
  handleHomepage,
};
