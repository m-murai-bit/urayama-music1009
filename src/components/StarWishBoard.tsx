import React, { useState } from 'react';
import { StarWish } from '../types';
import { INITIAL_WISHES } from '../data/songData';
import { Sparkles, Send, Star, Heart } from 'lucide-react';

export const StarWishBoard: React.FC = () => {
  const [wishes, setWishes] = useState<StarWish[]>(INITIAL_WISHES);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState('from-amber-400 to-orange-500');
  const [likes, setLikes] = useState<Record<string, number>>({});

  const colorOptions = [
    { label: '夕暮れアンバー', value: 'from-amber-400 to-orange-500', dot: 'bg-amber-400' },
    { label: '茜色ローズ', value: 'from-pink-400 to-rose-500', dot: 'bg-rose-400' },
    { label: '青空スカイ', value: 'from-sky-400 to-indigo-500', dot: 'bg-sky-400' },
    { label: '新緑ミント', value: 'from-emerald-400 to-teal-500', dot: 'bg-emerald-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newWish: StarWish = {
      id: `w-${Date.now()}`,
      name: name.trim() || '匿名のリスナー',
      message: message.trim(),
      color: selectedColor,
      timestamp: 'たった今',
    };

    setWishes([newWish, ...wishes]);
    setMessage('');
    setName('');
  };

  const toggleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono tracking-wider uppercase mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Wish upon the stars / 星の願い事ボード</span>
          </div>
          <h3 className="text-lg font-bold text-stone-100">
            「飾りつけの星を一緒に結ぼう」
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            歌詞に登場する折り紙の星に、あなたの願いや文化祭の思い出、感想を届けてください。
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-stone-950/60 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="お名前（例: 3年2組、ラジオネーム）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sm:w-1/3 px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            maxLength={20}
          />

          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-xs text-stone-400">星の色:</span>
            <div className="flex items-center gap-1.5">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-6 h-6 rounded-full ${c.dot} transition-transform ${
                    selectedColor === c.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea
            placeholder="願い事やメッセージを書いて星を結ぶ...（「来年もまた一緒にやろう」など）"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 resize-none"
            maxLength={140}
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-stone-500">{message.length}/140文字</span>
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-40 text-stone-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            星を結ぶ
          </button>
        </div>
      </form>

      {/* Wishes cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {wishes.map((w) => (
          <div
            key={w.id}
            className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-stone-700 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top accent badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${w.color}`} />
                <span className="text-xs font-semibold text-stone-300 truncate max-w-[140px]">
                  {w.name}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">{w.timestamp}</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-200 font-serif-jp my-1.5 leading-relaxed">
              "{w.message}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-stone-900 mt-2">
              <span className="text-[10px] text-amber-400/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                星の願い
              </span>
              <button
                onClick={() => toggleLike(w.id)}
                className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-400 transition-colors"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    likes[w.id] ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>{(likes[w.id] || 0) > 0 ? likes[w.id] : ''}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
