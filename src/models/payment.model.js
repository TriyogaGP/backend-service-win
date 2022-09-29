'use strict';

const PaymentMethodScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idPayment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_payment'
    },
    kodeBank: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'kode_bank',
    },
    namaDisplay: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_bank_display',
    },
    kodeBankProduct: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kode_bank_product',
    },
    image: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'image',
    },
    description: {
			type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
		pemilikBank: {
			type: DataTypes.STRING(256),
			allowNull: true,
			field: 'pemilik_bank',
		},
		accountBank: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'account_bank',
		},
		pajakBank: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'pajak_bank',
		},
		kategori: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'kategori',
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
  PaymentMethodScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const PaymentMethod = sequelizeInstance
      .define(
        'PaymentMethod',
        PaymentMethodScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_payment_method',
          modelName: 'PaymentMethod',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
		
    return PaymentMethod;
  },
};
