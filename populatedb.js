import userController from './src/controllers/userController.js';

const req = {
  body: {
    username: 'benjl',
    password: 'niggle',
    confirmPassword: 'niggle',
  },
};

const res = {
  status: (code) => ({
    json: (data) => {
      console.log(`Response Status: ${code}`, data);
    },
  }),
};

const next = (error) => {
  if (error) {
    console.error('Error:', error);
  }
};

const runCreateUser = async () => {
  for (const middleware of userController.createUser) {
    if (typeof middleware === 'function') {
      await middleware(req, res, next);
    }
  }
};

runCreateUser().then(() => {
  console.log('User creation process completed.');
});
