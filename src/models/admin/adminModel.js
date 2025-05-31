import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_on: {type: Date, require: true},
    token: {type: String}
})

const adminModel =
  mongoose.model.admin || mongoose.model("admin", adminSchema);

  export default adminModel