import prisma from '../config/database.js';

const fileServices = {
  getAllFilesByUser: async (userId) => {
    try {
      const trashFolder = await prisma.folder.findFirst({
        where: {
          ownerId: userId,
          title: 'Trash',
        },
        select: { id: true },
      });
      const files = await prisma.file.findMany({
        where: {
          ownerId: userId,
          OR: [
            {
              folderId: {
                not: trashFolder?.id,
              },
            },
            {
              folderId: null,
            },
          ],
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

  changeFileName: async (fileId, fileTitle) => {
    const file = await prisma.file.update({
      where: { id: fileId },
      data: { title: fileTitle },
    });
    return file;
  },

  addFileToFolder: async (folderId, fileId) => {
    try {
      const oldFileData = await prisma.file.findUnique({
        where: { id: fileId },
        select: { folderId: true },
      });
      await prisma.file.update({
        where: { id: fileId },
        data: { folderId },
      });
      let newParentFolder;
      if (folderId !== null) {
        newParentFolder = await prisma.folder.findUnique({
          where: { id: folderId },
          include: {
            childFolders: true,
            files: true,
          },
        });
      } else {
        newParentFolder = null;
      }
      let oldParentFolder;
      if (oldFileData.folderId !== null) {
        oldParentFolder = await prisma.folder.findUnique({
          where: { id: oldFileData.folderId },
          include: {
            childFolders: true,
            files: true,
          },
        });
      } else {
        oldParentFolder = null;
      }

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
