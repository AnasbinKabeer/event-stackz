// app/lib/dataModel.js
import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  id: String,
  name: String,
});

// Prevent model overwrite in dev/hot reload
export default mongoose.models.Data || mongoose.model("Data", DataSchema);
