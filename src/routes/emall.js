const { Router } = require('express');
const {body, checkSchema, validationResult} = require('express-validator');
const {
  getKategoriTenant,
  crudKategoriTenant,
  getKategoriContent,
  crudKategoriContent,
  getMall,
  crudMall,
  getFasilitasMall,
  crudFasilitasMall,
  getTenantMall,
  getFotoTenantMall,
  crudTenantMall,
  getContent,
  crudContent,
} = require('../controllers/emall.controller')

module.exports = models => {
  const route = Router();

  route.route('/getKategoriTenant').get(getKategoriTenant(models))
  route.route('/postKategoriTenant').post(crudKategoriTenant(models))
  route.route('/getKategoriContent').get(getKategoriContent(models))
  route.route('/postKategoriContent').post(crudKategoriContent(models))
  route.route('/getMall').get(getMall(models))
  route.route('/postMall').post(crudMall(models))
  route.route('/getFasilitasMall').get(getFasilitasMall(models))
  route.route('/postFasilitasMall').post(crudFasilitasMall(models))
  route.route('/getTenantMall').get(getTenantMall(models))
  route.route('/getFotoTenantMall/:idTenantMall').get(getFotoTenantMall(models))
  route.route('/postTenantMall').post(crudTenantMall(models))
  route.route('/getContent').get(getContent(models))
  route.route('/postContent').post(crudContent(models))
  
  return route;
}