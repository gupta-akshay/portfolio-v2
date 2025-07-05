'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faInbox, faMobile } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useForm } from '@tanstack/react-form';

import Layout from '@/app/components/Layout';

export default function Contact() {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

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
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
    <Layout>
      <Toaster />
      <section
        id='contact'
        data-nav-tooltip='Contact Me'
        className='pp-section pp-scrollable section dark-bg'
      >
        <div className='container'>
          <div className='title'>
            <h3>Get in touch.</h3>
          </div>
          <div className='row'>
            <div className='col-lg-5 col-xl-4 m-15px-tb'>
              <div className='contact-info'>
                <h4>Let&apos;s Connect. Share your vision.</h4>
                <p>
                  I&apos;m here for collaboration and opportunities. Whether
                  it&apos;s a game-changing project or an exciting full-time
                  role, let&apos;s talk.
                </p>
                <ul>
                  <li className='media'>
                    <FontAwesomeIcon icon={faMap as IconProp} fontSize={20} />
                    <span className='media-body'>
                      Ujjain, Madhya Pradesh, India
                    </span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faInbox as IconProp} />
                    <span className='media-body'>contact@akshaygupta.live</span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faMobile as IconProp} />
                    <span className='media-body'>+91 88199 45982</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-7 col-xl-8 m-15px-tb'>
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
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                              <input
                                id='email'
                                placeholder='Your Email'
                                className={`form-control${field.state.meta.errors.length ? ' invalid' : ''}`}
                                type='email'
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                              !value?.trim()
                                ? 'Subject is required'
                                : undefined,
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
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
                              !value?.trim()
                                ? 'Message is required'
                                : undefined,
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
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
            </div>
            <div className='col-12'>
              <div className='google-map'>
                <div className='embed-responsive embed-responsive-21by9'>
                  {mapLoaded ? (
                    <iframe
                      loading='lazy'
                      title='map'
                      className='embed-responsive-item'
                      referrerPolicy='no-referrer-when-downgrade'
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58688.52668488091!2d75.79722045!3d23.16899865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82abdf7899d412!2sUjjain%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1656359717223!5m2!1sen!2sin'
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
