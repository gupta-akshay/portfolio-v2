import { render, screen } from '@testing-library/react';
import Skills from '../Skills';
import { getSkillsArray } from '@/app/utils';

// Mock the utils module
jest.mock('@/app/utils', () => ({
  getSkillsArray: jest.fn(() => [
    { id: 1, name: 'React', icon: 'fab fa-react' },
    { id: 2, name: 'TypeScript', icon: 'fab fa-typescript' },
    { id: 3, name: 'JavaScript', icon: 'fab fa-js' },
  ]),
}));

describe('#Skills', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the skills component', () => {
    const { container } = render(<Skills />);
    expect(container.querySelector('.skills')).toBeInTheDocument();
  });

  it('calls getSkillsArray', () => {
    render(<Skills />);
    expect(getSkillsArray).toHaveBeenCalled();
  });

  it('renders all skills from the array', () => {
    const { container } = render(<Skills />);
    const skills = container.querySelectorAll('.skills__pill');
    expect(skills).toHaveLength(3);
  });

  it('renders skills with correct names and icons', () => {
    render(<Skills />);

    // Check for React skill
    const reactSkill = screen.getByText('React');
    expect(reactSkill).toBeInTheDocument();
    expect(
      reactSkill.parentElement?.querySelector('.fab.fa-react')
    ).toBeInTheDocument();

    // Check for TypeScript skill
    const tsSkill = screen.getByText('TypeScript');
    expect(tsSkill).toBeInTheDocument();
    expect(
      tsSkill.parentElement?.querySelector('.fab.fa-typescript')
    ).toBeInTheDocument();

    // Check for JavaScript skill
    const jsSkill = screen.getByText('JavaScript');
    expect(jsSkill).toBeInTheDocument();
    expect(
      jsSkill.parentElement?.querySelector('.fab.fa-js')
    ).toBeInTheDocument();
  });

  it('renders skills with correct CSS classes', () => {
    const { container } = render(<Skills />);
    const skillPills = container.querySelectorAll('.skills__pill');

    skillPills.forEach((pill) => {
      expect(pill).toHaveClass('skills__pill');
      const icon = pill.querySelector('i');
      if (icon) {
        expect(icon).toHaveClass('skills__pill--icon');
      }
    });
  });
});
