const { Router } = require('express');
const {
    getKategoriProduk,
    getProduk,
    getPromosi,
    getWishlist,
    crudWishlist,
} = require('../../controllers/api-controller/ecommerce.controller')
const { uploadFile } = require('../../middleware/uploadFile')

module.exports = models => {
  const route = Router();

  route.route('/getKategoriProduk').get(getKategoriProduk(models))
  route.route('/getProduk').get(getProduk(models))
  route.route('/getPromosi').get(getPromosi(models))
  route.route('/getWishlist').get(getWishlist(models))
  route.route('/postWishlist').post(crudWishlist(models))
  
  return route;
}