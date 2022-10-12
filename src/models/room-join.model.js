'use strict';

const RoomJoinScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idUser: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'idUser',
    },
    socketID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'socketID',
    },
    room: {
      type: DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true,
      field: 'room',
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_peserta',
    },
    idNpl: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_npl',
    },
    idLot: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_lot',
    },
    idEvent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_event',
    },
    isAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'is_admin',
    },
    device: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'device',
    },
    joinAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'join_at',
    },
  };
};

module.exports = {
  RoomJoinScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const RoomJoin = sequelizeInstance
      .define(
        'RoomJoin',
        RoomJoinScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_room_join',
          modelName: 'RoomJoin',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    RoomJoin.associate = models => {
      models.RoomJoin.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.RoomJoin.belongsTo(models.Event, {
        foreignKey: 'idEvent',
        constraint: false
      });
      models.RoomJoin.belongsTo(models.LOT, {
        foreignKey: 'idLot',
        constraint: false
      });
      models.RoomJoin.belongsTo(models.NPL, {
        foreignKey: 'idNpl',
        constraint: false
      });
    }
    return RoomJoin;
  },
};
