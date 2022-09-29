'use strict';

const WishlistScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idWishlist: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_wishlist'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produk'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'created_at',
    },
  };
};

module.exports = {
  WishlistScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Wishlist = sequelizeInstance
      .define(
        'Wishlist',
        WishlistScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_wishlist',
          modelName: 'Wishlist',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    Wishlist.associate = models => {
      models.Wishlist.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.Wishlist.belongsTo(models.Produk, {
        foreignKey: 'idProduk',
        constraint: false
      });
    }
    return Wishlist;
  },
};
