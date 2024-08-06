import prisma from '../config/database.js';

const fileServices = {
  getAllFilesByUser: async (userId) => {
    try {
      const files = await prisma.file.findMany({
        where: {
          ownerId: userId,
        },
      });
      return files;
    } catch (error) {
      throw new Error('Failed to get files');
    }
  },

  getFile: async (fileId) => {
    try {
      const file = await prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });
      return file;
    } catch (error) {
      throw new Error('Failed to get file');
    }
  },

  createFile: async (fileData) => {
    console.log(fileData);
    try {
      const file = await prisma.file.create({
        data: fileData,
      });
      return file;
    } catch (error) {
      throw new Error('Failed to create folder');
    }
  },

  deleteFile: async (fileId) => {
    try {
      await prisma.file.delete({
        where: { id: fileId },
      });
    } catch (error) {
      throw new Error('Failed to delete file');
    }
  },
};

export default fileServices;
