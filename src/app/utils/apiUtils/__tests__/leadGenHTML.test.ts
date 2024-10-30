import htmlString from '../leadGenHTML';

describe('#leadGenHTML', () => {
  it('should export a non-empty HTML string', () => {
    expect(typeof htmlString).toBe('string');
    expect(htmlString.length).toBeGreaterThan(0);
  });

  it('should contain required merge fields', () => {
    const requiredFields = [
      '{{name}}',
      '{{email}}',
      '{{subject}}',
      '{{message}}',
    ];

    requiredFields.forEach((field) => {
      expect(htmlString).toContain(field);
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
