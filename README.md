# Haber Akışı Projesi

iOS, Android ve Web platformlarında çalışan çapraz platform haber akışı uygulaması.

**Expo + React Native + TypeScript**

## Ekran Görüntüleri

<div align="center">
  <table>
    <tr>
      <td width="33%">
        <img src="https://github.com/user-attachments/assets/69127d60-4ed7-41a7-89ad-cf6937936a75" width="100%" alt="Ana Sayfa">
        <p><b>Ana Sayfa</b></p>
      </td>
      <td width="33%">
        <img src="https://github.com/user-attachments/assets/bd8cd553-9f71-4f3b-bdc4-7c48c8a3ad01" width="100%" alt="Kategori">
        <p><b>Kategori Sayfası</b></p>
      </td>
      <td width="33%">
        <img src="https://github.com/user-attachments/assets/4ddbad9c-1eb6-4e7f-bcbf-5b00e1af7d97" width="100%" alt="Arama">
        <p><b>Arama</b></p>
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <td width="33%">
        <img src="https://github.com/user-attachments/assets/73bcd0f2-19a7-4ee4-8cc7-1d0f413111c3" width="100%" alt="Favoriler">
        <p><b>Favoriler Sayfası</b></p>
      </td>
      <td width="33%">
        <img src="https://github.com/user-attachments/assets/47502308-1178-4caf-a20c-814d7ebb509b" width="100%" alt="Sıralama">
        <p><b>Sıralama Modalı</b></p>
      </td>
      <td width="33%">
        <img src="https://github.com/user-attachments/assets/00036a0e-210a-4be0-bc18-51fadfe2a5fe" width="100%" alt="Detay">
        <p><b>Detay Sayfası</b></p>
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <td width="50%">
        <img src="https://github.com/user-attachments/assets/40643593-2cbf-4c96-a496-9a84d3d02e5c" width="33%" alt="WebView">
        <p><b>WebView Sayfası</b></p>
      </td>
    </tr>
  </table>
</div>

---

## Proje Yapısı

```text
src/
├── app/              # Expo Router (dosya tabanlı yönlendirme)
├── components/       # Yeniden kullanılabilir kullanıcı arayüzü bileşenleri
├── hooks/            # İş mantığı (useNews, useSearch, useSavedNews)
├── services/         # API ve AsyncStorage katmanı
├── types/            # TypeScript tip tanımları
├── utils/            # Yardımcı fonksiyonlar (debounce, formatter vb.)
└── context/          # Global durum yönetimi (tema)
```

## Ortam Değişkeni Güvenliği (Vercel)

