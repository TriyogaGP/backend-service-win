const { response, OK, NOT_FOUND, NO_CONTENT } = require('../../utils/response.utils');
const { _buildResponseLelang, _buildResponseDetailLelang, _buildResponseLotLelang, _buildResponseDetailLot, _buildResponsePembelianNPL } = require('../../utils/build-response-json');
const { encrypt, decrypt, convertDate, makeRandomAngka, convertDateGabung } = require('../../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getKategoriLelang (models) {
  return async (req, res, next) => {
		let { sort } = req.query
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
      const dataKategori = await models.KategoriLelang.findAll({
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

function getBarangLelang (models) {
  return async (req, res, next) => {
		let { id_barang_lelang, id_kategori, keyword, id_peserta, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_barang_lelang) { 
				where.idBarangLelang = id_barang_lelang 
				where.statusAktif = true 
			}

      const dataPeserta = await models.PembelianNPL.findAll({
				where: { 
					idPeserta: id_peserta,
					statusAktif: true,
				},
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			let wherein = []
			dataPeserta.map(val => wherein.push(val.idEvent))

      const dataBarangLelang = await models.BarangLelang.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.KategoriLelang,
						attributes: ['kategori']
					},
				],
				order
			});

			let kumpul = await Promise.all(dataBarangLelang.map(async (el) => {
				const dataLot = await models.LOT.findOne({
					where: { idBarangLelang: el.idBarangLelang },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					include: [
						{
							model: models.Event,
							attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
						},
					],
					order
				});
				let objectBaru = Object.assign(el.dataValues, { LOT: dataLot });
				return objectBaru
			}))

			let hasilData = []
			if(id_kategori){	
				hasilData = kumpul.filter(val => val.idKategori == Number(id_kategori))
				if(keyword) {
					let searchRegExp = new RegExp(keyword , 'i');
					hasilData = hasilData.filter(val => {
						return searchRegExp.test(val.namaBarangLelang)
					})
				}	
			}
			
			if(keyword && !id_kategori) {
  			let searchRegExp = new RegExp(keyword , 'i');
				hasilData = kumpul.filter(val => {
					return searchRegExp.test(val.namaBarangLelang)
				})
			}

			if(id_barang_lelang){
				let hasil = await _buildResponseDetailLelang(models, kumpul)
				return OK(res, hasil[0]);
			}

			let hasilNih = []
			if(id_peserta && !id_kategori && !keyword) {
				kumpul.map(val => {
					let result = wherein.includes(val.LOT.idEvent)
					if(result) return hasilNih.push(val);
				})
			}

			if(id_peserta) {
				hasilData.map(val => {
					let result = wherein.includes(val.LOT.idEvent)
					if(result) return hasilNih.push(val);
				})
			}

			return OK(res, await _buildResponseLelang(models, hasilNih));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getEventLelang (models) {
  return async (req, res, next) => {
		let { id_peserta, keyword, sort } = req.query
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]

      const dataPeserta = await models.PembelianNPL.findAll({
				where: { 
					idPeserta: id_peserta,
					statusAktif: true,
				},
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			let wherein = []
			dataPeserta.map(val => wherein.push(val.idEvent))

			const dataEvent = await models.Event.findAll({
				where: { 
					idEvent: wherein,
					statusAktif: true
				},
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			let tampilData = []
			dataEvent.filter(val => val.statusAktif == true)
			.map(val => {
				tampilData.push({
					idEvent: val.idEvent,
					kodeEvent: val.kodeEvent,
					passEvent: val.passEvent,
					kataSandiEvent: val.kataSandiEvent,
					namaEvent: val.namaEvent,
					deskripsiEvent: val.deskripsiEvent,
					waktuEvent: convertDate(val.tanggalEvent) + " " + val.waktuEvent,
					kelipatanBid: val.kelipatanBid,
					gambar: val.gambar ? BASE_URL+'image/event/'+val.gambar : '',
					alamatEvent: val.alamatEvent,
					linkMaps: val.linkMaps,
					statusAktif: val.statusAktif,
				})
			})

			let hasilData = []
			if(keyword) {
				let searchRegExp = new RegExp(keyword , 'i');
				hasilData = tampilData.filter(val => {
					return searchRegExp.test(val.namaEvent)
				})
			}

			return OK(res, keyword ? hasilData : tampilData);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getLotLelang (models) {
  return async (req, res, next) => {
		let { id_barang_lelang, id_kategori, keyword, id_event, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_barang_lelang) { 
				where.statusAktif = true
				where.idBarangLelang = id_barang_lelang 
			}
			if(id_event) { 
				where.statusAktif = true
				where.idEvent = id_event 
			}

      const dataLOT = await models.LOT.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.BarangLelang,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
						include: [
							{
								model: models.KategoriLelang,
								attributes: ['kategori']
							},
						],
					},
					{
						model: models.Event,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					},
				],
				order
			});

			let hasilData = []
			if(id_kategori){	
				hasilData = dataLOT.filter(val => val.BarangLelang.idKategori == Number(id_kategori))
				if(keyword) {
					let searchRegExp = new RegExp(keyword , 'i');
					hasilData = hasilData.filter(val => {
						return searchRegExp.test(val.BarangLelang.namaBarangLelang)
					})
				}	
			}
			if(keyword && !id_kategori) {
  			let searchRegExp = new RegExp(keyword , 'i');
				hasilData = dataLOT.filter(val => {
					return searchRegExp.test(val.BarangLelang.namaBarangLelang)
				})
			}

			if(id_event){
				hasilData = dataLOT.filter(val => val.Event.idEvent == Number(id_event))
				if(keyword) {
					let searchRegExp = new RegExp(keyword , 'i');
					hasilData = hasilData.filter(val => {
						return searchRegExp.test(val.Event.namaEvent)
					})
				}
			}

			if(id_barang_lelang){
				let hasil = await _buildResponseDetailLot(models, dataLOT)
				return OK(res, hasil[0]);
			}

			return OK(res, await _buildResponseLotLelang(models, hasilData));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getPembelianNPL (models) {
  return async (req, res, next) => {
		let { id_peserta, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(id_peserta) { 
				where.idPeserta = id_peserta 
				where.statusAktif = true
			}

      const dataPembelianNPL = await models.PembelianNPL.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.User,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					},
					{
						model: models.Event,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					},
				],
				order
			});

			return OK(res, await _buildResponsePembelianNPL(models, dataPembelianNPL));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudPembelianNPL (models) {
  return async (req, res, next) => {
		let namaFile = req.files[0].filename;
		let body = { ...req.body, namaFile };
		let where = {}
    try {
			where = { 
				idPeserta: body.id_peserta,
				idEvent: body.id_event,
				statusAktif: true,
			}
			const count = await models.PembelianNPL.count({where});
			if(count) return NOT_FOUND(res, 'Pembelian NPL anda sudah tersedia, menunggu di verifikasi !')
			let noPembelian = `${makeRandomAngka(10)}.${body.id_peserta}`
			let kirimdata = {
				idEvent: body.id_event,
				idPeserta: body.id_peserta,
				typePembelian: 1,
				typeTransaksi: 2,
				noPembelian: noPembelian,
				nominal: body.nominal,
				tanggalTransfer: convertDateGabung(body.tanggal_transfer),
				bukti: body.nama_folder+'/'+body.namaFile,
				statusAktif: 1,
				createBy: body.id_peserta,
			}
			await models.PembelianNPL.create(kirimdata)

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

module.exports = {
  getKategoriLelang,
  getBarangLelang,
  getEventLelang,
  getLotLelang,
  getPembelianNPL,
  crudPembelianNPL,
}