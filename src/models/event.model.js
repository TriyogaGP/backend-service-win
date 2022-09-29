'use strict';

const EventScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idEvent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_event'
    },
    kodeEvent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kode_event',
    },
    passEvent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'pass_event',
    },
    kataSandiEvent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'katasandi_event',
    },
    namaEvent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_event',
    },
    deskripsiEvent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'deskripsi_event',
    },
    tanggalEvent: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'tanggal_event',
    },
    waktuEvent: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'waktu_event',
    },
    kelipatanBid: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'kelipatan_bid',
    },
    alamatEvent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'alamat_event',
    },
    linkMaps: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'link_maps',
    },
    UnixText: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'UnixText',
    },
    gambar: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'gambar',
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
  EventScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Event = sequelizeInstance
      .define(
        'Event',
        EventScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_event',
          modelName: 'Event',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Event;
  },
};
