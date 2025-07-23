// node-cron bu Node.js uchun cron job (ya’ni vaqti kelganda avtomatik ishga tushadigan vazifa) yaratish imkonini beradi.
const cron = require("node-cron");

const { UploadController} = require("../controllers/upload/upload.controller.js");

// "59 23 * * *" bu cron vaqt ifodasi:
// Birinci	59	Daqiqasi (ya’ni 59-daqiqada)
// Ikkinchi	23	Soati (ya’ni kechasi 23:59 da)
// Uchinchi	*	Har kuni (oyning har kuni)
// To‘rtinchi	*	Har oyning ichida
// Beshinchi	*	Har qanday hafta kuni
// ❗ Ya’ni bu vazifa har kecha soat 23:59 da avtomatik ishlaydi.
// Bu node-cron kutubxonasining asosiy funksiyasi bo‘lib, vaqt bo‘yicha avtomatik bajariladigan kod blokini belgilash uchun ishlatiladi.

cron.schedule("59 23 * * *", async () => {

  // deleteFileWithCron() — bu UploadController ichidagi metod bo‘lib, eski yoki kerakmas fayllarni o‘chirish vazifasini bajaradi.

  const data = await UploadController.deleteFileWithCron();
  console.info(
    `Cron job completed. Deleted files: ${data}! Date: ${new Date().toLocaleString()}`
  );
});

