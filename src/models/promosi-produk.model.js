'use strict';

const PromosiScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idPromosi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_promosi'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produk'
    },
    namaPromo: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_promo',
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
    gambar: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'gambar',
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
  PromosiScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Promosi = sequelizeInstance
      .define(
        'Promosi',
        PromosiScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_promosi',
          modelName: 'Promosi',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    Promosi.associate = models => {
      models.Promosi.belongsTo(models.Produk, {
        foreignKey: 'idProduk',
        constraint: false
      });
    }
    return Promosi;
  },
};
