'use strict';

const FasilitasMallScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idFasilitasMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_fasilitas_mall'
    },
    idMall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'id_mall'
    },
    fasilitasMall: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'fasilitas_mall',
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
  FasilitasMallScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const FasilitasMall = sequelizeInstance
      .define(
        'FasilitasMall',
        FasilitasMallScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_fasilitas_mall',
          modelName: 'FasilitasMall',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    FasilitasMall.associate = models => {
      models.FasilitasMall.belongsTo(models.Mall, {
        foreignKey: 'idMall',
        constraint: false
      });
    }
    return FasilitasMall;
  },
};
