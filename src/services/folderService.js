import prisma from '../config/database.js';

const folderServices = {
  getAllFolders: async (userId) => {
    try {
      const folders = await prisma.folder.findMany({
        where: { ownerId: userId },
        include: {
          childFolders: true,
          files: true,
        },
      });
      return folders;
    } catch (error) {
      throw new Error('Failed to fetch folders');
    }
  },

  getFolderContents: async (folderId) => {
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: { childFolders: true, files: true },
      });

      return folder;
    } catch (error) {
      throw new Error('Failed to fetch child folders');
    }
  },

  createFolder: async (folderData) => {
    try {
      const folder = await prisma.folder.create({
        data: folderData,
        include: {
          childFolders: true,
          files: true,
        },
      });
      const parentFolder = await prisma.folder.findUnique({
        where: {
          id: folder.parentFolderId,
        },
        include: {
          childFolders: true,
          files: true,
        },
      });
      return { folder, parentFolder };
    } catch (error) {
      throw new Error('Failed to create folder');
    }
  },

  changeFolderName: async (folderId, folderTitle) => {
    const folder = await prisma.folder.update({
      where: { id: folderId },
      data: { title: folderTitle },
    });
    return folder;
  },

  addFolderToFolder: async (folderId, childId) => {
    const childIds = await getFolderChildren(childId);
    if (childIds.includes(folderId)) {
      throw new Error('Cannot move parent folder into a child folder');
    } else {
      try {
        const oldParentId = await prisma.folder.findUnique({
          where: { id: childId },
          select: { parentFolderId: true },
        });
        const childFolder = await prisma.folder.update({
          where: { id: childId },
          data: { parentFolderId: folderId },
          include: {
            childFolders: true,
            files: true,
          },
        });
        let parentFolder;
        if (folderId !== null) {
          parentFolder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: {
              childFolders: true,
              files: true,
            },
          });
        } else {
          parentFolder = null;
        }

        let oldParentFolder = null;
        if (oldParentId && oldParentId.parentFolderId) {
          oldParentFolder = await prisma.folder.findUnique({
            where: { id: oldParentId.parentFolderId },
            include: {
              childFolders: true,
              files: true,
            },
          });
        }
        return { parentFolder, childFolder, oldParentFolder };
      } catch (error) {
        throw new Error('Failed to add child');
      }
    }
  },

  deleteTrashContents: async (folderId) => {
    try {
      await prisma.file.deleteMany({
        where: { folderId },
      });
      await prisma.folder.deleteMany({
        where: {
          parentFolderId: folderId,
        },
      });
      const trashFolder = await prisma.folder.findUnique({
        where: { id: folderId },
      });
      return trashFolder;
    } catch (error) {
      throw new Error('Failed to delete trash contents');
    }
  },
};

const getFolderChildren = async (folderId) => {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      childFolders: true,
    },
  });

  if (!folder) {
    return [];
  }

  let ids = [];
  const fetchChildrenIds = async (folder) => {
    for (const child of folder.childFolders) {
      ids.push(child.id);
      const grandChildIds = await getFolderChildren(child.id);
      ids = ids.concat(grandChildIds);
    }
  };

  await fetchChildrenIds(folder);

  return ids;
};

export default folderServices;
