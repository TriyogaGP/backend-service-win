const { Router } = require('express');
const {
  loginAdmin,
  loginPeserta,
  getProfile,
  getAddress,
  getDashboard,
  ubahKataSandi,
} = require('../controllers/auth.controller')

module.exports = models => {
  const route = Router();

  route.route('/loginAdmin').post(loginAdmin(models))
  route.route('/loginPeserta').post(loginPeserta(models))
  route.route('/getProfile').get(getProfile(models))
  route.route('/getAddress/:idLogin').get(getAddress(models))
  route.route('/getDashboard').get(getDashboard(models))
  route.route('/ubahKataSandi').post(ubahKataSandi(models))
  
  return route;
}