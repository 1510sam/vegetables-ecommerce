const Category = require("../Models/Category");
const categories = require("../Models/Category");
const prodcucts = require("../Models/priductss");
const products = require("../Models/prodcucts");
const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "vegetable_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const handleProducts = async (req, res) => {
  const product = await products.find();
  return res.render("products", {
    title: "All Products",
    css: "style.css",
    product: product,
    image:
      "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
  });
};

const handelAddProduct = async (req, res) => {
  const catemb = await Category.find();
  const sql = "SELECT * FROM categories ";

  connection.query(sql, (err, result) => {
    if (err) {
      console.log("Error fetching categories");
      return res.status(500).send("Internal Server Error");
    }
    // Pass the result to the render function
    return res.render("addProducts", {
      title: "Add Products",
      css: "style.css",
      catemb: catemb,
      categories: result, // Use a more descriptive name like 'categories' instead of 'categorySql'
      image:
        "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
    });
  });
};

//delete Products
const handelDeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await products.findByIdAndDelete(id);
    // Redirect with a message
    req.session.message = {
      type: "info",
      message: "Product deleted successfully",
    };

    return res.redirect("/product");
  } catch (error) {
    return res.json({ message: error });
  }
};

//update product

module.exports = {
  handleProducts,
  handelAddProduct,
  handelDeleteProduct,
};
