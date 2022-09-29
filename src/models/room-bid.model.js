'use strict';

const RoomBidScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    room: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'room',
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_peserta',
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
    pesan: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pesan',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'created_at',
    },
  };
};

module.exports = {
  RoomBidScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const RoomBid = sequelizeInstance
      .define(
        'RoomBid',
        RoomBidScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_room_bid',
          modelName: 'RoomBid',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    RoomBid.associate = models => {
      models.RoomBid.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.RoomBid.belongsTo(models.Event, {
        foreignKey: 'idEvent',
        constraint: false
      });
    }
    return RoomBid;
  },
};
