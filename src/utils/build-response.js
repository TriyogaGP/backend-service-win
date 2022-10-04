const { convertDateTime, dateconvert, convertDate } = require('./helper.utils');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function _buildResponseMenu(dataMenu) {
	return dataMenu.map(val => {
		return {
			idMenu: val.idMenu,
			idRole: val.idRole,
			namaRole: val.Role.namaRole,
			menuText: val.menuText,
			menuRoute: val.menuRoute,
			menuIcon: val.menuIcon,
			position: val.position,
			status: val.status,
		}
	})
}

async function _buildResponseKurir(models, dataKurir) {
	const dataKurirService = await models.KurirService.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataKurir.map(val => {
		dataKumpul = dataKurirService.filter(kurser => kurser.idKurir === val.idKurir)

		return {
			idKurir: val.idKurir,
			namaKurir: val.namaKurir,
			label: val.label,
			image: val.image,
			statusAktif: val.statusAktif,
			dataKurirService: dataKumpul,
		}
	})
}

function _buildResponseLoggerAdmin(dataLoggerAdmin) {
	return dataLoggerAdmin.map(val => {
		return {
			idLoggerAdmin: val.idLoggerAdmin,
			idAdmin: val.idAdmin,
			nama: val.Admin.nama,
			latitude: val.latitude,
			longitude: val.longitude,
			provinsi: val.provinsi,
			kota: val.kota,
			createdAt: convertDateTime(val.createdAt),
		}
	})
}

function _buildResponseLoggerPeserta(dataLoggerPeserta) {
	return dataLoggerPeserta.map(val => {
		return {
			idLoggerPeserta: val.idLoggerPeserta,
			idPeserta: val.idPeserta,
			nama: val.User.nama,
			latitude: val.latitude,
			longitude: val.longitude,
			provinsi: val.provinsi,
			kota: val.kota,
			createdAt: convertDateTime(val.createdAt),
		}
	})
}

function _buildResponseAdmin(dataAdmin, refreshToken, accessToken) {
	return {
		idAdmin: dataAdmin.idAdmin,
		downlineTenant: dataAdmin.downlineTenant,
		nama: dataAdmin.nama,
		username: dataAdmin.username,
		email: dataAdmin.email,
		password: dataAdmin.password,
		kataSandi: dataAdmin.kataSandi,
		noHP: dataAdmin.noHP,
		kota: dataAdmin.kota,
		alamat: dataAdmin.alamat,
		level: dataAdmin.level,
		namaRole: dataAdmin.Role.namaRole,
		statusAktif: dataAdmin.statusAktif,
		refreshToken,
		accessToken
	}
}

function _buildResponsePeserta(dataPeserta, refreshToken, accessToken) {
	let dataKumpul = Object.assign(dataPeserta, {
		fotoPeserta: BASE_URL+'image/berkas/'+dataPeserta.fotoPeserta,
		fotoKTP: BASE_URL+'image/berkas/'+dataPeserta.fotoKTP,
		fotoNPWP: BASE_URL+'image/berkas/'+dataPeserta.fotoNPWP,
	})

	return {
		...dataKumpul.dataValues,
		refreshToken,
		accessToken
	}
}

async function _buildResponseBarangLelang(models, dataBarangLelang) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataBarangLelang.map(val => {
		dataKumpul = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.idBarangLelang)
		.map(val2 => {
			// let objectBaru = Object.assign(val2, {
			// 	gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			// });
			// return objectBaru
			return val2
		})

		return {
			idBarangLelang: val.idBarangLelang,
			idKategori: val.idKategori,
			namaKategori: val.KategoriLelang.kategori,
			statusKategoriLelang: val.KategoriLelang.statusAktif,
			namaBarangLelang: val.namaBarangLelang,
			brand: val.brand,
			warna: val.warna,
			tahun: val.tahun,
			lokasiBarang: val.lokasiBarang,
			noRangka: val.noRangka,
			noMesin: val.noMesin,
			tipeModel: val.tipeModel,
			transmisi: val.transmisi,
			bahanBakar: val.bahanBakar,
			odometer: val.odometer,
			grade: val.grade,
			gradeInterior: val.gradeInterior,
			gradeEksterior: val.gradeEksterior,
			gradeMesin: val.gradeMesin,
			noPolisi: val.noPolisi,
			validSTNK: val.validSTNK ? convertDate(val.validSTNK) : null,
			sph: val.sph,
			kir: val.kir,
			kapasitasKendaraan: val.kapasitasKendaraan,
			deskripsi: val.deskripsi,
			UnixText: val.UnixText,
			stnk: val.stnk,
			bpkb: val.bpkb,
			faktur: val.faktur,
			ktpPemilik: val.ktpPemilik,
			kwitansi: val.kwitansi,
			statusAktif: val.statusAktif,
			dataFotoBarangLelang: dataKumpul,
		}
	})
}

