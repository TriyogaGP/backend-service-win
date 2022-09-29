'use strict';

const UpdateStokScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idUpdateStok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_update_stok'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produk'
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
      allowNull: true,
      field: 'tanggal',
    },
    tambahStok: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'tambah_stok'
    },
    kurangStok: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'kurang_stok'
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
  UpdateStokScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const UpdateStok = sequelizeInstance
      .define(
        'UpdateStok',
        UpdateStokScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_update_stok',
          modelName: 'UpdateStok',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    UpdateStok.associate = models => {
      models.UpdateStok.belongsTo(models.Produk, {
        foreignKey: 'idProduk',
        constraint: false
      });
    }
    return UpdateStok;
  },
};
