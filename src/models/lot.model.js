'use strict';

const LOTScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idLot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_lot'
    },
    idBarangLelang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_barang_lelang'
    },
    idEvent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_event'
    },
    noLot: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'no_lot',
    },
    hargaAwal: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'harga_awal',
    },
    statusLot: {
			type: DataTypes.INTEGER,
			allowNull: true,
      defaultValue: 0,
			field: 'status_lot'
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
  LOTScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const LOT = sequelizeInstance
      .define(
        'LOT',
        LOTScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_lot',
          modelName: 'LOT',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    LOT.associate = models => {
      models.LOT.belongsTo(models.BarangLelang, {
        foreignKey: 'idBarangLelang',
        constraint: false
      });
      models.LOT.belongsTo(models.Event, {
        foreignKey: 'idEvent',
        constraint: false
      });
    }
    return LOT;
  },
};
