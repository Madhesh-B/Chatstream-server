import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    unique: true,
    required: true
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  let saltValue = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltValue);
})

const User = mongoose.model('Users', userSchema);

export default User;