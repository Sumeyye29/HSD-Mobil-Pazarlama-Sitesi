## HSD Mobil Pazarlama Sitesi

Bu proje Vite ile servis edilen bir oyun sayfası (root `index.html`) ve örnek bir React sayfası (`src/App.jsx`) içerir. Skorlar Firebase Firestore'a yazılır ve oradan okunur.

### Kurulum

1) Bağımlılıkları yükleyin:

```bash
npm install
```

2) Firebase ortam değişkenlerini ayarlayın:

```bash
cp .env.example .env.local
# .env.local içindeki VITE_FIREBASE_* değerlerini kendi projeniz ile doldurun
```

Gerekli anahtarlar `src/config/firebase.js` tarafından `import.meta.env` üzerinden okunur. Vite, `VITE_` ile başlayan değişkenleri uygulamaya enjekte eder.

3) Geliştirme sunucusunu başlatın ve root `index.html` üzerinden oynayın:

```bash
npm run dev
```

Tarayıcı konsolunda "Firebase Config Check" ve "Firebase initialized successfully" loglarını görmelisiniz.

### Firebase Firestore

- Koleksiyon adı: `scores`
- Yazma: `saveScore(userName, score)`
- Okuma: `getTopScores(limit)` (varsayılan 10)

Firestore Güvenlik Kuralları test için en azından aşağıdaki gibi olmalıdır (kendi güvenlik ihtiyaçlarınıza göre düzenleyin):

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{docId} {
      allow read: if true;
      allow write: if true; // Geliştirme sırasında. Üretimde kimlik doğrulama ekleyin.
    }
  }
}
```

Kuralları kısıtlamak istiyorsanız yazmayı tarih veya kimlik doğrulamaya göre şartlandırın.

### Sorun Giderme

- Konsolda `Missing Firebase config variables` görüyorsanız `.env.local` değerleri eksik veya Vite ile servis edilmeden dosyayı doğrudan açıyorsunuz. Dosyayı `file://` ile değil `npm run dev` ile servis ederek açın.
- `Firebase initialization error` veya `permission-denied` hataları genellikle Firestore kuralları veya proje kimlik bilgilerinden kaynaklanır. Proje ID'nizi ve kuralları kontrol edin.
- Skor tablosu boş görünüyorsa `scores` koleksiyonunda veri yoktur veya ağ hatası vardır. Oyun bitince skor yazılır; ağ isteği hatasını tarayıcı konsolunda görebilirsiniz.
