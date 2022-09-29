'use strict';

const FotoTenantMallScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idFotoTenantMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_foto_tenant_mall'
    },
    idTenantMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'id_tenant_mall'
    },
    gambar: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'gambar',
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
  FotoTenantMallScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const FotoTenantMall = sequelizeInstance
      .define(
        'FotoTenantMall',
        FotoTenantMallScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_foto_tenant_mall',
          modelName: 'FotoTenantMall',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    // FotoTenantMall.associate = models => {
    //   models.FotoTenantMall.belongsTo(models.TenantMall, {
    //     foreignKey: 'idTenantMall',
    //     constraint: false
    //   });
    // }
    return FotoTenantMall;
  },
};
