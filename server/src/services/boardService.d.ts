interface BoardColumnInput {
    _id?: string;
    title: string;
    order: number;
}
interface CreateBoardInput {
    workspaceId: string;
    userId: string;
    name: string;
    description?: string;
    columns?: BoardColumnInput[];
}
interface UpdateBoardInput {
    boardId: string;
    userId: string;
    name?: string;
    description?: string;
    columns?: BoardColumnInput[];
    isArchived?: boolean;
}
declare const _default: {
    createBoard: ({ workspaceId, userId, name, description, columns, }: CreateBoardInput) => Promise<any>;
    getBoardsByWorkspace: (workspaceId: string, userId: string) => Promise<any>;
    getBoardById: (boardId: string, userId: string) => Promise<any>;
    updateBoard: ({ boardId, userId, name, description, columns, isArchived, }: UpdateBoardInput) => Promise<any>;
    deleteBoard: (boardId: string, userId: string) => Promise<void>;
};
export = _default;
//# sourceMappingURL=boardService.d.ts.map