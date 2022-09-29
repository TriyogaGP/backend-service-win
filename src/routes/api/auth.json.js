const { Router } = require('express');
const {
  login,
  register,
  blastEmail,
  forgotPass,
  updateProfile,
  updateFotoProfile,
  getProfile,
  getAddress,
  testing,
} = require('../../controllers/api-controller/auth.controller')
const { uploadFile } = require('../../middleware/uploadFile')

module.exports = models => {
  const route = Router();

  route.route('/login').post(login(models))
  route.route('/register').post(register(models))
  route.route('/blastEmail').post(blastEmail())
  route.route('/forgotPass').post(forgotPass(models))
  route.route('/updateProfile').post(updateProfile(models))
  route.route('/updateFotoProfile').post(uploadFile, updateFotoProfile(models))
  route.route('/getProfile/:idPeserta').get(getProfile(models))
  route.route('/getAddress/:idPeserta').get(getAddress(models))
  route.route('/testing').get(testing(models))
  
  return route;
}