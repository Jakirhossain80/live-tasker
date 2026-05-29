import mongoose = require("mongoose");
interface IComment {
    task: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    isEdited: boolean;
    editedAt?: Date;
}
declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, mongoose.DefaultSchemaOptions> & IComment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IComment>;
export = Comment;
//# sourceMappingURL=Comment.d.ts.map