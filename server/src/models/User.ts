import mongoose = require("mongoose");

interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1 });

const User =
  (mongoose.models.User as mongoose.Model<IUser> | undefined) ||
  mongoose.model<IUser>("User", userSchema);

export = User;
