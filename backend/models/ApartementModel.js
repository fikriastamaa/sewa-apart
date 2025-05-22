import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Apartemen = db.define('apartemen', {
    id_apartemen: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama_apartemen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    jumlah_kamar: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fasilitas: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
});

export default Apartemen;

(async () => {
    await db.sync();
})();