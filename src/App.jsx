import React, { useState, useEffect } from 'react';
import { saveScore, getTopScores } from './services/firebaseService';

// Test için environment değişkenlerini kontrol et
console.log('TEST - Environment variables:', import.meta.env);

function App() {
  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App component mounted');
    loadTopScores();
  }, []);

  const loadTopScores = async () => {
    try {
      const scores = await getTopScores();
      setTopScores(scores);
      setError(null);
    } catch (error) {
      console.error('Skorlar yüklenirken hata:', error);
      setError('Skorlar yüklenirken bir hata oluştu');
    }
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!userName || score <= 0) {
      setError('Lütfen geçerli bir kullanıcı adı ve skor girin');
      return;
    }

    setLoading(true);
    try {
      await saveScore(userName, Number(score));
      await loadTopScores();
      setUserName('');
      setScore(0);
      setError(null);
    } catch (error) {
      console.error('Skor kaydedilirken hata:', error);
      setError('Skor kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Skor Tablosu</h1>
      
      {error && (
        <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmitScore} className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Kullanıcı Adı"
            className="border p-2 rounded flex-1"
            required
            aria-label="Kullanıcı Adı"
          />
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            placeholder="Skor"
            className="border p-2 rounded w-32"
            min="1"
            required
            aria-label="Skor"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Kaydediliyor...' : 'Skoru Kaydet'}
          </button>
        </div>
      </form>

      <section>
        <h2 className="text-xl font-bold mb-4">En Yüksek Skorlar</h2>
        <div className="bg-gray-50 rounded-lg shadow">
          {topScores.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {topScores.map((score, index) => (
                <li
                  key={score.id}
                  className="flex justify-between items-center p-4"
                >
                  <span className="font-medium">
                    {index + 1}. {score.userName}
                  </span>
                  <span className="text-blue-600 font-bold">{score.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 p-4 text-center">
              Henüz skor kaydedilmemiş.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;