import { render, screen } from '@testing-library/react';
import BlogImage from '../BlogImage';

// Mock the Sanity image URL builder
jest.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    fit: () => ({
      auto: () => ({
        url: () => 'https://test-image.com/image.jpg',
      }),
    }),
  }),
}));

// Mock the Sanity asset utils
jest.mock('@sanity/asset-utils', () => ({
  getImageDimensions: () => ({ width: 800, height: 600 }),
}));

describe('#BlogImage', () => {
  const mockValue = {
    alt: 'Test image',
    // Minimal mock of a Sanity image asset
    asset: {
      _ref: 'image-123',
    },
  };

  it('renders image with default props', () => {
    render(<BlogImage value={mockValue} />);

    const image = screen.getByRole('img', { name: 'Test image' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('width', '800');
    expect(image).toHaveAttribute('height', '600');
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining(
        encodeURIComponent('https://test-image.com/image.jpg')
      )
    );
  });

  it('renders author image with specific dimensions', () => {
    render(<BlogImage value={mockValue} isAuthor={true} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '45');
    expect(image).toHaveAttribute('height', '45');
  });

  it('uses default alt text when not provided', () => {
    const valueWithoutAlt = { asset: { _ref: 'image-123' } };
    render(<BlogImage value={valueWithoutAlt} />);

    const image = screen.getByRole('img', { name: 'blog image' });
    expect(image).toBeInTheDocument();
  });

  it('applies correct styles for tile image', () => {
    render(<BlogImage value={mockValue} isTileImage={true} />);

    const image = screen.getByRole('img');
    expect(image).toHaveStyle({ objectFit: 'cover' });
  });

  it('applies correct styles for inline image', () => {
    render(<BlogImage value={mockValue} isInline={true} />);

    const image = screen.getByRole('img');
    expect(image.style.display).toBe('inline-block');
    expect(image.style.aspectRatio).toBe('800 / 600');
    expect(image.style.objectFit).toBe('cover');
  });

  it('has lazy loading attribute', () => {
    render(<BlogImage value={mockValue} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('has blog-image class', () => {
    render(<BlogImage value={mockValue} />);

    const image = screen.getByRole('img');
    expect(image).toHaveClass('blog-image');
  });
});
