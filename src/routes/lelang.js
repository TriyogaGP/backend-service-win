const { Router } = require('express');
const {
  getKategoriLelang,
  crudKategoriLelang,
  getBarangLelang,
  crudBarangLelang,
  getFotoBarangLelang,
  getEvent,
  crudEvent,
  getLot,
  crudLot,
  getNPL,
  getManajemenNPL,
  crudPembelianNPL,
  crudManajemenNPL,
  crudNPL,
  getPemenang,
  crudPemenang,
  getEventActive,
  getRoomEvent,
  getBidLelang,
} = require('../controllers/lelang.controller')

module.exports = models => {
  const route = Router();

  route.route('/getKategoriLelang').get(getKategoriLelang(models))
  route.route('/postKategoriLelang').post(crudKategoriLelang(models))
  route.route('/getBarangLelang').get(getBarangLelang(models))
  route.route('/postBarangLelang').post(crudBarangLelang(models))
  route.route('/getFotoBarangLelang/:idBarangLelang').get(getFotoBarangLelang(models))
  route.route('/getEvent').get(getEvent(models))
  route.route('/postEvent').post(crudEvent(models))
  route.route('/getLot').get(getLot(models))
  route.route('/postLot').post(crudLot(models))
  route.route('/getNPL').get(getNPL(models))
  route.route('/getManajemenNPL').get(getManajemenNPL(models))
  route.route('/postPembelianNPL').post(crudPembelianNPL(models))
  route.route('/postManajemenNPL').post(crudManajemenNPL(models))
  route.route('/postNPL').post(crudNPL(models))
  route.route('/getPemenang').get(getPemenang(models))
  route.route('/postPemenang').post(crudPemenang(models))
  route.route('/getEventActive').get(getEventActive(models))
  route.route('/getRoomEvent').get(getRoomEvent(models))
  route.route('/getBidLelang').get(getBidLelang(models))
  
  return route;
}