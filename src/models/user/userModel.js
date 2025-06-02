import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_on: {type: Date, require: true},
    token: {type: String}
})

const userModel =
  mongoose.model.user || mongoose.model("user", userSchema);

  export default userModel