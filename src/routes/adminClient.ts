import path from 'path';
import express from 'express';
import { checkAuth } from '../lib/checkauth';

const adminClient = express.Router();

adminClient.get('/login', (req, res) => {
  console.log('login');
  res.sendFile(
    path.join(__dirname, '..', '..', 'public', 'admin', 'index.html')
  );
});
adminClient.get('/*', checkAuth, (req, res) => {
  console.log('admin');

  res.sendFile(
    path.join(__dirname, '..', '..', 'public', 'admin', 'index.html')
  );
});

export default adminClient;
