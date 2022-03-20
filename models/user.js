const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    password: String,
    firstName: String,
    lastName: String,
    code: String, //for password resets and verification
    admin: { type: Boolean, default: false },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    permissions: { type: Map, default: {} },
  },
  { timestamps: true }
);

export default UserSchema;
