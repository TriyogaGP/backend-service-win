const { Router } = require('express');
const {
  getHomescreenLelang,
  getHomescreenLelangBy,
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
  getPemenangBy,
} = require('../../controllers/api-controller/lelang.controller')
const { uploadFile } = require('../../middleware/uploadFile')

module.exports = models => {
  const route = Router();

  route.route('/getHomescreenLelang').get(getHomescreenLelang(models))
  route.route('/getHomescreenLelangBy').get(getHomescreenLelangBy(models))
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
  route.route('/getPemenangBy').get(getPemenangBy(models))
  
  return route;
}