import mongoose = require("mongoose");
declare const taskPriorities: readonly ["low", "medium", "high", "urgent"];
type TaskPriority = (typeof taskPriorities)[number];
interface ITask {
    workspace: mongoose.Types.ObjectId;
    board: mongoose.Types.ObjectId;
    status: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    assignees: mongoose.Types.ObjectId[];
    priority: TaskPriority;
    dueDate?: Date;
    labels: string[];
    order: number;
    createdBy: mongoose.Types.ObjectId;
    isArchived: boolean;
}
declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, mongoose.DefaultSchemaOptions> & ITask & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, ITask>;
export = Task;
//# sourceMappingURL=Task.d.ts.map