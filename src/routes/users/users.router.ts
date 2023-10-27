import express from 'express';
import UserService from '../../services/UserService';
import { hideSensetiveUserData } from '../../lib/hideSensetiveData';
import { MongooseError } from 'mongoose';

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
  try {
    const users = await UserService.getAll();
    if (!users) {
      return res.status(404).json({
        success: false,
        message: 'No users data found',
      });
    }
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
});

usersRouter.get('/:username', async (req, res) => {
  try {
    const user = await UserService.getOne(req.params.username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user data found',
      });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
});

usersRouter.post('/createUser', async (req, res, next) => {
  try {
    const newUser = await UserService.create(req.body);
    return res.status(201).json({
      success: true,
      data: hideSensetiveUserData(newUser),
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

usersRouter.delete('/:username', async (req, res) => {
  try {
    const deletedUser = await UserService.remove(req.params.username);
    res
      .status(200)
      .json({ success: true, data: `User ${req.params.username} deleted` });
  } catch (error) {
    if (error instanceof Error && error.message === 'Username does`nt exists')
      return res.status(400).json({ success: false, message: error.message });
    return res
      .status(501)
      .json({ success: false, message: `Error deleting user ${error}` });
  }
});

usersRouter.put('/:username', async (req, res) => {
  try {
    const updatedUser = await UserService.update(req.params.username, req.body);
    if (!updatedUser)
      return res
        .status(400)
        .json({ success: false, message: 'User is not exists' });
    return res
      .status(200)
      .json({ success: true, data: `User ${req.params.username} updated` });
  } catch (error) {
    if (error instanceof MongooseError) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res
      .status(501)
      .json({ success: false, message: `Error creating user ${error}` });
  }
});

export default usersRouter;
