'use strict';

const FeedbackUserScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idFeedbackPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_feedback_peserta'
    },
    idProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produk'
    },
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_order'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    gambar: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'gambar',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'rating'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comment',
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
  FeedbackUserScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const FeedbackUser = sequelizeInstance
      .define(
        'FeedbackUser',
        FeedbackUserScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_feedback_peserta',
          modelName: 'FeedbackUser',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    FeedbackUser.associate = models => {
      models.FeedbackUser.belongsTo(models.Produk, {
        foreignKey: 'idProduk',
        constraint: false
      });
      models.FeedbackUser.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.FeedbackUser.belongsTo(models.Order, {
        foreignKey: 'idOrder',
        constraint: false
      });
    }
    return FeedbackUser;
  },
};
