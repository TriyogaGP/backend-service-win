const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
const { _buildResponseBarangLelang, _buildResponseLot, _buildResponseNPL, _buildResponsePemenang, _buildResponseRoom, _buildResponseBidLelang } = require('../utils/build-response');
const { encrypt, decrypt ,convertDate, dateconvert, buildMysqlResponseWithPagination, buildOrderQuery } = require('../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { logger } = require('../configs/db.winston')
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getKategoriLelang (models) {
  return async (req, res, next) => {
		let { status_aktif, sort, page = 1, limit = 10, keyword } = req.query
		let where = {}
		let order = []
    try {
			const OFFSET = page > 0 ? (page - 1) * parseInt(limit) : undefined
			order = [
				['updatedAt', sort ? sort : 'ASC'],
			]

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			const whereKey = keyword ? {
				[Op.or]: [
					{ kategori : { [Op.like]: `%${keyword}%` }},
				]
			} : {}

			where = whereKey

      const { count, rows: dataKategori } = await models.KategoriLelang.findAndCountAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order,
				limit: parseInt(limit),
				offset: OFFSET,
			});

			const responseData = buildMysqlResponseWithPagination(
				dataKategori,
				{ limit, page, total: count }
			)

			return OK(res, responseData);
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
		let { status_aktif, sort = '', page = 1, limit = 10, keyword } = req.query
		let where = {}
    try {
			const OFFSET = page > 0 ? (page - 1) * parseInt(limit) : undefined

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			const mappingSortField = [
        'namaBarangLelang', 'statusAktif',
        ['kategori', ['KategoriLelang', 'kategori']],
      ];
      const orders = buildOrderQuery(sort, mappingSortField);

      if (orders.length === 0) {
        orders.push(['updatedAt', 'DESC']);
      }
			
			const whereKey = keyword ? {
				[Op.or]: [
					{ '$KategoriLelang.kategori$' : { [Op.like]: `%${keyword}%` }},
					{ namaBarangLelang : { [Op.like]: `%${keyword}%` }},
					{ noPolisi : { [Op.like]: `%${keyword}%` }},
					{ noRangka : { [Op.like]: `%${keyword}%` }},
					{ noMesin : { [Op.like]: `%${keyword}%` }},
					{ deskripsi : { [Op.like]: `%${keyword}%` }},
				]
			} : {}

			where = whereKey

      const { count, rows: dataBarangLelang } = await models.BarangLelang.findAndCountAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.KategoriLelang,
						attributes: ['kategori', 'statusAktif']
					}
				],
				order: orders,
				limit: parseInt(limit),
				offset: OFFSET,
			});

			const getResult = await _buildResponseBarangLelang(models, dataBarangLelang)

			const responseData = buildMysqlResponseWithPagination(
				getResult,
				{ limit, page, total: count }
			)

			return OK(res, responseData);
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

			return OK(
				res, 
				{ dataFotoBarangLelang: 
					{ 
						FotoMobil: dataFotoBarangLelang.filter(val => val.kategori == 'Utama'), 
						FotoKondisiMobil: dataFotoBarangLelang.filter(val => val.kategori == 'Kondisi')
					}
				}
			);
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
					namaPemilik: body.nama_pemilik,
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
					// sph: body.sph,
					// kir: body.kir,
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
					namaPemilik: body.nama_pemilik,
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
					// sph: body.sph,
					// kir: body.kir,
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
		let { status_aktif, sort = '', page = 1, limit = 10, keyword } = req.query
		let where = {}
    try {
			const OFFSET = page > 0 ? (page - 1) * parseInt(limit) : undefined

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			const mappingSortField = [
        'kodeEvent', 'namaEvent', 'statusAktif',
				['tanggalevent', sequelize.col('`tanggalevent`')],
				'kelipatanBid'
      ];
      const orders = buildOrderQuery(sort, mappingSortField);

      if (orders.length === 0) {
        orders.push(['updatedAt', 'DESC']);
      }

			const whereKey = keyword ? {
				[Op.or]: [
					{ kodeEvent : { [Op.like]: `%${keyword}%` }},
					{ namaEvent : { [Op.like]: `%${keyword}%` }},
					{ kelipatanBid : { [Op.like]: `%${keyword}%` }},
					{ deskripsiEvent : { [Op.like]: `%${keyword}%` }},
				]
			} : {}

			where = whereKey

      const { count, rows: dataEvent } = await models.Event.findAndCountAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order: orders,
				limit: parseInt(limit),
				offset: OFFSET,
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

			const responseData = buildMysqlResponseWithPagination(
				dataKumpul,
				{ limit, page, total: count }
			)

			return OK(res, responseData);
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
		let { id_event, status_aktif, sort = '', page = 1, limit = 10, keyword } = req.query
		let where = {}
    try {
			const OFFSET = page > 0 ? (page - 1) * parseInt(limit) : undefined

			if(id_event) { 
				where.idEvent = id_event 
			}

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			const mappingSortField = [
        'noLot', 'hargaAwal', 'statusLot', 'statusAktif',
				['tanggalevent', sequelize.col('`tanggalevent`')],
				['namaBarangLelang', sequelize.literal('`BarangLelang.namaBarangLelang`')],
				['namaEvent', sequelize.literal('`Event.namaEvent`')],
      ];
      const orders = buildOrderQuery(sort, mappingSortField);

      if (orders.length === 0) {
        orders.push(['updatedAt', 'DESC']);
      }

			const whereKey = keyword ? {
				[Op.or]: [
					{ noLot : { [Op.like]: `%${keyword}%` }},
					{ '$Event.kode_event$' : { [Op.like]: `%${keyword}%` }},
					{ '$Event.nama_event$' : { [Op.like]: `%${keyword}%` }},
					{ '$BarangLelang.nama_barang_lelang$' : { [Op.like]: `%${keyword}%` }},
					{ '$BarangLelang.KategoriLelang.kategori$' : { [Op.like]: `%${keyword}%` }},
				]
			} : {}

			where = whereKey

      const { count, rows: dataLot } = await models.LOT.findAndCountAll({
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
				order: orders,
				limit: parseInt(limit),
				offset: OFFSET,
			});

			const getResult = await _buildResponseLot(models, dataLot)

			const responseData = buildMysqlResponseWithPagination(
				getResult,
				{ limit, page, total: count }
			)

			return OK(res, responseData);
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
								{ statusLot: [2,3,4] },
							]
						},
						{ [Op.or]: [
								{ [Op.and]: [
										{ idBarangLelang: body.id_barang_lelang },
										{ statusLot: [2,3,4] },
									] 
								},
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

function getNPL (models) {
  return async (req, res, next) => {
		let { kategori, id_event, id_peserta, status_aktif, sort = '', page = 1, limit = 10, keyword } = req.query
		let where = {}
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
    try {
			const OFFSET = page > 0 ? (page - 1) * parseInt(limit) : undefined
			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			if(id_event) { 
				where.idEvent= id_event
			}

			if(id_peserta) { 
				where.idPeserta = id_peserta
			}

			const mappingSortField = [
        'jmlNPL', 'nominal', 'verifikasi',  
				['namaEvent', sequelize.literal('`Event.namaEvent`')],
				['nama', sequelize.literal('`User.nama`')],
      ];
      const orders = buildOrderQuery(sort, mappingSortField);

      if (orders.length === 0) {
        orders.push(['updatedAt', 'DESC']);
      }

			const whereKey = keyword ? {
				[Op.or]: [
					{ noPembelian : { [Op.like]: `%${keyword}%` }},
					{ '$Event.kode_event$' : { [Op.like]: `%${keyword}%` }},
					{ '$Event.nama_event$' : { [Op.like]: `%${keyword}%` }},
					{ '$User.nama$' : { [Op.like]: `%${keyword}%` }},
					{ '$User.nik$' : { [Op.like]: `%${keyword}%` }},
				]
			} : {}

			where = whereKey

      const { count, rows: dataPembelianNPL } = await models.PembelianNPL.findAndCountAll({
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
				order: orders,
				limit: parseInt(limit),
				offset: OFFSET,
			});

			const getResult = await _buildResponseNPL(models, kategori, id_event, dataPembelianNPL)

			let kumpulNPL = []
			if(kategori == 'withNPL'){
				let result = _.chain(getResult).groupBy("nama").toPairs().map(val => {
					return _.zipObject(['nama', 'dataPembelianNPL'], val)
				}).value()

				kumpulNPL = await Promise.all(result.map(val => {
					let objectBaru = Object.assign(val, {
						nik: val.dataPembelianNPL[0].nik,
						email: val.dataPembelianNPL[0].email
					});
					return objectBaru
				}))
			}

			const responseData = buildMysqlResponseWithPagination(
				kategori == 'withNPL' ? kumpulNPL : getResult,
				{ limit, page, total: kategori == 'withNPL' ? kumpulNPL.length : count }
			)

			return OK(res, responseData);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getManajemenNPL (models) {
  return async (req, res, next) => {
		let { id_kategori, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
				['idKategori', 'ASC'],
			]

			if(id_kategori) {
				where.idKategori = id_kategori
			}

      const dataManajemenNPL = await models.ManajemenNPL.findAll({
				where,
				include: [
					{ 
						model: models.KategoriLelang,
						attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					},
				],
				order,
			});

			let dataKumpul = []
			dataManajemenNPL.map(val => {
				let kumpul = {
					idManajemenNPL: val.idManajemenNPL,
					idKategori: val.idKategori,
					kategori: val.KategoriLelang.kategori,
					nominal: val.nominal,
				}
				dataKumpul.push(kumpul)
			})

			let result = _.chain(dataKumpul).groupBy("kategori").toPairs().map(val => {
				return _.zipObject(['kategori', 'dataManajemenNPL'], val)
			}).value()

			let record = await Promise.all(result.map(async val => {
				let dataManajemen = []
				await val.dataManajemenNPL.map((str, i) => {
					if(i <= 1){
						return dataManajemen.push(str)
					}
				})
				return {
					kategori: val.kategori,
					nominal: val.dataManajemenNPL[0].nominal,
					dataManajemenNPL: dataManajemen }
			}))

			return OK(res, record);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudPembelianNPL (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			console.log(body);
			let kirimdata;
			if(body.jenis == 'ADD'){
				kirimdata = {
					idEvent: body.id_event,
					idPeserta: body.id_peserta,
					typePembelian: body.type_pembelian,
					typeTransaksi: body.type_transaksi,
					noPembelian: body.no_pembelian,
					jmlNPL: body.jml_nonpl,
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
					jmlNPL: body.jml_nonpl,
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

function crudManajemenNPL (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata = {
				idKategori: body.id_kategori,
				nominal: body.nominal,
				createBy: body.create_update_by,
			}
			await models.ManajemenNPL.create(kirimdata)
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

function getPemenang (models) {
	return async (req, res, next) => {
		let { status_aktif, sort = '', page = 1, limit = 10, keyword } = req.query
		let where = {}
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	  try {
			const OFFSET = page > 0 ? (page - 1) * parseInt(limit) : undefined

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			const mappingSortField = [
        'nominal', 'statusPembayaran', 'statusAktif'
      ];
      const orders = buildOrderQuery(sort, mappingSortField);

      if (orders.length === 0) {
        orders.push(['updatedAt', 'DESC']);
      }

			const whereKey = keyword ? {
				[Op.or]: [
					{ namaPemilik : { [Op.like]: `%${keyword}%` }},
					{ nominal : { [Op.like]: `%${keyword}%` }},
					{ '$Bidding.LOT.Event.kode_event$' : { [Op.like]: `%${keyword}%` }},
					{ '$Bidding.LOT.Event.nama_event$' : { [Op.like]: `%${keyword}%` }},
					{ '$Bidding.LOT.BarangLelang.nama_barang_lelang$' : { [Op.like]: `%${keyword}%` }},
				]
			} : {}

			where = whereKey

			const { count, rows: dataPemenang } = await models.PemenangLelang.findAndCountAll({
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
								],
							},
						],
					},
				],
				order: orders,
				limit: parseInt(limit),
				offset: OFFSET,
			});

			const getResult = await _buildResponsePemenang(models, dataPemenang);

			if(sort){
				let sorting = sort.split(',')
				let fieldName = []
				let order = []
				sorting.filter(str => {
					if(str === 'namaPemenang-ASC' || str === 'namaPemenang-DESC'){
						const stringSplit = str.split('-')
						fieldName.push('details.nama','namaPemilik')
						order.push(_.toLower(stringSplit[1]),_.toLower(stringSplit[1]))
					}
				})
				const responseData = buildMysqlResponseWithPagination(
					_.orderBy(getResult, fieldName, order),
					{ limit, page, total: count }
				)
	
				return OK(res, responseData);
			}

			const responseData = buildMysqlResponseWithPagination(
				getResult,
				{ limit, page, total: count }
			)

			return OK(res, responseData);
	  } catch (err) {
			return NOT_FOUND(res, err.message)
	  }
	}  
}

function crudPemenang (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata;
			if(body.jenis == 'EDIT'){
				kirimdata = {
					noRek: body.no_rek,
					namaPemilik: body.nama_pemilik,
					tanggalTransfer: body.tanggal_transfer,
					tipePelunasan: body.tipe_pelunasan,
					statusPembayaran: body.status_pembayaran,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.PemenangLelang.update(kirimdata, { where: { idPemenangLelang: body.id_pemenang_lelang } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.PemenangLelang.update(kirimdata, { where: { idPemenangLelang: body.id_pemenang_lelang } })
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = {
					statusAktif: body.status_aktif,
					updateBy: body.create_update_by
				}
				await models.PemenangLelang.update(kirimdata, { where: { idPemenangLelang: body.id_pemenang_lelang } })
			}else if(body.jenis == 'VERIFIKASI'){
				kirimdata = {
					statusPembayaran: body.status_pembayaran,
					updateBy: body.create_update_by
				}
				await models.PemenangLelang.update(kirimdata, { where: { idPemenangLelang: body.id_pemenang_lelang } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getEventActive (models) {
  return async (req, res, next) => {
		let { status_aktif, sort } = req.query
		let where = {}
		let order = []
	  try { 
			where.tanggalEvent = {
				[Op.gte]: new Date(new Date() - (1 * 24 * 60 * 60 * 1000)) // one days ago
			}
		  order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				where.tanggalEvent = {
          [Op.gte]: new Date(new Date() - (1 * 24 * 60 * 60 * 1000)) // one days ago
        }
			}
      const dataEvent = await models.Event.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			let dataKumpul = await Promise.all(dataEvent.map(async (val) => {
				const dataLot = await models.LOT.findAll({
					where: { idEvent: val.idEvent, statusLot: 2 },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				});
				let tampungData = []
				const splitkodeevent = val.dataValues.kodeEvent.split('-')
				const parameters = {
					tanggalEvent: convertDate(val.dataValues.tanggalEvent),
					startEvent: dateconvert(val.dataValues.tanggalEvent)+' '+val.dataValues.waktuEvent,
					kodeevent_split: splitkodeevent[2],
					kataSandiEvent: decrypt(val.dataValues.kataSandiEvent)
				}
				let objectBaru = Object.assign(val.dataValues, parameters);
				objectBaru = { ...objectBaru, LOT: dataLot.length ? dataLot : [] }
				tampungData.push(objectBaru)
				return tampungData[0]
			}))

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getRoomEvent (models) {
  return async (req, res, next) => {
		let { no_lot, status_aktif, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}
			if(no_lot) { 
				where.noLot = no_lot 
			}
      const dataLot = await models.LOT.findOne({
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
	
			return OK(res, await _buildResponseRoom(models, dataLot));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getBidLelang (models) {
  return async (req, res, next) => {
		let { id_peserta, status_aktif, sort } = req.query
		let where = {}
		let order = []
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}
			if(id_peserta) { 
				where.idPeserta = id_peserta 
				where.statusAktif = true 
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
						where: {
							tanggalEvent: {
								[Op.gte]: new Date(new Date() - (1 * 24 * 60 * 60 * 1000)) // one days ago
							}
						},
						model: models.Event,
						attributes,
					},
				],
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});

			return OK(res, await _buildResponseBidLelang(models, dataPembelianNPL));
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
}