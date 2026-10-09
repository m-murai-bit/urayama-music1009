import React, { useState } from 'react';
import { X, Music2, Image as ImageIcon, Link as LinkIcon, Check, Info } from 'lucide-react';
import { SongInfo } from '../types';

interface TrackSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songInfo: SongInfo;
  onUpdateSongInfo: (info: Partial<SongInfo>) => void;
}

export const TrackSettingsModal: React.FC<TrackSettingsModalProps> = ({
  isOpen,
  onClose,
  songInfo,
  onUpdateSongInfo,
}) => {
  const [audioUrlInput, setAudioUrlInput] = useState(songInfo.audioUrl);
  const [jacketUrlInput, setJacketUrlInput] = useState(songInfo.jacketUrl);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSongInfo({
      audioUrl: audioUrlInput.trim(),
      jacketUrl: jacketUrlInput.trim(),
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-stone-100">音源・ジャケット設定</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-amber-400" />
              音源URL (MP3)
            </label>
            <input
              type="text"
              value={audioUrlInput}
              onChange={(e) => setAudioUrlInput(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
              placeholder="https://..."
            />
            <p className="text-[11px] text-stone-500 mt-1">
              GitHubの blob URL も自動で raw.githubusercontent.com 形式に変換されて直接再生されます。
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
              ジャケット画像URL
            </label>
            <input
              type="text"
              value={jacketUrlInput}
              onChange={(e) => setJacketUrlInput(e.target.value)}
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
              placeholder="https://... またはローカル画像パス"
            />
          </div>

          <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 rounded-lg"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-md"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  保存完了
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" />
                  設定を反映する
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
