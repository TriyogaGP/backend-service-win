const { response, OK, NOT_FOUND, NO_CONTENT } = require('../../utils/response.utils');
const { _buildResponseProduk, _buildResponseDetailProduk, _buildResponsePromosi, _buildResponseWishlist, _buildResponseKeranjang } = require('../../utils/build-response-json');
const { encrypt, decrypt, convertDate } = require('../../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const { logger } = require('../../configs/db.winston')
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getKategoriProduk (models) {
  return async (req, res, next) => {
		let { sort } = req.query
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
      const dataKategori = await models.KategoriProduk.findAll({
				where: {
					statusAktif: true
				},
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			return OK(res, dataKategori);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getProduk (models) {
  return async (req, res, next) => {
		let { id_produk, id_kategori, keyword, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_produk) { 
				where.idProduk = id_produk 
				where.statusAktif = true 
			}

      const dataProduk = await models.Produk.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.KategoriProduk,
						attributes: ['kategoriProduk']
					},
					{
						model: models.Measurement,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					},
				],
				order
			});

			let hasilData = []
			if(id_kategori){	
				hasilData = dataProduk.filter(val => val.idKategoriProduk == Number(id_kategori))
				if(keyword) {
					let searchRegExp = new RegExp(keyword , 'i');
					hasilData = hasilData.filter(val => {
						return searchRegExp.test(val.namaProduk)
					})
				}	
			}
			
			if(keyword && !id_kategori) {
  			let searchRegExp = new RegExp(keyword , 'i');
				hasilData = dataProduk.filter(val => {
					return searchRegExp.test(val.namaProduk)
				})
			}

			if(id_produk){
				let hasil = await _buildResponseDetailProduk(models, dataProduk)
				return OK(res, hasil[0]);
			}

			return OK(res, await _buildResponseProduk(models, hasilData));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getPromosi (models) {
  return async (req, res, next) => {
		let { id_promosi, keyword, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_promosi){
				where.idPromosi = id_promosi
				where.statusAktif = true
			}
			const dataPromosi = await models.Promosi.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});
			
			let dataKumpul = [], hasilData = [];
			await dataPromosi.map(val => {
				let objectBaru = Object.assign(val.dataValues, {
					gambar: BASE_URL+'image/promo/'+val.dataValues.gambar,
					idProduk: val.dataValues.idProduk ? JSON.parse([val.dataValues.idProduk]) : []
				});
				return dataKumpul.push(objectBaru)
			})
			
			let dataHasil = await _buildResponsePromosi(dataKumpul)

			if(keyword) {
  			let searchRegExp = new RegExp(keyword , 'i');
				hasilData = dataHasil.filter(val => {
					return searchRegExp.test(val.namaPromo)
				})
				let kumpul = await Promise.all(hasilData.map(async (val) => {
					let hasil = await Promise.all(val.idProduk.map(async (val2) => {
						const dataProduk = await models.Produk.findAll({
							where: { idProduk: val2.id_produk },
							attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
						});
						return dataProduk[0]
					}))
					let objectBaru = { ...val, dataProduk: hasil }
					return objectBaru
				}))
				return OK(res, kumpul);
			}
			
			if(id_promosi){
				let kumpul = []
				await dataHasil[0].idProduk.map(val => {
					return kumpul.push(val.id_produk)
				})
				const dataProduk = await models.Produk.findAll({
					where: { idProduk: kumpul },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
				});
				
				return OK(res, { ...dataHasil[0], dataProduk });
			}

			let kumpul = await Promise.all(dataHasil.map(async (val) => {
				let hasil = await Promise.all(val.idProduk.map(async (val2) => {
					const dataProduk = await models.Produk.findAll({
						where: { idProduk: val2.id_produk },
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
					});
					return dataProduk[0]
				}))
				let objectBaru = { ...val, dataProduk: hasil }
				return objectBaru
			}))
			return OK(res, kumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getWishlist (models) {
  return async (req, res, next) => {
		let { id_peserta, id_produk, keyword, sort } = req.query
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
		let where = {}
    let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_peserta){
				where.idPeserta = id_peserta
				if(id_produk){
					where.idProduk = id_produk
				}
			}
			if(id_produk){
				where.idProduk = id_produk
			}
		  const dataWishlist = await models.Wishlist.findAll({
				where,
				include: [
					{
						model: models.User,
						attributes
					},
					{
						model: models.Produk,
						attributes
					},
				],
				order
			});

			let hasilData = []
			if(keyword) {
  			let searchRegExp = new RegExp(keyword , 'i');
				hasilData = dataWishlist.filter(val => {
					return searchRegExp.test(val.Produk.namaProduk)
				})
			}
			return OK(res, await _buildResponseWishlist(models, keyword ? hasilData : dataWishlist));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudWishlist (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'WISH'){
				where = { 
					idPeserta: body.id_peserta,
					idProduk: body.id_produk
				}
				const count = await models.Wishlist.count({where});
				if(count) return NOT_FOUND(res, 'Produk sudah ada di wishlist !')
				kirimdata = {
					idPeserta: body.id_peserta,
					idProduk: body.id_produk,
				}
				await models.Wishlist.create(kirimdata)
			}else if(body.jenis == 'UNWISH'){
				await models.Wishlist.destroy({ where: { idWishlist: body.id_wishlist, idPeserta: body.id_peserta } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getCart (models) {
	return async (req, res, next) => {
		let { id_peserta, sort } = req.query
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
		let where = {}
	  let order = []
	  try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_peserta){
				where.idPeserta = id_peserta
			}
			const dataKeranjang = await models.Keranjang.findAll({
				where,
				include: [
					{
						model: models.User,
						attributes
					},
					{
						model: models.Produk,
						attributes
					},
				],
				order
			});

			return OK(res, await _buildResponseKeranjang(models, dataKeranjang));
	  } catch (err) {
			return NOT_FOUND(res, err.message)
	  }
	}  
}

module.exports = {
  getKategoriProduk,
  getProduk,
  getPromosi,
  getWishlist,
  crudWishlist,
  getCart,
}