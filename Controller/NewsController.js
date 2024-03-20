// Controller cho MongoDB

const multer = require("multer");
const News = require("../Models/News");
const express = require("express");
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

const HandleAddNews = (req, res) => {
  return res.render("add_news", {
    title: "add news",
    css: "style.css",
    image:
      "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
  });
};

const HandleInsertNews = async (req, res) => {
  try {
    const New = new News({
      title: req.body.title,
      desc: req.body.desc,
      detail: req.body.detail,
      image: req.body.image,
    });
    //save in mongodb
    await New.save();
    // mysql save the category
    const sql =
      "INSERT INTO news ( `title` ,`desc`, `detail` ,`image`) VALUES (?,?,?,?)";
    connection.query(
      sql,
      [req.body.title, req.body.desc, req.body.detail, req.body.image],
      (err, result) => {
        if (err) {
          console.error("Error inserting into MySQL: ", err.message);
        }
        console.log("Inserted into MySQL successfully");
      }
    );
    //
    req.session.message = {
      type: "success",
      message: "News added successfully !",
    };
    res.redirect("/showNews");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

const HandleNews = async (req, res) => {
  try {
    const data = await News.find().exec();
    return res.render("news", {
      data: data,
      title: "News",
      css: "style.css",
      image:
        "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

//get form update News
const HandleEditNews = async (req, res) => {
  try {
    let id = req.params.id;
    const news = await News.findById(id);

    if (!news) {
      return res.redirect("/showNews");
    }

    return res.render("updateNews", {
      css: "style.css",
      title: "update News",
      news: news,
      image:
        "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
//  update category
const HandleUpdateNews = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      title: req.body.title,
      desc: req.body.desc,
      detail: req.body.detail,
      image: req.body.image,
    };

    // Update MongoDB news using async/await
    const mongoResult = await News.findByIdAndUpdate(id, updateData);

    if (!mongoResult) {
      return res.json({ message: "News not found" });
    }

    // Update MySQL news using promises
    const sql =
      "UPDATE news SET `title` = ?, `desc` = ?, `detail` = ?, `image` = ? WHERE `id` = ?";

    const updateMySQLPromise = new Promise((resolve, reject) => {
      connection.query(
        sql,
        [req.body.title, req.body.desc, req.body.image, req.body.detail, id],
        (err, result) => {
          if (err) {
            reject(err); // Reject the promise on error
          } else {
            resolve({ message: "Updated into MySQL successfully" }); // Resolve with success message
            console.log(result);
          }
        }
      );
    });

    // Update MySQL and handle both success and error cases
    updateMySQLPromise
      .then((mysqlResult) => {
        console.log(mysqlResult.message);
        req.session.message = {
          type: "success",
          message: "News updated successfully (both MongoDB and MySQL)",
        };
        return res.redirect("/showNews"); // Redirect after successful updates
      })
      .catch((error) => {
        console.error("Error updating into MySQL: ", error.message);
        // Handle MySQL update error appropriately (e.g., rollback MongoDB update or send error response)
        // Consider retrying the update or logging for further analysis
      });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

//delete category
const HandleDeleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    await News.findByIdAndDelete(id);

    // mysql save the category
    const sql = "DELETE FROM news WHERE id = ?";
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error inserting into MySQL: ", err.message);
      }
      console.log("Deleted into MySQL successfully");
    });

    // Redirect with a message
    req.session.message = {
      type: "info",
      message: "New deleted successfully",
    };

    return res.redirect("/showNews");
  } catch (error) {
    return res.json({ message: error });
  }
};

module.exports = {
  HandleAddNews,
  HandleInsertNews,
  HandleNews,
  HandleEditNews,
  HandleUpdateNews,
  HandleDeleteNews,
};
