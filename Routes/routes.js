// Controller cho MySQL

const express = require("express");
const router = express.Router();
const multer = require("multer");
const homeController = require("../Controller/homeController");
const ProductController = require("../Controller/ProdcutController");
const categoryController = require("../Controller/CategoryController");
const userController = require("../Controller/userController");
const newsController = require("../Controller/NewsController");
const prodcut = require("../Models/prodcucts");
const Category = require("../Models/Category");
const connectDB = require("../Config/connectDB");
const mysql = require("mysql2");
const News = require("../Models/News");

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

//save of images
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

//save form images product
var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/imageProducts");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var uploadimage = multer({
  storage: storage1,
}).single("image");

router.get("/dashbroad", homeController.handleHomepage);

router.get("/add", categoryController.HandleAddCategory);

// create category
router.post("/add_category", upload, async (req, res) => {
  try {
    const Categories = new Category({
      name: req.body.name,
      desc: req.body.desc,
      image: req.file.filename,
    });
    //save in mongodb
    await Categories.save();
    // mysql save the category
    const sql =
      "INSERT INTO categories ( `name` ,`desc` ,`image`) VALUES (?,?,?)";
    connection.query(
      sql,
      [req.body.name, req.body.desc, req.file.filename],
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
      message: "User added successfully !",
    };
    res.redirect("/category");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

router.get("/category", categoryController.HandleCategory);

router.get("/showNews", newsController.HandleNews);
router.get("/addNews", newsController.HandleAddNews);

// create news
router.post("/add_news", upload, newsController.HandleInsertNews);

//get form update News
router.get("/updateNews/:id", newsController.HandleEditNews);
router.post("/updateNews/:id", newsController.HandleUpdateNews);

//delete news
router.get("/deleteNews/:id", newsController.HandleDeleteNews);

//get form update Category
router.get("/update/:id", categoryController.HandleEditCategory);

router.post("/update/:id", categoryController.HandleUpdateCategory);

//delete category
router.get("/delete/:id", categoryController.handleDeleteCategory);

// managanment Product
router.get("/product", ProductController.handleProducts);

router.get("/addProduct", ProductController.handelAddProduct);

router.post("/saveProduct", uploadimage, async (req, res) => {
  //Insert into mongodb Database
  const prodcuts = new prodcut({
    name: req.body.name,
    price: req.body.price,
    sales: req.body.sales,
    image: req.body.image,
    category_Id: req.body.categoryId,
    status: req.body.status,
    desc: req.body.desc,
  });

  try {
    await prodcuts.save();
    // Insert into mysql database
    const sql =
      "INSERT INTO priductsses(`id` ,`name` , `desc` ,`image` , price , `status` ,sales ,categoryId) values(?,?,?,?,?,?,?,?)";
    connection.query(
      sql,
      [
        req.body._id,
        req.body.name,
        req.body.desc,
        req.body.image,
        req.body.price,
        req.body.status,
        req.body.sales,
        req.body.categoryId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting into MySQL: ", err.message);
        } else {
          console.log("Inserted prodcuts MySQL successfully");
        }
      }
    );
    req.session.message = {
      type: "success",
      message: "Product added successfully !",
    };
    res.redirect("/product");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//delete products
router.get("/product/delete/:id", ProductController.handelDeleteProduct);

//show usser
router.get("/showUser", userController.showUser);

module.exports = router;
