import express from 'express';
import UserService from '../../services/UserService';
import path from 'path';

const adminUserRouter = express.Router();

adminUserRouter.get('/users', async (req, res) => {
  const users = await UserService.getAll();
  res.status(200).json(users);
});

adminUserRouter.get('/users/:id', async (req, res) => {
  const user = await UserService.getOne(req.params.id);
  res.status(200).json(user);
});

adminUserRouter.post('/users', async (req, res) => {
  try {
    const newUser = await UserService.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(501).json(`Error creating user ${error}`);
  }
});

adminUserRouter.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await UserService.update(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(501).json(`Error creating user ${error}`);
  }
});

adminUserRouter.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await UserService.remove(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(501).json(`Error creating user ${error}`);
  }
});

// adminUserRouter.get('/', (req, res) => {
//   res.sendFile(
//     path.join(__dirname, '..', '..', '..', 'public', 'admin', 'index.html')
//   );
// });
export default adminUserRouter;
