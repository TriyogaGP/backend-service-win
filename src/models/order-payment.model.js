'use strict';

const OrderPaymentScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idOrderPayment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_order_payment'
    },
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_order'
    },
    paymentMethod: {
			type: DataTypes.ENUM('VA','MANUAL','ESPAY','COD','VOUCHER','VAC','MIDTRANS'),
			allowNull: true,
			field: 'payment_method'
    },
    paymentProvider: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'payment_provider'
    },
    paymentAccountNo: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'payment_account_no'
    },
    paymentOwnerName: {
      type: DataTypes.STRING(256),
			allowNull: true,
			field: 'payment_owner_name'
    },
    paymentRedirectUrl: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'payment_redirect_url'
    },
    harga: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'harga'
    },
    shippingFee: {
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
    paymentStatus: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'payment_status'
    },
    notes: {
			type: DataTypes.STRING(256),
			allowNull: true,
			field: 'notes'
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
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expired_at',
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
  OrderPaymentScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const OrderPayment = sequelizeInstance
      .define(
        'OrderPayment',
        OrderPaymentScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_order_payment',
          modelName: 'OrderPayment',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    OrderPayment.associate = models => {
      models.OrderPayment.belongsTo(models.Order, {
        foreignKey: 'idOrder',
        constraint: false
      });
    }
    return OrderPayment;
  },
};
