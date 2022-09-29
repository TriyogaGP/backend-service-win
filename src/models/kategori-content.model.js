'use strict';

const KategoriContentScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idKategoriContent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_kategori_content'
    },
    kategoriContent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kategori_content',
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
  KategoriContentScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const KategoriContent = sequelizeInstance
      .define(
        'KategoriContent',
        KategoriContentScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_kategori_content',
          modelName: 'KategoriContent',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return KategoriContent;
  },
};
