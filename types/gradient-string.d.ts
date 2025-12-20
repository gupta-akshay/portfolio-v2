declare module 'gradient-string' {
  type GradientMode = 'rgb' | 'hsv';

  interface GradientOptions {
    interpolation?: GradientMode;
    colorSpace?: GradientMode;
    hsvSpin?: 'short' | 'long';
  }

  interface MultilineOptions extends GradientOptions {
    newline?: string;
    trim?: boolean;
  }

  interface GradientFunction {
    (text: string | number, options?: GradientOptions): string;
    multiline(text: string | number, options?: MultilineOptions): string;
    colors: string[];
  }

  interface GradientConstructor {
    (...colors: string[]): GradientFunction;
    (colors: string[]): GradientFunction;
    map(colors: string[], options?: GradientOptions): GradientFunction;
    create(colors: string[]): GradientFunction;
    multiline(text: string | number, options?: MultilineOptions): string;
    rainbow(text: string | number, options?: GradientOptions): string;
    pastel(text: string | number, options?: GradientOptions): string;
    instagram(text: string | number, options?: GradientOptions): string;
    atlas(text: string | number, options?: GradientOptions): string;
    retro(text: string | number, options?: GradientOptions): string;
    summer(text: string | number, options?: GradientOptions): string;
    vice(text: string | number, options?: GradientOptions): string;
    passion(text: string | number, options?: GradientOptions): string;
    fruit(text: string | number, options?: GradientOptions): string;
    fire(text: string | number, options?: GradientOptions): string;
    ocean(text: string | number, options?: GradientOptions): string;
    crystal(text: string | number, options?: GradientOptions): string;
    valley(text: string | number, options?: GradientOptions): string;
    midnight(text: string | number, options?: GradientOptions): string;
    time(text: string | number, options?: GradientOptions): string;
    morning(text: string | number, options?: GradientOptions): string;
    teenage(text: string | number, options?: GradientOptions): string;
    rainbow: GradientFunction;
    pastel: GradientFunction;
    instagram: GradientFunction;
    atlas: GradientFunction;
    retro: GradientFunction;
    summer: GradientFunction;
    vice: GradientFunction;
    passion: GradientFunction;
    fruit: GradientFunction;
    fire: GradientFunction;
    ocean: GradientFunction;
    crystal: GradientFunction;
    valley: GradientFunction;
    midnight: GradientFunction;
    time: GradientFunction;
    morning: GradientFunction;
    teenage: GradientFunction;
  }

  const gradient: GradientConstructor;
  export default gradient;
}

