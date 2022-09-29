'use strict';

const UserScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_peserta'
    },
    nama: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama',
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'password',
    },
    kataSandi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'katasandi',
    },
    noHP: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'no_hp',
    },
		alamat: {
      type: DataTypes.TEXT,
			allowNull: true,
			field: 'alamat',
		},
    kodePos: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'kode_pos',
    },
    nik: {
      type: DataTypes.STRING(25),
      allowNull: true,
      field: 'nik',
    },
    npwp: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'npwp',
    },
    noRek: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'no_rek',
    },
    namaRek: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_rek',
    },
    bertindakMewakili: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'bertindak_mewakili',
    },
    namaPerusahaan: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'nama_perusahaan',
    },
    npwpPerusahaan: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'npwp_perusahaan',
    },
    alamatPerusahaan: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'alamat_perusahaan',
    },
    telpKantor: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'telp_kantor',
    },
    emailKantor: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'email_kantor',
    },
    tokenAktifasi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'token_aktifasi',
    },
    sumberDana: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'sumber_dana',
    },
    diwakili: {
			type: DataTypes.INTEGER,
			allowNull: true,
      defaultValue: 0,
			field: 'diwakili'
    },
    UnixText: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'UnixText',
    },
    fotoPeserta: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'foto_peserta',
    },
    fotoKTP: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'foto_ktp',
    },
    fotoNPWP: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'foto_npwp',
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
  UserScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const User = sequelizeInstance
      .define(
        'User',
        UserScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_peserta',
          modelName: 'User',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return User;
  },
};
