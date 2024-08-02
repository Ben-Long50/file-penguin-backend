import prisma from '../config/database.js';

const folderServices = {
  getAllFolders: async (userId) => {
    try {
      const folders = await prisma.folder.findMany({
        where: { ownerId: userId },
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
      });
      return folder;
    } catch (error) {
      throw new Error('Failed to create folder');
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
          AND: [
            { id: folderId },
            {
              title: {
                notIn: ['Trash', 'All files'],
              },
            },
          ],
        },
      });
      return folder;
    } catch (error) {
      throw new Error('Failed to delete folder');
    }
  },
};

export default folderServices;
