const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
const { _buildResponseBarangLelang, _buildResponseLot, _buildResponseNPL, _buildResponsePemenang } = require('../utils/build-response');
const { encrypt, decrypt ,convertDate, dateconvert } = require('../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getKategoriLelang (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}
      const dataKategori = await models.KategoriLelang.findAll({
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

function crudKategoriLelang (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					kategori: body.kategori
				}
				const count = await models.KategoriLelang.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					kategori: body.kategori,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.KategoriLelang.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.KategoriLelang.findOne({where: {kategori: body.kategori, [Op.not]: [{idKategori: body.id_kategori}]}})) return NOT_FOUND(res, 'kategori lelang sudah di gunakan !')
				kirimdata = {
					kategori: body.kategori,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.KategoriLelang.update(kirimdata, { where: { idKategori: body.id_kategori } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.KategoriLelang.update(kirimdata, { where: { idKategori: body.id_kategori } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.KategoriLelang.update(kirimdata, { where: { idKategori: body.id_kategori } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getBarangLelang (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}
      const dataBarangLelang = await models.BarangLelang.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.KategoriLelang,
						attributes: ['kategori', 'statusAktif']
					}
				],
				order
			});

			return OK(res, await _buildResponseBarangLelang(models, dataBarangLelang));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getFotoBarangLelang (models) {
  return async (req, res, next) => {
		let idBarangLelang = req.params.idBarangLelang
		let { sort } = req.query
    try {
      const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
				where: { idBarangLelang: idBarangLelang },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});

			// let dataKumpul = []
			// await dataFotoBarangLelang.map(val => {
			// 	let objectBaru = Object.assign(val.dataValues, {
			// 		gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val.dataValues.gambar
			// 	});
			// 	return dataKumpul.push(objectBaru)
			// })

			return OK(res, dataFotoBarangLelang);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudBarangLelang (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				if(body.id_kategori == 1 || body.id_kategori == 2){
					where = { 
						statusAktif: true,
						[Op.or]: [
							{ namaBarangLelang: body.nama_barang_lelang },
							{ noRangka: body.no_rangka },
							{ noMesin: body.no_mesin },
							{ noPolisi: body.no_polisi }
						]  
					}
				}else{
					where = { 
						statusAktif: true,
						namaBarangLelang: body.nama_barang_lelang,  
					}
				}
				const count = await models.BarangLelang.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					UnixText: body.UnixText,
					idKategori: body.id_kategori,
					namaBarangLelang: body.nama_barang_lelang,
					brand: body.brand,
					warna: body.warna,
					tahun: body.tahun,
					lokasiBarang: body.lokasi_barang,
					noRangka: body.no_rangka,
					noMesin: body.no_mesin,
					tipeModel: body.tipe_model,
					transmisi: body.transmisi,
					bahanBakar: body.bahan_bakar,
					odometer: body.odometer,
					grade: body.grade,
					gradeInterior: body.grade_interior,
					gradeEksterior: body.grade_eksterior,
					gradeMesin: body.grade_mesin,
					noPolisi: body.no_polisi,
					validSTNK: body.valid_stnk,
					sph: body.sph,
					kir: body.kir,
					kapasitasKendaraan: body.kapasitas_kendaraan,
					deskripsi: body.deskripsi,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.BarangLelang.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.BarangLelang.findOne({where: {namaBarangLelang: body.nama_barang_lelang, [Op.not]: [{idBarangLelang: body.id_barang_lelang}]}})) return NOT_FOUND(res, 'nama barang lelang sudah di gunakan !')
				if(body.id_kategori == 1 || body.id_kategori == 2) {
					if(await models.BarangLelang.findOne({where: {noRangka: body.no_rangka, [Op.not]: [{idBarangLelang: body.id_barang_lelang}]}})) return NOT_FOUND(res, 'no rangka sudah di gunakan !')
					if(await models.BarangLelang.findOne({where: {noMesin: body.no_mesin, [Op.not]: [{idBarangLelang: body.id_barang_lelang}]}})) return NOT_FOUND(res, 'no mesin sudah di gunakan !')
					if(await models.BarangLelang.findOne({where: {noPolisi: body.no_polisi, [Op.not]: [{idBarangLelang: body.id_barang_lelang}]}})) return NOT_FOUND(res, 'no polisi sudah di gunakan !')
				}
				kirimdata = {
					UnixText: body.UnixText,
					idKategori: body.id_kategori,
					namaBarangLelang: body.nama_barang_lelang,
					brand: body.brand,
					warna: body.warna,
					tahun: body.tahun,
					lokasiBarang: body.lokasi_barang,
					noRangka: body.no_rangka,
					noMesin: body.no_mesin,
					tipeModel: body.tipe_model,
					transmisi: body.transmisi,
					bahanBakar: body.bahan_bakar,
					odometer: body.odometer,
					grade: body.grade,
					gradeInterior: body.grade_interior,
					gradeEksterior: body.grade_eksterior,
					gradeMesin: body.grade_mesin,
					noPolisi: body.no_polisi,
					validSTNK: body.valid_stnk,
					sph: body.sph,
					kir: body.kir,
					kapasitasKendaraan: body.kapasitas_kendaraan,
					deskripsi: body.deskripsi,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.BarangLelang.update(kirimdata, { where: { idBarangLelang: body.id_barang_lelang } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.BarangLelang.update(kirimdata, { where: { idBarangLelang: body.id_barang_lelang } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.BarangLelang.update(kirimdata, { where: { idBarangLelang: body.id_barang_lelang } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getEvent (models) {
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
      const dataEvent = await models.Event.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			let dataKumpul = []
			await dataEvent.map(val => {
				const splitkodeevent = val.dataValues.kodeEvent.split('-')
				let objectBaru = Object.assign(val.dataValues, {
					tanggalEvent: convertDate(val.dataValues.tanggalEvent),
					startEvent: dateconvert(val.dataValues.tanggalEvent)+' '+val.dataValues.waktuEvent,
					kodeevent_split: splitkodeevent[2],
					// gambar: BASE_URL+'image/event/'+val.dataValues.gambar
				});
				return dataKumpul.push(objectBaru)
			})

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudEvent (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let salt, hashPassword, kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true,
					[Op.or]: [
						{ kodeEvent: body.kode_event },
						{ namaEvent: body.nama_event },
					]  
				}
				const count = await models.Event.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				salt = await bcrypt.genSalt();
				hashPassword = await bcrypt.hash(body.pass_event, salt);
				kirimdata = {
					UnixText: body.UnixText,
					kodeEvent: body.kode_event,
					namaEvent: body.nama_event,
					passEvent: hashPassword,
					kataSandiEvent: encrypt(body.pass_event),
					deskripsiEvent: body.deskripsi_event,
					kelipatanBid: body.kelipatan_bid,
					tanggalEvent: body.tanggal_event,
					waktuEvent: body.waktu_event,
					alamatEvent: body.alamat_event,
					linkMaps: body.link_maps,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.Event.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.Event.findOne({where: {kodeEvent: body.kode_event, [Op.not]: [{idEvent: body.id_event}]}})) return NOT_FOUND(res, 'kode event sudah di gunakan !')
				if(await models.Event.findOne({where: {namaEvent: body.nama_event, [Op.not]: [{idEvent: body.id_event}]}})) return NOT_FOUND(res, 'nama event sudah di gunakan !')
				const data = await models.Event.findOne({where: {idEvent: body.id_event}});
				salt = await bcrypt.genSalt();
				let decryptPass = data.kataSandiEvent != body.pass_event ? body.pass_event : decrypt(body.pass_event)
				hashPassword = await bcrypt.hash(decryptPass, salt);
				kirimdata = {
					kodeEvent: body.kode_event,
					namaEvent: body.nama_event,
					passEvent: hashPassword,
					kataSandiEvent: data.kataSandiEvent == body.pass_event ? body.pass_event : encrypt(body.pass_event),
					deskripsiEvent: body.deskripsi_event,
					kelipatanBid: body.kelipatan_bid,
					tanggalEvent: body.tanggal_event,
					waktuEvent: body.waktu_event,
					alamatEvent: body.alamat_event,
					linkMaps: body.link_maps,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.Event.update(kirimdata, { where: { idEvent: body.id_event } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.Event.update(kirimdata, { where: { idEvent: body.id_event } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.Event.update(kirimdata, { where: { idEvent: body.id_event } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getLot (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}
      const dataLot = await models.LOT.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{ 
						model: models.BarangLelang,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
						include: [
							{ 
								model: models.KategoriLelang,
								attributes: ['kategori', 'statusAktif'],
							},
						]
					},
					{ 
						model: models.Event,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
					},
				],
				order
			});

			return OK(res, await _buildResponseLot(models, dataLot));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudLot (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true,
					[Op.or]: [
						{
							[Op.and]: [
								{ idBarangLelang: body.id_barang_lelang },
								{ idEvent: body.id_event },
							]
						},
						{ [Op.or]: [
								{ idBarangLelang: body.id_barang_lelang },
								{ noLot: body.no_lot },
							] 
						},
					]  
				}
				const count = await models.LOT.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					idBarangLelang: body.id_barang_lelang,
					idEvent: body.id_event,
					noLot: body.no_lot,
					hargaAwal: body.harga_awal,
					statusLot: body.status_lot,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.LOT.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.LOT.findOne({where: {[Op.and]: [{idBarangLelang: body.id_barang_lelang},{idEvent: body.id_event}], [Op.not]: [{idLot: body.id_lot}]}})) return NOT_FOUND(res, 'event dan barang lelang sudah di gunakan !')
				if(await models.LOT.findOne({where: {[Op.or]: [{idBarangLelang: body.id_barang_lelang},{noLot: body.no_lot}], [Op.not]: [{idLot: body.id_lot}]}})) return NOT_FOUND(res, 'barang lelang atau no lot sudah di gunakan !')
				kirimdata = {
					idBarangLelang: body.id_barang_lelang,
					idEvent: body.id_event,
					noLot: body.no_lot,
					hargaAwal: body.harga_awal,
					statusLot: body.status_lot,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.LOT.update(kirimdata, { where: { idLot: body.id_lot } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.LOT.update(kirimdata, { where: { idLot: body.id_lot } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.LOT.update(kirimdata, { where: { idLot: body.id_lot } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getPemenang (models) {
	return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	  try {
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
			const dataPemenang = await models.PemenangLelang.findAll({
				where,
				attributes,
				include: [
					{ 
						model: models.Bidding,
						attributes,
						include: [
							{ 
								model: models.LOT,
								attributes,
								include: [
									{ 
										model: models.BarangLelang,
										attributes,
									},
									{ 
										model: models.Event,
										attributes,
									},
								],
							},
							{ 
								model: models.NPL,
								attributes,
								include: [
									{ 
										model: models.PembelianNPL,
										attributes,
									},
									{ 
										model: models.User,
										attributes,
									},
								],
							},
						],
					},
				],
				order
			});

			return OK(res, await _buildResponsePemenang(models, dataPemenang));
	  } catch (err) {
			return NOT_FOUND(res, err.message)
	  }
	}  
}

function getNPL (models) {
  return async (req, res, next) => {
		let { kategori, id_event, id_peserta, status_aktif, sort } = req.query
		let where = {}
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
    try {
			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}
			if(id_event) { 
				where = {
					idEvent: id_event,
				}
			}
			if(id_peserta) { 
				where = {
					idPeserta: id_peserta,
				}
			}
      const dataPembelianNPL = await models.PembelianNPL.findAll({
				where,
				attributes,
				include: [
					{ 
						model: models.User,
						attributes,
					},
					{ 
						model: models.Event,
						attributes,
					},
				],
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});
			
			return OK(res, await _buildResponseNPL(models, kategori, id_event, dataPembelianNPL));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudPembelianNPL (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				kirimdata = {
					idEvent: body.id_event,
					idPeserta: body.id_peserta,
					typePembelian: body.type_pembelian,
					typeTransaksi: body.type_transaksi,
					noPembelian: body.no_pembelian,
					nominal: body.nominal,
					tanggalTransfer: body.tanggal_transfer,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.PembelianNPL.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				kirimdata = {
					idEvent: body.id_event,
					idPeserta: body.id_peserta,
					typePembelian: body.type_pembelian,
					typeTransaksi: body.type_transaksi,
					noPembelian: body.no_pembelian,
					nominal: body.nominal,
					tanggalTransfer: body.tanggal_transfer,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.PembelianNPL.update(kirimdata, { where: { idPembelianNPL: body.id_pembelian_npl } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.PembelianNPL.update(kirimdata, { where: { idPembelianNPL: body.id_pembelian_npl } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.PembelianNPL.update(kirimdata, { where: { idPembelianNPL: body.id_pembelian_npl } })
			}else if(body.jenis == 'STATUSVERIFIKASI'){
				kirimdata = { 
					verifikasi: body.verifikasi, 
					updateBy: body.create_update_by 
				}
				await models.PembelianNPL.update(kirimdata, { where: { idPembelianNPL: body.id_pembelian_npl } })
			}else if(body.jenis == 'VERIFIKASI'){
				kirimdata = { 
					pesanVerifikasi: body.pesan_verifikasi,
					verifikasi: 1, 
					updateBy: body.create_update_by 
				}
				let sendData = await models.PembelianNPL.update(kirimdata, { where: { idPembelianNPL: body.id_pembelian_npl } })
				if(sendData) {
					body.dataNPL.map(async (el) => {
						let kirimdata2 = {
							idPembelianNPL: body.id_pembelian_npl,
							idPeserta: body.id_peserta,
							idEvent: body.id_event,
							noNpl: el.no_npl,
							npl: el.npl,
							createBy: body.create_update_by,
						}
						await models.NPL.create(kirimdata2)
					})
				}else{
					return NOT_FOUND(res, 'gagal input data !')
				}
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudNPL (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata;
			if(body.jenis == 'EDIT'){
				kirimdata = {
					noNpl: body.no_npl,
					statusNPL: body.status_npl,
					updateBy: body.create_update_by,
				}
				await models.NPL.update(kirimdata, { where: { idNpl: body.id_npl } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

module.exports = {
  getKategoriLelang,
  crudKategoriLelang,
  getBarangLelang,
  crudBarangLelang,
  getFotoBarangLelang,
  getEvent,
  crudEvent,
  getLot,
  crudLot,
  getPemenang,
  getNPL,
  crudPembelianNPL,
  crudNPL,
}