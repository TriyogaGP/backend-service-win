'use strict';

const OrderMovesScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idOrderMoves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_order'
    },
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_order'
    },
    statusLatest: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'status_latest',
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
  OrderMovesScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const OrderMoves = sequelizeInstance
      .define(
        'OrderMoves',
        OrderMovesScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_order_moves',
          modelName: 'OrderMoves',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    OrderMoves.associate = models => {
      models.OrderMoves.belongsTo(models.Order, {
        foreignKey: 'idOrder',
        constraint: false
      });
    }
    return OrderMoves;
  },
};
