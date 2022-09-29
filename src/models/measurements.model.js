'use strict';

const MeasurementScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idMeasurement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_measurements'
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'name',
    },
    displayName: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'display_name',
    },
    deskripsi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'deskripsi',
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
  MeasurementScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Measurement = sequelizeInstance
      .define(
        'Measurement',
        MeasurementScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_measurements',
          modelName: 'Measurement',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Measurement;
  },
};
