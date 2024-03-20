const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      require: true,
    },
    detail: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", newsSchema);
