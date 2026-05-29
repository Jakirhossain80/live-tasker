import type { Server } from "socket.io";
declare const _default: {
    setSocketServer: (socketServer: Server) => void;
    getSocketServer: () => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
    emitTaskCreated: (task: any) => void;
    emitTaskUpdated: (task: any) => void;
    emitTaskMoved: (task: any) => void;
    emitTaskDeleted: (payload: {
        taskId: string;
        workspaceId: string;
        boardId: string;
    }) => void;
    emitCommentAdded: (comment: any) => void;
};
export = _default;
//# sourceMappingURL=socketEmitter.d.ts.map