async function _buildResponseProduk(models, dataProduk) {
	const dataFotoProduk = await models.FotoProduk.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	const dataUpdateStok = await models.UpdateStok.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	const dataFeedbackUser = await models.FeedbackUser.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
		include: [
			{
				model: models.User,
				attributes: ['nama', 'email', 'noHP'],
			}
		] 
	});

	let dataKumpul = [], kumpulFeed = []
	let sisaStok = 0
	let rateProduk = 0
	return dataProduk.map(val => {
		let stokMasuk = 0, stokKeluar = 0, rating = 0, jumlahProduk = 0

		dataKumpul = dataFotoProduk
		.filter(barleng => barleng.idProduk === val.idProduk)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/produk/'+val2.gambar
			});
			return objectBaru
		})

		dataUpdateStok
		.filter(stok => stok.idProduk === val.idProduk)
		.map((val2) => {
			if(val2.statusAktif == 1){
				stokMasuk += val2.tambahStok
				stokKeluar += val2.kurangStok
			}
		})

		kumpulFeed = dataFeedbackUser
		.filter(feedback => feedback.idProduk === val.idProduk)
		.map(val2 => {
			rating += val2.rating
			jumlahProduk += 1
			let objectBaru = {
				idFeedbackPeserta: val2.idFeedbackPeserta,
				idOrder: val2.idOrder,
				idPeserta: val2.idPeserta,
				rating: val2.rating,
				comment: val2.comment,
				gambar: val2.gambar ? JSON.parse([val2.gambar]) : [],
				nama: val2.User.nama,
				email: val2.User.email,
				noHP: val2.User.noHP
			};
			return objectBaru
		})

		sisaStok = parseInt(stokMasuk) - parseInt(stokKeluar)
		rateProduk = parseInt(rating) / parseInt(jumlahProduk)

		return {
			idProduk: val.idProduk,
			idKategoriProduk: val.idKategoriProduk,
			kategoriProduk: val.KategoriProduk.kategoriProduk,
			idMeasurement: val.idMeasurement,
			name: val.Measurement.name,
			displayName: val.Measurement.displayName,
			kodeProduk: val.kodeProduk,
			merekProduk: val.merekProduk,
			namaProduk: val.namaProduk,
			harga: val.harga,
			stok: val.stok,
			berat: val.berat,
			point: val.point,
			deskripsi: val.deskripsi,
			UnixText: val.UnixText,
			statusAktif: val.statusAktif,
			sisaStok: sisaStok ? sisaStok : 0,
			rateProduk: rateProduk ? rateProduk : 0,
			dataFotoProduk: dataKumpul,
			dataFeedbackUser: kumpulFeed,
		}
	})
}

async function _buildResponseLot(models, dataLot) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpulFoto = []
	return dataLot.map(val => {
		dataKumpulFoto = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.idBarangLelang)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			});
			return objectBaru
		})

		let dataBarLel = Object.assign(val.BarangLelang, {
			stnk: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.stnk,
			bpkb: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.bpkb,
			faktur: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.faktur,
			ktpPemilik: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.ktpPemilik,
			kwitansi: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.kwitansi,
		});

		let dataEvent = Object.assign(val.Event, {
			gambar: BASE_URL+'image/event/'+val.Event.gambar
		});

		return {
			idLot: val.idLot,
			noLot: val.noLot,
			hargaAwal: val.hargaAwal,
			statusLot: val.statusLot,
			statusAktif: val.statusAktif,
			Event: dataEvent,
			BarangLelang: dataBarLel,
			dataFotoBarangLelang: dataKumpulFoto,
		}
	})
}

async function _buildResponseNPL(models, kategori = null, dataPembelianNPL) {
	if(kategori) {
		const dataNPL = await models.NPL.findAll({
			attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
		});

		let dataKumpulNPL = []
		return dataPembelianNPL.map(val => {
			dataKumpulNPL = dataNPL
			.filter(npl => npl.idPembelianNPL === val.idPembelianNPL)
			.map(val2 => {
				return val2
			})

			return {
				idPembelianNPL: val.idPembelianNPL,
				idPeserta: val.idPeserta,
				idEvent: val.idEvent,
				typePembelian: val.typePembelian,
				typeTransaksi: val.typeTransaksi,
				noPembelian: val.noPembelian,
				verifikasi: val.verifikasi,
				nominal: val.nominal,
				tanggalTransfer: convertDateTime(val.tanggalTransfer),
				pesanVerifikasi: val.pesanVerifikasi,
				bukti: BASE_URL+'image/berkas/'+val.bukti,
				statusAktif: val.statusAktif,
				nama: val.User.nama,
				email: val.User.email,
				noHP: val.User.noHP,
				kodeEvent: val.Event.kodeEvent,
				namaEvent: val.Event.namaEvent,
				tanggalEvent: dateconvert(val.Event.tanggalEvent)+' '+val.Event.waktuEvent,
				NPL: dataKumpulNPL,
			}
		})	
	}

	return dataPembelianNPL.map(val => {
		return {
			idPembelianNPL: val.idPembelianNPL,
			idPeserta: val.idPeserta,
			idEvent: val.idEvent,
			typePembelian: val.typePembelian,
			typeTransaksi: val.typeTransaksi,
			noPembelian: val.noPembelian,
			verifikasi: val.verifikasi,
			nominal: val.nominal,
			tanggalTransfer: convertDateTime(val.tanggalTransfer),
			pesanVerifikasi: val.pesanVerifikasi,
			bukti: BASE_URL+'image/berkas/'+val.bukti,
			statusAktif: val.statusAktif,
			nama: val.User.nama,
			email: val.User.email,
			noHP: val.User.noHP,
			kodeEvent: val.Event.kodeEvent,
			namaEvent: val.Event.namaEvent,
			tanggalEvent: dateconvert(val.Event.tanggalEvent)+' '+val.Event.waktuEvent,
		}
	})
}

