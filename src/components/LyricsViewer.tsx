import React, { useState, useRef } from 'react';
import { LyricSection } from '../types';
import { Copy, Check, Type, Compass } from 'lucide-react';

interface LyricsViewerProps {
  sections: LyricSection[];
  currentTime?: number;
}

export const LyricsViewer: React.FC<LyricsViewerProps> = ({
  sections,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [activeSectionId, setActiveSectionId] = useState<string>('verse-1');
  const [copied, setCopied] = useState<boolean>(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyFullLyrics = () => {
    const text = sections
      .map((s) => `[${s.type}]\n${s.lines.join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base sm:text-lg leading-loose',
    lg: 'text-lg sm:text-xl leading-loose',
  }[fontSize];

  return (
    <div className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col h-[560px] md:h-[680px] shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header with section jump and toolbar */}
      <div className="p-4 border-b border-stone-800/80 bg-stone-950/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h3 className="text-sm font-semibold text-stone-200 tracking-wider uppercase font-mono">
            Lyrics / 歌詞
          </h3>
        </div>

        {/* Controls: Font size toggle & Copy lyrics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-900 rounded-lg p-0.5 border border-stone-800 text-xs">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'sm' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="文字サイズ：小"
            >
              小
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'base' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="文字サイズ：標準"
            >
              標準
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'lg' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="文字サイズ：大"
            >
              大
            </button>
          </div>

          <button
            onClick={copyFullLyrics}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-800 rounded-lg text-xs transition-colors"
            title="歌詞をクリップボードにコピー"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>コピー</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="px-4 py-2 bg-stone-950/40 border-b border-stone-800/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
        <span className="text-stone-500 text-[11px] shrink-0 mr-1 flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-500/80" />
          移動:
        </span>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap text-[11px] font-medium transition-all ${
              activeSectionId === sec.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            {sec.type}
          </button>
        ))}
      </div>

      {/* Scrollable lyrics area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 font-serif-jp tracking-wide select-text">
        {sections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="group transition-opacity duration-300 scroll-mt-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-amber-400/80 tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {section.type}
              </span>
              <span className="text-xs text-stone-500 font-sans-jp">
                {section.title}
              </span>
              <div className="h-px flex-1 bg-stone-800/60" />
            </div>

            <div className={`space-y-2 text-stone-200 ${fontSizeClass}`}>
              {section.lines.map((line, idx) => {
                const isChorus = section.type.includes('Chorus');
                return (
                  <p
                    key={idx}
                    className={`transition-colors duration-200 hover:text-amber-200 cursor-pointer ${
                      isChorus ? 'font-medium text-stone-100' : 'text-stone-300'
                    }`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        {/* Ending note */}
        <div className="pt-8 pb-4 text-center border-t border-stone-800/40 text-stone-500 text-xs font-sans-jp space-y-1">
          <p>作詞・作曲: 文化祭ソングプロジェクト</p>
          <p>楽曲「青春の味」より</p>
        </div>
      </div>
    </div>
  );
};
