'use strict';

const MallScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_mall'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_admin'
    },
    namaMall: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_mall',
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
  MallScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Mall = sequelizeInstance
      .define(
        'Mall',
        MallScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_mall',
          modelName: 'Mall',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    Mall.associate = models => {
      models.Mall.belongsTo(models.Admin, {
        foreignKey: 'idAdmin',
        constraint: false
      });
    }
    return Mall;
  },
};
