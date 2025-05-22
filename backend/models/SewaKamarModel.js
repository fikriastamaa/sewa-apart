import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Kamar from './KamarModel.js';  // Mengimpor model Kamar
import User from './UserModel.js';    // Mengimpor model User

const { DataTypes } = Sequelize;

const SewaKamar = db.define('sewa_kamar', {
    id_sewa: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_kamar: {
        type: DataTypes.INTEGER,
        references: {
            model: Kamar,
            key: 'id_kamar'
        },
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id_user'
        },
        allowNull: false
    },
    tanggal_mulai: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tanggal_selesai: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status_sewa: {
        type: DataTypes.ENUM('Aktif', 'Selesai', 'Dibatalkan'),
        defaultValue: 'Aktif'
    }
}, {
    freezeTableName: true,
});

// Relasi dengan Kamar
SewaKamar.belongsTo(Kamar, { foreignKey: 'id_kamar' });
// Relasi dengan User
SewaKamar.belongsTo(User, { foreignKey: 'id_user' });

export default SewaKamar;

(async () => {
    await db.sync();
})();
