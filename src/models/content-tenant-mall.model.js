'use strict';

const ContentTenantMallScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idContentTenantMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_content_tenant_mall'
    },
    idTenantMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_tenant_mall'
    },
    idKategoriContent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kategori_content'
    },
    judulContent: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'judul_content',
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'link',
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'deskripsi',
    },
    foto: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'foto',
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
  ContentTenantMallScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const ContentTenantMall = sequelizeInstance
      .define(
        'ContentTenantMall',
        ContentTenantMallScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_content_tenant_mall',
          modelName: 'ContentTenantMall',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    ContentTenantMall.associate = models => {
      models.ContentTenantMall.belongsTo(models.TenantMall, {
        foreignKey: 'idTenantMall',
        constraint: false
      });
      models.ContentTenantMall.belongsTo(models.KategoriContent, {
        foreignKey: 'idKategoriContent',
        constraint: false
      });
    }
    return ContentTenantMall;
  },
};
