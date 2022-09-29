'use strict';

const KategoriProdukScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idKategoriProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_kategori_produk'
    },
    kategoriProduk: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kategori_produk',
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
  KategoriProdukScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const KategoriProduk = sequelizeInstance
      .define(
        'KategoriProduk',
        KategoriProdukScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_kategori_produk',
          modelName: 'KategoriProduk',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return KategoriProduk;
  },
};
