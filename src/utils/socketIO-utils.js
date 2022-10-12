const { encrypt, decrypt, makeRandom, convertDateTime } = require('./helper.utils');
const { Op } = require('sequelize')
const { sequelizeInstance, Sequelize } = require('../configs/db.config');
const { importModels } = require('../models/index')
const models = importModels(sequelizeInstance, Sequelize);

const userJoin = async (id, room, id_peserta, id_event, is_admin, device) => {
	const cekData = await models.RoomJoin.findAll({where: { idEvent: id_event, idPeserta: id_peserta }})
  let user = null;
  if(!cekData.length){
    user = {
      idUser: makeRandom(15),
      socketID: id,
      room,
      idPeserta: id_peserta,
      idEvent: id_event,
      isAdmin: is_admin,
      device,
    }
    await models.RoomJoin.create(user);  
  }else{
    user = {
      idUser: cekData[0].idUser,
      socketID: id,
      room,
      idPeserta: id_peserta,
      idEvent: id_event,
      isAdmin: is_admin,
      device,
    }
    await models.RoomJoin.update(user, {where: { idEvent: id_event, idPeserta: id_peserta }});  
  }
  return user
};

const getCurrentUser = async (user) => {
	let table = user.isAdmin == 1 ? models.Admin : models.User;
	let where = user.isAdmin == 1 ? { idAdmin: user.idPeserta } : { idPeserta: user.idPeserta };
	const getUser = await table.findOne({where})
	const getEvent = await models.Event.findOne({where: { idEvent: user.idEvent }})
  return {
    ...user,
    nama: getUser.nama,
    email: getUser.email,
    alamat: getUser.alamat,
    noHP: getUser.noHP,
    kodeEvent: getEvent.kodeEvent,
    namaEvent: getEvent.namaEvent,
    kataSandiEvent: getEvent.kataSandiEvent,
    tanggalEvent: getEvent.tanggalEvent,
    waktuEvent: getEvent.waktuEvent,
  }
};

const getUsersData = async (room) => {
	const getData = await models.RoomJoin.findAll({where: { room: room }})
  const tampilData = await Promise.all(getData.map(async (val) => {
    let tampungData = []
    let table = val.isAdmin == 1 ? models.Admin : models.User;
		let where = val.isAdmin == 1 ? { idAdmin: val.idPeserta } : { idPeserta: val.idPeserta };
		const getUser = await table.findOne({where})
		const getEvent = await models.Event.findOne({where: { idEvent: val.idEvent }})
    let tampung = {
      ...val.dataValues,
      nama: getUser.nama,
      email: getUser.email,
      alamat: getUser.alamat,
      noHP: getUser.noHP,
      kodeEvent: getEvent.kodeEvent,
      namaEvent: getEvent.namaEvent,
      katasandiEvent: getEvent.katasandiEvent,
      tanggalEvent: getEvent.tanggalEvent,
      waktuEvent: getEvent.waktuEvent,
      status: true,
    }
    tampungData.push(tampung)
    return tampungData[0]
  }))
  return tampilData.length ? tampilData : []
};

const getMassageRoom = async (room) => {
  const getData = await models.RoomBid.findAll({where: { room: room }})
  const tampilData = await Promise.all(getData.map(async (val) => {
    let tampungData = []
    let table = val.isAdmin == 1 ? models.Admin : models.User;
		let where = val.isAdmin == 1 ? { idAdmin: val.idPeserta } : { idPeserta: val.idPeserta };
		const getUser = await table.findOne({where})
    let tampung = {
      ...val.dataValues,
      jam: convertDateTime(val.dataValues.createdAt),
      nama: getUser.nama,
      email: getUser.email,
      alamat: getUser.alamat,
      noHP: getUser.noHP,
    }
    tampungData.push(tampung)
    return tampungData[0]
  }))
  return tampilData
};

const userJoinBidding = async (id, room, id_peserta, id_event, id_npl, id_lot, is_admin, device) => {
	const cekData = await models.RoomJoin.findAll({where: { idEvent: id_event, idPeserta: id_peserta, idNpl: id_npl }})
  if(!is_admin){
    let npl = {
      statusNPL: 1
    }
    await models.NPL.update(npl, {where: { idNpl: id_npl }});  
  }else{
    let lot = {
      statusLot: 3
    }
    await models.LOT.update(lot, {where: { noLot: room.split('_')[0] }});
  }

  let user;
  if(!cekData.length){
    user = {
      idUser: makeRandom(15),
      socketID: id,
      room,
      idPeserta: id_peserta,
      idEvent: id_event,
      idNpl: id_npl,
      idLot: id_lot,
      isAdmin: is_admin,
      device,
    }
    await models.RoomJoin.create(user);  
  }else{
    user = {
      idUser: cekData[0].idUser,
      socketID: id,
      room,
      idPeserta: id_peserta,
      idEvent: id_event,
      idNpl: id_npl,
      idLot: id_lot,
      isAdmin: is_admin,
      device,
    }
    await models.RoomJoin.update(user, {where: { idEvent: id_event, idPeserta: id_peserta, idNpl: id_npl }});  
  }
  return user
};

