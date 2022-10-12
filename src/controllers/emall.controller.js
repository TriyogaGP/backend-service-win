const { response, OK, NOT_FOUND, NO_CONTENT } = require('../utils/response.utils');
const { _buildResponseMall, _buildResponseTenantMall, _buildResponseContent } = require('../utils/build-response');
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

function getKategoriTenant (models) {
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
      const dataKategori = await models.KategoriTenant.findAll({
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

function crudKategoriTenant (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					kategoriTenant: body.kategori_tenant
				}
				const count = await models.KategoriTenant.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					kategoriTenant: body.kategori_tenant,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.KategoriTenant.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.KategoriTenant.findOne({where: {kategoriTenant: body.kategori_tenant, [Op.not]: [{idKategoriTenant: body.id_kategori_tenant}]}})) return NOT_FOUND(res, 'kategori tenant sudah di gunakan !')
				kirimdata = {
					kategoriTenant: body.kategori_tenant,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.KategoriTenant.update(kirimdata, { where: { idKategoriTenant: body.id_kategori_tenant } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.KategoriTenant.update(kirimdata, { where: { idKategoriTenant: body.id_kategori_tenant } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.KategoriTenant.update(kirimdata, { where: { idKategoriTenant: body.id_kategori_tenant } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getKategoriContent (models) {
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
      const dataKategori = await models.KategoriContent.findAll({
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

function crudKategoriContent (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					kategoriContent: body.kategori_content
				}
				const count = await models.KategoriContent.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					kategoriContent: body.kategori_content,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.KategoriContent.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.KategoriContent.findOne({where: {kategoriContent: body.kategori_content, [Op.not]: [{idKategoriContent: body.id_kategori_content}]}})) return NOT_FOUND(res, 'kategori tenant sudah di gunakan !')
				kirimdata = {
					kategoriContent: body.kategori_content,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.KategoriContent.update(kirimdata, { where: { idKategoriContent: body.id_kategori_content } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.KategoriContent.update(kirimdata, { where: { idKategoriContent: body.id_kategori_content } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.KategoriContent.update(kirimdata, { where: { idKategoriContent: body.id_kategori_content } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getMall (models) {
  return async (req, res, next) => {
		let { id_admin, status_aktif, sort } = req.query
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
			if(id_admin) { 
				where.idAdmin = id_admin 
				where.statusAktif = true 
			}
      const dataMall = await models.Mall.findAll({
				where,
				attributes,
				include: [
					{
						model: models.Admin,
						attributes,
						include: [
							{
								model: models.Role,
								attributes,
							}
						],
					}
				],
				order
			});

			return OK(res, await _buildResponseMall(dataMall));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudMall (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					namaMall: body.nama_mall
				}
				const count = await models.Mall.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					idAdmin: body.id_admin,
					UnixText: body.UnixText,
					namaMall: body.nama_mall,
					deskripsi: body.deskripsi,
					alamat: body.alamat,
					provinsi: body.provinsi,
					kota: body.kota,
					noWhatsapp: body.no_whatsapp,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.Mall.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.Mall.findOne({where: {namaMall: body.nama_mall, [Op.not]: [{idMall: body.id_mall}]}})) return NOT_FOUND(res, 'nama mall sudah di gunakan !')
				kirimdata = {
					idAdmin: body.id_admin,
					UnixText: body.UnixText,
					namaMall: body.nama_mall,
					deskripsi: body.deskripsi,
					alamat: body.alamat,
					provinsi: body.provinsi,
					kota: body.kota,
					noWhatsapp: body.no_whatsapp,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.Mall.update(kirimdata, { where: { idMall: body.id_mall } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.Mall.update(kirimdata, { where: { idMall: body.id_mall } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.Mall.update(kirimdata, { where: { idMall: body.id_mall } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getFasilitasMall (models) {
  return async (req, res, next) => {
		let { id_mall, status_aktif, sort } = req.query
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
			if(id_mall) {
				where.idMall = id_mall
				where.statusAktif = 1  
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
      const dataFasilitasMall = await models.FasilitasMall.findAll({
				where,
				attributes,
				include: [
					{
						model: models.Mall,
						attributes,
					}
				],
				order
			});
			
			let dataKumpul = []
			await dataFasilitasMall.map(val => {
				let objectBaru = {
					idFasilitasMall: val.idFasilitasMall,
					idMall: val.idMall,
					idAdmin: val.Mall.idAdmin,
					namaMall: val.Mall.namaMall,
					fasilitasMall: val.fasilitasMall,
					statusAktif: val.statusAktif,
				};
				return dataKumpul.push(objectBaru)
			})

			return OK(res, dataKumpul);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudFasilitasMall (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					idMall: body.id_mall,
					fasilitasMall: body.fasilitas_mall
				}
				const count = await models.FasilitasMall.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					idMall: body.id_mall,
					fasilitasMall: body.fasilitas_mall,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.FasilitasMall.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.FasilitasMall.findOne({where: {idMall: body.id_mall, fasilitasMall: body.fasilitas_mall, [Op.not]: [{idFasilitasMall: body.id_fasilitas_mall}]}})) return NOT_FOUND(res, 'mall dan fasilitas mall sudah di gunakan !')
				kirimdata = {
					idMall: body.id_mall,
					fasilitasMall: body.fasilitas_mall,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.FasilitasMall.update(kirimdata, { where: { idFasilitasMall: body.id_fasilitas_mall } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.FasilitasMall.update(kirimdata, { where: { idFasilitasMall: body.id_fasilitas_mall } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.FasilitasMall.update(kirimdata, { where: { idFasilitasMall: body.id_fasilitas_mall } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getTenantMall (models) {
  return async (req, res, next) => {
		let { id_admin, status_aktif, sort } = req.query
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
			if(id_admin) { 
				where.idAdmin = id_admin 
				where.statusAktif = 1 
				order = [
					['createdAt', sort ? sort : 'ASC'],
				]
			}
      const dataTenantMall = await models.TenantMall.findAll({
				where,
				attributes,
				include: [
					{
						model: models.Admin,
						attributes,
					},
					{
						model: models.KategoriTenant,
						attributes,
					},
					{
						model: models.Mall,
						attributes,
					},
				],
				order
			});

			return OK(res, await _buildResponseTenantMall(dataTenantMall));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getFotoTenantMall (models) {
  return async (req, res, next) => {
		let idTenantMall = req.params.idTenantMall
		let { sort } = req.query
    try {
      const dataFotoTenantMall = await models.FotoTenantMall.findAll({
				where: { idTenantMall: idTenantMall },
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
				order: [
					['createdAt', sort ? sort : 'ASC'],
				]
			});

			// let dataKumpul = []
			// await dataFotoTenantMall.map(val => {
			// 	let objectBaru = Object.assign(val.dataValues, {
			// 		gambar: BASE_URL+'image/mall/'+val.dataValues.gambar
			// 	});
			// 	return dataKumpul.push(objectBaru)
			// })

			return OK(res, dataFotoTenantMall);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudTenantMall (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					idMall: body.id_mall,
					namaTenantMall: body.nama_tenant_mall,
				}
				const count = await models.TenantMall.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					idAdmin: body.id_admin,
					idKategoriTenant: body.id_kategori_tenant,
					idMall: body.id_mall,
					namaTenantMall: body.nama_tenant_mall,
					deskripsi: body.deskripsi,
					alamat: body.alamat,
					provinsi: body.provinsi,
					kota: body.kota,
					noWhatsapp: body.no_whatsapp,
					UnixText: body.UnixText,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await models.TenantMall.create(kirimdata)
			}else if(body.jenis == 'EDIT'){
				if(await models.TenantMall.findOne({where: {idMall: body.id_mall, namaTenantMall: body.nama_tenant_mall, [Op.not]: [{idTenantMall: body.id_tenant_mall}]}})) return NOT_FOUND(res, 'mall dan fasilitas mall sudah di gunakan !')
				kirimdata = {
					idAdmin: body.id_admin,
					idKategoriTenant: body.id_kategori_tenant,
					idMall: body.id_mall,
					namaTenantMall: body.nama_tenant_mall,
					deskripsi: body.deskripsi,
					alamat: body.alamat,
					provinsi: body.provinsi,
					kota: body.kota,
					noWhatsapp: body.no_whatsapp,
					UnixText: body.UnixText,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await models.TenantMall.update(kirimdata, { where: { idTenantMall: body.id_tenant_mall } })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await models.TenantMall.update(kirimdata, { where: { idTenantMall: body.id_tenant_mall } })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await models.TenantMall.update(kirimdata, { where: { idTenantMall: body.id_tenant_mall } })
			}else{
				return NOT_FOUND(res, 'terjadi kesalahan pada sistem !')
			}

			return OK(res);
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getContent (models) {
  return async (req, res, next) => {
		let { kategori, id_kategori_content, id_tenant_mall, id_mall, status_aktif, sort } = req.query
		let where = {}
		let order = []
		let table = ''
		let attributes = { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
    try {
			order = [
				['createdAt', sort ? sort : 'ASC'],
			]
			if(kategori == 'mall'){
				table = models.ContentMall
				if(id_mall) { 
					where.idMall = id_mall 
					where.statusAktif = true 
				}
			}else if(kategori == 'tenantmall'){
				table = models.ContentTenantMall
				if(id_tenant_mall) { 
					where.idTenantMall = id_tenant_mall 
					where.statusAktif = true
				}
			}

			if(status_aktif) { 
				where.statusAktif = status_aktif 
			}

			if(id_kategori_content){
				where.idKategoriContent = id_kategori_content 
			}

      const dataContent = await table.findAll({
				where,
				attributes,
				include: [
					{
						model: models.KategoriContent,
						attributes,
					},
					kategori == 'mall' ?
						{
							model: models.Mall,
							attributes,
							include: [
								{
									model: models.Admin,
									attributes,
								},
							]
						}
					:
						{
							model: models.TenantMall,
							attributes,
							include: [
								{
									model: models.Admin,
									attributes,
								},
							]
						}
				],
				order
			});

			return OK(res, await _buildResponseContent(kategori, dataContent));
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function crudContent (models) {
  return async (req, res, next) => {
		let body = { ...req.body }
		let where = {}
		let table = body.content == 'Mall' ? models.ContentMall : models.ContentTenantMall
		let whereContent = body.content == 'Mall' ? { idContentMall: body.id_content_mall } : { idContentTenantMall: body.id_content_tenant_mall }
    try {
			let kirimdata;
			if(body.jenis == 'ADD'){
				where = { 
					statusAktif: true, 
					judulContent: body.judul_content,
				}
				const count = await table.count({where});
				if(count) return NOT_FOUND(res, 'data sudah di gunakan !')
				kirimdata = {
					idKategoriContent: body.id_kategori_content,
					judulContent: body.judul_content,
					link: body.link,
					deskripsi: body.deskripsi,
					statusAktif: 1,
					createBy: body.create_update_by,
				}
				await table.create(body.content == 'Mall' ? { ...kirimdata, idMall: body.id_mall } : { ...kirimdata, idTenantMall: body.id_tenant_mall })
			}else if(body.jenis == 'EDIT'){
				if(await table.findOne({where: {judulContent: body.judul_content, [Op.not]: [whereContent]}})) return NOT_FOUND(res, 'judul content sudah di gunakan !')
				kirimdata = {
					idKategoriContent: body.id_kategori_content,
					judulContent: body.judul_content,
					link: body.link,
					deskripsi: body.deskripsi,
					statusAktif: 1,
					updateBy: body.create_update_by,
				}
				await table.update(body.content == 'Mall' ? { ...kirimdata, idMall: body.id_mall } : { ...kirimdata, idTenantMall: body.id_tenant_mall }, { where: whereContent })
			}else if(body.jenis == 'DELETE'){
				kirimdata = {
					statusAktif: 0,
					deleteBy: body.delete_by,
					deletedAt: new Date(),
				}
				await table.update(kirimdata, { where: whereContent })	
			}else if(body.jenis == 'STATUSRECORD'){
				kirimdata = { 
					statusAktif: body.status_aktif, 
					updateBy: body.create_update_by 
				}
				await table.update(kirimdata, { where: whereContent })
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
  getKategoriTenant,
  crudKategoriTenant,
  getKategoriContent,
  crudKategoriContent,
  getMall,
  crudMall,
  getFasilitasMall,
  crudFasilitasMall,
  getTenantMall,
  getFotoTenantMall,
  crudTenantMall,
  getContent,
  crudContent,
}