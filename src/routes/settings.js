const { Router } = require('express');
const {
  updateFile,
  getEncrypt,
  getDecrypt,
  getRole,
  getMenu,
  getKurir,
  getKurirServiceBy,
  getPayment,
  getWilayah,
  getLoggerAdmin,
  getLoggerPeserta,
  getMeasurement,
} = require('../controllers/settings.controler')
const { uploadFile } = require('../middleware/uploadFile')

module.exports = models => {
  const route = Router();
  route.route('/updateFile').post(uploadFile, updateFile(models))
  route.route('/encryptPass').get(getEncrypt())
  route.route('/decryptPass').get(getDecrypt())
  route.route('/getRole').get(getRole(models))
  route.route('/getMenu').get(getMenu(models))
  route.route('/getKurir').get(getKurir(models))
  route.route('/getKurirService/:idKurir').get(getKurirServiceBy(models))
  route.route('/getPayment').get(getPayment(models))
  route.route('/getWilayah').get(getWilayah(models))
  route.route('/getLoggerAdmin').get(getLoggerAdmin(models))
  route.route('/getLoggerPeserta').get(getLoggerPeserta(models))
  route.route('/getMeasurement').get(getMeasurement(models))
  
  return route;
}