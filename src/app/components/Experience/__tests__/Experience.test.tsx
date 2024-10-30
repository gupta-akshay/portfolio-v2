import { render, screen } from '@testing-library/react';
import Experience from '../Experience';
import data from '../data';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img alt={props.alt || ''} {...props} />,
}));

describe('#Experience', () => {
  it('renders the Experience title', () => {
    render(<Experience />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('renders all experience entries from data', () => {
    render(<Experience />);

    data.forEach((experience) => {
      // Check if role is rendered
      expect(screen.getByText(experience.role)).toBeInTheDocument();

      // Check if company info is rendered
      const companyInfo = `${experience.company} | ${experience.location} | ${experience.timeInRole}`;
      expect(screen.getByText(companyInfo)).toBeInTheDocument();

      // Check if employment type is rendered
      const fullTimeElements = screen.getAllByText('Full Time');
      expect(fullTimeElements.length).toBeGreaterThan(0);

      // Check if company logo images are rendered with correct props
      const images = screen.getAllByAltText('Company Logo');
      const matchingImage = images.find(
        (img) => img.getAttribute('src') === experience.imgSrc
      );
      expect(matchingImage).toBeInTheDocument();
      expect(matchingImage).toHaveAttribute('width', '120');
      expect(matchingImage).toHaveAttribute('height', '120');

      // Find the specific experience container for this entry
      const experienceTitle = screen.getByText(experience.role);
      const experienceContainer = experienceTitle.closest('.experience-row');
      const responsibilitiesContainer = experienceContainer?.querySelector(
        '.experience-row--right__content'
      );

      expect(responsibilitiesContainer?.innerHTML).toContain(
        experience.responsibilities
      );
    });
  });

  it('renders correct number of experience entries', () => {
    render(<Experience />);
    const experienceRows = screen.getAllByRole('heading', { level: 6 });
    expect(experienceRows).toHaveLength(data.length);
  });
});
