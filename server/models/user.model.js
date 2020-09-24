const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

UserSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  return obj
}

const User = mongoose.model("User", UserSchema);

module.exports = User;