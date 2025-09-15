import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, where, getCountFromServer, doc, getDoc, setDoc } from 'firebase/firestore';

const SCORES_COLLECTION = 'scores';
const GAME_STATUS_COLLECTION = 'gameStatus';
const ADMIN_USERNAME = 'abirollupnerde0'; // Admin kullanıcı adı

export const saveScore = async (userName, score) => {
  if (!userName || typeof score !== 'number' || score <= 0) {
    throw new Error('Geçersiz kullanıcı adı veya skor');
  }

  try {
    const normalizedName = userName.trim();
    
    // Her oyunu kaydet
    const docRef = await addDoc(collection(db, SCORES_COLLECTION), {
      userName: normalizedName,
      score: score,
      createdAt: new Date().toISOString()
    });
    
    console.log('Skor başarıyla kaydedildi:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Skor kaydetme hatası:', error);
    throw error;
  }
};

export const getTopScores = async (limitCount = 10) => {
  try {
    // Tüm skorları al
    const querySnapshot = await getDocs(
      query(
        collection(db, SCORES_COLLECTION),
        orderBy('score', 'desc')
      )
    );

    // Kullanıcı bazında en yüksek skorları bul
    const userHighScores = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!userHighScores[data.userName] || 
          data.score > userHighScores[data.userName].score) {
        userHighScores[data.userName] = {
          id: doc.id,
          userName: data.userName,
          score: data.score,
          createdAt: data.createdAt
        };
      }
    });

    // En yüksek skorları sırala ve limitle
    const scores = Object.values(userHighScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount);

    console.log('Skorlar başarıyla alındı:', scores.length);
    return scores;
  } catch (error) {
    console.error('Skorları alma hatası:', error);
    throw error;
  }
};

export const getPlayCountByUserName = async (userName) => {
  try {
    const normalizedName = (userName || '').trim();
    if (!normalizedName) return 0;

    const scoresQuery = query(
      collection(db, SCORES_COLLECTION),
      where('userName', '==', normalizedName)
    );

    // Prefer sunucu tarafı sayaç (daha performanslı)
    const snapshot = await getCountFromServer(scoresQuery);
    return snapshot.data().count || 0;
  } catch (error) {
    console.error('Kullanıcı oyun sayısı alınamadı:', error);
    try {
      // Yedek olarak döküman sayımı
      const qSnap = await getDocs(
        query(
          collection(db, SCORES_COLLECTION),
          where('userName', '==', (userName || '').trim())
        )
      );
      return qSnap.size;
    } catch (e) {
      console.error('Yedek sayım da başarısız:', e);
      return 0;
    }
  }
};

// Yeni admin ve oyun durumu fonksiyonları
export const isAdmin = (userName) => {
  return userName.toLowerCase() === ADMIN_USERNAME;
};

export const getGameStatus = async () => {
  try {
    const statusDoc = await getDoc(doc(db, GAME_STATUS_COLLECTION, 'status'));
    if (statusDoc.exists()) {
      return statusDoc.data().isActive;
    }
    // Varsayılan olarak oyun aktif
    return true;
  } catch (error) {
    console.error('Oyun durumu alınamadı:', error);
    return true; // Hata durumunda varsayılan olarak aktif
  }
};

export const setGameStatus = async (isActive) => {
  try {
    await setDoc(doc(db, GAME_STATUS_COLLECTION, 'status'), {
      isActive: isActive,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Oyun durumu güncellenemedi:', error);
    throw error;
  }
};