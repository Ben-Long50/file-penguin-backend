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

  getFoldersInFolder: async (folderId) => {
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        select: { childFolders: true },
      });

      return folder.childFolders;
    } catch (error) {
      throw new Error('Failed to fetch child folders');
    }
  },

  getFilesInFolder: async (folderId) => {
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        select: { files: true },
      });
      return folder.files;
    } catch (error) {
      throw new Error('Failed to fetch files');
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
      return folder;
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

  addChildToFolder: async (folderId, childId) => {
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
        const parentFolder = await prisma.folder.findUnique({
          where: { id: folderId },
          include: {
            childFolders: true,
            files: true,
          },
        });

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

  deleteFolder: async (folderId) => {
    try {
      await prisma.file.updateMany({
        where: { folderId },
        data: { folderId: null },
      });
      const folder = await prisma.folder.delete({
        where: {
          id: folderId,
          title: {
            notIn: ['Trash', 'All files'],
          },
        },
      });
      return folder;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Folder not found');
      }
      throw new Error('Failed to delete folder');
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
