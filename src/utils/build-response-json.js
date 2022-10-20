const { convertDateTime, dateconvert, convertDate } = require('./helper.utils');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function _buildResponsePeserta(dataPeserta, refreshToken, accessToken) {
	let dataKumpul = Object.assign(dataPeserta, {
		fotoPeserta: BASE_URL+'image/berkas/'+dataPeserta.fotoPeserta,
		// fotoKTP: BASE_URL+'image/berkas/'+dataPeserta.fotoKTP,
		// fotoNPWP: BASE_URL+'image/berkas/'+dataPeserta.fotoNPWP,
	})

	return {
		// ...dataKumpul.dataValues,
		idPeserta: dataPeserta.idPeserta,
		refreshToken,
		accessToken
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
			namaPemilik: val.namaPemilik,
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
			statusLot: val.LOT ? val.LOT.statusLot == 1 ? "Tidak Aktif" : val.LOT.statusLot == 2 ? "Aktif" : val.LOT.statusLot == 3 ? "Lelang" : "Terjual" : null,
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
			dataFotoBarangLelang: { 
				FotoMobil: dataKumpul.filter(val => val.kategori == 'Utama'), 
				FotoKondisiMobil: dataKumpul.filter(val => val.kategori == 'Kondisi')
			},
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

		let dateNOW = new Date()
		let dateExpiredAt = new Date(val.LOT.expiredAt)
		let Difference_In_Time = dateExpiredAt.getTime() - dateNOW.getTime();

		return {
			idBarangLelang: val.idBarangLelang,
			idKategori: val.idKategori,
			namaKategori: val.KategoriLelang.kategori,
			namaBarangLelang: val.namaBarangLelang,
			namaPemilik: val.namaPemilik,
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
			expiredAt: val.LOT ? val.LOT.expiredAt : null,
			selisihTime: val.LOT ? Difference_In_Time : null,
			statusLot: val.LOT ? val.LOT.statusLot == 1 ? "Tidak Aktif" : val.LOT.statusLot == 2 ? "Aktif" : val.LOT.statusLot == 3 ? "Lelang" : "Terjual" : null,
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
			dataFotoBarangLelang: { 
				FotoMobil: dataKumpul.filter(val => val.kategori == 'Utama'), 
				FotoKondisiMobil: dataKumpul.filter(val => val.kategori == 'Kondisi')
			},
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
			statusLot: val.statusLot == 1 ? "Tidak Aktif" : val.statusLot == 2 ? "Aktif" : val.statusLot == 3 ? "Lelang" : "Terjual",
			namaBarangLelang: val.BarangLelang.namaBarangLelang,
			namaPemilik: val.BarangLelang.namaPemilik,
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
			dataFotoBarangLelang: { 
				FotoMobil: dataKumpul.filter(val => val.kategori == 'Utama'), 
				FotoKondisiMobil: dataKumpul.filter(val => val.kategori == 'Kondisi')
			},
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
			statusLot: val.statusLot == 1 ? "Tidak Aktif" : val.statusLot == 2 ? "Aktif" : val.statusLot == 3 ? "Lelang" : "Terjual",
			namaBarangLelang: val.BarangLelang.namaBarangLelang,
			namaPemilik: val.BarangLelang.namaPemilik,
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
			dataFotoBarangLelang: { 
				FotoMobil: dataKumpul.filter(val => val.kategori == 'Utama'), 
				FotoKondisiMobil: dataKumpul.filter(val => val.kategori == 'Kondisi')
			},
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

module.exports = {
  _buildResponsePeserta,
  _buildResponseLelang,
  _buildResponseDetailLelang,
  _buildResponseLotLelang,
  _buildResponseDetailLot,
  _buildResponsePembelianNPL,
  _buildResponseProduk,
  _buildResponseDetailProduk,
  _buildResponsePromosi,
  _buildResponseWishlist,
}