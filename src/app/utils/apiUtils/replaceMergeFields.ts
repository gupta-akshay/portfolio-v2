type MergeFields = {
  name: string;
  email?: string;
  subject?: string;
  message?: string;
};

export const replaceMergeFields = ({
  messageString,
  mergeFields: { name = '', email = '', subject = '', message = '' },
}: {
  messageString: string;
  mergeFields: MergeFields;
}): string => {
  const mergeTags = [
    {
      tag: '{{name}}',
      value: name,
    },
    {
      tag: '{{email}}',
      value: email,
    },
    {
      tag: '{{subject}}',
      value: subject,
    },
    {
      tag: '{{message}}',
      value: message,
    },
  ];

  return mergeTags.reduce((updatedMessage, { tag, value }) => {
    return updatedMessage.replace(new RegExp(tag, 'g'), value);
  }, messageString);
};
