interface CreateCommentInput {
    taskId: string;
    userId: string;
    content: string;
}
interface UpdateCommentInput {
    commentId: string;
    userId: string;
    content: string;
}
declare const _default: {
    createComment: ({ taskId, userId, content, }: CreateCommentInput) => Promise<any>;
    getCommentsByTask: (taskId: string, userId: string) => Promise<any>;
    updateComment: ({ commentId, userId, content, }: UpdateCommentInput) => Promise<any>;
    deleteComment: (commentId: string, userId: string) => Promise<void>;
};
export = _default;
//# sourceMappingURL=commentService.d.ts.map