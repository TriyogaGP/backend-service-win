'use strict';

const AddressScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idAddress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_address'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    label: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'label',
    },
    namaPenerima: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_penerima',
    },
    telpPenerima: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'telp_penerima',
    },
    alamatPenerima: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'alamat_penerima',
    },
    alamatDetail: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'alamat_detail',
    },
    statusAktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'status_aktif',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      field: 'is_primary',
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
  AddressScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Address = sequelizeInstance
      .define(
        'Address',
        AddressScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_address',
          modelName: 'Address',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
      
    return Address;
  },
};
