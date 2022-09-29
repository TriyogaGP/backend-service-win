const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
const { _buildResponseProduk, _buildResponseOrder, _buildResponseWishlist } = require('../utils/build-response');
const { convertDate, dateconvert } = require('../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getKategoriProduk (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
      const dataKategori = await models.KategoriProduk.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			return OK(res, dataKategori);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudKategoriProduk (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					kategoriProduk: body.kategori_produk
				}
				const count = await models.KategoriProduk.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					kategoriProduk: body.kategori_produk,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.KategoriProduk.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.KategoriProduk.findOne({where: {kategoriProduk: body.kategori_produk, [Op.not]: [{idKategoriProduk: body.id_kategori_produk}]}})) return NOT_FOUND(res, 'kategori produk sudah di gunakan !')
				kirimdata = {
					kategoriProduk: body.kategori_produk,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.KategoriProduk.update(kirimdata, { where: { idKategoriProduk: body.id_kategori_produk } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.KategoriProduk.update(kirimdata, { where: { idKategoriProduk: body.id_kategori_produk } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.KategoriProduk.update(kirimdata, { where: { idKategoriProduk: body.id_kategori_produk } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getProduk (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
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

			return OK(res, await _buildResponseProduk(models, dataProduk));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getFotoProduk (models) {
  return async (req, res, next) => {
		let idProduk = req.params.idProduk
		let { sort } = req.query
    try {
      const dataFotoProduk = await models.FotoProduk.findAll({
				where: { idProduk: idProduk },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});

			let dataKumpul = []
			await dataFotoProduk.map(val => {
				let objectBaru = Object.assign(val.dataValues, {
					gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val.dataValues.gambar
				});
				return dataKumpul.push(objectBaru)
			})

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getHistoryStock (models) {
  return async (req, res, next) => {
		let idProduk = req.params.idProduk
		let { sort } = req.query
    try {
      const dataUpdateStok = await models.UpdateStok.findAll({
				where: { idProduk: idProduk },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});

			let dataKumpul = []
			let stokMasuk = 0, stokKeluar = 0
			await dataUpdateStok.map(val => {
				if(val.statusAktif == 1){
					stokMasuk += val.tambahStok
					stokKeluar += val.kurangStok
				}
				let objectBaru = Object.assign(val.dataValues, {
					tanggal: convertDate(val.dataValues.tanggal),
					tanggalstok: dateconvert(val.dataValues.tanggal),
					stokMasuk,
					stokKeluar
				});
				return dataKumpul.push(objectBaru)
			})

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudProduk (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true,
					[Op.or]: [
						{ kodeProduk: body.kode_produk },
						{ namaProduk: body.nama_produk }
					]
				}
				const count = await models.Produk.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					UnixText: body.UnixText,
					idKategoriProduk: body.id_kategori_produk,
					kodeProduk: body.kode_produk,
					namaProduk: body.nama_produk,
					merekProduk: body.merek_produk,
					harga: body.harga,
					stok: body.stok,
					berat: body.berat,
					point: body.point,
					deskripsi: body.deskripsi,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				let sendData = await models.Produk.create(kirimdata)
				if(sendData) {
					const data = await models.Produk.findOne({where: {kodeProduk: body.kode_produk}});
					let kirimdata2 = {
						idProduk: data.idProduk,
						tanggal: convertDate(data.createdAt),
						tambahStok: body.stok,
						kurangStok: 0,
						statusAktif: 1,
						createBy: body.create_update_by,
					}
					await models.UpdateStok.create(kirimdata2)
				}else{
					return NOT_FOUND(res, 'gagal input data !')
				}
			}else if(body.jenis == 'EDIT'){
				if(await models.Produk.findOne({where: {kodeProduk: body.kode_produk, [Op.not]: [{idProduk: body.id_produk}]}})) return NOT_FOUND(res, 'kode produk sudah di gunakan !')
				if(await models.Produk.findOne({where: {namaProduk: body.nama_produk, [Op.not]: [{idProduk: body.id_produk}]}})) return NOT_FOUND(res, 'nama produk sudah di gunakan !')
				kirimdata = {
					UnixText: body.UnixText,
					idKategoriProduk: body.id_kategori_produk,
					kodeProduk: body.kode_produk,
					namaProduk: body.nama_produk,
					merekProduk: body.merek_produk,
					harga: body.harga,
					stok: body.stok,
					berat: body.berat,
					point: body.point,
					deskripsi: body.deskripsi,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.Produk.update(kirimdata, { where: { idProduk: body.id_produk } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.Produk.update(kirimdata, { where: { idProduk: body.id_produk } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.Produk.update(kirimdata, { where: { idProduk: body.id_produk } })
			}else if(body.jenis == 'STATUSRECORDSTOK'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.UpdateStok.update(kirimdata, { where: { idUpdateStok: body.id_update_stok } })
			}else if(body.jenis == 'DELETESTOK'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.UpdateStok.update(kirimdata, { where: { idUpdateStok: body.id_update_stok } })
			}else if(body.jenis == 'ADDSTOK'){
				kirimdata = {
					idProduk: body.id_produk,
					tanggal: body.tanggal,
					tambahStok: body.tambah_stok,
					kurangStok: body.kurang_stok,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.UpdateStok.create(kirimdata)
			}else if(body.jenis == 'EDITSTOK'){
				kirimdata = {
					idProduk: body.id_produk,
					tanggal: body.tanggal,
					tambahStok: body.tambah_stok,
					kurangStok: body.kurang_stok,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.UpdateStok.update(kirimdata, { where: { idUpdateStok: body.id_update_stok } })
			}else if(body.jenis == 'EDITSTOKONE'){
				body.bagian == 'tambah' ?
					kirimdata = {
						tambahStok: body.inputTemp,
						statusAktif: 1,
						updateBy: body.create_update_by,
					}
				:
					kirimdata = {
						kurangStok: body.inputTemp,
						statusAktif: 1,
						updateBy: body.create_update_by,
					}
				await models.UpdateStok.update(kirimdata, { where: { idUpdateStok: body.id_update_stok } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getPromosi (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
      const dataPromosi = await models.Promosi.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			let dataKumpul = []
			await dataPromosi.map(val => {
				let objectBaru = Object.assign(val.dataValues, {
					gambar: BASE_URL+'image/promo/'+val.dataValues.gambar,
					idProduk: val.dataValues.idProduk ? JSON.parse([val.dataValues.idProduk]) : []
				});
				return dataKumpul.push(objectBaru)
			})

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudPromosi (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					namaPromo: body.nama_promo
				}
				const count = await models.Promosi.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					UnixText: body.UnixText,
					namaPromo: body.nama_promo,
					idProduk: JSON.stringify(body.id_produk),
					deskripsi: body.deskripsi,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.Promosi.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.Promosi.findOne({where: {namaPromo: body.nama_promo, [Op.not]: [{idPromosi: body.id_promosi}]}})) return NOT_FOUND(res, 'nama promo sudah di gunakan !')
				kirimdata = {
					UnixText: body.UnixText,
					namaPromo: body.nama_promo,
					idProduk: JSON.stringify(body.id_produk),
					deskripsi: body.deskripsi,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.Promosi.update(kirimdata, { where: { idPromosi: body.id_promosi } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.Promosi.update(kirimdata, { where: { idPromosi: body.id_promosi } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.Promosi.update(kirimdata, { where: { idPromosi: body.id_promosi } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getOrder (models) {
  return async (req, res, next) => {
		let { code_status, sort } = req.query
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
    try {
      const dataOrder = await models.Order.findAll({
				where: {
					status_latest: {
						[Op.in]:
							code_status == '0' ? [ "MENUNGGU PEMBAYARAN", "MENUNGGU KONFIRMASI PENJUAL", "MENUNGGU PENGAMBILAN OLEH KURIR", "MENUNGGU KONFIRMASI PEMBELI" ] : 
							code_status == '1' ? [ "PEMBAYARAN SUKSES", "SEDANG DIKEMAS" ] : 
							code_status == '2' ? [ "SEDANG DIKEMAS" ] : 
							code_status == '3' ? [ "TIBA DITUJUAN" ] : 
							code_status == '4' ? [ "TRANSAKSI SELESAI" ] : 
							[ "TRANSAKSI BATAL" ]
					}
				},
				attributes,
				include: [
					{
						model: models.User,
						attributes
					},
					{
						model: models.Address,
						attributes
					},
					{
						model: models.Kurir,
						attributes
					},
					{
						model: models.KurirService,
						attributes
					},
				],
				order: [
					['createdAt', sort ? sort : 'DESC'],
				]
			});

			return OK(res, await _buildResponseOrder(models, dataOrder));
			// return OK(res, dataDetailOrder);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getWishlist (models) {
  return async (req, res, next) => {
		let { sort } = req.query
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
    try {
		  const dataWishlist = await models.Wishlist.findAll({
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
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});

			return OK(res, await _buildResponseWishlist(models, dataWishlist));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

module.exports = {
  getKategoriProduk,
  crudKategoriProduk,
  getProduk,
  getHistoryStock,
  getFotoProduk,
  crudProduk,
  getPromosi,
  crudPromosi,
  getOrder,
  getWishlist,
}