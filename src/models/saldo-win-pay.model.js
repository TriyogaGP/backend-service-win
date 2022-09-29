'use strict';

const SaldoWinPayScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSaldoWinPay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_saldo_win_pay'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    saldo: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'saldo',
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
  SaldoWinPayScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const SaldoWinPay = sequelizeInstance
      .define(
        'SaldoWinPay',
        SaldoWinPayScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_saldo_win_pay',
          modelName: 'SaldoWinPay',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    SaldoWinPay.associate = models => {
      models.SaldoWinPay.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
    }
    return SaldoWinPay;
  },
};
