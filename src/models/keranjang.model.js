'use strict';

const KeranjangScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idKeranjang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_keranjang'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produk'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'qty'
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
  KeranjangScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Keranjang = sequelizeInstance
      .define(
        'Keranjang',
        KeranjangScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_keranjang',
          modelName: 'Keranjang',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    Keranjang.associate = models => {
      models.Keranjang.belongsTo(models.Produk, {
        foreignKey: 'idProduk',
        constraint: false
      });
      models.Keranjang.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
    }
    return Keranjang;
  },
};
