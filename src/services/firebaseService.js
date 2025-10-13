import { db } from '../config/firebase';
import {
  collection, addDoc, getDocs, query, orderBy, limit, where,
  getCountFromServer, doc, getDoc, setDoc
} from 'firebase/firestore';

const SCORES_COLLECTION = 'scores';
const GAME_STATUS_COLLECTION = 'gameStatus';
const ADMIN_USERNAME = 'abirollupnerde0'; // Admin kullanıcı adı

// Skor kaydet
export const saveScore = async (userName, score) => {
  if (!userName || typeof score !== 'number' || score <= 0) {
    throw new Error('Geçersiz kullanıcı adı veya skor');
  }

  try {
    const normalizedName = userName.trim();
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

// En yüksek skorları getir
export const getTopScores = async (limitCount = 10) => {
  try {
    // Tüm skorları al (limit olmadan) - her kullanıcının en yüksek skorunu bulmak için
    const querySnapshot = await getDocs(
      query(
        collection(db, SCORES_COLLECTION),
        orderBy('score', 'desc')
      )
    );

    const userHighScores = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Her kullanıcı için sadece en yüksek skoru tut
      if (
        !userHighScores[data.userName] ||
        data.score > userHighScores[data.userName].score
      ) {
        userHighScores[data.userName] = {
          id: docSnap.id,
          userName: data.userName,
          score: data.score,
          createdAt: data.createdAt
        };
      }
    });

    // Kullanıcıların en yüksek skorlarını sırala ve istenen sayıda döndür
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

// Kullanıcının oynama sayısı
export const getPlayCountByUserName = async (userName) => {
  try {
    const normalizedName = (userName || '').trim();
    if (!normalizedName) return 0;

    const scoresQuery = query(
      collection(db, SCORES_COLLECTION),
      where('userName', '==', normalizedName)
    );

    const snapshot = await getCountFromServer(scoresQuery);
    return snapshot.data().count || 0;
  } catch (error) {
    console.error('Kullanıcı oyun sayısı alınamadı:', error);
    try {
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

// Kullanıcının en yüksek skorunu getir
export const getUserHighestScore = async (userName) => {
  try {
    const normalizedName = (userName || '').trim();
    if (!normalizedName) {
      return null;
    }

    const userScoresQuery = query(
      collection(db, SCORES_COLLECTION),
      where('userName', '==', normalizedName),
      orderBy('score', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(userScoresQuery);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      userName: data.userName,
      score: data.score,
      createdAt: data.createdAt
    };
  } catch (error) {
    console.error('Kullanıcı en yüksek skor alma hatası:', error);
    return null;
  }
};

// Admin kontrolü
export const isAdmin = (userName) => {
  return userName.toLowerCase() === ADMIN_USERNAME;
};

// Oyun durumunu getir
export const getGameStatus = async () => {
  try {
    const statusDoc = await getDoc(doc(db, GAME_STATUS_COLLECTION, 'status'));
    if (statusDoc.exists()) {
      return statusDoc.data().isActive;
    }
    return true; // Varsayılan aktif
  } catch (error) {
    console.error('Oyun durumu alınamadı:', error);
    return true;
  }
};

// Oyun durumunu ayarla
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
