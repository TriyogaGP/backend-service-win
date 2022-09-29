'use strict';

const TenantMallScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idTenantMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_tenant_mall'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_admin'
    },
    idKategoriTenant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kategori_tenant'
    },
    idMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_mall'
    },
    namaTenantMall: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_tenant_mall',
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'deskripsi',
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'alamat',
    },
    kota: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kota',
    },
    provinsi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'provinsi',
    },
    noWhatsapp: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'no_whatsapp',
    },
    UnixText: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'UnixText',
    },
    logo: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'logo',
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
  TenantMallScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const TenantMall = sequelizeInstance
      .define(
        'TenantMall',
        TenantMallScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_tenant_mall',
          modelName: 'TenantMall',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    TenantMall.associate = models => {
      models.TenantMall.belongsTo(models.Admin, {
        foreignKey: 'idAdmin',
        constraint: false
      });
      models.TenantMall.belongsTo(models.KategoriTenant, {
        foreignKey: 'idKategoriTenant',
        constraint: false
      });
      models.TenantMall.belongsTo(models.Mall, {
        foreignKey: 'idMall',
        constraint: false
      });
    }
    return TenantMall;
  },
};
