'use strict';

const ManajemenNPLScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idManajemenNPL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_manajemen_npl'
    },
    idKategori: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_kategori'
    },
    nominal: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'nominal',
    },
    createBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'create_by'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'created_at',
    },
  };
};

module.exports = {
  ManajemenNPLScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const ManajemenNPL = sequelizeInstance
      .define(
        'ManajemenNPL',
        ManajemenNPLScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_manajemen_npl',
          modelName: 'ManajemenNPL',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    ManajemenNPL.associate = models => {
      models.ManajemenNPL.belongsTo(models.KategoriLelang, {
        foreignKey: 'idKategori',
        constraint: false
      });
    }
    return ManajemenNPL;
  },
};
