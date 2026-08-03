'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { logger } from '@/app/utils/logger';

const FIELDS = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Full name',
    type: 'text',
    width: 'col-md-6',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    width: 'col-md-6',
  },
  {
    name: 'subject',
    label: 'Subject',
    placeholder: 'What is this regarding?',
    type: 'text',
    width: 'col-md-12',
  },
] as const;

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function ContactFormInteractive() {
  const [values, setValues] = useState(EMPTY);
  const [isSending, setIsSending] = useState(false);

  const update = (name: keyof typeof EMPTY, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  // The browser blocks submit until every `required` field is filled and the
  // address parses, so the input is well-formed by the time we get here. The
  // API route re-validates with zod regardless — that is the real boundary.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await toast.promise(
        (async () => {
          const response = await fetch('/api/sendMail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `HTTP error! status: ${response.status}`
            );
          }

          return response;
        })(),
        {
          loading: 'Sending Message...',
          success: () => {
            setValues(EMPTY);
            return 'Message sent successfully!';
          },
          error: (error: Error) =>
            error.message.includes('Too many requests')
              ? 'Too many requests. Please try again later.'
              : 'Some error occurred. Please try again!',
        },
        { success: { duration: 3000 } }
      );
    } catch (error) {
      logger.error('Error while submitting the form', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='contact-form route-shell'>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          {FIELDS.map((field) => (
            <div className={field.width} key={field.name}>
              <div className='form-group'>
                <label className='form-label' htmlFor={field.name}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  className='form-control'
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => update(field.name, e.target.value)}
                  disabled={isSending}
                  required
                />
              </div>
            </div>
          ))}

          <div className='col-md-12'>
            <div className='form-group'>
              <label className='form-label' htmlFor='message'>
                Message
              </label>
              <textarea
                id='message'
                name='message'
                className='form-control'
                placeholder='Your message'
                rows={5}
                value={values.message}
                onChange={(e) => update('message', e.target.value)}
                disabled={isSending}
                required
              />
            </div>
          </div>

          <div className='col-md-12'>
            <div className='send'>
              <button
                className='px-btn px-btn-theme'
                type='submit'
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
