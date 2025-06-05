export interface WallpaperCardProps {
  id: string;
  name: string;
  url: string;
  description?: string;
  tags?: string[];
  author?: string;
  isSelected?: boolean;
  bentoLink?: string;
  backgroundImageLink?: string;
  theme?: string;
}
