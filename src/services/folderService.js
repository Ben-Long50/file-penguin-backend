import prisma from '../config/database.js';

const folderServices = {
  getAllFolders: async () => {
    try {
      const folders = await prisma.folder.findMany();
      return folders;
    } catch (error) {
      throw new Error('Failed to fetch folders');
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

  deleteFolder: async (id) => {
    try {
      const folder = await prisma.folder.delete({
        where: { id: Number(id) },
      });
      return folder;
    } catch (error) {
      throw new Error('Failed to delete folder');
    }
  },
};

export default folderServices;
