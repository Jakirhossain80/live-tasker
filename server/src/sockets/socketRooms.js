"use strict";
const getWorkspaceRoom = (workspaceId) => {
    return `workspace:${workspaceId}`;
};
const getBoardRoom = (boardId) => {
    return `board:${boardId}`;
};
module.exports = {
    getWorkspaceRoom,
    getBoardRoom,
};
//# sourceMappingURL=socketRooms.js.map