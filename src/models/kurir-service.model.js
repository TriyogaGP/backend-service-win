'use strict';

const KurirServiceScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idKurirService: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_kurir_services'
    },
    idKurir: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_kurir'
    },
    namaService: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_service',
    },
    kategoriService: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kategori_service',
    },
    beratToleransi: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'berat_toleransi',
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
  KurirServiceScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const KurirService = sequelizeInstance
      .define(
        'KurirService',
        KurirServiceScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_kurir_services',
          modelName: 'KurirService',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

		KurirService.associate = models => {
			models.KurirService.belongsTo(models.Kurir, {
				foreignKey: 'idKurir',
				constraint: false
			});
		}
    return KurirService;
  },
};
