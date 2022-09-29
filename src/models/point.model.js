'use strict';

const PointScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_point'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    point: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'point',
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
  PointScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Point = sequelizeInstance
      .define(
        'Point',
        PointScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_point',
          modelName: 'Point',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    Point.associate = models => {
      models.Point.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
    }
    return Point;
  },
};
