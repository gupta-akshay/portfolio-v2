import { getSkillsArray, formatDate } from '../index';

describe('#getSkillsArray', () => {
  it('should return an array of skill objects', () => {
    const skills = getSkillsArray();

    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);

    // Test structure of first skill object
    const firstSkill = skills[0];
    expect(firstSkill).toHaveProperty('id');
    expect(firstSkill).toHaveProperty('name');
    expect(firstSkill).toHaveProperty('icon');
  });
});

describe('#formatDate', () => {
  it('should format date string correctly', () => {
    const testDate = '2024-03-20T10:30:00Z';
    const formattedDate = formatDate(testDate);

    expect(formattedDate).toBe('20/Mar/2024');
  });

  it('should handle different date inputs', () => {
    const dates = [
      { input: '2023-01-01T00:00:00Z', expected: '01/Jan/2023' },
      { input: '2024-12-31T23:59:59Z', expected: '31/Dec/2024' },
    ];

    dates.forEach(({ input, expected }) => {
      expect(formatDate(input)).toBe(expected);
    });
  });
});
