import { getYearsOfExperience } from '@/app/utils/helpers/format';
import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'Resume — Akshay Gupta, Senior Staff Engineer';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return renderOg({
    title: 'Resume',
    subtitle: 'Akshay Gupta',
    note: `Senior Staff Engineer · ${getYearsOfExperience()}+ Years Experience`,
    footer: 'akshaygupta.live/resume',
  });
}
