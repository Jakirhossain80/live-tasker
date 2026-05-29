import mongoose = require("mongoose");
interface IUser {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    isActive: boolean;
    lastLoginAt?: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export = User;
//# sourceMappingURL=User.d.ts.map