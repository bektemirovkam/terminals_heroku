
const {Schema, model} = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
  canEdit: {
    default: false,
    type: Boolean
  },
});


userSchema.set("toJSON", {
  transform: function (_, obj) {
    delete obj.password;
    return obj;
  },
});

module.exports = model("User", userSchema);
