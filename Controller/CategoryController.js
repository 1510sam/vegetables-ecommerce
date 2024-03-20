const multer = require("multer");
const Category = require("../Models/Category");
const express = require("express");

const HandleAddCategory = (req, res) => {
  return res.render("add_category", {
    title: "add category",
    css: "style.css",
    image:
      "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
  });
};

const HandleCategory = async (req, res) => {
  try {
    const categories = await Category.find().exec();
    return res.render("category", {
      title: "Category",
      css: "style.css",
      category: categories,
      image:
        "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

//edit category
// const HandleEditCategory = async(req, res) => {
//   try {
//      let id = req.params.id
//      await Category.findById(id,(err, category)=>{
//           if(err)
//           {
//             return res.redirect("/category")
//           }else {
//             if(category == null){
//               return res.redirect("/category")
//             }
//             else {
//                return res.render("editCategory",{
//                  title: category ,
//                  category: category
//                })
//             }
//           }
//      })

//   } catch (error) {
//     return res.json({ message: error.message });
//   }
// }
//get form update Category
const HandleEditCategory = async (req, res) => {
  try {
    let id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
      return res.redirect("/category");
    }

    return res.render("editCategory", {
      css: "style.css",
      title: "edit Category",
      category: category,
      image:
        "https://img.freepik.com/free-vector/vegan-friendly-leaves-label-green-color_1017-25452.jpg?w=740&t=st=1704384258~exp=1704384858~hmac=9fffabebdbb3e16a1cc7fc4ea5bafa4eddebe6687e8ba8e6a9fa177deed34bb7",
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
//  update category
const HandleUpdateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      name: req.body.name,
      desc: req.body.desc,
    };

    // Update category using async/await
    const result = await Category.findByIdAndUpdate(id, updateData);

    if (!result) {
      return res.json({ message: "Category not found" });
    }
    req.session.message = {
      type: "success",
      message: "Category updated successfully",
    };
    return res.redirect("/category");
  } catch (error) {
    return res.json({ message: error.message });
  }
};

//delete category
const handleDeleteCategory = async (req, res) => {
  try {
    let id = req.params.id;

    // Find the category by ID
    const result = await Category.findByIdAndDelete(id);

    // Check if the result is not null and has an image property
    if (result && result.image !== '') {
      try {
        // Delete the associated image file
        fs.unlinkSync("./upload/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }

    // Redirect with a message
    req.session.message = {
      type: "info",
      message: "Category deleted successfully",
    };
    
    return res.redirect("/category");
  } catch (error) {
    return res.json({ message: error.message });
  }
};


module.exports = {
  HandleAddCategory,
  HandleCategory,
  HandleEditCategory,
  HandleUpdateCategory,
  handleDeleteCategory
};