async function _buildResponsePemenang(models, dataPemenang) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpulFoto = []
	return dataPemenang.map(val => {
		dataKumpulFoto = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.Bidding.LOT.idBarangLelang)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			});
			return objectBaru
		})

		let dataBarLel = Object.assign(val.Bidding.LOT.PembelianNPL, {
			stnk: BASE_URL+'image/kelengkapan-barang-lelang/'+val.Bidding.LOT.BarangLelang.stnk,
			bpkb: BASE_URL+'image/kelengkapan-barang-lelang/'+val.Bidding.LOT.BarangLelang.bpkb,
			faktur: BASE_URL+'image/kelengkapan-barang-lelang/'+val.Bidding.LOT.BarangLelang.faktur,
			ktpPemilik: BASE_URL+'image/kelengkapan-barang-lelang/'+val.Bidding.LOT.BarangLelang.ktpPemilik,
			kwitansi: BASE_URL+'image/kelengkapan-barang-lelang/'+val.Bidding.LOT.BarangLelang.kwitansi,
		});

		let dataEvent = Object.assign(val.Bidding.LOT.Event, {
			gambar: BASE_URL+'image/event/'+val.Bidding.LOT.Event.gambar
		});

		let dataPembelianNPL = Object.assign(val.Bidding.NPL.PembelianNPL, {
			bukti: BASE_URL+'image/berkas/'+val.Bidding.NPL.PembelianNPL.bukti
		});

		let dataUser = Object.assign(val.Bidding.NPL.User, {
			fotoPeserta: BASE_URL+'image/berkas/'+val.Bidding.NPL.User.fotoPeserta,
			fotoKTP: BASE_URL+'image/berkas/'+val.Bidding.NPL.User.fotoKTP,
			fotoNPWP: BASE_URL+'image/berkas/'+val.Bidding.NPL.User.fotoNPWP
		});

		return {
			idPemenangLelang: val.idPemenangLelang,
			noRek: val.noRek,
			namaPemilik: val.namaPemilik,
			nominal: val.nominal,
			tanggalTransfer: val.tanggalTransfer,
			tipePelunasan: val.tipePelunasan,
			statusPembayaran: val.statusPembayaran,
			bukti: BASE_URL+'image/bukti-pemenang/'+val.bukti,
			statusAktif: val.statusAktif,
			data_bidding_terakhir: {
				idBidding: val.Bidding.idBidding,
				hargaHidding: val.Bidding.hargaBidding,
				nominal: val.nominal,
				isAdmin: val.Bidding.isAdmin,
				waktuBidTerakhir: convertDateTime(val.Bidding.waktu),
			},
			details: {
				idLot: val.Bidding.LOT.idLot,
				noLot: val.Bidding.LOT.noLot,
				hargaAwal: val.Bidding.LOT.hargaAwal,
				statusLot: val.Bidding.LOT.statusLot,
				idNpl: val.Bidding.NPL.idNpl,
				noNpl: val.Bidding.NPL.noNpl,
				npl: val.Bidding.NPL.npl,
				statusNpl: val.Bidding.NPL.statusNpl,
				idBarangLelang: dataBarLel.idBarangLelang,
				namaBarangLelang: dataBarLel.namaBarangLelang,
				idEvent: dataEvent.idEvent,
				kodeEvent: dataEvent.kodeEvent,
				namaEvent: dataEvent.namaEvent,
				idPeserta: dataUser.idPeserta,
				nama: dataUser.nama,
				email: dataUser.email,
				noHP: dataUser.noHP,
				alamat: dataUser.alamat,
				idPembelianNPL: dataPembelianNPL.idPembelianNPL,
				buktiPembelianNPL: dataPembelianNPL.bukti,
				nominalPembelianNPL: dataPembelianNPL.nominal,
				tanggalTransferPembelianNPL: convertDateTime(dataPembelianNPL.tanggalTransfer),
			}
		}
	})
}

