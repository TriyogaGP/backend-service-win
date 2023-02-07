const { Router } = require('express');
const {
    getKategoriLelang,
    getBarangLelang,
    getEventLelang,
    getLotLelang,
    getPembelianNPL,
    getDataNPL,
    getListNPLPeserta,
    getListEvent,
    crudPembelianNPL,
    getListPelunasan,
    crudPelunasanLelang,
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
  route.route('/getListNPL').get(getListNPLPeserta(models))
  route.route('/getListEvent').get(getListEvent(models))
  route.route('/postPembelianNPL').post(uploadFile, crudPembelianNPL(models))
  route.route('/getListPelunasan').get(getListPelunasan(models))
  route.route('/postPelunasanLelang').post(uploadFile, crudPelunasanLelang(models))
  
  return route;
}