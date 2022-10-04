const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
// const { _buildResponseAdmin, _buildResponsePeserta } = require('../utils/build-response');
const { encrypt, decrypt } = require('../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getAdmin (models) {
  return async (req, res, next) => {
		let { status_aktif, level, sort } = req.query
		let where = {}
		let order = []
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				
			}
			if(level) { 
				where = {
					level: level,
					statusAktif: true
				}
			}
      const dataAdmin = await models.Admin.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			const getResult = await Promise.all(dataAdmin.map(async (val) => {
				let dataRole = await models.Role.findOne({
					where: { idRole: val.level },
					attributes: ['namaRole'],
				});
	
				let dataKumpul = Object.assign(val.dataValues, {
					namaRole: dataRole.namaRole,
				})
				return dataKumpul;
			}))

			return OK(res, getResult);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudAdmin (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let salt, hashPassword, kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true,
					[Op.or]: [
						{ email: body.email },
						{ username: body.username }
					] 
				}
				const {count, rows} = await models.Admin.findAndCountAll({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				salt = await bcrypt.genSalt();
				hashPassword = await bcrypt.hash(body.password, salt);
				kirimdata = {
					level: body.level,
					downline_tenant: body.downline_tenant,
					nama: body.nama,
					email: body.email,
					username: body.username,
					password: hashPassword,
					kataSandi: encrypt(body.password),
					kota: body.kota,
					noHP: body.no_hp,
					alamat: body.alamat,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.Admin.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.Admin.findOne({where: {email: body.email, [Op.not]: [{idAdmin: body.id_admin}]}})) return NOT_FOUND(res, 'email sudah di gunakan !')
				if(await models.Admin.findOne({where: {username: body.username, [Op.not]: [{idAdmin: body.id_admin}]}})) return NOT_FOUND(res, 'username sudah di gunakan !')
				const data = await models.Admin.findOne({where: {idAdmin: body.id_admin}});
				salt = await bcrypt.genSalt();
				let decryptPass = data.kataSandi != body.password ? body.password : decrypt(body.password)
				hashPassword = await bcrypt.hash(decryptPass, salt);
				kirimdata = {
					downline_tenant: body.downline_tenant,
					level: body.level,
					nama: body.nama,
					email: body.email,
					username: body.username,
					password: hashPassword,
					kataSandi: data.kataSandi == body.password ? body.password : encrypt(body.password),
					kota: body.kota,
					noHP: body.no_hp,
					alamat: body.alamat,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.Admin.update(kirimdata, { where: { idAdmin: body.id_admin } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.Admin.update(kirimdata, { where: { idAdmin: body.id_admin } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.Admin.update(kirimdata, { where: { idAdmin: body.id_admin } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getPeserta (models) {
  return async (req, res, next) => {
		let { status_aktif, id_peserta, sort } = req.query
		let where = {}
		let order = []
    try {
			if(status_aktif) { 
				where.statusAktif = status_aktif 
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
			if(id_peserta) { 
				where = {
					idPeserta: id_peserta,
					statusAktif: true
				}
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
      dataProfile = await models.User.findAll({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order
			});

			const getResult = await Promise.all(dataProfile.map(async (val) => {
				let dataAddress = await models.Address.findAll({
					where: { idPeserta: val.idPeserta },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
					order
				});
	
				let dataKumpul = Object.assign(val.dataValues, {
					// fotoPeserta: BASE_URL+'image/berkas/'+val.dataValues.fotoPeserta,
					// fotoKTP: BASE_URL+'image/berkas/'+val.dataValues.fotoKTP,
					// fotoNPWP: BASE_URL+'image/berkas/'+val.dataValues.fotoNPWP,
					dataAddress,
				})
				return dataKumpul;
			}))

			return OK(res, getResult);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudPeserta (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let salt, hashPassword, kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true,
					[Op.or]: [
						{ email: body.email },
						{ nik: body.nik }
					] 
				}
				const {count, rows} = await models.User.findAndCountAll({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				salt = await bcrypt.genSalt();
				hashPassword = await bcrypt.hash(body.password, salt);
				kirimdata = {
					UnixText: body.UnixText,
					nik: body.nik,
					nama: body.nama,
					email: body.email,
					password: hashPassword,
					kataSandi: encrypt(body.password),
					noHP: body.no_hp,
					alamat: body.alamat,
					kodePos: body.kode_pos,
					npwp: body.npwp,
					noRek: body.no_rek,
					namaRek: body.nama_rek,
					bertindakMewakili: body.bertindak_mewakili,
					namaPerusahaan: body.nama_perusahaan,
					npwpPerusahaan: body.npwp_perusahaan,
					alamatPerusahaan: body.alamat_perusahaan,
					telpKantor: body.telp_kantor,
					emailKantor: body.email_kantor,
					sumberDana: body.sumber_dana,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.User.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.User.findOne({where: {email: body.email, [Op.not]: [{idPeserta: body.id_peserta}]}})) return NOT_FOUND(res, 'email sudah di gunakan !')
				if(await models.User.findOne({where: {nik: body.nik, [Op.not]: [{idPeserta: body.id_peserta}]}})) return NOT_FOUND(res, 'nik sudah di gunakan !')
				const data = await models.User.findOne({where: {idPeserta: body.id_peserta}});
				salt = await bcrypt.genSalt();
				let decryptPass = data.kataSandi != body.password ? body.password : decrypt(body.password)
				hashPassword = await bcrypt.hash(decryptPass, salt);
				kirimdata = {
					UnixText: body.UnixText,
					nik: body.nik,
					nama: body.nama,
					email: body.email,
					password: hashPassword,
					kataSandi: data.kataSandi == body.password ? body.password : encrypt(body.password),
					noHP: body.no_hp,
					alamat: body.alamat,
					kodePos: body.kode_pos,
					npwp: body.npwp,
					noRek: body.no_rek,
					namaRek: body.nama_rek,
					bertindakMewakili: body.bertindak_mewakili,
					namaPerusahaan: body.nama_perusahaan,
					npwpPerusahaan: body.npwp_perusahaan,
					alamatPerusahaan: body.alamat_perusahaan,
					telpKantor: body.telp_kantor,
					emailKantor: body.email_kantor,
					sumberDana: body.sumber_dana,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.User.update(kirimdata, { where: { idPeserta: body.id_peserta } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.User.update(kirimdata, { where: { idPeserta: body.id_peserta } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.User.update(kirimdata, { where: { idPeserta: body.id_peserta } })
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
  getAdmin,
  crudAdmin,
  getPeserta,
  crudPeserta,
}