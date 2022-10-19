'use strict';

const PemenangLelangScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idPemenangLelang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_pemenang_lelang'
    },
    idBidding: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_bidding'
    },
    noRek: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'no_rek',
    },
    namaPemilik: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_pemilik',
    },
    nominal: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nominal',
    },
    tanggalTransfer: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
      field: 'tanggal_transfer',
    },
    tipePelunasan: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'tipe_pelunasan'
    },
    statusPembayaran: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'status_pembayaran'
    },
    bukti: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'bukti',
    },
    remarks: {
      type: DataTypes.TEXT,
      defaultValue: null,
      allowNull: true,
      field: 'remarks',
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
  PemenangLelangScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const PemenangLelang = sequelizeInstance
      .define(
        'PemenangLelang',
        PemenangLelangScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_pemenang_lelang',
          modelName: 'PemenangLelang',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    PemenangLelang.associate = models => {
      models.PemenangLelang.belongsTo(models.Bidding, {
        foreignKey: 'idBidding',
        constraint: false
      });
    }
    return PemenangLelang;
  },
};
