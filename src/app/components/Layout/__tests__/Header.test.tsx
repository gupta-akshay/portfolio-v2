import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('#Header', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders the header with logo and navigation links', () => {
    render(<Header />);

    expect(screen.getByText('Akshay')).toBeInTheDocument();
    expect(screen.getByText('Akshay Gupta')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
    expect(screen.getByText('Contact Me')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Header />);

    const toggleButton = screen.getByLabelText('open menu');
    const headerElement = screen.getByTestId('header-left');
    expect(headerElement).not.toHaveClass('menu-open');

    fireEvent.click(toggleButton);
    expect(headerElement).toHaveClass('menu-open');
    expect(screen.getByLabelText('close menu')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(headerElement).not.toHaveClass('menu-open');
  });

  it('sets active section based on current pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    render(<Header />);

    const navItems = screen.getAllByRole('listitem');
    const aboutItem = navItems.find((item) =>
      item.textContent?.includes('About Me')
    );
    expect(aboutItem).toHaveClass('active');
  });

  it('renders social media links with correct attributes', () => {
    render(<Header />);

    const socialLinks = screen.getAllByRole('link', {
      name: /github|linkedin|instagram|facebook|soundcloud/i,
    });
    expect(socialLinks).toHaveLength(5);

    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('handles blog routes correctly', () => {
    (usePathname as jest.Mock).mockReturnValue('/blog/some-post');
    render(<Header />);

    const navItems = screen.getAllByRole('listitem');
    const blogItem = navItems.find((item) =>
      item.textContent?.includes('Blogs')
    );
    expect(blogItem).toHaveClass('active');
  });
});
