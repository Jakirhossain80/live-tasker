const getWorkspaceRoom = (workspaceId: string) => {
  return `workspace:${workspaceId}`;
};

const getBoardRoom = (boardId: string) => {
  return `board:${boardId}`;
};

export = {
  getWorkspaceRoom,
  getBoardRoom,
};
