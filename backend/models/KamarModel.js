import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Apartemen from './ApartementModel.js';  // Mengimpor model Apartemen

const { DataTypes } = Sequelize;

const Kamar = db.define('kamar', {
    id_kamar: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_apartemen: {
        type: DataTypes.INTEGER,
        references: {
            model: Apartemen, // Menghubungkan dengan model Apartemen
            key: 'id_apartemen'
        },
        allowNull: false
    },
    nomor_kamar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipe_kamar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    harga_per_bulan: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Tersedia', 'Terisi'),
        defaultValue: 'Tersedia'
    },
    fasilitas: {
        type: DataTypes.TEXT
    },
    gambar: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
});

// Relasi dengan Apartemen
Kamar.belongsTo(Apartemen, { foreignKey: 'id_apartemen' });

export default Kamar;

(async () => {
    await db.sync();
})();
