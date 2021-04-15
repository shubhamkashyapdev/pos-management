import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please Enter A Username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please Add An Email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/,
        'Please Add A Valid Email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please Add A Password'],
      minLength: [6, 'Please Enter A Password With 6 Character Or More'],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, 'Please Enter Your Full Name'],
    },
    role: {
      type: String,
      enum: ['cashier', 'user'],
      default: 'user',
    },
    lastActive: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

// hash password //
UserSchema.pre('save', async function (next) {
  console.log(this.password);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// send token //
UserSchema.methods.getToken = async function () {
  const token = await jwt.sign({ user: this.id }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRE}`,
  });
  return token;
};

// match user entered password to hashed password in the database //
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

// User.collection.createIndex({
//   username: 'text',
//   fullname: 'text',
// });

export default User;
