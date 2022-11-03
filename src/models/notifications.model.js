'use strict';

const NotificationScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idNotification: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_notification'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    type: {
			type: DataTypes.ENUM('SMS','EMAIL','IN_APP','PUSH_NOTIFICATION'),
			allowNull: true,
			field: 'type'
    },
    judul: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'judul',
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pesan',
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'params',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_read',
    },
    statusAktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'status_aktif',
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
  NotificationScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Notification = sequelizeInstance
      .define(
        'Notification',
        NotificationScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_notifications',
          modelName: 'Notification',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Notification;
  },
};
