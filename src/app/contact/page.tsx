'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faInbox, faMobile } from '@fortawesome/free-solid-svg-icons';
import Layout from '@/app/components/Layout';

const emailRegex = /\S+@\S+\.\S+/;

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ErrorMap {
  name: boolean;
  email: boolean;
  subject: boolean;
  message: boolean;
}

export default function Contact() {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errorMap, setErrorMap] = useState<ErrorMap>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrorMap((prev) => ({
        ...prev,
        [name]:
          name === 'email'
            ? value.length > 0 &&
              (!emailRegex.test(value) || value.trim().length === 0)
            : value.trim().length === 0,
      }));
    },
    []
  );

  const resetFormState = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrorMap({
      name: false,
      email: false,
      subject: false,
      message: false,
    });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await toast.promise(
        fetch('/api/sendMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }),
        {
          loading: 'Sending Message...',
          success: () => {
            resetFormState();
            setIsSending(false);
            return 'Message sent successfully!';
          },
          error: () => {
            setIsSending(false);
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
  };

  const isButtonDisabled =
    Object.values(errorMap).some((value) => value) ||
    Object.values(formData).some((value) => value.trim().length === 0);

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
                    <FontAwesomeIcon icon={faMap} fontSize={20} />
                    <span className='media-body'>
                      Ujjain, Madhya Pradesh, India
                    </span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faInbox} />
                    <span className='media-body'>contact@akshaygupta.live</span>
                  </li>
                  <li className='media'>
                    <FontAwesomeIcon icon={faMobile} />
                    <span className='media-body'>+91 88199 45982</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-lg-7 col-xl-8 m-15px-tb'>
              <div className='contact-form'>
                <h4>Send your message here</h4>
                <form id='contact-form' onSubmit={onSubmit}>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <input
                          name='name'
                          id='name'
                          placeholder='Full Name'
                          className={`form-control${errorMap.name ? ' invalid' : ''}`}
                          type='text'
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isSending}
                          required
                        />
                        <span
                          className='warning-text text-danger'
                          style={{ display: errorMap.name ? 'block' : 'none' }}
                        >
                          The name is invalid.
                        </span>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <input
                          name='email'
                          id='email'
                          placeholder='Your Email'
                          className={`form-control${errorMap.email ? ' invalid' : ''}`}
                          type='text'
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSending}
                          required
                        />
                        <span
                          className='warning-text text-danger'
                          style={{ display: errorMap.email ? 'block' : 'none' }}
                        >
                          The email is invalid.
                        </span>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <input
                          name='subject'
                          id='subject'
                          placeholder='Email Subject'
                          className={`form-control${errorMap.subject ? ' invalid' : ''}`}
                          type='text'
                          value={formData.subject}
                          onChange={handleInputChange}
                          disabled={isSending}
                          required
                        />
                        <span
                          className='warning-text text-danger'
                          style={{
                            display: errorMap.subject ? 'block' : 'none',
                          }}
                        >
                          The subject is invalid.
                        </span>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <textarea
                          name='message'
                          id='message'
                          placeholder='Write Your Message'
                          className={`form-control${errorMap.message ? ' invalid' : ''}`}
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          disabled={isSending}
                          required
                        />
                        <span
                          className='warning-text text-danger'
                          style={{
                            display: errorMap.message ? 'block' : 'none',
                          }}
                        >
                          The message is invalid.
                        </span>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='send'>
                        <button
                          className='px-btn px-btn-theme'
                          type='submit'
                          disabled={isButtonDisabled || isSending}
                        >
                          Submit
                        </button>
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
