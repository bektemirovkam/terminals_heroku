const mongoose = require("../core/db");

const isValidObjectId = mongoose.Types.ObjectId.isValid;

module.exports = isValidObjectId;