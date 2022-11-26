const { Router } = require('express');
const {
    getKategoriLelang,
    getBarangLelang,
    getEventLelang,
    getLotLelang,
    getPembelianNPL,
    getDataNPL,
    crudPembelianNPL,
} = require('../../controllers/api-controller/lelang.controller')
const { uploadFile } = require('../../middleware/uploadFile')

module.exports = models => {
  const route = Router();

  route.route('/getKategoriLelang').get(getKategoriLelang(models))
  route.route('/getBarangLelang').get(getBarangLelang(models))
  route.route('/getEventLelang').get(getEventLelang(models))
  route.route('/getLotLelang').get(getLotLelang(models))
  route.route('/getPembelianNPL').get(getPembelianNPL(models))
  route.route('/getDataNPL').get(getDataNPL(models))
  route.route('/postPembelianNPL').post(uploadFile, crudPembelianNPL(models))
  
  return route;
}