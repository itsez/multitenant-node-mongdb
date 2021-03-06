const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    name: String,
    collectionName: String,
  },
  { timestamps: true }
);

export default AccountSchema;
