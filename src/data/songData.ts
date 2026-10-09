import defaultJacketImg from '../assets/images/youth_jacket_cover_1791516815466.jpg';
import { LyricSection, SongInfo, StarWish } from '../types';

export const RAW_AUDIO_FALLBACK =
  'https://raw.githubusercontent.com/m-murai-bit/urayama-music/main/%E5%AD%A6%E5%9C%92%E7%A5%AD%E3%81%AE%E9%A1%98%E3%81%84%E4%BA%8B.mp3';

export const ORIGINAL_GITHUB_URL =
  'https://github.com/m-murai-bit/urayama-music/blob/main/%E5%AD%A6%E5%9C%92%E7%A5%AD%E3%81%AE%E9%A1%98%E3%81%84%E4%BA%8B.mp3';

export function resolveAudioSource(url: string): string {
  if (!url) return RAW_AUDIO_FALLBACK;
  // If user passed github.com blob URL, rewrite to raw.githubusercontent.com for native HTML5 audio streaming
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }
  return url;
}

export const SONG_INFO: SongInfo = {
  title: '青春の味',
  subtitle: '学園祭の願い事',
  artist: '青空メロディ (Aozora Melody)',
  releaseDate: '2026.10 Special Digital Release',
  durationEstimate: '3:45',
  genre: 'J-POP / School Anthem / Youth Pop',
  audioUrl: ORIGINAL_GITHUB_URL,
  jacketUrl: defaultJacketImg,
  description:
    '放課後の茜空、文化祭準備の教室で交わした視線。ワッフルの甘い匂いと、手作りの星に託した胸の高鳴りを描いた切なくも心あたたまる青春ソング。',
};

export const LYRIC_SECTIONS: LyricSection[] = [
  {
    id: 'verse-1',
    type: 'Verse 1',
    title: '放課後の教室と廊下',
    lines: [
      '放課後の廊下　ポスターの山',
      '絵の具のついた君が笑った',
      '「手伝うよ」って袖をまくれば',
      '胸のチャイムが先に鳴る',
    ],
  },
  {
    id: 'pre-chorus-1',
    type: 'Pre-Chorus',
    title: '模擬店と紙コップ',
    lines: [
      '模擬店のメニュー　まだ決まらない',
      '君の好きな味を聞きたい',
      '紙コップ越し　目が合うたび',
      '言葉がひとつ迷子になる',
    ],
  },
  {
    id: 'chorus-1',
    type: 'Chorus',
    title: '今日だけは隣にいて',
    lines: [
      'ねえ　今日だけは隣にいて',
      '飾りつけの星を一緒に結ぼう',
      '君が笑うと教室じゅう',
      'いつもの景色が特別になる',
      'ねえ　帰り道も少しだけ',
      '遠回りして話していたい',
      '学園祭の幕が下りても',
      'この恋はまだ続いてく',
    ],
  },
  {
    id: 'verse-2',
    type: 'Verse 2',
    title: 'ワッフルの甘さとステージ袖',
    lines: [
      '焼きたてワッフル　ベルが鳴る',
      '君がくれた半分の甘さ',
      'ステージ袖でそっと交わした',
      '「頑張ろうね」が宝物',
    ],
  },
  {
    id: 'pre-chorus-2',
    type: 'Pre-Chorus',
    title: 'ほんとの気持ち',
    lines: [
      'クラスの仲間の声にまぎれて',
      'ほんとの気持ちを探してる',
      '片づけ終わるその前に',
      '名前を呼んでみたいんだ',
    ],
  },
  {
    id: 'chorus-2',
    type: 'Chorus',
    title: '手作りの旗と小さな奇跡',
    lines: [
      'ねえ　今日だけは隣にいて',
      '手作りの旗を一緒に掲げよう',
      '君が笑うと教室じゅう',
      '小さな奇跡でいっぱいになる',
      'ねえ　帰り道も少しだけ',
      '同じ歩幅で歩いていたい',
      '学園祭の写真の中に',
      '君と私が並んでる',
    ],
  },
  {
    id: 'bridge',
    type: 'Bridge',
    title: '来年の約束',
    lines: [
      '「来年もまた一緒にやろう」',
      'そのひと言に頷いた',
      '来年の話をする君の隣',
      '私の席もありますように',
    ],
  },
  {
    id: 'final-chorus',
    type: 'Final Chorus',
    title: '明日もそばにいて',
    lines: [
      'ねえ　明日もそばにいて',
      'まだ言えない言葉を抱きしめて',
      '君が笑うと教室じゅう',
      '新しい季節が始まるみたい',
      'ねえ　帰り道は手を振って',
      '振り返るたび目が合うね',
      '学園祭の幕が下りても',
      'この恋を育てていこう',
    ],
  },
  {
    id: 'outro',
    type: 'Outro',
    title: '星の願い事',
    lines: [
      'ポスターの端に書いた願い',
      '君とまた　来年も',
    ],
  },
];

export const INITIAL_WISHES: StarWish[] = [
  {
    id: 'w1',
    name: '3年A組 有志',
    message: '模擬店のワッフル完売！みんな最高の思い出をありがとう✨',
    color: 'from-amber-400 to-orange-500',
    timestamp: '17:20 放課後',
  },
  {
    id: 'w2',
    name: '文化祭実行委員',
    message: '星の飾り付け、最後まで手伝ってくれた君へ。来年も一緒にやろうね。',
    color: 'from-pink-400 to-rose-500',
    timestamp: '18:05 夕暮れ',
  },
  {
    id: 'w3',
    name: '軽音部ステージ',
    message: '「青春の味」最高のステージ演奏でした！アンコール感動しました！',
    color: 'from-sky-400 to-indigo-500',
    timestamp: '18:40 後夜祭',
  },
];
