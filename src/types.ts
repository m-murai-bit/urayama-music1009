export interface LyricSection {
  id: string;
  type: string;
  title: string;
  lines: string[];
}

export interface StarWish {
  id: string;
  name: string;
  message: string;
  color: string;
  timestamp: string;
}

export interface SongInfo {
  title: string;
  subtitle: string;
  artist: string;
  releaseDate: string;
  durationEstimate: string;
  genre: string;
  audioUrl: string;
  jacketUrl: string;
  description: string;
}
