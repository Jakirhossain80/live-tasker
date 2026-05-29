import mongoose = require("mongoose");
declare const workspaceMemberRoles: readonly ["owner", "admin", "member"];
type WorkspaceMemberRole = (typeof workspaceMemberRoles)[number];
interface IWorkspaceMember {
    user: mongoose.Types.ObjectId;
    role: WorkspaceMemberRole;
    joinedAt: Date;
}
interface IWorkspace {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    members: IWorkspaceMember[];
    isArchived: boolean;
}
declare const Workspace: mongoose.Model<IWorkspace, {}, {}, {}, mongoose.Document<unknown, {}, IWorkspace, {}, mongoose.DefaultSchemaOptions> & IWorkspace & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IWorkspace>;
export = Workspace;
//# sourceMappingURL=Workspace.d.ts.map