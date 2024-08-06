import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import userServices from '../services/userService.js';

const userController = {
  getUser: async (req, res) => {
    try {
      const user = await userServices.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: [
    body('username', 'Username must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape()
      .custom(async (value) => {
        const user = await userServices.getUserByUsername(value);
        if (user) {
          throw new Error('Username already exists');
        }
        return true;
      }),

    body('password', 'Password must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),

    body('confirmPassword', 'Passwords must match')
      .trim()
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return false;
        }
        return true;
      }),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const userData = {
            username: req.body.username,
            password: hashedPassword,
          };
          const newUser = await userServices.createUser(userData);
          res.status(200).json(newUser);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    },
  ],

  signinUser: [
    body('username', 'Username does not exist')
      .trim()
      .escape()
      .custom(async (value) => {
        const user = await userServices.getUserByUsername(value);
        if (!user) {
          throw new Error('Username does not exist');
        }
        return true;
      }),
    body('password', 'Incorrect password')
      .trim()
      .escape()
      .custom(async (value, { req }) => {
        const user = await userServices.getUserByUsername(req.body.username);
        if (!user) {
          return false;
        }
        const match = await bcrypt.compare(value, user.password);
        if (!match) {
          throw new Error('Incorrect password');
        }
        return true;
      }),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      }

      try {
        const user = await userServices.getUserByUsername(req.body.username);
        jwt.sign(
          { user },
          process.env.JWT_SECRET,
          {
            expiresIn: '4h',
          },
          (err, token) => {
            if (err) {
              res.status(500).json({ message: 'Error generating token' });
            }
            res.status(200).json({
              token,
              user,
            });
          },
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  ],
};

export default userController;
