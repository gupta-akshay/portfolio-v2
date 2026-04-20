'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import toast from 'react-hot-toast';
import { logger } from '@/app/utils/logger';

export default function ContactFormInteractive() {
  const [isSending, setIsSending] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      setIsSending(true);
      try {
        await toast.promise(
          (async () => {
            const response = await fetch('/api/sendMail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(value),
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
              form.reset();
              setIsSending(false);
              return 'Message sent successfully!';
            },
            error: (error) => {
              setIsSending(false);
              // Handle specific error messages
              if (error.message.includes('Too many requests')) {
                return 'Too many requests. Please try again later.';
              }
              return 'Some error occurred. Please try again!';
            },
          },
          {
            success: {
              duration: 3000,
            },
          }
        );
      } catch (error) {
        logger.error('Error while submitting the form', error);
        setIsSending(false);
      }
    },
  });

  return (
    <div className='contact-form route-shell'>
      <h4>Tell me about your project</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className='row'>
          <div className='col-md-6'>
            <div className='form-group'>
              <form.Field
                name='name'
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? 'Name is required' : undefined,
                }}
              >
                {(field) => (
                  <>
                    <label className='form-label' htmlFor='name'>
                      Name
                    </label>
                    <input
                      id='name'
                      placeholder='Full name'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      type='text'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className='warning-text text-danger'>
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='form-group'>
              <form.Field
                name='email'
                validators={{
                  onChange: ({ value }) => {
                    if (!value?.trim()) return 'Email is required';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      return 'Invalid email address';
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <>
                    <label className='form-label' htmlFor='email'>
                      Email
                    </label>
                    <input
                      id='email'
                      placeholder='you@example.com'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      type='email'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className='warning-text text-danger'>
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='form-group'>
              <form.Field
                name='subject'
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? 'Subject is required' : undefined,
                }}
              >
                {(field) => (
                  <>
                    <label className='form-label' htmlFor='subject'>
                      Subject
                    </label>
                    <input
                      id='subject'
                      placeholder='What is this regarding?'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      type='text'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className='warning-text text-danger'>
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='form-group'>
              <form.Field
                name='message'
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? 'Message is required' : undefined,
                }}
              >
                {(field) => (
                  <>
                    <label className='form-label' htmlFor='message'>
                      Message
                    </label>
                    <textarea
                      id='message'
                      placeholder='Your message'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      rows={5}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className='warning-text text-danger'>
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <div className='col-md-12'>
            <div className='send'>
              <form.Subscribe>
                {(state) => (
                  <button
                    className='px-btn px-btn-theme'
                    type='submit'
                    disabled={!state.canSubmit || isSending}
                  >
                    {isSending ? 'Sending...' : 'Submit'}
                  </button>
                )}
              </form.Subscribe>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
