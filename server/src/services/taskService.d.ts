declare const taskPriorities: readonly ["low", "medium", "high", "urgent"];
type TaskPriority = (typeof taskPriorities)[number];
interface CreateTaskInput {
    boardId: string;
    userId: string;
    status: string;
    title: string;
    description?: string;
    assignees?: string[];
    priority?: TaskPriority;
    dueDate?: string | null;
    labels?: string[];
    order?: number;
}
interface UpdateTaskInput {
    taskId: string;
    userId: string;
    status?: string;
    title?: string;
    description?: string;
    assignees?: string[];
    priority?: TaskPriority;
    dueDate?: string | null;
    labels?: string[];
    order?: number;
}
interface MoveTaskInput {
    taskId: string;
    userId: string;
    status: string;
    order: number;
}
declare const _default: {
    taskPriorities: readonly ["low", "medium", "high", "urgent"];
    createTask: ({ boardId, userId, status, title, description, assignees, priority, dueDate, labels, order, }: CreateTaskInput) => Promise<any>;
    getTasksByBoard: (boardId: string, userId: string) => Promise<any>;
    getTaskById: (taskId: string, userId: string) => Promise<any>;
    updateTask: ({ taskId, userId, status, title, description, assignees, priority, dueDate, labels, order, }: UpdateTaskInput) => Promise<any>;
    moveTask: ({ taskId, userId, status, order }: MoveTaskInput) => Promise<any>;
    deleteTask: (taskId: string, userId: string) => Promise<void>;
};
export = _default;
//# sourceMappingURL=taskService.d.ts.map