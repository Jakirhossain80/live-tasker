import mongoose = require("mongoose");
declare const activityActions: readonly ["created", "updated", "deleted", "moved", "commented", "assigned", "completed"];
type ActivityAction = (typeof activityActions)[number];
declare const activityEntityTypes: readonly ["workspace", "board", "task", "comment"];
type ActivityEntityType = (typeof activityEntityTypes)[number];
interface IActivityLog {
    workspace: mongoose.Types.ObjectId;
    board?: mongoose.Types.ObjectId;
    task?: mongoose.Types.ObjectId;
    actor: mongoose.Types.ObjectId;
    action: ActivityAction;
    entityType: ActivityEntityType;
    entityId: mongoose.Types.ObjectId;
    message: string;
    metadata?: Record<string, unknown>;
}
declare const ActivityLog: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog, {}, mongoose.DefaultSchemaOptions> & IActivityLog & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IActivityLog>;
export = ActivityLog;
//# sourceMappingURL=ActivityLog.d.ts.map