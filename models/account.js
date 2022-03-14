const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statuses = ["owner", "admin", "editor"];
const AccountSchema = new Schema(
  {
    name: String,
    collectionName: String,
  },
  { timestamps: true }
);

export default AccountSchema;
