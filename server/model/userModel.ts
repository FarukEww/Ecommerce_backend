import mongoose, { Schema, Types } from "mongoose";
// import mongoose{Schema} from "mongoose";

export interface UserI {
  name: String;
  email: String;
  password: String;
 
  mobile_no:number
}

const userSchema = new Schema<UserI>(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    mobile_no: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserI>("User", userSchema);
export default User;

