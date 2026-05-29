import mongoose = require("mongoose");
interface IBoardColumn {
    title: string;
    order: number;
}
interface IBoard {
    workspace: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    columns: IBoardColumn[];
    createdBy: mongoose.Types.ObjectId;
    isArchived: boolean;
}
declare const Board: mongoose.Model<IBoard, {}, {}, {}, mongoose.Document<unknown, {}, IBoard, {}, mongoose.DefaultSchemaOptions> & IBoard & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IBoard>;
export = Board;
//# sourceMappingURL=Board.d.ts.map