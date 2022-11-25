const { response, OK, NOT_FOUND, NO_CONTENT } = require('../../utils/response.utils');
const { _buildResponsePeserta } = require('../../utils/build-response-json');
const { encrypt, decrypt, makeRandom, convertDateGabung } = require('../../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const { request } = require('../../utils/request')
const { logger } = require('../../configs/db.winston')
const nodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL
const KMART_BASE_URL = 'https://kld-api-stg.k-mart.co.id/v1/'

function login (models) {
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

function register (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			where = { 
				statusAktif: true,
				[Op.or]: [
					{ email: body.email },
					{ nik: body.nik }
				] 
			}
			const {count, rows} = await models.User.findAndCountAll({where});
			if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
			let salt = await bcrypt.genSalt();
			let hashPassword = await bcrypt.hash(body.password, salt);

			let kirimdata = {
				UnixText: `Peserta${convertDateGabung(new Date().toISOString().slice(0,10))}${makeRandom(8)}`,
				nik: body.nik,
				nama: body.nama,
				email: body.email,
				password: hashPassword,
				kataSandi: encrypt(body.password),
				statusAktif: 1,
			}
			await models.User.create(kirimdata)

			return OK(res)
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function blastEmail () {
  return async (req, res, next) => {
		let { email, kodeOtp } = req.body
    try {
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'triyoga.ginanjar.p@gmail.com',
					pass: 'edyqlenfqxgtmeat' //26122020CBN
				}
			});

			let html = `<h1>Konfirmasi Pendataran Akun</h1>`;
			html += `Harap informasi ini jangan di hapus karena informasi ini penting adanya, dan masukan kode ini <strong>${kodeOtp}</strong> untuk aktifkan akun anda. Terimakasih. <br>Jika Anda memiliki pertanyaan, silakan balas email ini`;
			
			let mailOptions = {
				from: process.env.EMAIL,
				to: email,
				subject: 'Konfirmasi Pendaftaran Akun',
				// text: `Silahkan masukan kode verifikasi akun tersebut`
				html: html,
			};

			transporter.sendMail(mailOptions, (err, info) => {
				if (err) return NOT_FOUND(res, 'Gagal mengirim data ke alamat email anda, cek lagi email yang di daftarkan!.')
			});

			return OK(res)
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function forgotPass (models) {
  return async (req, res, next) => {
		let { email } = req.body
    try {
			const data = await models.User.findOne({
				where: {
					statusAktif: true,
					email: email
				},
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});

			if(!data){ return NOT_FOUND(res, 'data tidak di temukan !') }

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'triyoga.ginanjar.p@gmail.com',
					pass: 'edyqlenfqxgtmeat' //26122020CBN
				}
			});

			let html = `<h1>Data Informasi Akun</h1>
			<ul>`;
			html += `<li>Nama Lengkap : ${data.nama}</li>
				<li>Alamat Email : ${data.email}</li>
				<li>Kata Sandi : ${decrypt(data.kataSandi)}</li>
			</ul>
			Harap informasi ini jangan di hapus karena informasi ini penting adanya. Terimakasih. <br>Jika Anda memiliki pertanyaan, silakan balas email ini`;
			
			let mailOptions = {
				from: process.env.EMAIL,
				to: email,
				subject: 'Konfirmasi Lupa Kata Sandi',
				// text: `Silahkan masukan kode verifikasi akun tersebut`
				html: html,
			};

			transporter.sendMail(mailOptions, (err, info) => {
				if (err) return NOT_FOUND(res, 'Gagal mengirim data ke alamat email anda, cek lagi email yang di daftarkan!.')
			});

			return OK(res)
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function updateProfile (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
    try {
			let kirimdata = {
				nama: body.nama,
				email: body.email,
				noHP: body.no_hp,
				alamat: body.alamat,
				updateBy: body.id_peserta,
			}
			await models.User.update(kirimdata, { where: { idPeserta: body.id_peserta } })

			return OK(res)
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function updateFotoProfile (models) {
  return async (req, res, next) => {
		let namaFile = req.files[0].filename;
		let body = { ...req.body, namaFile };
    try {
			let kirimdata = { fotoPeserta: body.nama_folder+'/'+body.namaFile }
			await models.User.update(kirimdata, { where: { idPeserta: body.id } })

			return OK(res)
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getProfile (models) {
  return async (req, res, next) => {
		let idPeserta = req.params.idPeserta
    try {
			let dataProfile = await models.User.findOne({
				where: { idPeserta: idPeserta },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});

			let dataAddress = await models.Address.findAll({
				where: { idPeserta: idPeserta },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});

			let dataKumpul = Object.assign(dataProfile, {
				fotoPeserta: BASE_URL+'image/berkas/'+dataProfile.fotoPeserta,
				fotoKTP: BASE_URL+'image/berkas/'+dataProfile.fotoKTP,
				fotoNPWP: BASE_URL+'image/berkas/'+dataProfile.fotoNPWP,
			})

			return OK(res, { ...dataKumpul.dataValues, dataAddress});
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getAddress (models) {
  return async (req, res, next) => {
		let idPeserta = req.params.idPeserta
    try {
			let dataAddress = await models.Address.findAll({
				where: { idPeserta: idPeserta },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			});
			return OK(res, dataAddress);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function testing (models) {
  return async (req, res, next) => {
    try {
			let dataNotif = await models.Notification.findAll({
				where: { statusAktif: false },
				attributes: { exclude: ['updatedAt', 'deletedAt'] },
			});

			let dataKumpul = []
			await dataNotif.map(val => {
				let objectBaru = Object.assign(val.dataValues, {
					params: val.dataValues.params ? JSON.parse([val.dataValues.params]) : {}
				});
				if(val.dataValues.params.room == '0002_Event 1') return dataKumpul.push(objectBaru);
			})

			if (!dataKumpul.length) {
				let kirimData = {
					idPeserta: '1',
					type: 'IN_APP',
					judul: null,
					pesan: null,
					params: JSON.stringify({
						idPemenang: null,
						noLot: '0002',
						room: '0002_Event 1'
					}),
					isRead: 0,
					statusAktif: 0
				}
	
				await models.Notification.create(kirimData)
				return OK(res);
			} else {
				return OK(res, dataKumpul);
			}
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

module.exports = {
  login,
  register,
  blastEmail,
  forgotPass,
  updateProfile,
  updateFotoProfile,
  getProfile,
  getAddress,
  testing,
}