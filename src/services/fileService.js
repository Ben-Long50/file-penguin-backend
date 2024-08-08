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
    try {
      const file = await prisma.file.create({
        data: fileData,
      });
      return file;
    } catch (error) {
      throw new Error('Failed to create folder');
    }
  },

  addFileToFolder: async (folderId, fileId) => {
    try {
      const oldFileData = await prisma.file.findUnique({
        where: { id: fileId },
        select: { folderId: true },
      });
      console.log(oldFileData);
      const newFileData = await prisma.file.update({
        where: { id: fileId },
        data: { folderId },
      });
      console.log(newFileData);
      const newParentFolder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: {
          childFolders: true,
          files: true,
        },
      });
      const oldParentFolder = await prisma.folder.findUnique({
        where: { id: oldFileData.folderId },
        include: {
          childFolders: true,
          files: true,
        },
      });
      return { newParentFolder, oldParentFolder };
    } catch (error) {
      throw new Error('Failed to add child');
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
