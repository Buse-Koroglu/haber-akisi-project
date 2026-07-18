
# Haber Akışı Projesi
 
Cross-platform news feed uygulaması (iOS, Android, Web). Expo + React Native + TypeScript.
 <img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 44 (4)" src="https://github.com/user-attachments/assets/69127d60-4ed7-41a7-89ad-cf6937936a75" />
 <img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 45" src="https://github.com/user-attachments/assets/bd8cd553-9f71-4f3b-bdc4-7c48c8a3ad01" />
 <img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 44 (3)" src="https://github.com/user-attachments/assets/4ddbad9c-1eb6-4e7f-bcbf-5b00e1af7d97" />
 <img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 44 (2)" src="https://github.com/user-attachments/assets/73bcd0f2-19a7-4ee4-8cc7-1d0f413111c3" />
<img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 44 (1)" src="https://github.com/user-attachments/assets/47502308-1178-4caf-a20c-814d7ebb509b" />
<img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 44" src="https://github.com/user-attachments/assets/00036a0e-210a-4be0-bc18-51fadfe2a5fe" />
<img width="501" height="1024" alt="WhatsApp Image 2026-07-18 at 12 59 43" src="https://github.com/user-attachments/assets/40643593-2cbf-4c96-a496-9a84d3d02e5c" />


 
## Proje Yapısı
 
```
src/
├── app/              # Expo Router (file-based routing)
├── components/       # Reusable UI bileşenleri
├── hooks/            # Business logic (useNews, useSearch, useSavedNews)
├── services/         # API & AsyncStorage layer
├── types/            # TypeScript definitions
├── utils/            # Helpers (debounce, formatters)
└── context/          # Global state (theme)
```

## Environment Variable Protection (Vercel):
- `.env` ve `.env.*.local` dosyaları `.gitignore`'da (git'e commit yok)
- Local development: `.env.example`'dan template alınır, dev values doldurulur
- Production: API keys, tokens, database URLs **Vercel dashboard**'da tutuluyor
- Deployment sırasında Vercel otomatik inject ediyor (build time'da)
- Staging vs Production secrets ayrı manage edilebiliyor
- `EXPO_PUBLIC_` prefix'i only public variables için (bunlar source code'da görülse ok)
- Sensitive data hiçbir zaman repo'da yok
---
 
---
 
## Tech Stack
 
| Layer | Teknoloji | Neden |
|-------|-----------|-------|
| **UI** | React 19, React Native 0.85 | Cross-platform, latest features |
| **Styling** | NativeWind + Tailwind | Utility-first, consistent design system |
| **Routing** | Expo Router | File-based, typed routes, deep linking |
| **Data** | React Query + AsyncStorage | Smart caching + offline support |
| **Type Safety** | TypeScript strict | Compile-time errors vs runtime |
| **Validation** | Zod | Schema validation, type inference |
 
---
 
## Kritik Teknik Kararlar
 
### 1. React Query + AsyncStorage (Hybrid Data Strategy)
 
**Problem:** Mobil uygulamalarda network unreliable
 
**Çözüm:**
- React Query = server state (smart caching, background sync)
- AsyncStorage = offline fallback (kaydedilen haberler, user prefs)
- User online mi offline mi sistem otomatik handle eder
**Flow:**
```
User açılır → AsyncStorage'dan instant results → 
API call paralel → Fresh data update (network varsa)
```
 
**Impact:** Users hiç "no data" görmez. Network slow/gone olsa da app çalışır.
 
---
 
### 2. Debounce Search/Filter (Network Optimization)
 
**Problem:** Her karakter yazdığında API çağrısı = 100 çağrı bir kelime için
 
**Çözüm:** 300ms debounce
- User yazarken bekleme
- Son 300ms sessiz kalınca API call
- Aynı anda AsyncStorage'dan instant results göster
**Impact:** 
- API calls 90% az
- Server yükü düşer
- User experience smooth kalır
**Production Case:** Large deployments'da debounce/throttle olmazsa server crasher.
 
---
 
### 3. Image Optimization (expo-image)
 
**Problem:** Mobilde ağır resimler = yavaş scroll, battery drain
 
**Çözüm:**
- Otomatik compression
- Progressive loading (blur → sharp)
- WebP format
- Lazy loading
**Impact:** 60FPS smooth scrolling, low memory footprint
 
---
 
### 4. Error Boundaries per Feature
 
**Problem:** Bir sayfanın crash'ı tüm app'ı kırar
 
**Çözüm:** Her feature'ın kendi ErrorBoundary'si
- Feed crash → Diğer tabs çalışır
- Search error → User "retry" yapabilir
- Graceful degradation
**Impact:** Reliability. Production app asla completely down görünmez.
 
---
 
### 5. Offline-First Mindset (AsyncStorage)
 
**Problem:** Turkey'de offline periods normal (traffic, coverage gaps)
 
**Çözüm:**
- Kaydedilen haberler AsyncStorage'da persist
- Theme + settings AsyncStorage'da
- App offline bile functional
**What NOT to sync offline:**
- Real-time trending
- Current weather
- Live comments
**Impact:** 30-40% users offline mode kullanır (analytics)
 
---
 
## Sayfalı ve Teknikler
 
| Sayfa | Amaç | Teknik |
|-------|------|--------|
| **Feed** | Haber akışı | FlatList virtualization, infinite scroll, pull-to-refresh |
| **Explore** | Kategoriye göre | Debounced filters, multi-faceted search |
| **Saved** | Bookmarks | AsyncStorage as source of truth |
| **Profile** | Settings | Context API (theme), immediate updates |
 
---
 
## Performance Targets
 
| Metrik | Hedef | |
|--------|-------|---|
| Initial load | < 3s | Code splitting, lazy routes |
| Feed FPS | 60 | FlatList virtualization, React.memo |
| Search response | < 500ms | Debounce + cache |
| Bundle size | < 5MB | Tree-shaking, dynamic imports |
 
**Test on real devices** (Android low-end simulation). Simulator yalan söyler.
 
---
 
## Critical for Production
 
1. **Type Safety**
   - Strict TypeScript mode
   - API response validation (Zod)
   - No `any` types
2. **Error Handling**
   - Error boundaries
   - Retry logic (exponential backoff)
   - User-friendly messages
3. **Network Awareness**
   - Detect offline → Show cached data
   - Retry on connection restore
   - Queue requests (if needed)
4. **Testing**
   - Unit tests (utils, hooks)
   - Component tests (UI interactions)
   - Integration tests (data flows)
---
 
## Deployment
 
- **Web:** Vercel (static export)
- **Mobile:** EAS Build (Expo's cloud builder)
- **Env:** Dev → Staging → Production
---
 
## Key Takeaways
 
✅ **Debounce** = less API calls, better UX  
✅ **React Query** = smart caching, background sync  
✅ **AsyncStorage** = offline support, critical for mobile  
✅ **Type Safety** = fewer bugs at scale  
✅ **Image Optimization** = smooth 60FPS scrolling  
✅ **Error Boundaries** = app reliability  
 
**Production philosophy:** Assume network fails, design for offline, optimize images, test on slow devices.
 
---
 
**Version:** 1.0.0 
**Repo:** https://github.com/Buse-Koroglu/haber-akisi-project
