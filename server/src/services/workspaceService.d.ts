declare const workspaceMemberRoles: readonly ["owner", "admin", "member"];
type WorkspaceMemberRole = (typeof workspaceMemberRoles)[number];
type ManageableWorkspaceMemberRole = Exclude<WorkspaceMemberRole, "owner">;
interface CreateWorkspaceInput {
    name: string;
    description?: string;
    ownerId: string;
}
interface UpdateWorkspaceInput {
    workspaceId: string;
    userId: string;
    name?: string;
    description?: string;
    isArchived?: boolean;
}
interface AddMemberInput {
    workspaceId: string;
    actorId: string;
    userId?: string;
    email?: string;
    role: ManageableWorkspaceMemberRole;
}
interface UpdateMemberInput {
    workspaceId: string;
    actorId: string;
    userId: string;
    role: ManageableWorkspaceMemberRole;
}
interface RemoveMemberInput {
    workspaceId: string;
    actorId: string;
    userId: string;
}
interface JoinWorkspaceInput {
    workspaceId: string;
    userId: string;
}
interface ArchiveWorkspaceInput {
    workspaceId: string;
    userId: string;
}
declare const _default: {
    workspaceMemberRoles: readonly ["owner", "admin", "member"];
    createWorkspace: ({ name, description, ownerId, }: CreateWorkspaceInput) => Promise<any>;
    getWorkspaces: (userId: string) => Promise<any>;
    getWorkspaceById: (workspaceId: string, userId: string) => Promise<any>;
    updateWorkspace: ({ workspaceId, userId, name, description, isArchived, }: UpdateWorkspaceInput) => Promise<any>;
    archiveWorkspace: ({ workspaceId, userId }: ArchiveWorkspaceInput) => Promise<any>;
    addMember: ({ workspaceId, actorId, userId, email, role, }: AddMemberInput) => Promise<any>;
    joinWorkspace: ({ workspaceId, userId }: JoinWorkspaceInput) => Promise<any>;
    updateMember: ({ workspaceId, actorId, userId, role, }: UpdateMemberInput) => Promise<any>;
    removeMember: ({ workspaceId, actorId, userId, }: RemoveMemberInput) => Promise<void>;
};
export = _default;
//# sourceMappingURL=workspaceService.d.ts.map