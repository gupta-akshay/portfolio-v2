import { render, screen } from '@testing-library/react';
import TypingAnimation from '../TypingAnimation';
import Typed from 'typed.js';

// Mock typed.js
jest.mock('typed.js');

describe('#TypingAnimation', () => {
  it('renders the typing animation container', () => {
    render(<TypingAnimation />);
    const typingElement = screen.getByTestId('typing-animation');

    expect(typingElement).toBeInTheDocument();
    expect(typingElement).toHaveClass('subtitle', 'subtitle-typed');
    expect(typingElement).toHaveAttribute('id', 'type-it');
  });

  it('initializes and cleans up Typed instance', () => {
    const mockDestroy = jest.fn();
    const MockTyped = jest.requireMock('typed.js') as jest.MockedClass<
      typeof Typed,
    >;

    MockTyped.mockImplementation((elementId: any, options: any) => {
      return { destroy: mockDestroy } as unknown as Typed;
    });

    const { unmount } = render(<TypingAnimation />);

    // Verify Typed was initialized with correct options
    expect(MockTyped).toHaveBeenCalledWith(expect.any(HTMLElement), {
      strings: [
        'a Passionate Full Stack Developer',
        'an Electronic Music Producer',
        'a Hobbyist DJ',
        'an Enthusiastic Traveller',
        'an Avid Gamer',
      ],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      smartBackspace: true,
      loop: true,
      showCursor: true,
    });

    // Test cleanup
    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });
});
