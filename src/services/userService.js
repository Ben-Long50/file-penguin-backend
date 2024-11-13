import prisma from '../config/database.js';

const userServices = {
  getUserById: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      throw new Error('Failed to find user');
    }
  },

  createUser: async (userData) => {
    try {
      const newUser = await prisma.user.create({
        data: {
          username: userData.username,
          password: userData.password,
          folders: {
            create: [{ title: 'All files' }, { title: 'Trash' }],
          },
        },
      });
      return newUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  getUserByUsername: async (username) => {
    try {
      console.log(username);

      const user = await prisma.user.findUnique({
        where: { username },
      });
      return user;
    } catch (error) {
      throw new Error('Failed to find user');
    }
  },
};

export default userServices;