* `.env` ve `.env.*.local` dosyaları `.gitignore` içerisinde yer alır (Git'e eklenmez).
* Geliştirme ortamında `.env.example` dosyası şablon olarak kullanılır.
* Production ortamındaki API anahtarları, token'lar ve diğer gizli bilgiler **Vercel Dashboard** üzerinden yönetilir.
* Deployment sırasında Vercel bu değişkenleri otomatik olarak build sürecine ekler.
* Staging ve Production ortamları için farklı gizli bilgiler yönetilebilir.
* `EXPO_PUBLIC_` öneki yalnızca herkese açık değişkenler için kullanılır.
* Hassas bilgiler hiçbir zaman repository içerisinde tutulmaz.

---

## Kullanılan Teknolojiler

| Katman            | Teknoloji                   | Kullanım Amacı                                           |
| ----------------- | --------------------------- | -------------------------------------------------------- |
| **Arayüz**        | React 19, React Native 0.85 | Çapraz platform geliştirme, güncel React özellikleri     |
| **Stil**          | NativeWind + Tailwind       | Utility-first yaklaşımı ve tutarlı tasarım sistemi       |
| **Yönlendirme**   | Expo Router                 | Dosya tabanlı yönlendirme, tip güvenliği ve deep linking |
| **Veri Yönetimi** | React Query + AsyncStorage  | Akıllı önbellekleme ve çevrimdışı destek                 |
| **Tip Güvenliği** | TypeScript (Strict Mode)    | Derleme zamanında hata yakalama                          |
| **Doğrulama**     | Zod                         | Şema doğrulama ve tip çıkarımı                           |

---

## Kritik Teknik Kararlar

### 1. React Query + AsyncStorage (Hibrit Veri Stratejisi)

**Problem:** Mobil uygulamalarda ağ bağlantısı her zaman güvenilir değildir.

**Çözüm:**

* React Query = Sunucu verisini yönetir, önbellek oluşturur ve arka planda günceller.
* AsyncStorage = Favoriler ve kullanıcı tercihleri gibi verileri cihazda saklar.
* Kullanıcının çevrim içi veya çevrim dışı olması otomatik olarak yönetilir.

**Akış:**

```text
Uygulama açılır →
AsyncStorage'dan anlık veriler yüklenir →
API isteği paralel olarak yapılır →
İnternet varsa güncel veriler gösterilir
```

**Etkisi:**

Kullanıcı ağ bağlantısı yavaş veya kesilmiş olsa bile uygulamayı kullanmaya devam edebilir.

---

### 2. Debounce Arama / Filtreleme (Ağ Optimizasyonu)

**Problem:**

Her karakter girişinde API isteği yapılması gereksiz ağ trafiğine neden olur.

**Çözüm:**

* 500 ms debounce uygulanır.
* Kullanıcı yazmayı bıraktığında API isteği yapılır.
* Aynı anda AsyncStorage'daki kayıtlı sonuçlar gösterilebilir.

**Etkisi**

* API istekleri önemli ölçüde azalır.
* Sunucu üzerindeki yük düşer.
* Daha akıcı bir kullanıcı deneyimi sağlanır.

**Production Senaryosu**

Büyük ölçekli uygulamalarda debounce/throttle kullanılmaması gereksiz istek yüküne neden olabilir.

---

### 3. Feature Bazlı Error Boundary

**Problem**

Bir sayfadaki hata tüm uygulamayı etkileyebilir.

**Çözüm**

Her özelliğin kendi Error Boundary yapısı bulunur.

* Feed hata verse bile diğer sekmeler çalışmaya devam eder.
* Arama ekranındaki hata diğer ekranları etkilemez.

---

### 4. Offline-First Yaklaşımı (AsyncStorage)

**Problem**

Mobil cihazlarda internet bağlantısı her zaman kesintisiz olmayabilir.

**Çözüm**

* Favorilenen haberler AsyncStorage içerisinde saklanır.
* Tema bilgisi cihazda tutulur.
* Uygulama çevrim dışıyken de temel özellikler kullanılabilir.

**Çevrim dışı senkronize edilmeyen veriler**

* Gerçek zamanlı trend haberleri
* Hava durumu
* Canlı yorumlar

---

## Sayfalar ve Kullanılan Teknikler

| Sayfa                | Amaç                            | Kullanılan Teknik                                         |
| -------------------- | ------------------------------- | --------------------------------------------------------- |
| **Feed**             | Haber akışı                     | FlatList Virtualization, Infinite Scroll, Pull-to-Refresh |
| **Kategori Sayfası** | Kategoriye göre haber listeleme | Debounced Filters, Çoklu filtreleme                       |
| **Haber Detayı**     | Haber içeriğini görüntüleme     | useLocalSearchParams                                      |
| **WebView Sayfası**  | Haber kaynağını görüntüleme     | WebView Component                                         |
| **Favoriler**        | Kaydedilen haberler             | AsyncStorage veri kaynağı                                 |

---

## Performans Hedefleri

| Metrik            | Hedef    | Kullanılan Yaklaşım                 |
| ----------------- | -------- | ----------------------------------- |
| İlk açılış süresi | < 3 sn   | Code Splitting, Lazy Routes         |
| Feed FPS          | 60       | FlatList Virtualization, React.memo |
| Arama süresi      | < 500 ms | Debounce + Cache                    |
| Paket Boyutu      | < 5 MB   | Tree Shaking, Dynamic Imports       |

Gerçek cihazlarda test edilmesi önerilir (özellikle düşük donanımlı Android cihazlarda).

---

## Production İçin Dikkat Edilen Noktalar

### Tip Güvenliği

* Strict TypeScript Mode
* Zod ile API doğrulaması
* `any` kullanımından kaçınılması

### Hata Yönetimi

* Error Boundaries
* Exponential Backoff ile tekrar deneme

### Ağ Yönetimi

* Çevrim dışı durumun tespiti
* Bağlantı geri geldiğinde yeniden deneme
* Gerekirse istek kuyruğu oluşturma

### Testler

* Unit Testleri
* Component Testleri
* Integration Testleri

---

## Deployment

* **Web:** Vercel (Static Export)
* **Mobil:** Expo EAS Build
* **Ortamlar:** Development → Staging → Production

---

## Öne Çıkan Teknikler

✅ Debounce ile gereksiz API çağrılarının azaltılması

✅ React Query ile akıllı önbellekleme

✅ AsyncStorage ile çevrim dışı destek

✅ TypeScript ile tip güvenliği

✅ Görsel optimizasyonları sayesinde daha akıcı kaydırma deneyimi

✅ Error Boundaries ile uygulama kararlılığı

**Yaklaşım:** Ağ bağlantısının her zaman güvenilir olmadığı varsayılarak çevrim dışı kullanım ve performans odaklı bir yapı hedeflenmiştir.

---

**Versiyon:** 1.0.0

**Repository:** https://github.com/Buse-Koroglu/haber-akisi-project

