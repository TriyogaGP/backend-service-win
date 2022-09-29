'use strict';

const KategoriTenantScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idKategoriTenant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_kategori_tenant'
    },
    kategoriTenant: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kategori_tenant',
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
  KategoriTenantScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const KategoriTenant = sequelizeInstance
      .define(
        'KategoriTenant',
        KategoriTenantScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_kategori_tenant',
          modelName: 'KategoriTenant',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return KategoriTenant;
  },
};