async function _buildResponseOrder(models, dataOrder) {
	const dataDetailOrder = await models.OrderDetail.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'createdAt', 'updatedAt'] },
		include: [
			{
				model: models.Produk,
				attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
			},
		]
	});
	
	const dataOrderPayment = await models.OrderPayment.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
	});

	const dataOrderMoves = await models.OrderMoves.findAll();

	let kumpulProduk = [], kumpulOrderPayment = [], kumpulOrderMoves = []
	return dataOrder.map(val => {
		let qty = 0, berat = 0
		dataDetailOrder
		.filter(order => order.idOrder === val.idOrder)
		.map(val2 => {
			qty += val2.jumlahProduk
			let splitBerat = val2.Produk.berat.split(' ')
			berat += parseInt(splitBerat[0])
		})

		kumpulProduk = dataDetailOrder
		.filter(order => order.idOrder === val.idOrder)
		.map(val2 => {
			return val2.Produk
		})

		kumpulOrderPayment = dataOrderPayment
		.filter(order => order.idOrder === val.idOrder)
		.map(val2 => {
			return val2
		})

		kumpulOrderMoves = dataOrderMoves
		.filter(order => order.idOrder === val.idOrder)
		.map(val2 => {
			let objectBaru = Object.assign(val2.dataValues, {
				createdAt: convertDateTime(val2.dataValues.createdAt)
			});
			return objectBaru
		})

		return {
			idOrder: val.idOrder,
			idPeserta: val.idPeserta,
			idAddress: val.idAddress,
			noOrder: val.noOrder,
			tanggalResi: convertDateTime(val.tanggalResi),
			shippingPrice: val.shippingPrice,
			adminFee: val.adminFee,
			total: val.total,
			statusLatest: val.statusLatest,
			qty,
			berat: berat+' gr',
			items: kumpulProduk.length,
			dataBuyer: {
				nama: val.User.nama,
				email: val.User.email,
				noHP: val.User.noHP,
				alamat: val.User.alamat,
			},
			dataRecipient: {
				namaPenerima: val.Address.namaPenerima,
				telpPenerima: val.Address.telpPenerima,
			},
			dataShipping: {
				namaKurir: val.Kurir.namaKurir,
				namaService: val.KurirService.namaService,
				noResi: val.noResi,
				alamatPenerima: val.Address.alamatPenerima,
				alamatDetail: val.Address.alamatDetail,
			},
			dataProduk: kumpulProduk,
			dataPaymentDetails: kumpulOrderPayment,
			dataOrderStatus: kumpulOrderMoves,
		}
	})
}

async function _buildResponseWishlist(models, dataWishlist) {
	const dataFotoProduk = await models.FotoProduk.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataWishlist.map(val => {
		dataKumpul = dataFotoProduk
		.filter(barleng => barleng.idProduk === val.idProduk)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/produk/'+val2.gambar
			});
			return objectBaru
		})

		return {
			idWishlist: val.idWishlist,
			idPeserta: val.idPeserta,
			idProduk: val.idProduk,
			nama: val.User.nama,
			kodeProduk: val.Produk.kodeProduk,
			merekProduk: val.Produk.merekProduk,
			namaProduk: val.Produk.namaProduk,
			berat: val.Produk.berat,
			createdAt: convertDateTime(val.createdAt),
			dataFotoProduk: dataKumpul,
		}
	})
}

function _buildResponseMall(dataMall) {
	return dataMall.map(val => {
		return {
			idMall: val.idMall,
			idAdmin: val.idAdmin,
			namaMall: val.namaMall,
			deskripsi: val.deskripsi,
			alamat: val.alamat,
			provinsi: val.provinsi,
			kota: val.kota,
			noWhatsapp: val.noWhatsapp,
			UnixText: val.UnixText,
			logo: BASE_URL+'image/mall/'+val.logo,
			nama: val.Admin.nama,
			email: val.Admin.email,
			noHP: val.Admin.noHP,
			role: val.level,
			namaRole: val.Admin.Role.namaRole,
			statusAktif: val.statusAktif,
		}
	})
}

function _buildResponseTenantMall(dataTenantMall) {
	return dataTenantMall.map(val => {
		return {
			idTenantMall: val.idTenantMall,
			idAdmin: val.idAdmin,
			idKategoriTenant: val.idKategoriTenant,
			idMall: val.idMall,
			namaTenantMall: val.namaTenantMall,
			deskripsi: val.deskripsi,
			alamat: val.alamat,
			kota: val.kota,
			provinsi: val.provinsi,
			noWhatsapp: val.noWhatsapp,
			UnixText: val.UnixText,
			logo: BASE_URL+'image/mall/'+val.logo,
			kategoriTenant: val.KategoriTenant.kategoriTenant,
			nama: val.Admin.nama,
			email: val.Admin.email,
			noHP: val.Admin.noHP,
			namaMall: val.Mall.namaMall,
			logoMall: BASE_URL+'image/mall/'+val.Mall.logo,
			statusAktif: val.statusAktif,
		}
	})
}

function _buildResponseContent(kategori, dataContent) {
	if(kategori == 'mall'){
		return dataContent.map(val => {
			return {
				idContentMall: val.idContentMall,
				idMall: val.idMall,
				idKategoriContent: val.idKategoriContent,
				judulContent: val.judulContent,
				link: val.link,
				deskripsi: val.deskripsi,
				foto: BASE_URL+'image/mall/'+val.foto,
				kategoriContent: val.KategoriContent.kategoriContent,
				namaMall: val.Mall.namaMall,
				statusAktif: val.statusAktif,
			}
		})
	}else if(kategori == 'tenantmall'){
		return dataContent.map(val => {
			return {
				idContentTenantMall: val.idContentTenantMall,
				idTenantMall: val.idTenantMall,
				idKategoriContent: val.idKategoriContent,
				judulContent: val.judulContent,
				link: val.link,
				deskripsi: val.deskripsi,
				foto: BASE_URL+'image/mall/'+val.foto,
				kategoriContent: val.KategoriContent.kategoriContent,
				namaTenantMall: val.TenantMall.namaTenantMall,
				statusAktif: val.statusAktif,
			}
		})
	}
}

