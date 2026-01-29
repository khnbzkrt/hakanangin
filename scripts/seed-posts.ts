import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// .env.local dosyasını oku
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = "https://tedinnsocazsbkobvagh.supabase.co";
// Service Role Key - Bu key'i Supabase Dashboard > Project Settings > API bölümünden alın
// ve .env.local dosyasına SUPABASE_SERVICE_ROLE_KEY= olarak ekleyin
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error(`
❌ SUPABASE_SERVICE_ROLE_KEY bulunamadı!

Lütfen şu adımları takip edin:
1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Project Settings > API bölümüne gidin
4. "service_role" anahtarını kopyalayın (Project API keys altında)
5. .env.local dosyasına şu satırı ekleyin:
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
6. Bu script'i tekrar çalıştırın
`);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Unsplash'tan Türkiye doğa fotoğrafları
const posts = [
    {
        title: "Kapadokya'nın Büyülü Peri Bacaları",
        slug: "kapadokya-peri-bacalari",
        excerpt: "Milyonlarca yıllık volkanik aktivitelerin şekillendirdiği eşsiz coğrafya, dünyada benzeri olmayan bir manzara sunuyor.",
        content: `# Kapadokya'nın Büyülü Peri Bacaları

Kapadokya, Türkiye'nin Orta Anadolu bölgesinde yer alan ve UNESCO Dünya Mirası Listesi'nde bulunan eşsiz bir doğa harikasıdır. Milyonlarca yıl önce Erciyes, Hasandağı ve Güllüdağ'ın püskürttüğü lavlar ve küllerin oluşturduğu yumuşak tabakalar, zamanla yağmur ve rüzgar erozyonuyla şekillenerek bugünkü muhteşem görünümünü kazanmıştır.

## Peri Bacaları Nasıl Oluştu?

Peri bacaları, yumuşak tüf kayaçlarının üzerindeki sert bazalt tabakasının koruma görevi görmesiyle oluşur. Yumuşak kısımlar erozyon ile aşınırken, sert şapka kısmı altındaki kayayı koruyarak bu benzersiz yapıların ortaya çıkmasını sağlar.

## Görülmesi Gereken Yerler

- **Göreme Açık Hava Müzesi**: Kaya kiliseler ve freskler
- **Ürgüp**: Şarap tadımı ve butik oteller  
- **Uçhisar Kalesi**: Panoramik manzara
- **Paşabağı (Rahipler Vadisi)**: En güzel peri bacaları

## En İyi Ziyaret Zamanı

Balon turları için en ideal dönem Nisan-Kasım ayları arasıdır. Sabahın erken saatlerinde kalkan balonlarla gün doğumunu izlemek, unutulmaz bir deneyim sunar.`,
        cover_image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Pamukkale Travertenleri: Beyaz Cennet",
        slug: "pamukkale-travertenleri",
        excerpt: "Binlerce yıldır akan kalsiyum karbonat içerikli sular, dağın yamacında bembeyaz bir şelale oluşturmuş.",
        content: `# Pamukkale Travertenleri: Beyaz Cennet

Denizli'nin en değerli hazinesi Pamukkale, dünyada eşi benzeri olmayan doğal bir güzelliktir. UNESCO Dünya Mirası Listesi'nde yer alan bu alan, hem doğal güzellikleri hem de antik Hierapolis kenti ile ziyaretçilerini büyüler.

## Travertenler Nasıl Oluştu?

Yeraltından çıkan sıcak su kaynakları, yüksek oranda kalsiyum karbonat içerir. Bu sular yüzeye çıktığında, karbondioksit havaya karışır ve kalsiyum karbonat çökelerek beyaz travertenleri oluşturur.

## Antik Hierapolis

Pamukkale'nin hemen üzerinde yer alan Hierapolis antik kenti, Roma dönemine ait muhteşem kalıntılar barındırır:

- Antik tiyatro
- Nekropol (mezarlık)
- Kleopatra Havuzu
- Roma Hamamları

## Ziyaret Önerileri

Travertenlerin üzerinde yalın ayak yürümek zorunludur. Güneş batımı saatlerinde beyaz travertenler pembe ve turuncu tonlarına bürünür.`,
        cover_image: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Sümela Manastırı: Karadeniz'in Gizli Hazinesi",
        slug: "sumela-manastiri",
        excerpt: "Trabzon'un Maçka ilçesinde, Altındere Vadisi'nin dik yamaçlarına inşa edilmiş bin yıllık manastır.",
        content: `# Sümela Manastırı: Karadeniz'in Gizli Hazinesi

Karadeniz Bölgesi'nin en etkileyici tarihi yapılarından biri olan Sümela Manastırı, Trabzon'un Maçka ilçesinde, deniz seviyesinden 1150 metre yükseklikte, Altındere Vadisi'nin dik kayalıklarına inşa edilmiştir.

## Tarihçe

Manastır, MS 386 yılında Atinalı iki keşiş tarafından kurulmuştur. Bizans döneminde büyük önem kazanan yapı, yüzyıllar boyunca birçok kez restore edilmiş ve genişletilmiştir.

## Mimari Özellikleri

- Kaya kilisesi ve şapeller
- Bizans freskleri
- Kutsal çeşme
- Keşiş odaları
- Kütüphane kalıntıları

## Altındere Milli Parkı

Manastırın bulunduğu Altındere Vadisi, zengin bitki örtüsü ve endemik türleriyle de dikkat çeker. Yürüyüş parkurları ve piknik alanları ziyaretçilere doğayla iç içe vakit geçirme imkanı sunar.`,
        cover_image: "https://images.unsplash.com/photo-1572633375058-84e10030a4d5?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Olimpos ve Yanartaş: Sönmeyen Ateşler",
        slug: "olimpos-yanartas",
        excerpt: "Antik Likya kenti Olimpos ve hiç sönmeyen doğal alevleriyle Yanartaş, Antalya'nın en mistik noktası.",
        content: `# Olimpos ve Yanartaş: Sönmeyen Ateşler

Antalya'nın Kemer ilçesine bağlı Olimpos, antik Likya medeniyetinin en önemli şehirlerinden biriydi. Bugün hem arkeolojik kalıntıları hem de yakınındaki Yanartaş ile ziyaretçilerin ilgisini çekmeye devam ediyor.

## Antik Olimpos

MÖ 2. yüzyılda kurulan kent, Likya Birliği'nin en önemli altı şehrinden biriydi. Kalıntılar arasında:

- Roma hamamları
- Nekropol
- Tiyatro kalıntıları
- Bizans kilisesi

## Yanartaş (Chimaera)

Olimpos'un 7 km kuzeyindeki Yanartaş, yeryüzünden çıkan doğal gazların binlerce yıldır yanmasıyla oluşan eşsiz bir doğa olayıdır. Antik çağda denizden görülebilen bu alevler, denizcilere işaret görevi görüyordu.

Mitolojide bu alevler, ateş püsküren canavar Chimaera'nın nefesi olarak anlatılır.

## Ziyaret İpuçları

Yanartaş'ı ziyaret etmek için en ideal zaman gece saatleridir. Karanlıkta dans eden alevler, unutulmaz bir görsel şölen sunar.`,
        cover_image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Uzungöl: Doğu Karadeniz'in İncisi",
        slug: "uzungol-trabzon",
        excerpt: "Trabzon'un yemyeşil dağları arasına gizlenmiş, büyüleyici doğasıyla ünlü heyelan gölü.",
        content: `# Uzungöl: Doğu Karadeniz'in İncisi

Trabzon'un Çaykara ilçesinde bulunan Uzungöl, Karadeniz'in en popüler turistik destinasyonlarından biridir. Yemyeşil dağlarla çevrili bu heyelan gölü, her mevsim farklı bir güzellik sunar.

## Gölün Oluşumu

Uzungöl, yaklaşık 1000 yıl önce meydana gelen bir heyelan sonucu Haldizen Deresi'nin önünün kapanmasıyla oluşmuştur. Göl, deniz seviyesinden 1090 metre yükseklikte yer alır.

## Doğal Güzellikler

- Ladin ve köknar ormanları
- Şelaleler
- Yayla evleri
- Endemik bitki türleri

## Yapılacak Aktiviteler

1. **Göl çevresinde yürüyüş**
2. **Fotoğraf çekimi**
3. **Yerel lezzetlerin tadımı** (muhlama, kuymak)
4. **Yayla turları**
5. **Balık tutma**

## En İyi Ziyaret Zamanı

Yaz aylarında yeşilin en canlı tonlarını görebilirsiniz. Sonbaharda ise yaprakların renk değiştirmesiyle bambaşka bir atmosfer oluşur.`,
        cover_image: "https://images.unsplash.com/photo-1571935281109-8e624aae27fa?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Saklıkent Kanyonu: Fethiye'nin Doğa Harikası",
        slug: "saklikent-kanyonu",
        excerpt: "18 km uzunluğuyla Türkiye'nin en uzun, Avrupa'nın en derin ikinci kanyonu.",
        content: `# Saklıkent Kanyonu: Fethiye'nin Doğa Harikası

Muğla'nın Fethiye ilçesine 50 km uzaklıkta bulunan Saklıkent Kanyonu, 18 km uzunluğu ve 300 metreye varan derinliğiyle Türkiye'nin en uzun, Avrupa'nın en derin ikinci kanyonudur.

## Kanyonun Özellikleri

Eşen Çayı'nın milyonlarca yıl boyunca kayaları oymasıyla oluşan kanyon, bazı noktalarda sadece 2 metre genişliğe kadar daralır. Yüksek kayalıklar arasından süzülen güneş ışığı, mistik bir atmosfer oluşturur.

## Aktiviteler

- **Kanyon yürüyüşü**: Soğuk sularda yürüyerek kanyonun derinliklerine inebilirsiniz
- **Rafting**: Daha macera dolu bir deneyim için
- **Doğa fotoğrafçılığı**: Eşsiz ışık oyunları
- **Piknik**: Giriş bölgesindeki platformlarda

## Pratik Bilgiler

- Su ayakkabısı zorunludur
- Yaz aylarında bile su oldukça soğuktur
- Açılış saatleri: 08:00 - 19:00
- En ideal ziyaret dönemi: Mayıs - Eylül`,
        cover_image: "https://images.unsplash.com/photo-1602850666012-5bc3f25c3f3b?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Nemrut Dağı: Tanrıların Tahtı",
        slug: "nemrut-dagi",
        excerpt: "2150 metre yükseklikteki devasa heykeller ve tümülüs, Kommagene Krallığı'nın ihtişamını gözler önüne seriyor.",
        content: `# Nemrut Dağı: Tanrıların Tahtı

Adıyaman'da bulunan Nemrut Dağı, 2150 metre yüksekliğindeki zirvesinde yer alan devasa heykeller ve tümülüsüyle UNESCO Dünya Mirası Listesi'ndedir. MÖ 1. yüzyılda Kommagene Kralı I. Antiochos tarafından yaptırılmıştır.

## Tarihsel Önemi

Kommagene Krallığı, Doğu ve Batı kültürlerinin buluştuğu bir geçiş noktasında yer alıyordu. Nemrut'taki heykeller, bu sentezin en güzel örneklerini sunar. Yunan ve Pers tanrıları yan yana tasvir edilmiştir.

## Heykeller

Doğu ve Batı teraslarında bulunan heykeller:

- **Zeus-Ahura Mazda**
- **Apollo-Mithras-Helios**
- **Herakles-Artagnes-Ares**
- **Kommagene (Bereket tanrıçası)**
- **Kral I. Antiochos**

## Gün Doğumu Deneyimi

Nemrut'un en büyülü anı gün doğumudur. Güneşin ilk ışıkları heykelleri aydınlatırken, bulutların üzerinde tanrılarla birlikte olmak benzersiz bir deneyimdir.

## Ulaşım ve Konaklama

En yakın yerleşim yeri Kahta'dır. Gece turları organize edilmektedir.`,
        cover_image: "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Salda Gölü: Türkiye'nin Maldivleri",
        slug: "salda-golu",
        excerpt: "Bembeyaz kumsalları ve turkuaz suları ile 'Türkiye'nin Maldivleri' olarak anılan krater gölü.",
        content: `# Salda Gölü: Türkiye'nin Maldivleri

Burdur'da bulunan Salda Gölü, bembeyaz kıyıları ve turkuaz rengi suları ile son yılların en popüler doğal güzelliklerinden biri haline gelmiştir. "Türkiye'nin Maldivleri" olarak anılan göl, aynı zamanda bilimsel açıdan da büyük önem taşır.

## Jeolojik Önemi

Salda Gölü, dünyadaki nadir hidromanyezit oluşumlarından birine ev sahipliği yapar. NASA, Mars'taki Jezero Krateri ile benzerlik göstermesi nedeniyle gölü yakından incelemiştir.

## Beyaz Kumsallar

Gölün çevresindeki beyaz kumsallar, hidromanyezit mineralinin birikmesiyle oluşmuştur. Bu mineral, suya turkuaz rengini verir.

## Koruma Altında

Salda Gölü, Özel Çevre Koruma Bölgesi ilan edilmiştir. Ziyaretçilerin uyması gereken kurallar:

- Güneş kremi kullanmamak
- Belirli alanlar dışına çıkmamak
- Çöp bırakmamak
- Göle sabun, şampuan vb. sokmamak

## Ulaşım

Burdur şehir merkezine 50 km, Antalya'ya 150 km mesafededir.`,
        cover_image: "https://images.unsplash.com/photo-1623492701902-2d9c72f13fa3?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Göbeklitepe: İnsanlık Tarihinin Başlangıcı",
        slug: "gobeklitepe",
        excerpt: "12.000 yıllık geçmişiyle bilinen en eski tapınak kompleksi, tarih kitaplarını yeniden yazdırıyor.",
        content: `# Göbeklitepe: İnsanlık Tarihinin Başlangıcı

Şanlıurfa'da bulunan Göbeklitepe, 12.000 yıllık geçmişiyle bilinen en eski anıtsal yapı kompleksidir. Bu keşif, insanlık tarihine dair bildiklerimizi kökten değiştirmiştir.

## Neden Bu Kadar Önemli?

Göbeklitepe, Mısır piramitlerinden 7.000 yıl, Stonehenge'den 6.000 yıl daha eskidir. Daha da önemlisi, avcı-toplayıcı toplulukların bu kadar karmaşık yapılar inşa edemeyeceği düşünülüyordu.

## Arkeolojik Bulgular

- **T-biçimli dikilitaşlar**: 6 metre yüksekliğe ulaşan, üzerinde hayvan figürleri oyulmuş taşlar
- **Dairesel yapılar**: Şimdiye kadar 20'den fazla yapı tespit edildi
- **Hayvan kabartmaları**: Yılan, tilki, aslan, ördek gibi figürler

## Kazı Çalışmaları

1994'te başlayan kazılar hala devam etmektedir. Şimdiye kadar alanın sadece %5'i kazılabilmiştir.

## UNESCO Mirası

2018'de UNESCO Dünya Mirası Listesi'ne alınan Göbeklitepe, Türkiye'nin en önemli arkeolojik alanlarından biridir.`,
        cover_image: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Likya Yolu: Türkiye'nin En Uzun Yürüyüş Parkuru",
        slug: "likya-yolu",
        excerpt: "Fethiye'den Antalya'ya uzanan 540 km'lik antik patika, dünyanın en iyi 10 yürüyüş rotasından biri.",
        content: `# Likya Yolu: Türkiye'nin En Uzun Yürüyüş Parkuru

Fethiye'den Antalya'ya uzanan Likya Yolu, 540 km uzunluğuyla Türkiye'nin en uzun, dünyanın en güzel yürüyüş rotalarından biridir. Sunday Times tarafından dünyanın en iyi 10 yürüyüş parkurundan biri seçilmiştir.

## Rota Hakkında

Likya Yolu, antik Likya medeniyetinin topraklarından geçer. Yol boyunca:

- Antik kentler (Patara, Xanthos, Myra)
- Likya kaya mezarları
- Osmanlı dönemi köyleri
- Bozulmamış koylar

## Etaplar

Yol genellikle 29 etapta yürünür. Popüler bölümler:

1. **Ölüdeniz - Kabak**: Kelebek Vadisi manzarası
2. **Patara - Kalkan**: Patara antik kenti ve kumsalı
3. **Demre - Finike**: Aziz Nikolaos Kilisesi
4. **Olimpos - Adrasan**: Yanartaş (Chimaera)

## Pratik Bilgiler

- **En iyi dönem**: Mart-Mayıs, Ekim-Kasım
- **Zorluk**: Orta-Zor
- **İşaretleme**: Kırmızı-beyaz boya işaretleri
- **Konaklama**: Pansiyonlar ve kamp alanları`,
        cover_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Kaçkar Dağları: Yaylalar ve Buzul Gölleri",
        slug: "kackar-daglari",
        excerpt: "Doğu Karadeniz'in muhteşem dağ silsilesi, buzul gölleri ve geleneksel yayla kültürü ile büyülüyor.",
        content: `# Kaçkar Dağları: Yaylalar ve Buzul Gölleri

Doğu Karadeniz'de yükselen Kaçkar Dağları, 3937 metre yüksekliğindeki Kaçkar zirvesiyle Türkiye'nin en yüksek dördüncü dağ silsilesidir. Buzul gölleri, alpine çayırları ve geleneksel yayla kültürü ile doğa tutkunlarının gözdesidir.

## Doğal Zenginlikler

- **Buzul gölleri**: Deniz Gölü, Kara Göl, Meterik Gölü
- **Endemik türler**: 300'den fazla endemik bitki
- **Ormanlar**: Sahilden başlayan Kolşik ormanları
- **Şelaleler**: Gelin Tülü Şelalesi

## Yaylalar

Kaçkar eteklerinde geleneksel yaşamın sürdüğü yaylalar:

- **Ayder Yaylası**: En ünlüsü, kaplıcalarıyla meşhur
- **Pokut Yaylası**: Fotoğrafçıların gözdesi
- **Kavrun Yaylası**: Bozulmamış doğasıyla
- **Elevit Yaylası**: Hemşin kültürünün yaşadığı yer

## Tırmanış ve Trekking

Kaçkar Dağları, Türkiye'nin en iyi tırmanış ve trekking destinasyonudur. Trans-Kaçkar rotası deneyimli dağcılar için mükemmeldir.`,
        cover_image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Efes Antik Kenti: Roma'nın Doğu İncisi",
        slug: "efes-antik-kenti",
        excerpt: "Dünyanın en büyük ve en iyi korunmuş antik kentlerinden biri, Roma döneminin ihtişamını gözler önüne seriyor.",
        content: `# Efes Antik Kenti: Roma'nın Doğu İncisi

İzmir'in Selçuk ilçesinde bulunan Efes, antik dünyanın en büyük ve en önemli şehirlerinden biriydi. Roma döneminde Asia Eyaleti'nin başkenti olan kent, UNESCO Dünya Mirası Listesi'ndedir.

## Tarihçe

Efes, MÖ 10. yüzyılda kurulmuştur. Roma döneminde 250.000 nüfusuyla dünyanın en kalabalık şehirlerinden biriydi.

## Görülmesi Gerekenler

### Celsus Kütüphanesi
Roma döneminin en görkemli yapılarından biri. 12.000 rulo barındıran antik dünyanın üçüncü büyük kütüphanesiydi.

### Büyük Tiyatro
25.000 kişi kapasiteli dev tiyatro, mükemmel akustiğiyle hala hayret uyandırır.

### Yamaç Evleri
Roma aristokratlarının lüks evleri, dönemin günlük yaşamına dair ipuçları sunar.

### Artemis Tapınağı
Dünyanın yedi harikasından biri. Bugün sadece bir sütunu ayakta.

## Ziyaret İpuçları

- Sabah erken saatlerde gidin
- Rahat ayakkabı giyin
- En az 3-4 saat ayırın
- Sesli rehber kiralayın`,
        cover_image: "https://images.unsplash.com/photo-1565071559227-20ab25b7685e?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Kelebekler Vadisi: Ölüdeniz'in Gizli Cenneti",
        slug: "kelebekler-vadisi",
        excerpt: "Sadece tekneyle veya zorlu bir patikadan ulaşılabilen bu koy, Türkiye'nin en saf doğal güzelliklerinden.",
        content: `# Kelebekler Vadisi: Ölüdeniz'in Gizli Cenneti

Fethiye'nin dünyaca ünlü Ölüdeniz'inin hemen yanı başında bulunan Kelebekler Vadisi, ulaşımının zorluğu sayesinde bozulmamış doğasını koruyan nadir yerlerden biridir.

## Neden Kelebekler Vadisi?

Vadiye adını veren Jersey Tiger (Kaplan Kelebeği) türü, her yıl üreme mevsiminde buraya gelir. Haziran-Eylül ayları arasında vadide binlerce kelebeği görmek mümkündür.

## Ulaşım

İki yol vardır:

1. **Tekne ile**: Ölüdeniz'den kalkan tekneler (20 dakika)
2. **Yürüyüş**: Faralya köyünden inen zorlu patika (1 saat)

## Konaklama

Vadide elektrik yoktur. Ağaç evlerde veya çadırlarda konaklayabilirsiniz. Bu, dijital detoks için mükemmel bir fırsattır.

## Aktiviteler

- Yüzme ve şnorkel
- Kanyona doğru yürüyüş
- Yoga ve meditasyon
- Kelebeklerle tanışma

## Dikkat Edilecekler

- Değerli eşyalarınızı güvende tutun
- Yeterli nakit getirin (ATM yok)
- Su geçirmez çanta kullanın
- Bol güneş kremi`,
        cover_image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Van Gölü ve Akdamar Adası",
        slug: "van-golu-akdamar",
        excerpt: "Türkiye'nin en büyük gölü ve üzerindeki bin yıllık Ermeni kilisesi, Doğu Anadolu'nun incisi.",
        content: `# Van Gölü ve Akdamar Adası

Van Gölü, 3.713 km² yüzölçümüyle Türkiye'nin en büyük, dünyanın en büyük sodalı gölüdür. Gölün ortasındaki Akdamar Adası'nda bulunan tarihi kilise, bölgenin en önemli kültürel mirasıdır.

## Van Gölü

### Özellikleri
- Deniz seviyesinden 1640 metre yükseklikte
- Maksimum derinlik: 451 metre
- Sodalı yapısı nedeniyle batmak imkansız
- Van Kedisi'nin memleketi

### Gün Batımı
Van Gölü'nde gün batımı, Türkiye'nin en güzel manzaralarından birini sunar. Suphan Dağı'nın silueti, göle yansıyan renkler... Unutulmaz!

## Akdamar Kilisesi

921 yılında inşa edilen Surp Haç (Kutsal Haç) Kilisesi, Ermeni mimarisinin en önemli örneklerinden biridir.

### Öne Çıkanlar
- Dış cephedeki taş kabartmalar (Adem ile Havva, Yunus Peygamber)
- Fresklerin kalıntıları
- Özgün mimarisi

## Ziyaret

Akdamar'a Gevaş'tan kalkan feribotlarla ulaşılır. Seyahat süresi 20 dakikadır.`,
        cover_image: "https://images.unsplash.com/photo-1669288584014-ccf67f0f4b74?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Aspendos Antik Tiyatrosu",
        slug: "aspendos-antik-tiyatrosu",
        excerpt: "Roma döneminden günümüze en iyi korunmuş tiyatro, 2000 yıl sonra hala kullanılıyor.",
        content: `# Aspendos Antik Tiyatrosu

Antalya'nın Serik ilçesinde bulunan Aspendos Antik Tiyatrosu, Roma döneminden günümüze kalan en iyi korunmuş tiyatrodur. MS 161-180 yılları arasında inşa edilmiştir.

## Mimari Mükemmellik

### Boyutlar
- 96 metre çap
- 15.000-20.000 kişi kapasitesi
- 24 metre yüksekliğinde sahne binası

### Akustik
Tiyatronun akustiği o kadar mükemmeldir ki, sahneden fısıldanan bir ses en üst sıradan dahi duyulabilir. Bunu test etmek için sahneye inin ve bir madeni para düşürün!

### Koruma Durumu

Selçuklu döneminde kervansaray olarak kullanılması, yapının korunmasını sağlamıştır. Onarımlar orijinal malzeme ve tekniklerle yapılmaktadır.

## Festivaller

Her yıl düzenlenen Aspendos Opera ve Bale Festivali, antik tiyatroyu hala işlevsel tutmaktadır. Bu tarihi mekanda opera izlemek benzersiz bir deneyimdir.

## Antik Kent

Tiyatronun yanı sıra:
- Su kemerleri
- Bazilika
- Nymphaeum (anıtsal çeşme)
- Stadyum kalıntıları`,
        cover_image: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Mardin: Mezopotamya'nın Balkonunda Bir Taş Şehir",
        slug: "mardin-tas-sehir",
        excerpt: "Binlerce yıllık geçmişiyle, taş evleri ve minareleriyle Mardin, zamanın durduğu bir açık hava müzesi.",
        content: `# Mardin: Mezopotamya'nın Balkonunda Bir Taş Şehir

Güneydoğu Anadolu'nun incisi Mardin, sarı kireç taşından yapılmış evleri, camileri ve kiliseleriyle Mezopotamya ovasına bakan eşsiz bir konuma sahiptir. Şehrin tamamı UNESCO Dünya Mirası geçici listesindedir.

## Tarihi Doku

### Mimari
Mardin'in karakteristik sarı taş yapıları, yüzyıllar boyunca farklı medeniyetlerin izlerini taşır:
- Artuklu dönemi medreseleri
- Osmanlı konakları  
- Süryani kiliseleri
- Kürt taş evleri

### Önemli Yapılar
- **Zinciriye Medresesi**: 14. yüzyıl Artuklu eseri
- **Kasımiye Medresesi**: Mezopotamya manzaralı avlu
- **Kırklar Kilisesi**: 5. yüzyıl Süryani kilisesi
- **Ulu Cami**: 12. yüzyıl

## Midyat ve Mor Gabriel

Mardin'e 60 km uzaklıktaki Midyat, gümüş işçiliği ve telkari sanatıyla ünlüdür. Yakınındaki Mor Gabriel Manastırı (397), dünyanın en eski manastırlarından biridir.

## Yerel Lezzetler

- Kaburga dolması
- İcot (lor peynirli erişte)
- Sembusek
- Mırra (acı kahve)`,
        cover_image: "https://images.unsplash.com/photo-1609910941904-e396b3a9c7fd?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Şirince: İzmir'in Şarap Köyü",
        slug: "sirince-sarap-koyu",
        excerpt: "Efes'in hemen yanı başında, yüz yıllık Rum evleri ve meyve şaraplarıyla tanınan şirin bir köy.",
        content: `# Şirince: İzmir'in Şarap Köyü

Selçuk'un 8 km doğusunda, zeytinlikler arasına gizlenmiş Şirince, taş döşeli sokakları, restore edilmiş Rum evleri ve butik şarap imalathaneleriyle İzmir'in en romantik köyüdür.

## Tarihçe

Köy, antik Efes'in terk edilmesinin ardından buraya yerleşen Rumlar tarafından kurulmuştur. 1924 mübadelesine kadar Rum nüfusun yaşadığı köy, bugün geleneksel dokusunu korumaktadır.

## Şirince Evleri

İki katlı, beyaz badanalı taş evler köyün karakterini oluşturur. Birçoğu butik otele dönüştürülmüştür:
- Ahşap cumbalı pencereler
- Taş avlular
- Üzüm asmaları
- Bahçeli teraslar

## Şarap Kültürü

Şirince, özellikle meyve şaraplarıyla ünlüdür:
- Böğürtlen şarabı
- Vişne şarabı
- Nar şarabı
- Çilek şarabı
- Klasik üzüm şarapları

Köyde düzinelerce şarap evi bulunur ve tadım yapabilirsiniz.

## Yerel Ürünler

- Zeytinyağı
- Zeytinyağlı sabunlar
- El yapımı reçeller
- Kuru meyveler`,
        cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Ani Harabeleri: Bin Kilisenin Şehri",
        slug: "ani-harabeleri",
        excerpt: "Kars sınırında, Ermeni Krallığı'nın eski başkenti, Ortaçağ'ın unutulmuş metropolü.",
        content: `# Ani Harabeleri: Bin Kilisenin Şehri

Kars'ın 45 km doğusunda, Türkiye-Ermenistan sınırında bulunan Ani, bir zamanlar "40 Kapılı Şehir" ve "1001 Kilisenin Şehri" olarak anılırdı. UNESCO Dünya Mirası Listesi'ndeki bu antik kent, İpek Yolu'nun önemli duraklarından biriydi.

## Tarihçe

- 5. yüzyıl: İlk yerleşim
- 961: Bagratid Ermeni Krallığı'nın başkenti
- 11. yüzyıl: 100.000 nüfus, "Dünyanın Sayılı Şehirlerinden"
- 1064: Selçuklu fethi
- 1319: Moğol istilası sonrası terk edilme

## Önemli Yapılar

### Ani Katedrali (Fethiye Camii)
1001-1010 yılları arasında inşa edilen katedral, Ermeni mimarisinin şaheseridir.

### Abuğamrents Kilisesi
6 yapraklı yonca planıyla dikkat çeker.

### Tigran Honents Kilisesi
İç duvarlarındaki freskler hala görülebilir.

### Menüçehr Camii
1072 yılında inşa edilen Anadolu'nun ilk camilerinden.

## Ziyaret

- Sınır bölgesi olduğundan kimlik gerekli
- En iyi fotoğraf saati: Gün batımı
- Ortalama ziyaret süresi: 2-3 saat`,
        cover_image: "https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=1200&h=800&fit=crop",
        published: true,
    },
    {
        title: "Dalyan ve Kaunos: Kaya Mezarları ve Caretta Carettalar",
        slug: "dalyan-kaunos",
        excerpt: "Likya kaya mezarları, İztuzu Plajı ve caretta carettalarla ünlü delta cenneti.",
        content: `# Dalyan ve Kaunos: Kaya Mezarları ve Caretta Carettalar

Muğla'nın Ortaca ilçesine bağlı Dalyan, Köyceğiz Gölü ile Akdeniz arasında uzanan kanalları, Likya kaya mezarları ve nesli tehlike altındaki caretta caretta deniz kaplumbağalarıyla ünlüdür.

## Kaunos Antik Kenti

MÖ 10. yüzyılda kurulan Kaunos, Likya ve Karya kültürlerinin kesiştiği önemli bir liman kentiydi. 

### Kaya Mezarları
Dalyan'ın simgesi olan kaya mezarları, MÖ 4. yüzyılda kayalara oyulmuştur. Tapınak cepheli bu mezarlar, Likya krallarına aittir.

### Diğer Kalıntılar
- Antik tiyatro
- Roma hamamları
- Agora
- Bazilika

## İztuzu Plajı

5 km uzunluğundaki İztuzu Plajı, Akdeniz'de caretta caretta deniz kaplumbağalarının en önemli yuvalama alanlarından biridir.

### Koruma Kuralları
- Mayıs-Ekim: Gece girişi yasak
- Şemsiye ve şezlong sınırlı
- Köpek yasak
- Plastik kullanımı minimize edilmeli

## Çamur Banyosu

Dalyan kaplıcalarındaki kükürtlü çamur, cilt hastalıklarına iyi gelir ve doğal güzellik bakımı olarak kullanılır.`,
        cover_image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
        published: true,
    },
];

async function seedPosts() {
    console.log("🌱 Blog yazıları ekleniyor...\n");

    // Service role ile auth.users tablosundan ilk kullanıcıyı al
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    let authorId: string;
    
    if (usersError || !users?.users?.length) {
        console.error("❌ Kullanıcı bulunamadı. Lütfen önce sisteme kayıt olun.");
        process.exit(1);
    } else {
        authorId = users.users[0].id;
        console.log(`✅ Kullanıcı bulundu: ${users.users[0].email}\n`);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
        const { error } = await supabase.from("posts").insert({
            ...post,
            author_id: authorId,
        });

        if (error) {
            if (error.code === "23505") {
                console.log(`⚠️  "${post.title}" zaten mevcut, atlanıyor...`);
            } else {
                console.error(`❌ Hata: ${post.title}`, error.message);
                errorCount++;
            }
        } else {
            console.log(`✅ Eklendi: ${post.title}`);
            successCount++;
        }
    }

    console.log(`\n📊 Sonuç: ${successCount} yazı eklendi, ${errorCount} hata`);
}

seedPosts();
