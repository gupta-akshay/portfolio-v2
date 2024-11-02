import { render, screen, fireEvent } from '@testing-library/react';
import BackBtn from '../BackBtn';

const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('#BackBtn', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('renders back button with correct aria-label', () => {
    render(<BackBtn />);

    const backButton = screen.getByRole('button', { name: /go back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('renders FontAwesome arrow icon', () => {
    render(<BackBtn />);

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('calls router.back() when clicked', () => {
    render(<BackBtn />);

    const backButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
