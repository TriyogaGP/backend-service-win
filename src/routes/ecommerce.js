const { Router } = require('express');
const {
  getKategoriProduk,
  crudKategoriProduk,
  getProduk,
  getFotoProduk,
  getHistoryStock,
  crudProduk,
  getPromosi,
  crudPromosi,
  getOrder,
  getWishlist,
} = require('../controllers/ecommerce.controller')

module.exports = models => {
  const route = Router();

  route.route('/getKategoriProduk').get(getKategoriProduk(models))
  route.route('/postKategoriProduk').post(crudKategoriProduk(models))
  route.route('/getProduk').get(getProduk(models))
  route.route('/getFotoProduk/:idProduk').get(getFotoProduk(models))
  route.route('/getHistoryStock/:idProduk').get(getHistoryStock(models))
  route.route('/postProduk').post(crudProduk(models))
  route.route('/getPromosi').get(getPromosi(models))
  route.route('/postPromosi').post(crudPromosi(models))
  route.route('/getOrder').get(getOrder(models))
  route.route('/getWishlist').get(getWishlist(models))
  
  return route;
}