async function _buildResponseLelang(models, dataLelang) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataLelang.map(val => {
		dataKumpul = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.idBarangLelang)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			});
			return objectBaru
		})

		return {
			idBarangLelang: val.idBarangLelang,
			idKategori: val.idKategori,
			namaKategori: val.KategoriLelang.kategori,
			namaBarangLelang: val.namaBarangLelang,
			brand: val.brand,
			warna: val.warna,
			tahun: val.tahun,
			lokasiBarang: val.lokasiBarang,
			noRangka: val.noRangka,
			noMesin: val.noMesin,
			tipeModel: val.tipeModel,
			transmisi: val.transmisi,
			bahanBakar: val.bahanBakar,
			odometer: val.odometer,
			grade: val.grade,
			gradeInterior: val.gradeInterior,
			gradeEksterior: val.gradeEksterior,
			gradeMesin: val.gradeMesin,
			noPolisi: val.noPolisi,
			validSTNK: val.validSTNK ? convertDate(val.validSTNK) : null,
			sph: val.sph,
			kir: val.kir,
			kapasitasKendaraan: val.kapasitasKendaraan,
			deskripsi: val.deskripsi,
			UnixText: val.UnixText,
			stnk: BASE_URL+'image/kelengkapan-barang-lelang/'+val.stnk,
			bpkb: BASE_URL+'image/kelengkapan-barang-lelang/'+val.bpkb,
			faktur: BASE_URL+'image/kelengkapan-barang-lelang/'+val.faktur,
			ktpPemilik: BASE_URL+'image/kelengkapan-barang-lelang/'+val.ktpPemilik,
			kwitansi: BASE_URL+'image/kelengkapan-barang-lelang/'+val.kwitansi,
			idLot: val.idLot,
			noLot: val.LOT ? val.LOT.noLot : null,
			hargaAwal: val.LOT ? val.LOT.hargaAwal : null,
			statusLot: val.LOT ? val.LOT.statusLot == 0 ? "Tidak Aktif" : val.LOT.statusLot == 1 ? "Aktif" : val.LOT.statusLot == 2 ? "Lelang" : "Terjual" : null,
			tanggalevent: val.LOT ? convertDateTime(convertDate(val.LOT.Event.tanggalEvent) + " " + val.LOT.Event.waktuEvent) : null,
			kodeEvent: val.LOT ? val.LOT.Event.kodeEvent : null,
			passEvent: val.LOT ? val.LOT.Event.passEvent : null,
			kataSandiEvent: val.LOT ? val.LOT.Event.kataSandiEvent : null,
			namaEvent: val.LOT ? val.LOT.Event.namaEvent : null,
			deskripsiEvent: val.LOT ? val.LOT.Event.deskripsiEvent : null,
			kelipatanBid: val.LOT ? val.LOT.Event.kelipatanBid : null,
			gambar: val.LOT ? BASE_URL+'image/event/'+val.LOT.Event.gambar : null,
			alamatEvent: val.LOT ? val.LOT.Event.alamatEvent : null,
			linkMaps: val.LOT ? val.LOT.Event.linkMaps : null,
			statusAktif: val.statusAktif,
			dataFotoBarangLelang: dataKumpul,
		}
	})
}

async function _buildResponseDetailLelang(models, dataLelang) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataLelang.map(val => {
		dataKumpul = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.idBarangLelang)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			});
			return objectBaru
		})

		let detailBarangAtas = []
		let detailBarang = []

		if(val.KategoriLelang.kategori == 'Mobil' || val.KategoriLelang.kategori == 'Motor'){
			detailBarangAtas = [
				{ icon: BASE_URL+'bahan/bahanbakar.png', name: 'Bahan Bakar', text: val.bahanBakar },
				{ icon: BASE_URL+'bahan/transmisi.png', name: 'Transmisi', text: val.transmisi },
				{ icon: BASE_URL+'bahan/seat.png', name: 'Kapasitas', text: val.kapasitasKendaraan },
				{ icon: BASE_URL+'bahan/pintu.png', name: 'Pintu', text: 'Empat (4)' },
			]
			detailBarang = [
				{ icon: BASE_URL+'bahan/nopol.png', name: 'No Polisi', text: val.noPolisi },
				{ icon: BASE_URL+'bahan/model.png', name: 'Tipe / Model', text: val.tipeModel },
				{ icon: BASE_URL+'bahan/warna.png', name: 'Warna', text: val.warna },
				{ icon: BASE_URL+'bahan/nomesindanrangka.png', name: 'No Mesin', text: val.noMesin },
				{ icon: BASE_URL+'bahan/nomesindanrangka.png', name: 'No Rangka', text: val.noRangka },
				{ icon: BASE_URL+'bahan/kilometer.png', name: 'Kilometer', text: val.odometer },
			]
		}

		return {
			idBarangLelang: val.idBarangLelang,
			idKategori: val.idKategori,
			namaKategori: val.KategoriLelang.kategori,
			namaBarangLelang: val.namaBarangLelang,
			brand: val.brand,
			warna: val.warna,
			tahun: val.tahun,
			lokasiBarang: val.lokasiBarang,
			noRangka: val.noRangka,
			noMesin: val.noMesin,
			tipeModel: val.tipeModel,
			transmisi: val.transmisi,
			bahanBakar: val.bahanBakar,
			odometer: val.odometer,
			grade: val.grade,
			gradeInterior: val.gradeInterior,
			gradeEksterior: val.gradeEksterior,
			gradeMesin: val.gradeMesin,
			noPolisi: val.noPolisi,
			validSTNK: val.validSTNK ? convertDate(val.validSTNK) : null,
			stnk: BASE_URL+'image/kelengkapan-barang-lelang/'+val.stnk,
			bpkb: BASE_URL+'image/kelengkapan-barang-lelang/'+val.bpkb,
			faktur: BASE_URL+'image/kelengkapan-barang-lelang/'+val.faktur,
			ktp_pemilik: BASE_URL+'image/kelengkapan-barang-lelang/'+val.ktpPemilik,
			kwitansi: BASE_URL+'image/kelengkapan-barang-lelang/'+val.kwitansi,
			sph: val.sph,
			kir: val.kir,
			kapasitasKendaraan: val.kapasitasKendaraan,
			deskripsi: val.deskripsi,
			idLot: val.idLot,
			noLot: val.LOT ? val.LOT.noLot : null,
			hargaAwal: val.LOT ? val.LOT.hargaAwal : null,
			statusLot: val.LOT ? val.LOT.statusLot == 0 ? "Tidak Aktif" : val.LOT.statusLot == 1 ? "Aktif" : val.LOT.statusLot == 2 ? "Lelang" : "Terjual" : null,
			tanggalevent: val.LOT ? convertDateTime(convertDate(val.LOT.Event.tanggalEvent) + " " + val.LOT.Event.waktuEvent) : null,
			kodeEvent: val.LOT ? val.LOT.Event.kodeEvent : null,
			passEvent: val.LOT ? val.LOT.Event.passEvent : null,
			kataSandiEvent: val.LOT ? val.LOT.Event.kataSandiEvent : null,
			namaEvent: val.LOT ? val.LOT.Event.namaEvent : null,
			deskripsiEvent: val.LOT ? val.LOT.Event.deskripsiEvent : null,
			kelipatanBid: val.LOT ? val.LOT.Event.kelipatanBid : null,
			gambar: val.LOT ? BASE_URL+'image/event/'+val.LOT.Event.gambar : null,
			alamatEvent: val.LOT ? val.LOT.Event.alamatEvent : null,
			linkMaps: val.LOT ? val.LOT.Event.linkMaps : null,
			statusAktif: val.statusAktif,
			detailBarangAtas,
			detailBarang,
			dataFotoBarangLelang: dataKumpul,
		}
	})
}

