import htmlString from '../userEmailHTML';

describe('#userEmailHTML', () => {
  it('should export a non-empty HTML string', () => {
    expect(typeof htmlString).toBe('string');
    expect(htmlString.length).toBeGreaterThan(0);
  });

  it('should contain required merge field', () => {
    expect(htmlString).toContain('{{name}}');
  });

  it('should contain social media links', () => {
    const socialLinks = [
      'https://www.instagram.com/dja_shay',
      'https://www.linkedin.com/in/akshayguptaujn/',
      'https://akshaygupta.live/',
    ];

    socialLinks.forEach((link) => {
      expect(htmlString).toContain(link);
    });
  });

  it('should be valid HTML structure', () => {
    expect(htmlString).toMatch(/<!DOCTYPE html/);
    expect(htmlString).toMatch(/<html[^>]*>/);
    expect(htmlString).toMatch(/<\/html>/);
    expect(htmlString).toMatch(/<body[^>]*>/);
    expect(htmlString).toMatch(/<\/body>/);
  });
});
