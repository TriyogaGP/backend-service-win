'use strict';

const BiddingScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idBidding: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_bidding'
    },
    idLot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_lot'
    },
    idNpl: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_npl'
    },
    hargaBidding: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'harga_bidding',
    },
    waktu: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'waktu',
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
      field: 'is_admin',
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
  BiddingScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Bidding = sequelizeInstance
      .define(
        'Bidding',
        BiddingScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_bidding',
          modelName: 'Bidding',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    Bidding.associate = models => {
      models.Bidding.belongsTo(models.NPL, {
        foreignKey: 'idNpl',
        constraint: false
      });
      models.Bidding.belongsTo(models.LOT, {
        foreignKey: 'idLot',
        constraint: false
      });
    }
    return Bidding;
  },
};
