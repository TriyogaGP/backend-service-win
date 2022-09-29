'use strict';

const KurirScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idKurir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_kurir'
    },
    namaKurir: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_kurir',
    },
    label: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'label',
    },
    image: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'image',
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
  KurirScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Kurir = sequelizeInstance
      .define(
        'Kurir',
        KurirScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_kurir',
          modelName: 'Kurir',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
		
    return Kurir;
  },
};
