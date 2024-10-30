import Image from 'next/image';
import { render, screen } from '@testing-library/react';
import BlogTile from '../BlogTile';
import { Blog } from '@/sanity/types/blog';

// Mock the BlogImage component
jest.mock('@/app/components/BlogImage', () => {
  return function MockBlogImage({ value }: { value: any }) {
    return (
      <Image
        src='/mock-image.jpg'
        alt={value.alt || 'mock image'}
        width={500}
        height={300}
      />
    );
  };
});

// Mock the formatDate utility to return the actual format used in the component
jest.mock('@/app/utils', () => ({
  formatDate: (date: string) => '20/Mar/2024',
}));

describe('BlogTile', () => {
  const mockBlog: Blog = {
    _id: 'mock-id',
    title: 'Test Blog Post',
    slug: {
      current: 'test-blog-post',
      _type: 'slug',
    },
    mainImage: {
      _type: 'image',
      alt: 'Test Image',
      asset: {
        _ref: 'image-123',
        _type: 'reference',
      },
    },
    publishedAt: '2024-03-20T12:00:00Z',
    categories: [
      { title: 'Technology', slug: { current: 'technology', _type: 'slug' } },
      { title: 'Programming', slug: { current: 'programming', _type: 'slug' } },
    ],
    author: {
      name: 'Test Author',
      slug: { current: 'test-author', _type: 'slug' },
      _id: 'author-1',
      image: {
        _type: 'image',
        asset: {
          _ref: 'image-author-123',
          _type: 'reference',
        },
      },
      bio: [],
    },
    body: [],
  };

  it('renders blog tile with correct structure', () => {
    render(<BlogTile blog={mockBlog} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('20/Mar/2024')).toBeInTheDocument();
  });

  it('renders correct link URLs', () => {
    render(<BlogTile blog={mockBlog} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/blog/test-blog-post');
    });
  });

  it('displays all categories with hashtags', () => {
    render(<BlogTile blog={mockBlog} />);

    expect(screen.getByText('#Technology')).toBeInTheDocument();
    expect(screen.getByText('#Programming')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<BlogTile blog={mockBlog} />);

    expect(screen.getByText('20/Mar/2024')).toBeInTheDocument();
  });

  it('renders blog image with correct props', () => {
    render(<BlogTile blog={mockBlog} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('applies correct CSS classes', () => {
    render(<BlogTile blog={mockBlog} />);

    expect(screen.getByTestId('blog-tile')).toHaveClass(
      'col-md-6',
      'm-15px-tb'
    );
    expect(screen.getByTestId('blog-grid')).toHaveClass('blog-grid');
    expect(screen.getByTestId('blog-img')).toHaveClass('blog-img');
    expect(screen.getByTestId('blog-info')).toHaveClass('blog-info');
  });
});
