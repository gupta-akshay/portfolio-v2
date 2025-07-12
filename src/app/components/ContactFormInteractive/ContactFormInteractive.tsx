'use client';

import { useRef, useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'react-hot-toast';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

export default function ContactFormInteractive() {
  const [isSending, setIsSending] = useState(false);
  const { addCursorInteraction } = useCursorInteractions();

  // Form field refs
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Add cursor interactions for form elements
  useEffect(() => {
    if (nameRef.current) {
      addCursorInteraction(nameRef.current, {
        onHover: 'text',
        onText: 'Enter your full name',
        onClick: 'click',
      });
    }

    if (emailRef.current) {
      addCursorInteraction(emailRef.current, {
        onHover: 'text',
        onText: 'Enter your email address',
        onClick: 'click',
      });
    }

    if (subjectRef.current) {
      addCursorInteraction(subjectRef.current, {
        onHover: 'text',
        onText: 'What is this about?',
        onClick: 'click',
      });
    }

    if (messageRef.current) {
      addCursorInteraction(messageRef.current, {
        onHover: 'text',
        onText: 'Tell me more details',
        onClick: 'click',
      });
    }

    if (submitRef.current) {
      addCursorInteraction(submitRef.current, {
        onHover: 'hover',
        onText: 'Send your message',
        onClick: 'click',
      });
    }

    return undefined;
  }, [addCursorInteraction]);

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
        console.error('Error while submitting the form', error);
        setIsSending(false);
      }
    },
  });

  return (
    <div className='contact-form'>
      <h4>Send your message here</h4>
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
                    <input
                      id='name'
                      placeholder='Full Name'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      type='text'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                      ref={nameRef}
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
                    <input
                      id='email'
                      placeholder='Your Email'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      type='email'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                      ref={emailRef}
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
                    <input
                      id='subject'
                      placeholder='Email Subject'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      type='text'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                      ref={subjectRef}
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
                    <textarea
                      id='message'
                      placeholder='Write Your Message'
                      className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                      rows={5}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isSending}
                      ref={messageRef}
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
                    ref={submitRef}
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
