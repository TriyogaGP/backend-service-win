'use strict';

const OrderDetailScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idOrderDetail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_order_detail'
    },
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_order'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produk'
    },
    jumlahProduk: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'jumlah_produk'
    },
    harga: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'harga'
    },
    subTotal: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'subtotal'
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
    }
  };
};

module.exports = {
  OrderDetailScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const OrderDetail = sequelizeInstance
      .define(
        'OrderDetail',
        OrderDetailScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_order_detail',
          modelName: 'OrderDetail',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    OrderDetail.associate = models => {
      models.OrderDetail.belongsTo(models.Order, {
        foreignKey: 'idOrder',
        constraint: false
      });
      models.OrderDetail.belongsTo(models.Produk, {
        foreignKey: 'idProduk',
        constraint: false
      });
    }
    return OrderDetail;
  },
};