const getCurrentUserBidding = async (user) => {
  let table = user.is_admin == 1 ? models.Admin : models.User;
	let where = user.is_admin == 1 ? { idAdmin: user.idPeserta } : { idPeserta: user.idPeserta };
	const getUser = await table.findOne({where})
	const getEvent = await models.Event.findOne({where: { idEvent: user.idEvent }})
  if(user.isAdmin){
    return {
      ...user,
      nama: getUser.nama,
      email: getUser.email,
      alamat: getUser.alamat,
      noHP: getUser.noHP,
			kodeEvent: getEvent.kodeEvent,
      namaEvent: getEvent.namaEvent,
      kataSandiEvent: getEvent.kataSandiEvent,
      tanggalEvent: getEvent.tanggalEvent,
      waktuEvent: getEvent.waktuEvent,
    }
  }
	const getNPL = await models.NPL.findOne({where: { idNpl: user.idNpl }})
  return {
    ...user,
    nama: getUser.nama,
    email: getUser.email,
    alamat: getUser.alamat,
    noHP: getUser.noHP,
    kodeEvent: getEvent.kodeEvent,
    namaEvent: getEvent.namaEvent,
    kataSandiEvent: getEvent.kataSandiEvent,
    tanggalEvent: getEvent.tanggalEvent,
    waktuEvent: getEvent.waktuEvent,
    noNpl: getNPL.noNpl,
    npl: getNPL.npl,
    statusNPL: getNPL.statusNPL,
  }
};

const getUserBidding = async (id_lot) => {
	let hasil = 0
	const getBid = await models.Bidding.findAll({where: { idLot: id_lot, statusAktif: true }, order: [['createdAt', 'DESC']]})
	getBid.map(val => {
		hasil += parseInt(val.hargaBidding)
	})

  if(getBid.length) {
		const getNPL = await models.NPL.findOne({where: { idNpl: getBid[0].idNpl }})		
		let table = getBid[0].isAdmin == 1 ? models.Admin : models.User;
		let where = getBid[0].isAdmin == 1 ? { idAdmin: getBid[0].idNpl } : { idPeserta: getBid[0].idNpl };
		const getUser = await table.findOne({where})
    return { 
      dataBidding: { 
        ...getBid[0].dataValues, 
        no_npl: getBid[0].isAdmin == 1 ? 'Admin' : getNPL.noNpl, 
        npl: getBid[0].isAdmin == 1 ? 'Admin' : getNPL.npl,
        nama: getUser.nama,
        email: getUser.email,
        alamat: getUser.alamat,
        noHP: getUser.noHP,
      }, 
      totalUserBid: getBid.length, 
      nilaiAkhir: hasil.toString() 
    }
  }else{
    return { 
      dataBidding: null, 
      totalUserBid: getBid.length, 
      nilaiAkhir: hasil.toString() 
    }
  }
};

const setUserBidding = async (id_npl, id_lot, harga_bidding, is_admin) => {
	const getNPL = await models.NPL.findOne({where: { idNpl: id_npl }})
  let kirim = {
    idNpl: id_npl,
    idLot: id_lot,
    hargaBidding: harga_bidding,
    isAdmin: is_admin,
  }
  await models.Bidding.create(kirim);  
  return { 
		...kirim, 
		id_peserta: getNPL.idPeserta 
	}
};

const setUserPemenang = async (create_by, id_bidding, nominal, nama, no_npl) => {
  let kirim = { 
		createdBy: create_by, 
		idBidding: id_bidding, 
		nominal 
	}
  await models.PemenangLelang.create(kirim);  
  return { id_bidding, nominal, nama, no_npl }
};

const messageRoom = async (room, id_peserta, id_event, is_admin, pesan) => {
  let kirimPesan = {
    room,
    idPeserta: id_peserta,
    idEvent: id_event,
    isAdmin: is_admin,
    pesan,
  }
  await models.RoomBid.create(kirimPesan);  
  const getData = await models.RoomBid.findAll({where: { room: room }})
  const tampilData = await Promise.all(getData.map(async (val) => {
    let tampungData = []
    let table = val.isAdmin == 1 ? models.Admin : models.User;
		let where = val.isAdmin == 1 ? { idAdmin: val.idPeserta } : { idPeserta: val.idPeserta };
		const getUser = await table.findOne({where})
    let tampung = {
      ...val.dataValues,
      jam: convertDateTime(val.dataValues.createdAt),
      nama: getUser.nama,
      email: getUser.email,
      alamat: getUser.alamat,
      noHP: getUser.noHP,
    }
    tampungData.push(tampung)
    return tampungData[0]
  }))
  return tampilData
};

const getUserData = async (id) => {
	const getData = await models.RoomJoin.findOne({where: { socketID: id }})
  if(getData){
		let table = getData.isAdmin == 1 ? models.Admin : models.User;
		let where = getData.isAdmin == 1 ? { idAdmin: getData.idPeserta } : { idPeserta: getData.idPeserta };
		const getUser = await table.findOne({where})
		const getEvent = await models.Event.findOne({where: { idEvent: getData.idEvent }})
    return {
      ...getData,
      nama: getUser.nama,
      email: getUser.email,
      alamat: getUser.alamat,
      noHP: getUser.noHP,
      kodeEvent: getEvent.kodeEvent,
      namaEvent: getEvent.namaEvent,
      katasandiEvent: getEvent.katasandiEvent,
      tanggalEvent: getEvent.tanggalEvent,
      waktuEvent: getEvent.waktuEvent,
      status: true,
    }
  }else{
    return {
      status: false,
    }
  }
};

const userLeave = async (id) => {
  await models.RoomJoin.destroy({where: { socketID: id }});  
};

module.exports = {
  userJoin,
  getCurrentUser,
  getUsersData,
  getMassageRoom,
  userJoinBidding,
  getCurrentUserBidding,
  getUserBidding,
  setUserBidding,
  setUserPemenang,
  messageRoom,
  getUserData,
  userLeave,
};