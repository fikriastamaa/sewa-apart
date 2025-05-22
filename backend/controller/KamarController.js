import Kamar from "../models/KamarModel.js";

// Mendapatkan semua data Kamar
export const getKamar = async (req, res) => {
    try {
        const response = await Kamar.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// Menambahkan data Kamar baru
export const createKamar = async (req, res) => {
    try {
        let data = req.body;
        if (req.file) {
            data.gambar = req.file.filename;
        }
        await Kamar.create(data);
        res.status(201).json({ message: 'Kamar berhasil ditambahkan' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// Mengupdate data Kamar
export const updateKamar = async (req, res) => {
    try {
        const { id } = req.params;
        await Kamar.update(req.body, {
            where: { id_kamar: id }
        });
        res.status(200).json({ message: 'Kamar berhasil diupdate' });
    } catch (error) {
        console.log(error.message);
    }
}

// Menghapus data Kamar
export const deleteKamar = async (req, res) => {
    try {
        const { id } = req.params;
        await Kamar.destroy({
            where: { id_kamar: id }
        });
        res.status(200).json({ message: 'Kamar berhasil dihapus' });
    } catch (error) {
        console.log(error.message);
    }
}
