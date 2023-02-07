const { Router } = require('express');
const {
  getAdmin,
  crudAdmin,
  getPeserta,
  crudPeserta,
} = require('../controllers/admin.controller')

module.exports = models => {
  const route = Router();

  route.route('/getAdmin').get(getAdmin(models))
  route.route('/postAdmin').post(crudAdmin(models))
  route.route('/getPeserta').get(getPeserta(models))
  route.route('/postPeserta').post(crudPeserta(models))
  
  return route;
}