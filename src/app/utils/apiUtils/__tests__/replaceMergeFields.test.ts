import { replaceMergeFields } from '../replaceMergeFields';

describe('#replaceMergeFields', () => {
  const testTemplate =
    'Hello {{name}}, your email is {{email}}. Subject: {{subject}}. Message: {{message}}';

  it('should replace all merge fields correctly', () => {
    const mergeFields = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };

    const result = replaceMergeFields({
      messageString: testTemplate,
      mergeFields,
    });

    expect(result).toBe(
      'Hello John Doe, your email is john@example.com. Subject: Test Subject. Message: Test Message'
    );
  });

  it('should handle missing optional fields', () => {
    const mergeFields = {
      name: 'John Doe',
    };

    const result = replaceMergeFields({
      messageString: testTemplate,
      mergeFields,
    });

    expect(result).toBe('Hello John Doe, your email is . Subject: . Message: ');
  });

  it('should replace multiple occurrences of the same merge field', () => {
    const template = '{{name}} {{name}} {{name}}';
    const mergeFields = {
      name: 'John',
    };

    const result = replaceMergeFields({
      messageString: template,
      mergeFields,
    });

    expect(result).toBe('John John John');
  });
});
