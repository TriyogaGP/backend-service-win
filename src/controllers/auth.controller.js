const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
const { _buildResponseAdmin, _buildResponsePeserta } = require('../utils/build-response');
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

function loginAdmin (models) {
  return async (req, res, next) => {
		let { username, password, lat, long } = req.body		
		let where = {}	
    try {
			if(!username){ return NOT_FOUND(res, 'Username atau Email tidak boleh kosong !') }
			if(!password){ return NOT_FOUND(res, 'Kata Sandi tidak boleh kosong !') }
			
			let options = {
				provider: 'google',
				apiKey: process.env.APIKEY,
			};
			
			let geoCoder = nodeGeocoder(options);
			let alamat = await geoCoder.reverse({lat: lat, lon: long})
			.then((res)=> {
				return res;
			});

			where = {
				[Op.and]: [
					{ statusAktif: true },
					{
						[Op.or]: [
							{ email: username },
							{ username: username }
						]
					}
				]
			}

      const data = await models.Admin.findOne({
				where,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				include: [
					{
						model: models.Role,
						attributes: ['namaRole']
					}
				]
			});

			if(!data){ return NOT_FOUND(res, 'data tidak di temukan !') }

			const match = await bcrypt.compare(password, data.password);
			if(!match) return NOT_FOUND(res, 'Kata Sandi tidak sesuai !');
			const userID = data.idAdmin;
			const nama = data.nama;
			const email = data.email;
			const accessToken = jwt.sign({userID, nama, email}, process.env.ACCESS_TOKEN_SECRET, {
					expiresIn: '12h'
			});
			const refreshToken = jwt.sign({userID, nama, email}, process.env.REFRESH_TOKEN_SECRET, {
					expiresIn: '1d'
			});

			const kirimData = {
				idAdmin: data.idAdmin,
				latitude: lat,
				longitude: long,
				provinsi: alamat[0].administrativeLevels.level1short,
				kota: alamat[0].administrativeLevels.level2short
			}

			let sendData = await models.LoggerAdmin.create(kirimData)

			if(sendData) return OK(res, await _buildResponseAdmin(data, refreshToken, accessToken))
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function loginPeserta (models) {
  return async (req, res, next) => {
		let { email, password, lat, long } = req.body			
    try {
			if(!email){ return NOT_FOUND(res, 'Email tidak boleh kosong !') }
			if(!password){ return NOT_FOUND(res, 'Kata Sandi tidak boleh kosong !') }
			
			let options = {
				provider: 'google',
				apiKey: process.env.APIKEY,
			};
			
			let geoCoder = nodeGeocoder(options);
			let alamat = await geoCoder.reverse({lat: lat, lon: long})
			.then((res)=> {
				return res;
			});

      const data = await models.User.findOne({
				where: {
					statusAktif: true,
					email: email
				},
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});

			if(!data){ return NOT_FOUND(res, 'data tidak di temukan !') }

			const match = await bcrypt.compare(password, data.password);
			if(!match) return NOT_FOUND(res, 'Kata Sandi tidak sesuai !');
			const userID = data.idPeserta;
			const nama = data.nama;
			const Email = data.email;
			const accessToken = jwt.sign({userID, nama, Email}, process.env.ACCESS_TOKEN_SECRET, {
					expiresIn: '12h'
			});
			const refreshToken = jwt.sign({userID, nama, Email}, process.env.REFRESH_TOKEN_SECRET, {
					expiresIn: '1d'
			});

			const kirimData = {
				idPeserta: data.idPeserta,
				latitude: lat,
				longitude: long,
				provinsi: alamat[0].administrativeLevels.level1short,
				kota: alamat[0].administrativeLevels.level2short
			}

			let sendData = await models.LoggerPeserta.create(kirimData)

			if(sendData) return OK(res, await _buildResponsePeserta(data, refreshToken, accessToken))
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getProfile (models) {
  return async (req, res, next) => {
		let { id_login, by } = req.query
    try {
			let dataProfile
			if(by == 'Admin') { 
				dataProfile = await models.Admin.findOne({
					where: { idAdmin: id_login },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
				});
				return OK(res, dataProfile);
			}else if(by == 'Peserta') { 
				dataProfile = await models.User.findOne({
					where: { idPeserta: id_login },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				});

				let dataAddress = await models.Address.findAll({
					where: { idPeserta: id_login },
					attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				});

				// let dataKumpul = Object.assign(dataProfile, {
				// 	fotoPeserta: BASE_URL+'image/berkas/'+dataProfile.fotoPeserta,
				// 	fotoKTP: BASE_URL+'image/berkas/'+dataProfile.fotoKTP,
				// 	fotoNPWP: BASE_URL+'image/berkas/'+dataProfile.fotoNPWP,
				// })
				return OK(res, { ...dataProfile.dataValues, dataAddress});
			}
			OK(res, null, 'param tidak lengkap !');
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getAddress (models) {
  return async (req, res, next) => {
		let idLogin = req.params.idLogin
    try {
			let dataAddress = await models.Address.findAll({
				where: { idPeserta: idLogin },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});
			return OK(res, dataAddress);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getDashboard (models) {
  return async (req, res, next) => {
		let { id_role, by, id_login } = req.query
    try {
			if(by == 'Admin'){
				if(id_role == 1){
					let jmlAdmin = await models.Admin.count();
					let jmlPeserta = await models.User.count();
					//Lelang
					let jmlEvent = await models.Event.count();
					let jmlBarangLelang = await models.BarangLelang.count();
					let jmlLot = await models.LOT.count();
					let jmlPembelianNPL = await models.PembelianNPL.count();
					//Ecommerce
					let jmlProduk = await models.Produk.count();
					let jmlPromosi = await models.Promosi.count();
					return OK(res, {
						jmlAdmin, 
						jmlPeserta,
						jmlEvent,
						jmlBarangLelang,
						jmlLot,
						jmlPembelianNPL,
						jmlProduk,
						jmlPromosi,
					});
				}
			}
			OK(res, null, 'param tidak lengkap !');
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function ubahKataSandi (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata, salt, hashPassword;
			if(body.jenis == 'Admin'){
				let admin = await models.Admin.findOne({where: {idAdmin: body.id_login}})
				if(body.passwordLama != decrypt(admin.kataSandi)) return NOT_FOUND(res, 'Kata Sandi Lama tidak cocok !')
				if(body.passwordBaru != body.passwordConfBaru) return NOT_FOUND(res, 'Kata Sandi Baru tidak cocok dengan Konfirmasi Kata Sandi Baru !')
				salt = await bcrypt.genSalt();
				hashPassword = await bcrypt.hash(body.passwordBaru, salt);
				kirimdata = {
					password: hashPassword,
					kataSandi: encrypt(body.passwordBaru),
					updateBy: body.create_update_by,
				}
				await models.Admin.update(kirimdata, { where: { idAdmin: body.id_login } })
				return OK(res, admin);
			}else if(body.jenis == 'Peserta'){
				let admin = await models.User.findOne({where: {idPeserta: body.id_login}})
				if(body.passwordLama != decrypt(admin.kataSandi)) return NOT_FOUND(res, 'Kata Sandi Lama tidak cocok !')
				if(body.passwordBaru != body.passwordConfBaru) return NOT_FOUND(res, 'Kata Sandi Baru tidak cocok dengan Konfirmasi Kata Sandi Baru !')
				salt = await bcrypt.genSalt();
				hashPassword = await bcrypt.hash(body.passwordBaru, salt);
				kirimdata = {
					password: hashPassword,
					kataSandi: encrypt(body.passwordBaru),
					updateBy: body.create_update_by,
				}
				await models.User.update(kirimdata, { where: { idPeserta: body.id_login } })
				return OK(res, admin);
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
  loginAdmin,
  loginPeserta,
  getProfile,
  getAddress,
  getDashboard,
  ubahKataSandi,
}