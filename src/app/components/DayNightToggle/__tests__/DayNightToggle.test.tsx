import { render, screen, fireEvent } from '@testing-library/react';
import DayNightToggle from '../DayNightToggle';

describe('#DayNightToggle', () => {
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key],
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  beforeEach(() => {
    localStorageMock.clear();
    document.body.classList.remove('theme-light');
  });

  it('renders with initial dark mode when no theme is stored', () => {
    render(<DayNightToggle />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-label', 'switch to light mode');
    expect(document.body.classList.contains('theme-light')).toBeFalsy();
  });

  it('renders with light mode when theme-light is stored', () => {
    localStorage.setItem('theme', 'theme-light');
    render(<DayNightToggle />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-label', 'switch to dark mode');
    expect(document.body.classList.contains('theme-light')).toBeTruthy();
  });

  it('toggles theme when clicked', () => {
    render(<DayNightToggle />);
    const toggle = screen.getByRole('button');

    // Initial state (dark mode)
    expect(toggle).toHaveAttribute('aria-label', 'switch to light mode');
    expect(document.body.classList.contains('theme-light')).toBeFalsy();

    // Click to switch to light mode
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-label', 'switch to dark mode');
    expect(document.body.classList.contains('theme-light')).toBeTruthy();
    expect(localStorage.getItem('theme')).toBe('theme-light');

    // Click to switch back to dark mode
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-label', 'switch to light mode');
    expect(document.body.classList.contains('theme-light')).toBeFalsy();
    expect(localStorage.getItem('theme')).toBe('theme-dark');
  });
});
