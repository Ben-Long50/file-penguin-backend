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

  getNestedContents: async (folderId) => {
    try {
      const getNestedIds = async (parentId) => {
        const folder = await prisma.folder.findUnique({
          where: { id: parentId },
          include: { childFolders: true, files: true },
        });

        const folderIds = [folder.id];

        const fileIds = folder.files.map((file) => file.id);

        if (folder && folder.childFolders.length > 0) {
          const childFolderPromises = folder.childFolders.map(
            async (childFolder) => getNestedIds(childFolder.id),
          );

          const childIds = await Promise.all(childFolderPromises);
          const allFolderIds = folderIds.concat(
            childIds.map((child) => child.folderIds).flat(),
          );
          const allFileIds = fileIds.concat(
            childIds.map((child) => child.fileIds).flat(),
          );

          return { folderIds: allFolderIds, fileIds: allFileIds };
        }

        return { folderIds, fileIds };
      };

      const { folderIds, fileIds } = await getNestedIds(folderId);

      return { folderIds, fileIds };
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
      let parentFolder;
      if (folder.parentFolderId !== null) {
        parentFolder = await prisma.folder.findUnique({
          where: {
            id: folder.parentFolderId,
          },
          include: {
            childFolders: true,
            files: true,
          },
        });
      } else {
        parentFolder = null;
      }
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

  deleteFolder: async (folderId) => {
    try {
      await prisma.folder.delete({
        where: {
          id: folderId,
        },
      });
    } catch (error) {
      throw new Error('Failed to delete folder');
    }
  },

  deleteFolders: async (trashFolderId, folderIdArray) => {
    try {
      await prisma.folder.deleteMany({
        where: {
          id: {
            in: folderIdArray,
          },
        },
      });
      const trashFolder = await prisma.folder.findUnique({
        where: { id: trashFolderId },
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
