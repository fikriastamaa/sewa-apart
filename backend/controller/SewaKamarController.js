import SewaKamar from "../models/SewaKamarModel.js";
import User from "../models/UserModel.js";
import Kamar from "../models/KamarModel.js";
import Apartemen from "../models/ApartementModel.js";

// Mendapatkan semua data SewaKamar beserta nama_user, info kamar, dan info apartemen
export const getSewaKamar = async (req, res) => {
    try {
        const response = await SewaKamar.findAll({
            include: [
                {
                    model: User,
                    attributes: ['nama_user']
                },
                {
                    model: Kamar,
                    attributes: ['nomor_kamar', 'tipe_kamar', 'gambar', 'harga_per_bulan', 'fasilitas', 'id_apartemen'],
                    include: [
                        {
                            model: Apartemen,
                            attributes: ['nama_apartemen', 'alamat']
                        }
                    ]
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// Menambahkan data SewaKamar baru
export const createSewaKamar = async (req, res) => {
    try {
        // Cek status kamar sebelum membuat sewa
        const kamar = await Kamar.findOne({ where: { id_kamar: req.body.id_kamar } });
        if (!kamar) {
            return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        }
        if (kamar.status === 'Terisi') {
            return res.status(400).json({ message: 'Kamar sudah terisi' });
        }
        // Buat sewa kamar
        const sewa = await SewaKamar.create(req.body);
        // Update status kamar menjadi Terisi
        await Kamar.update({ status: 'Terisi' }, { where: { id_kamar: req.body.id_kamar } });
        res.status(201).json({ message: 'Sewa Kamar berhasil ditambahkan', sewa });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// Mengupdate data SewaKamar
export const updateSewaKamar = async (req, res) => {
    try {
        const { id } = req.params;
        // Ambil data sewa lama
        const sewa = await SewaKamar.findOne({ where: { id_sewa: id } });
        if (!sewa) return res.status(404).json({ message: 'Sewa tidak ditemukan' });
        // Update sewa
        await SewaKamar.update(req.body, {
            where: { id_sewa: id }
        });
        // Jika status_sewa diubah menjadi 'Selesai', update kamar menjadi 'Tersedia'
        if (req.body.status_sewa === 'Selesai') {
            await Kamar.update({ status: 'Tersedia' }, { where: { id_kamar: sewa.id_kamar } });
        }
        res.status(200).json({ message: 'Sewa Kamar berhasil diupdate' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// Menghapus data SewaKamar
export const deleteSewaKamar = async (req, res) => {
    try {
        const { id } = req.params;
        await SewaKamar.destroy({
            where: { id_sewa: id }
        });
        res.status(200).json({ message: 'Sewa Kamar berhasil dihapus' });
    } catch (error) {
        console.log(error.message);
    }
}
