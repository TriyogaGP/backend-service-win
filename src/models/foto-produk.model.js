'use strict';

const FotoProdukScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idFotoProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_foto_produk'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'id_produk'
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
  FotoProdukScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const FotoProduk = sequelizeInstance
      .define(
        'FotoProduk',
        FotoProdukScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_foto_produk',
          modelName: 'FotoProduk',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    // FotoProduk.associate = models => {
    //   models.FotoProduk.belongsTo(models.Produk, {
    //     foreignKey: 'idProduk',
    //     constraint: false
    //   });
    // }
    return FotoProduk;
  },
};
