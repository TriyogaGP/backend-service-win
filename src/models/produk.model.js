'use strict';

const ProdukScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_produk'
    },
    idKategoriProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kategori_produk'
    },
    idMeasurement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_measurements'
    },
    kodeProduk: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'kode_produk',
    },
    merekProduk: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'merek_produk',
    },
    namaProduk: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_produk',
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'harga'
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'stok'
    },
    berat: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'berat',
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'point'
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'deskripsi',
    },
    coverImage: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'cover_image',
    },
    UnixText: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'UnixText',
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
  ProdukScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Produk = sequelizeInstance
      .define(
        'Produk',
        ProdukScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_produk',
          modelName: 'Produk',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    Produk.associate = models => {
      models.Produk.belongsTo(models.KategoriProduk, {
        foreignKey: 'idKategoriProduk',
        constraint: false
      });
      models.Produk.belongsTo(models.Measurement, {
        foreignKey: 'idMeasurement',
        constraint: false
      });
    }
    return Produk;
  },
};
