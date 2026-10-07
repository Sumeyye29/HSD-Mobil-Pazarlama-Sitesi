🌐 HSD Mobil Uygulaması Pazarlama Sitesi (Landing Page)

> Türkiye'nin dört bir yanındaki Huawei Student Developers (HSD) topluluklarını tek bir çatı altında toplayan HSD Mobil Uygulaması için geliştirilmiş resmi tanıtım ve pazarlama web sitesi.



 🔗 Canlı Web Sitesi

👉 **[Pazarlama Sitesini Ziyaret Et](https://hsdbandirma.com/mobil/)**


📌 Proje Hakkında

Bu repo, **HSD Mobil Uygulaması**'nın tanıtımını yapmak, özelliklerini sergilemek ve kullanıcıları uygulamaya yönlendirmek amacıyla hazırlanan **landing page (tanıtım web sitesi)** kodlarını içerir. 

Proje, HSD Bandırma topluluğundaki bizden önceki arkadaşlarımızın katkılarıyla geliştirilmiştir.

### Web Sitesinin Amacı
- **Farkındalık Yaratmak:** Türkiye genelindeki tüm HSD kulüplerini kapsayan mobil uygulamanın misyonunu ve sunduğu imkanları web üzerinden tanıtmak.
- **Uygulama İndirmelerini Artırmak:** Mobil uygulamaya erişim ve indirme bağlantılarını tek bir noktada sunarak kullanıcı dönüşümünü sağlamak.
- **Topluluk Vitrini Olmak:** Türkiye'deki HSD ağının büyüklüğünü ve birleştirici gücünü dijital bir pazarlama sayfasıyla sergilemek.

---

## ✨ Web Sitesinin Özellikleri

- 🎨 **Pazarlama Odaklı Tasarım:** Kullanıcı dikkatini uygulamanın ana özelliklerine çeken modern ve dinamik arayüz.
- 📱 **Tam Responsive Yapı:** Mobil, tablet ve masaüstü tarayıcılarda sorunsuz çalışan esnek düzen.
- 🚀 **Hızlı Yükleme & SEO Uyumu:** Web sitesinin arama motorlarında rahat bulunabilmesi ve hızlı açılması için optimize edilmiş yapı.
- 🔗 **Yönlendirme & CTA (Call to Action) Alanları:** Kullanıcıları uygulamayı indirmeye ve topluluğa katılmaya teşvik eden dinamik butonlar.

---

## 👥 Emek Verenler (Contributors)

Bu web sitesinin geliştirilmesinde ve tasarımında emeği geçen tüm HSD topluluğu üyelerine teşekkür ederiz! ❤️

---

## 🤝 Katkıda Bulunma (Contributing)

1. Bu depoyu çatallayın (`Fork`).
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/YeniOzellik`).
3. Değişikliklerinizi işleyin (`git commit -m 'Yeni özellik eklendi'`).
4. Dalınıza gönderin (`git push origin feature/YeniOzellik`).
5. Bir Pull Request (PR) oluşturun.

---


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