async function _buildResponseDetailProduk(models, dataProduk) {
	const dataFotoProduk = await models.FotoProduk.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	const dataUpdateStok = await models.UpdateStok.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	const dataFeedbackUser = await models.FeedbackUser.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] },
		include: [
			{
				model: models.User,
				attributes: ['nama', 'email', 'noHP'],
			}
		] 
	});

	let dataKumpul = [], kumpulFeed = []
	let sisaStok = 0
	let rateProduk = 0
	return dataProduk.map(val => {
		let stokMasuk = 0, stokKeluar = 0, rating = 0, jumlahProduk = 0
		
		dataKumpul = dataFotoProduk
		.filter(barleng => barleng.idProduk === val.idProduk)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/produk/'+val2.gambar
			});
			return objectBaru
		})

		dataUpdateStok
		.filter(stok => stok.idProduk === val.idProduk)
		.map((val2) => {
			if(val2.statusAktif == 1){
				stokMasuk += val2.tambahStok
				stokKeluar += val2.kurangStok
			}
		})

		kumpulFeed = dataFeedbackUser
		.filter(feedback => feedback.idProduk === val.idProduk)
		.map(val2 => {
			rating += val2.rating
			jumlahProduk += 1
			let objectBaru = {
				idFeedbackPeserta: val2.idFeedbackPeserta,
				idOrder: val2.idOrder,
				idPeserta: val2.idPeserta,
				rating: val2.rating,
				comment: val2.comment,
				gambar: val2.gambar ? JSON.parse([val2.gambar]) : [],
				nama: val2.User.nama,
				email: val2.User.email,
				noHP: val2.User.noHP
			};
			return objectBaru
		})

		sisaStok = parseInt(stokMasuk) - parseInt(stokKeluar)
		rateProduk = parseInt(rating) / parseInt(jumlahProduk)

		return {
			idProduk: val.idProduk,
			idKategoriProduk: val.idKategoriProduk,
			kategoriProduk: val.KategoriProduk.kategoriProduk,
			idMeasurement: val.idMeasurement,
			name: val.Measurement.name,
			displayName: val.Measurement.displayName,
			kodeProduk: val.kodeProduk,
			merekProduk: val.merekProduk,
			namaProduk: val.namaProduk,
			harga: val.harga,
			stok: val.stok,
			berat: val.berat,
			point: val.point,
			deskripsi: val.deskripsi,
			UnixText: val.UnixText,
			statusAktif: val.statusAktif,
			sisaStok: sisaStok ? sisaStok : 0,
			rateProduk: rateProduk ? rateProduk : 0,
			dataFotoProduk: dataKumpul,
			dataFeedbackUser: kumpulFeed,
		}
	})
}

