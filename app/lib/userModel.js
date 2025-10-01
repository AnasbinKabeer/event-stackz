import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  shortName: { type: String, required: true },
  password: { type: String, required: true }, // plain text
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
