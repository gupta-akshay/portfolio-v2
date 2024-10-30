import { render, waitFor, act, RenderResult } from '@testing-library/react';
import ParticlesBackground from '../ParticlesBackground';
import { initParticlesEngine } from '@tsparticles/react';

// Mock the Particles component and its dependencies
jest.mock('@tsparticles/react', () => {
  const MockParticles = ({ id, className }: any) => (
    <div data-testid='particles-component' id={id} className={className} />
  );

  return {
    __esModule: true,
    default: MockParticles,
    initParticlesEngine: jest.fn(() => Promise.resolve()),
    Particles: MockParticles,
  };
});

jest.mock('tsparticles', () => ({
  loadFull: jest.fn(() => Promise.resolve()),
}));

describe('ParticlesBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null initially', () => {
    const { container } = render(<ParticlesBackground />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders Particles component after initialization', async () => {
    let resolveInit: (value: unknown) => void;
    const initPromise = new Promise((resolve) => {
      resolveInit = resolve;
    });

    (initParticlesEngine as jest.Mock).mockImplementation(async (callback) => {
      await callback({});
      resolveInit(undefined);
    });

    let rendered: RenderResult = {} as RenderResult;

    // Wrap render in act
    await act(async () => {
      rendered = render(<ParticlesBackground />);
    });

    // Wait for initialization to complete
    await act(async () => {
      await initPromise;
    });

    expect(rendered.getByTestId('particles-component')).toBeInTheDocument();
  }, 10000);
});