async function _buildResponseLotLelang(models, dataLelang) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataLelang.map(val => {
		dataKumpul = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.idBarangLelang)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			});
			return objectBaru
		})

		return {
			idLot: val.idLot,
			idBarangLelang: val.idBarangLelang,
			idKategori: val.idKategori,
			namaKategori: val.BarangLelang.KategoriLelang.kategori,
			noLot: val.noLot,
			hargaAwal: val.hargaAwal,
			statusLot: val.statusLot == 0 ? "Tidak Aktif" : val.statusLot == 1 ? "Aktif" : val.statusLot == 2 ? "Lelang" : "Terjual",
			namaBarangLelang: val.BarangLelang.namaBarangLelang,
			brand: val.BarangLelang.brand,
			warna: val.BarangLelang.warna,
			tahun: val.BarangLelang.tahun,
			lokasiBarang: val.BarangLelang.lokasiBarang,
			noRangka: val.BarangLelang.noRangka,
			noMesin: val.BarangLelang.noMesin,
			tipeModel: val.BarangLelang.tipeModel,
			transmisi: val.BarangLelang.transmisi,
			bahanBakar: val.BarangLelang.bahanBakar,
			odometer: val.BarangLelang.odometer,
			grade: val.BarangLelang.grade,
			gradeInterior: val.BarangLelang.gradeInterior,
			gradeEksterior: val.BarangLelang.gradeEksterior,
			gradeMesin: val.BarangLelang.gradeMesin,
			noPolisi: val.BarangLelang.noPolisi,
			validSTNK: val.BarangLelang.validSTNK ? convertDate(val.BarangLelang.validSTNK) : null,
			stnk: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.stnk,
			bpkb: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.bpkb,
			faktur: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.faktur,
			ktp_pemilik: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.ktpPemilik,
			kwitansi: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.kwitansi,
			sph: val.BarangLelang.sph,
			kir: val.BarangLelang.kir,
			kapasitasKendaraan: val.BarangLelang.kapasitasKendaraan,
			deskripsi: val.BarangLelang.deskripsi,
			idEvent: val.Event.idEvent,
			tanggalevent: convertDateTime(convertDate(val.Event.tanggalEvent) + " " + val.Event.waktuEvent),
			kodeEvent: val.Event.kodeEvent,
			passEvent: val.Event.passEvent,
			kataSandiEvent: val.Event.kataSandiEvent,
			namaEvent: val.Event.namaEvent,
			deskripsiEvent: val.Event.deskripsiEvent,
			kelipatanBid: val.Event.kelipatanBid,
			gambar: BASE_URL+'image/event/'+val.Event.gambar,
			alamatEvent: val.Event.alamatEvent,
			linkMaps: val.Event.linkMaps,
			statusAktif: val.statusAktif,
			dataFotoBarangLelang: dataKumpul,
		}
	})
}

async function _buildResponseDetailLot(models, dataLot) {
	const dataFotoBarangLelang = await models.FotoBarangLelang.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataLot.map(val => {
		dataKumpul = dataFotoBarangLelang
		.filter(barleng => barleng.idBarangLelang === val.idBarangLelang)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				gambar: BASE_URL+'image/kelengkapan-barang-lelang/'+val2.gambar
			});
			return objectBaru
		})

		let detailBarangAtas = []
		let detailBarang = []

		if(val.BarangLelang.KategoriLelang.kategori == 'Mobil' || val.BarangLelang.KategoriLelang.kategori == 'Motor'){
			detailBarangAtas = [
				{ icon: BASE_URL+'bahan/bahanbakar.png', name: 'Bahan Bakar', text: val.bahanBakar },
				{ icon: BASE_URL+'bahan/transmisi.png', name: 'Transmisi', text: val.transmisi },
				{ icon: BASE_URL+'bahan/seat.png', name: 'Kapasitas', text: val.kapasitasKendaraan },
				{ icon: BASE_URL+'bahan/pintu.png', name: 'Pintu', text: 'Empat (4)' },
			]
			detailBarang = [
				{ icon: BASE_URL+'bahan/nopol.png', name: 'No Polisi', text: val.noPolisi },
				{ icon: BASE_URL+'bahan/model.png', name: 'Tipe / Model', text: val.tipeModel },
				{ icon: BASE_URL+'bahan/warna.png', name: 'Warna', text: val.warna },
				{ icon: BASE_URL+'bahan/nomesindanrangka.png', name: 'No Mesin', text: val.noMesin },
				{ icon: BASE_URL+'bahan/nomesindanrangka.png', name: 'No Rangka', text: val.noRangka },
				{ icon: BASE_URL+'bahan/kilometer.png', name: 'Kilometer', text: val.odometer },
			]
		}

		return {
			idLot: val.idLot,
			idBarangLelang: val.idBarangLelang,
			idKategori: val.idKategori,
			namaKategori: val.BarangLelang.KategoriLelang.kategori,
			noLot: val.noLot,
			hargaAwal: val.hargaAwal,
			statusLot: val.statusLot == 0 ? "Tidak Aktif" : val.statusLot == 1 ? "Aktif" : val.statusLot == 2 ? "Lelang" : "Terjual",
			namaBarangLelang: val.BarangLelang.namaBarangLelang,
			brand: val.BarangLelang.brand,
			warna: val.BarangLelang.warna,
			tahun: val.BarangLelang.tahun,
			lokasiBarang: val.BarangLelang.lokasiBarang,
			noRangka: val.BarangLelang.noRangka,
			noMesin: val.BarangLelang.noMesin,
			tipeModel: val.BarangLelang.tipeModel,
			transmisi: val.BarangLelang.transmisi,
			bahanBakar: val.BarangLelang.bahanBakar,
			odometer: val.BarangLelang.odometer,
			grade: val.BarangLelang.grade,
			gradeInterior: val.BarangLelang.gradeInterior,
			gradeEksterior: val.BarangLelang.gradeEksterior,
			gradeMesin: val.BarangLelang.gradeMesin,
			noPolisi: val.BarangLelang.noPolisi,
			validSTNK: val.BarangLelang.validSTNK ? convertDate(val.BarangLelang.validSTNK) : null,
			stnk: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.stnk,
			bpkb: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.bpkb,
			faktur: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.faktur,
			ktp_pemilik: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.ktpPemilik,
			kwitansi: BASE_URL+'image/kelengkapan-barang-lelang/'+val.BarangLelang.kwitansi,
			sph: val.BarangLelang.sph,
			kir: val.BarangLelang.kir,
			kapasitasKendaraan: val.BarangLelang.kapasitasKendaraan,
			deskripsi: val.BarangLelang.deskripsi,
			idEvent: val.Event.idEvent,
			tanggalevent: convertDateTime(convertDate(val.Event.tanggalEvent) + " " + val.Event.waktuEvent),
			kodeEvent: val.Event.kodeEvent,
			passEvent: val.Event.passEvent,
			kataSandiEvent: val.Event.kataSandiEvent,
			namaEvent: val.Event.namaEvent,
			deskripsiEvent: val.Event.deskripsiEvent,
			kelipatanBid: val.Event.kelipatanBid,
			gambar: BASE_URL+'image/event/'+val.Event.gambar,
			alamatEvent: val.Event.alamatEvent,
			linkMaps: val.Event.linkMaps,
			statusAktif: val.statusAktif,
			detailBarangAtas,
			detailBarang,
			dataFotoBarangLelang: dataKumpul,
		}
	})
}

