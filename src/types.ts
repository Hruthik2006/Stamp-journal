export type StampEdge = 'rough' | 'scalloped' | 'wave';
export type StampAppearance = 'vintage' | 'white' | 'gold' | 'silver';

export interface Stamp {
  id: string;
  name: string;
  imageUrl: string;
  paddingTopBottom: number;
  paddingLeftRight: number;
  edge: StampEdge;
  appearance: StampAppearance;
  createdAt: string;
}

export interface PlacedStamp {
  id: string;
  stampId: string;
  imageUrl: string;
  topPercent: number; // Y position on page container
  leftPercent: number; // X position on page container
  paddingTopBottom: number;
  paddingLeftRight: number;
  edge: StampEdge;
  appearance: StampAppearance;
  rotationDegrees?: number;
}

export interface JournalPage {
  id: string;
  title: string;
  content: string; // The text content of the page
  createdAt: string;
  isBookmarked: boolean;
  placedStamps: PlacedStamp[];
}

export type JournalColor = string;

export interface JournalSettings {
  userName: string;
  coverColor: JournalColor;
  coverImage?: string; // Optional image URL for cover if customized
}

export type ActiveScreen =
  | 'home'
  | 'writing'
  | 'stamps'
  | 'stamp-designer'
  | 'index'
  | 'bookmarks'
  | 'recents'
  | 'about';
