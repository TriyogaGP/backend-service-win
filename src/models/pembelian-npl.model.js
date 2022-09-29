'use strict';

const PembelianNPLScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idPembelianNPL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_pembelian_npl'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    idEvent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_event'
    },
    typePembelian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'type_pembelian'
    },
    typeTransaksi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'type_transaksi'
    },
    noPembelian: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'no_pembelian',
    },
    verifikasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'verifikasi'
    },
    nominal: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'nominal',
    },
    tanggalTransfer: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
      allowNull: true,
      field: 'tanggal_transfer',
    },
    pesanVerifikasi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pesan_verifikasi',
    },
    bukti: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'bukti',
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
  PembelianNPLScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const PembelianNPL = sequelizeInstance
      .define(
        'PembelianNPL',
        PembelianNPLScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_pembelian_npl',
          modelName: 'PembelianNPL',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    PembelianNPL.associate = models => {
      models.PembelianNPL.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.PembelianNPL.belongsTo(models.Event, {
        foreignKey: 'idEvent',
        constraint: false
      });
    }
    return PembelianNPL;
  },
};