async function _buildResponsePembelianNPL(models, dataPembelianNPL) {
	const dataNPL = await models.NPL.findAll({
		attributes: { exclude: ['createBy', 'updateBy', 'deleteBy', 'createdAt', 'updatedAt', 'deletedAt'] }
	});

	let dataKumpul = []
	return dataPembelianNPL.map(val => {
		dataKumpul = dataNPL
		.filter(npl => npl.idPembelianNPL === val.idPembelianNPL)
		.map(val2 => {
			let objectBaru = Object.assign(val2, {
				statusNpl: val2.statusNpl == 0 ? "Belum Digunakan" : val2.statusNPL == 1 ? "Sudah Digunakan" : "Refund NPL",
			});
			return objectBaru
		})

		return {
			idPembelianNPL: val.idPembelianNPL,
			idPeserta: val.idPeserta,
			idEvent: val.idEvent,
			typePembelian: val.typePembelian == 1 ? "Online" : "Offline",
			typeTransaksi: val.typeTransaksi == 1 ? "Tunai" : "Transfer/EDC",
			noPembelian: val.noPembelian,
			verifikasi: val.verifikasi == 1 ? 'Sudah Di Verifikasi' : 'Belum Di Verifikasi',
			nominal: val.nominal,
			tanggalTransfer: dateconvert(val.tanggalTransfer),
			pesanVerifikasi: val.pesanVerifikasi,
			bukti: BASE_URL+'image/berkas/'+val.bukti,
			statusAktif: val.statusAktif,
			kodeEvent: val.Event.kodeEvent,
			passEvent: val.Event.passEvent,
			kataSandiEvent: val.Event.kataSandiEvent,
			namaEvent: val.Event.namaEvent,
			deskripsiEvent: val.Event.deskripsiEvent,
			waktuEvent: dateconvert(val.Event.tanggalEvent) + ' ' + val.Event.waktuEvent,
			kelipatan_bid: val.Event.kelipatan_bid,
			gambar: BASE_URL+'image/event/'+val.Event.gambar,
			alamatEvent: val.Event.alamatEvent,
			linkMaps: val.Event.linkMaps,
			nama: val.User.nama,
			email: val.User.email,
			no_hp: val.User.no_hp,
			alamat: val.User.alamat,
			dataNPL: dataKumpul
		}
	})
}

async function _buildResponsePromosi(dataPromosi) {
	return dataPromosi.map(val => {
		return {
			idPromosi: val.idPromosi,
			idProduk: val.idProduk,
			namaPromo: val.namaPromo,
			deskripsi: val.deskripsi,
			UnixText: val.UnixText,
			gambar: val.gambar,
			statusAktif: val.statusAktif,
		}
	})
}

module.exports = {
  _buildResponseMenu,
  _buildResponseKurir,
  _buildResponseLoggerAdmin,
  _buildResponseLoggerPeserta,
  _buildResponseAdmin,
  _buildResponsePeserta,
  _buildResponseBarangLelang,
  _buildResponseProduk,
  _buildResponseLot,
  _buildResponseNPL,
  _buildResponsePemenang,
  _buildResponseOrder,
  _buildResponseWishlist,
  _buildResponseMall,
  _buildResponseTenantMall,
  _buildResponseContent,
  _buildResponseLelang,
  _buildResponseDetailLelang,
  _buildResponseDetailProduk,
  _buildResponseLotLelang,
  _buildResponseDetailLot,
  _buildResponsePembelianNPL,
  _buildResponsePromosi,
}