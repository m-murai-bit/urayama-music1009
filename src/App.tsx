/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Disc3,
  Share2,
  Heart,
  Sparkles,
  Settings2,
  ExternalLink,
  Check,
  Music4,
  Calendar,
  Radio,
  Clock,
  Layers,
} from 'lucide-react';
import { SONG_INFO, LYRIC_SECTIONS } from './data/songData';
import { SongInfo } from './types';
import { AudioPlayer } from './components/AudioPlayer';
import { LyricsViewer } from './components/LyricsViewer';
import { StarWishBoard } from './components/StarWishBoard';
import { TrackSettingsModal } from './components/TrackSettingsModal';

export default function App() {
  const [songInfo, setSongInfo] = useState<SongInfo>(SONG_INFO);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(1284);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'main' | 'lyrics' | 'wishes'>('main');

  const handleUpdateSongInfo = (updated: Partial<SongInfo>) => {
    setSongInfo((prev) => ({ ...prev, ...updated }));
  };

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((c) => c + 1);
    } else {
      setIsLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans-jp selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20">
              <Disc3 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block -mb-0.5">
                Special Release Single
              </span>
              <h1 className="text-sm sm:text-base font-bold text-stone-100 tracking-tight">
                {songInfo.title}
                <span className="text-xs font-normal text-stone-400 ml-1.5 hidden sm:inline">
                  - {songInfo.subtitle}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                isLiked
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="お気に入りに追加"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span className="font-mono text-[11px]">{likeCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs text-stone-300 transition-colors"
              title="URLを共有"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">コピー済</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">共有</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-900 rounded-xl border border-transparent hover:border-stone-800 transition-colors"
              title="音源・ジャケット設定"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-10">
        {/* Mobile View Tab Switcher */}
        <div className="flex sm:hidden p-1 bg-stone-900/90 rounded-xl border border-stone-800 text-xs mb-2">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
              activeTab === 'main' ? 'bg-amber-500/20 text-amber-300 shadow-sm' : 'text-stone-400'
            }`}
          >
            プレイヤー
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
              activeTab === 'lyrics' ? 'bg-amber-500/20 text-amber-300 shadow-sm' : 'text-stone-400'
            }`}
          >
            歌詞
          </button>
          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all ${
              activeTab === 'wishes' ? 'bg-amber-500/20 text-amber-300 shadow-sm' : 'text-stone-400'
            }`}
          >
            星の願い事
          </button>
        </div>

        {/* Hero Section: Artwork + Custom Audio Player + Lyrics side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Jacket Art & Player & Liner Notes (Desktop: 7 cols) */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              activeTab !== 'main' ? 'hidden sm:block' : ''
            }`}
          >
            {/* Visual Album Art Section */}
            <div className="relative group rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-stone-900/90 via-stone-900/50 to-stone-950 border border-stone-800/80 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                {/* Jacket Image Container with vinyl overlay */}
                <div className="relative shrink-0">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-stone-700/60 group-hover:shadow-amber-500/10 transition-all duration-500">
                    <img
                      src={songInfo.jacketUrl}
                      alt={`${songInfo.title} Jacket Artwork`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gloss sheen overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

                    {/* Edge Badge */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-mono text-amber-300 tracking-wider border border-white/10">
                      OFFICIAL COVER
                    </div>
                  </div>

                  {/* Vinyl Record disc styling sliding out behind jacket */}
                  <div className="hidden md:block absolute -right-6 top-4 w-56 h-56 rounded-full bg-stone-950 border-4 border-stone-800/90 shadow-2xl -z-10 group-hover:translate-x-6 transition-transform duration-500 pointer-events-none overflow-hidden">
                    {/* Vinyl grooves */}
                    <div className="w-full h-full rounded-full border-[10px] border-stone-900 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-[8px] border-stone-900/80 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-[6px] border-stone-900/60 flex items-center justify-center bg-amber-500/20">
                          <div className="w-6 h-6 rounded-full bg-stone-950 border-2 border-stone-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single metadata info & Story */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>2026 DIGITAL SINGLE</span>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight font-serif-jp">
                      {songInfo.title}
                    </h2>
                    <p className="text-sm font-medium text-amber-200/90 mt-1">
                      〜{songInfo.subtitle}〜
                    </p>
                  </div>

                  {/* Clean unboxed metadata text without pill boxes */}
                  <div className="pt-2 text-xs text-stone-400 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 font-mono">
                    <span className="text-stone-300 font-sans-jp">{songInfo.artist}</span>
                    <span>·</span>
                    <span>{songInfo.genre}</span>
                    <span>·</span>
                    <span>{songInfo.durationEstimate}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed font-sans-jp pt-2 line-clamp-3">
                    {songInfo.description}
                  </p>

                  {/* Streaming badges mockup */}
                  <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1 hover:text-stone-200 cursor-pointer">
                      <Radio className="w-3 h-3 text-emerald-400" /> Streaming Available
                    </span>
                    <span>·</span>
                    <span className="text-amber-400/90 font-medium">Hi-Res Audio (48kHz/24bit)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Interactive Audio Player */}
            <AudioPlayer
              audioUrl={songInfo.audioUrl}
              songTitle={songInfo.title}
              artist={songInfo.artist}
            />

            {/* Song Story & Background Liner Notes */}
            <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-stone-300 font-bold text-sm">
                <Music4 className="w-4 h-4 text-amber-400" />
                <span>楽曲ストーリー & ライナーノーツ</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-serif-jp">
                放課後の廊下に積み上げられた文化祭のポスター、手についた絵の具のぬくもり、そして模擬店の香ばしい焼きたてワッフル。教室を彩る手作りの星を見上げるたびに胸が鳴る、かけがえのない青春の一瞬を切り取ったミディアムポップバラードです。
              </p>
              <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between text-xs text-stone-500 font-mono gap-2">
                <span>PROJECT: URAYAMA MUSIC 2026</span>
                <span>MASTERED FOR STREAMING</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Lyrics (Desktop: 5 cols) */}
          <div
            className={`lg:col-span-5 ${
              activeTab !== 'lyrics' ? 'hidden sm:block' : ''
            }`}
          >
            <LyricsViewer sections={LYRIC_SECTIONS} />
          </div>
        </div>

        {/* Star Wish Board Section (Desktop + Mobile) */}
        <section
          id="wish-section"
          className={`pt-6 ${activeTab !== 'wishes' && activeTab !== 'main' ? 'hidden sm:block' : ''}`}
        >
          <StarWishBoard />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-stone-900 bg-stone-950 py-10 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-300 font-serif-jp">青春の味</span>
            <span>-</span>
            <span>学園祭の願い事 特設音楽配信Webサイト</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>© 2026 Urayama Music Project.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <TrackSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        songInfo={songInfo}
        onUpdateSongInfo={handleUpdateSongInfo}
      />
    </div>
  );
}
