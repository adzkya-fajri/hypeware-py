// Data Produk Bayi — sumber tunggal untuk global script & ES module
const _dataBayi = [
  { id: "bodysuit-bayi-katun", nama: "Bodysuit Katun Organik Newborn", category: "bjp",
    deskripsi: "Bodysuit bayi dari 100% katun organik yang ekstra lembut dan bebas bahan kimia berbahaya untuk kulit sensitif bayi.",
    harga: "Rp129.000", priceNumeric: 129000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArKgNEq9d72ZXKv4-naZWiUZVXY4GMb0xVlJLHxNMR_toWN0eBBzz8e4y8QM3B5kLavfT-ODW116S0rSjW_0bCKnB_19L0K0yJAmQdMUeNyfxGZtxwv0owNwtcFm11I0qsZ5lBa8Uk4f3jnQIrmW8ovYF3PN9t54IAA9_bSBuRXLAYM7jtwqp0oePel17Af2BRDU2WIm20d8ZYPCrO3AYLsGHl_E7bJrMoFymZBCLbhnTOCKw-mh8pDSJLiVruBVLFxywoswVbrtn0" },
  { id: "piyama-bayi-set", nama: "Set Piyama Bayi Soft Fleece", category: "bjp",
    deskripsi: "Setelan piyama bayi lengan panjang dengan kancing bahu yang memudahkan proses pemakaian.",
    harga: "Rp159.000", priceNumeric: 159000,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTQFlPgfYWq0Rp6yhFdzfGVmveTH5ANyLqtBR-20NGvCT4r-5WjiDoawLL00s3D0AEWzFmwfUi_Qsqw0GkECKbt-VraD4g0mQ" },
  { id: "jaket-bayi-hoodie", nama: "Jaket Hoodie Soft Knit Bayi", category: "op",
    deskripsi: "Jaket bayi rajut lembut berhoodie telinga kelinci yang menggemaskan dan hangat.",
    harga: "Rp219.000", priceNumeric: 219000,
    img: "https://i.pinimg.com/1200x/9c/9b/ab/9c9bab11c594cf5ac6baf18a844dd44a.jpg" },
  { id: "celana-legging-bayi", nama: "Celana Legging Katun Rib Bayi", category: "cl",
    deskripsi: "Celana legging berbahan katun rib yang elastis dan nyaman dipakai sepanjang hari.",
    harga: "Rp99.000", priceNumeric: 99000,
    img: "https://riraclothing.com/wp-content/uploads/2024/06/celana-wanita-santai.webp" }
];

// Expose ke global (untuk <script src="..."> biasa di HTML)
if (typeof window !== 'undefined') window.dataBayi = _dataBayi;

// Export ES module (untuk produk.js yang pakai import)
if (typeof module !== 'undefined' && module.exports) { module.exports = { dataBayi: _dataBayi }; }
