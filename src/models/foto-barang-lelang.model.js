'use strict';

const FotoBarangLelangScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idFotoBarangLelang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_foto_barang_lelang'
    },
    idBarangLelang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'id_barang_lelang'
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
  FotoBarangLelangScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const FotoBarangLelang = sequelizeInstance
      .define(
        'FotoBarangLelang',
        FotoBarangLelangScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_foto_barang_lelang',
          modelName: 'FotoBarangLelang',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    FotoBarangLelang.associate = models => {
      models.FotoBarangLelang.belongsTo(models.BarangLelang, {
        foreignKey: 'idBarangLelang',
        constraint: false
      });
    }
    return FotoBarangLelang;
  },
};
