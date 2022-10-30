const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
const { 
	_buildResponseMenu, 
	_buildResponseKurir, 
	_buildResponseLoggerAdmin, 
	_buildResponseLoggerPeserta 
} = require('../utils/build-response');
const { encrypt, decrypt } = require('../utils/helper.utils')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const { logger } = require('../configs/db.winston')
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function updateFile (models) {
  return async (req, res, next) => {
		let namaFile = req.files[0].filename;
		let body = { ...req.body, namaFile };
    try {
      let kirimdata, whereBy
			if(body.table == 'm_peserta'){ //untuk User Peserta
				let splitData = body.nama_file.split('-')
				kirimdata = 
				splitData[1] == 'ktp' ? { fotoKTP: body.nama_folder+'/'+body.namaFile } : 
				splitData[1] == 'npwp' ? { fotoNPWP: body.nama_folder+'/'+body.namaFile } : 
				{ fotoPeserta: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { nik: body.nik } : { idPeserta: body.id }
				await models.User.update(kirimdata, { where: whereBy })
			}else if(body.table == 't_event'){ //untuk Event
				kirimdata = { gambar: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { kodeEvent: body.kode_event, namaEvent: body.nama_event } : { idEvent: body.id }
				await models.Event.update(kirimdata, { where: whereBy })
			}else if(body.table == 'm_barang_lelang'){ // untuk Barang Lelang
				let splitData = body.nama_file.split('-')
				kirimdata = splitData[1] == 'stnk' ? { stnk: body.nama_folder+'/'+body.namaFile } : 
					splitData[1] == 'bpkb' ? { bpkb: body.nama_folder+'/'+body.namaFile } : 
					splitData[1] == 'faktur' ? { faktur: body.nama_folder+'/'+body.namaFile } : 
					splitData[1] == 'ktp' ? { ktpPemilik: body.nama_folder+'/'+body.namaFile } : 
					splitData[1] == 'kwitansi' ? { kwitansi: body.nama_folder+'/'+body.namaFile } : ''
				whereBy = body.proses == 'ADD' ? { namaBarangLelang: body.nama_barang_lelang } : { idBarangLelang: body.id }
				await models.BarangLelang.update(kirimdata, { where: whereBy })
			}else if(body.table == 'm_foto_barang_lelang'){ //untuk Foto Barang Lelang
				kirimdata = { 
					idBarangLelang: body.id,
					title: body.title,
					kategori: body.kategori,
					gambar: body.nama_folder+'/'+body.namaFile,
					statusAktif: 1
				}
				await models.FotoBarangLelang.create(kirimdata)
			}else if(body.table == 'm_produk'){ //untuk Produk
				kirimdata = { coverImage: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { kodeProduk: body.kode_produk } : { idProduk: body.id }
				await models.Produk.update(kirimdata, { where: whereBy })	
			}else if(body.table == 'm_foto_produk'){ //untuk Foto Produk
				kirimdata = { idProduk: body.id, gambar: body.nama_folder+'/'+body.namaFile, statusAktif: 1 }
				await models.FotoProduk.create(kirimdata)
			}else if(body.table == 'm_foto_tenant_mall'){ //untuk Foto Tenant Mall
				kirimdata = { idTenantMall: body.id, gambar: body.nama_folder+'/'+body.namaFile, statusAktif: 1 }
				await models.FotoTenantMall.create(kirimdata)
			}else if(body.table == 't_pembelian_npl'){ //untuk Pembelian NPL
				kirimdata = { bukti: body.nama_folder+'/'+body.namaFile }
				whereBy = { idPembelianNPL: body.id }
				await models.PembelianNPL.update(kirimdata, { where: whereBy })
			}else if(body.table == 't_refund_npl'){ //untuk Refund NPL
				kirimdata = { idNpl: body.id, bukti: body.nama_folder+'/'+body.namaFile, status_refund: 1, createBy: body.create_update_by }
				await models.RefundNPL.create(kirimdata)
			}else if(body.table == 't_promosi'){ //untuk Promosi
				kirimdata = { gambar: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { namaPromo: body.nama_promo } : { idPromosi: body.id }
				await models.Promosi.update(kirimdata, { where: whereBy })
			}else if(body.table == 'm_mall'){ //untuk Mall
				kirimdata = { logo: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { namaMall: body.nama_mall } : { idMall: body.id }
				await models.Mall.update(kirimdata, { where: whereBy })
			}else if(body.table == 't_tenant_mall'){ //untuk Tenant Mall
				kirimdata = { logo: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { namaTenantMall: body.nama_tenant_mall } : { idTenantMall: body.id }
				await models.TenantMall.update(kirimdata, { where: whereBy })
			}else if(body.table == 't_content_mall'){ //untuk Content Mall
				kirimdata = { foto: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { judulContent: body.judul_content } : { idContentMall: body.id }
				await models.ContentMall.update(kirimdata, { where: whereBy })
			}else if(body.table == 't_content_tenant_mall'){ //untuk Content Tenant Mall
				kirimdata = { foto: body.nama_folder+'/'+body.namaFile }
				whereBy = body.proses == 'ADD' ? { judulContent: body.judul_content } : { idContentTenantMall: body.id }
				await models.ContentTenantMall.update(kirimdata, { where: whereBy })
			}else if(body.table == 't_pemenang_lelang'){ //untuk Pemenang Lelang
				kirimdata = { bukti: body.namaFile }
				whereBy = { idPemenangLelang: body.id }
			}
			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function updateBerkas (models) {
	return async (req, res, next) => {
		let namaFile = req.files[0].filename;
		let body = { ...req.body, namaFile };
	  try {
			let kirimdata, whereBy
			if(body.table == 'm_barang_lelang'){
				let splitData = body.nama_file.split('-')
				kirimdata = splitData[1] == 'sph' ? { sph: body.nama_folder+'/'+body.namaFile } : 
					splitData[1] == 'kir' ? { kir: body.nama_folder+'/'+body.namaFile } : ''
				whereBy = body.proses == 'ADD' ? { namaBarangLelang: body.nama_barang_lelang } : { idBarangLelang: body.id }
				await models.BarangLelang.update(kirimdata, { where: whereBy })
			}
			return OK(res);
	  } catch (err) {
			return NOT_FOUND(res, err.message)
	  }
	}  
  }

function getEncrypt () {
  return async (req, res, next) => {
		let { kata } = req.query;
    try {
      let dataEncrypt = {
				asli: kata,
				hasil: encrypt(kata)
			}

			// logger.info(JSON.stringify({ message: dataEncrypt, level: 'info', timestamp: new Date() }), {route: '/settings/encryptPass'});
			return OK(res, dataEncrypt);
    } catch (err) {
			// logger.error(JSON.stringify({ message: err.message, level: 'error', timestamp: new Date() }), {route: '/settings/encryptPass'});
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getDecrypt () {
  return async (req, res, next) => {
		let { kata } = req.query;
    try {
      let dataDecrypt = {
				asli: kata,
				hasil: decrypt(kata)
			}
			return OK(res, dataDecrypt);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getRole (models) {
  return async (req, res, next) => {
    try {
      const dataRole = await models.Role.findAll();
			return OK(res, dataRole);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getMenu (models) {
  return async (req, res, next) => {
		let { idRole } = req.query
		let where = {}
    try {
			if(idRole) {
				where = {
					idRole: idRole,
					status: true
				}
			}
      const dataMenu = await models.Menu.findAll({
				where,
				include: [
					{
						model: models.Role,
						attributes: ['idRole', 'namaRole']
					}
				],
				order: [
					['position', 'ASC'],
				]
			});

			return OK(res, await _buildResponseMenu(dataMenu));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function postMenu (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata;
			if(body.jenis == 'EDIT'){
				if(await models.Menu.findOne({where: {[Op.not]: [{menuText: body.menu_text, menuRoute: body.menu_route}], [Op.not]: [{idMenu: body.id_menu}]}})) return NOT_FOUND(res, 'Menu Label sudah di gunakan !')
				kirimdata = {
					idRole: body.id_role,
					menuText: body.menu_text,
					menuRoute: body.menu_route,
					menuIcon: body.menu_icon,
					position: body.position,
					status: 1,
				}
				await models.Menu.update(kirimdata, { where: { idMenu: body.id_menu } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					status: 0,
				}
				await models.Menu.update(kirimdata, { where: { idMenu: body.id_menu } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					status: body.status, 
				}
				await models.Menu.update(kirimdata, { where: { idMenu: body.id_menu } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getKurir (models) {
  return async (req, res, next) => {
		let { idKurir } = req.query;
		let where = {}
    try {
			if(idKurir) { where.idKurir = idKurir }

			const dataKurir = await models.Kurir.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});

			let dataKumpul = []
			await dataKurir.map(val => {
				let objectBaru = Object.assign(val.dataValues, {image: BASE_URL+'kurir/'+val.dataValues.image});
				return dataKumpul.push(objectBaru)
			})

			return OK(res, await _buildResponseKurir(models, dataKumpul));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getKurirServiceBy (models) {
  return async (req, res, next) => {
		let idKurir = req.params.idKurir;
    try {
			const dataKurirService = await models.KurirService.findAll({
				where: { idKurir: idKurir },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
			});

			return OK(res, dataKurirService);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getPayment (models) {
  return async (req, res, next) => {
		let { idPayment } = req.query
		let where = {}
    try {
			if(idPayment) {
				where.idPayment = idPayment
			}
			const dataPaymentMethod= await models.PaymentMethod.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
			});
			
			let dataKumpul = []
			await dataPaymentMethod.map(val => {
				let objectBaru = Object.assign(val.dataValues, {image: BASE_URL+'payment/'+val.dataValues.image});
				return dataKumpul.push(objectBaru)
			})

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getWilayah (models) {
  return async (req, res, next) => {
		let { bagian, KodeWilayah } = req.query
		let jmlString = bagian == 'provinsi' ? 2 : bagian == 'kabkotaOnly' ? 5 : KodeWilayah.length
		let whereChar = (jmlString==2?5:(jmlString==5?8:13))
    let where = {}
		try {
			if(bagian == 'provinsi' || bagian == 'kabkotaOnly') {
				where = sequelize.where(sequelize.fn('char_length', sequelize.col('kode')), jmlString)
			}else{
				where = { 
					[Op.and]: [
						sequelize.where(sequelize.fn('char_length', sequelize.col('kode')), whereChar),
						{
							kode: {
								[Op.like]: `${KodeWilayah}%`
							}
						}
					]
				}
			}
			const dataWilayah = await models.Wilayah.findAll({
				where,
				attributes: [['kode', 'value'], ['nama', 'text'], 'kodePos']
			});

			return OK(res, dataWilayah);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getLoggerAdmin (models) {
  return async (req, res, next) => {
    try {
      const dataLoggerAdmin = await models.LoggerAdmin.findAll({
				include: [
					{
						model: models.Admin,
						attributes: ['nama']
					}
				],
			});

			return OK(res, await _buildResponseLoggerAdmin(dataLoggerAdmin));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getLoggerPeserta (models) {
  return async (req, res, next) => {
    try {
      const dataLoggerPeserta = await models.LoggerPeserta.findAll({
				include: [
					{
						model: models.User,
						attributes: ['nama']
					}
				],
			});

			return OK(res, await _buildResponseLoggerPeserta(dataLoggerPeserta));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getMeasurement (models) {
  return async (req, res, next) => {
		let { status_aktif } = req.query
		let where = {}
    try {
			if(status_aktif) {
				where.statusAktif = status_aktif
			}
      const dataMeasurement = await models.Measurement.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
			});
			return OK(res, dataMeasurement);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

module.exports = {
  updateFile,
  updateBerkas,
  getEncrypt,
  getDecrypt,
  getRole,
  getMenu,
  postMenu,
  getKurir,
  getKurirServiceBy,
  getPayment,
  getWilayah,
  getLoggerAdmin,
  getLoggerPeserta,
  getMeasurement,
}