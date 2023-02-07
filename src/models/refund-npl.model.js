'use strict';

const RefundNPLScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idRefundNpl: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_refund_npl'
    },
    idNpl: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_npl'
    },
    bukti: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'bukti',
    },
    statusRefund: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status_refund',
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
    },
  };
};

module.exports = {
  RefundNPLScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const RefundNPL = sequelizeInstance
      .define(
        'RefundNPL',
        RefundNPLScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_refund_npl',
          modelName: 'RefundNPL',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    RefundNPL.associate = models => {
      models.RefundNPL.hasOne(models.NPL, {
        foreignKey: 'idNpl',
        constraint: false
      });
    }
    return RefundNPL;
  },
};
