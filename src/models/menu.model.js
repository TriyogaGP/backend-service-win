'use strict';

const MenuScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idMenu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_menu'
    },
    idRole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_role'
    },
    menuText: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'menu_text',
    },
    menuRoute: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'menu_route',
    },
    menuIcon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'menu_icon',
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'position',
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'status',
    },
  };
};

module.exports = {
  MenuScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Menu = sequelizeInstance
      .define(
        'Menu',
        MenuScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_menu',
          modelName: 'Menu',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

		Menu.associate = models => {
			models.Menu.belongsTo(models.Role, {
				foreignKey: 'idRole',
				constraint: false
			});
		}
    return Menu;
  },
};
