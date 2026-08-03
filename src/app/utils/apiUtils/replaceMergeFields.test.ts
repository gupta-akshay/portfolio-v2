// Run with: node --test src/app/utils/apiUtils/replaceMergeFields.test.ts
// Guards the contact form's escaping: these values are interpolated straight
// into an HTML email body.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml, replaceMergeFields } from './replaceMergeFields.ts';

test('escapeHtml neutralises markup', () => {
  assert.equal(
    escapeHtml(`<script>alert("x" & 'y')</script>`),
    '&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;'
  );
  assert.equal(escapeHtml('&lt;'), '&amp;lt;', 'ampersand escaped first');
  assert.equal(escapeHtml('plain text'), 'plain text');
});

test('replaceMergeFields substitutes every tag', () => {
  assert.equal(
    replaceMergeFields({
      messageString: '{{name}} <{{email}}> {{subject}}: {{message}}',
      mergeFields: {
        name: 'Ada',
        email: 'ada@example.com',
        subject: 'Hi',
        message: 'Hello',
      },
    }),
    'Ada <ada@example.com> Hi: Hello'
  );
});

test('missing and unknown tags collapse to empty', () => {
  assert.equal(
    replaceMergeFields({
      messageString: '[{{name}}][{{subject}}][{{nope}}]',
      mergeFields: { name: 'Ada' },
    }),
    '[Ada][][]'
  );
});

test('a substituted value is not itself treated as a template', () => {
  assert.equal(
    replaceMergeFields({
      messageString: '{{name}}',
      mergeFields: { name: '{{message}}', message: 'leaked' },
    }),
    '{{message}}'
  );
});
