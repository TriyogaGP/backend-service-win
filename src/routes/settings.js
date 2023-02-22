const { Router } = require('express');
const {
  updateFile,
  updateBerkas,
  getEncrypt,
  getDecrypt,
  getRole,
  getMenu,
  getMenuSequence,
  postMenu,
  postSequenceMenu,
  getKurir,
  getKurirServiceBy,
  getPayment,
  getWilayah,
  getLoggerAdmin,
  getLoggerPeserta,
  getMeasurement,
  getNotification,
  postNotification,
  // option
  getPeserta,
  getKategoriLelang,
  getBarangLelang,
  getEvent,
  getLot,
  optionRole,
} = require('../controllers/settings.controler')
const { uploadFile } = require('../middleware/uploadFile')
const { uploadBerkas } = require('../middleware/uploadBerkas')
const { verifyToken } = require('../middleware/VerifyToken');

module.exports = models => {
  const route = Router();
  route.route('/updateFile').post(uploadFile, updateFile(models))
  route.route('/updateBerkas').post(uploadBerkas, updateBerkas(models))
  route.route('/encryptPass').get(getEncrypt())
  route.route('/decryptPass').get(getDecrypt())
  route.route('/getRole').get(verifyToken, getRole(models))
  route.route('/getMenu').get(verifyToken, getMenu(models))
  route.route('/getMenuSequence').get(verifyToken, getMenuSequence(models))
  route.route('/postMenu').post(verifyToken, postMenu(models))
  route.route('/postSequenceMenu').post(verifyToken, postSequenceMenu(models))
  route.route('/getKurir').get(verifyToken, getKurir(models))
  route.route('/getKurirService/:idKurir').get(verifyToken, getKurirServiceBy(models))
  route.route('/getPayment').get(verifyToken, getPayment(models))
  route.route('/getWilayah').get(verifyToken, getWilayah(models))
  route.route('/getLoggerAdmin').get(verifyToken, getLoggerAdmin(models))
  route.route('/getLoggerPeserta').get(verifyToken, getLoggerPeserta(models))
  route.route('/getMeasurement').get(verifyToken, getMeasurement(models))
  route.route('/getNotification').get(verifyToken, getNotification(models))
  route.route('/postNotification').post(verifyToken, postNotification(models))

  //Options Dropdown
  route.route('/optionUser').get(getPeserta(models))
  route.route('/optionKategori').get(getKategoriLelang(models))
  route.route('/optionBarangLelang').get(getBarangLelang(models))
  route.route('/optionEvent').get(getEvent(models))
  route.route('/optionLot').get(getLot(models))
  route.route('/optionRole').get(optionRole(models))
  
  return route;
}