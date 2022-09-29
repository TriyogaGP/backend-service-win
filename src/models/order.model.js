'use strict';

const OrderScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_order'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    idAddress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_address'
    },
    idKurir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kurir'
    },
    idKurirService: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kurir_services'
    },
    noOrder: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'no_order',
    },
    noResi: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'no_resi',
    },
    tanggalResi: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
      field: 'tanggal',
    },
    shippingPrice: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'shipping_fee'
    },
    adminFee: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'admin_fee'
    },
    total: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'total'
    },
    statusLatest: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'status_latest',
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
  OrderScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Order = sequelizeInstance
      .define(
        'Order',
        OrderScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_order',
          modelName: 'Order',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    Order.associate = models => {
      models.Order.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.Order.belongsTo(models.Address, {
        foreignKey: 'idAddress',
        constraint: false
      });
      models.Order.belongsTo(models.Kurir, {
        foreignKey: 'idKurir',
        constraint: false
      });
      models.Order.belongsTo(models.KurirService, {
        foreignKey: 'idKurirService',
        constraint: false
      });
    }
    return Order;
  },
};
