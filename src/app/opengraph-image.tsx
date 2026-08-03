import { getYearsOfExperience } from '@/app/utils/helpers/format';
import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'Akshay Gupta - Senior Staff Engineer at PeopleGrove';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    title: 'Akshay Gupta',
    plainTitle: true,
    subtitle: 'Senior Staff Engineer',
    subtitleColor: '#fbbf24',
    note: `${getYearsOfExperience()}+ years building reliable web platforms and products`,
    footer: 'akshaygupta.live',
  });
}
