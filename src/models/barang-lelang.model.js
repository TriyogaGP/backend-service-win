'use strict';

const BarangLelangScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idBarangLelang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_barang_lelang'
    },
    idKategori: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kategori'
    },
    namaBarangLelang: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_barang_lelang',
    },
    brand: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'brand',
    },
    warna: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'warna',
    },
    tahun: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'tahun',
    },
    lokasiBarang: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'lokasi_barang',
    },
    noRangka: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'no_rangka',
    },
    noMesin: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'no_mesin',
    },
    tipeModel: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'tipe_model',
    },
    transmisi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'transmisi',
    },
    bahanBakar: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'bahan_bakar',
    },
    odometer: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'odometer',
    },
    grade: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'grade',
    },
    gradeInterior: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'grade_interior',
    },
    gradeEksterior: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'grade_eksterior',
    },
    gradeMesin: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'grade_mesin',
    },
    noPolisi: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'no_polisi',
    },
    validSTNK: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'valid_stnk',
    },
    sph: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'sph',
    },
    kir: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kir',
    },
    kapasitasKendaraan: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'kapasitas_kendaraan',
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'deskripsi',
    },
    UnixText: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'UnixText',
    },
    stnk: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'stnk',
    },
    bpkb: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'bpkb',
    },
    faktur: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'faktur',
    },
    ktpPemilik: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'ktp_pemilik',
    },
    kwitansi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kwitansi',
    },
    statusAktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'status_aktif',
    },
    createBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'create_by'
    },
    updateBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'update_by'
    },
    deleteBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'delete_by'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
      field: 'deleted_at',
    },
  };
};

module.exports = {
  BarangLelangScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const BarangLelang = sequelizeInstance
      .define(
        'BarangLelang',
        BarangLelangScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_barang_lelang',
          modelName: 'BarangLelang',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    BarangLelang.associate = models => {
      models.BarangLelang.belongsTo(models.KategoriLelang, {
        foreignKey: 'idKategori',
        constraint: false
      });
    }
    return BarangLelang;
  },
};
