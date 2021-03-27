const { Schema, model } = require("mongoose");

const terminalSchema = new Schema(
  {
    city: {
      type: String,
      require: true,
    },
    organization: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    model: String,
    yearOfIssue: Number,
    isOnline: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Terminal", terminalSchema);
