'use strict';

const WinPayScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idWinPay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_win_pay'
    },
    idSaldoWinPay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_saldo_win_pay'
    },
    virtualAccount: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'virtual_account'
    },
    saldoMasuk: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'saldo_masuk'
    },
    saldoKeluar: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'saldo_keluar'
    },
    platform: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'platform'
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
  WinPayScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const WinPay = sequelizeInstance
      .define(
        'WinPay',
        WinPayScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_win_pay',
          modelName: 'WinPay',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    WinPay.associate = models => {
      models.WinPay.belongsTo(models.SaldoWinPay, {
        foreignKey: 'idSaldoWinPay',
        constraint: false
      });
    }
    return WinPay;
  },
};
