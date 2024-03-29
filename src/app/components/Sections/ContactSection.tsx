'use client';

import { FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMap,
  faMailForward,
  faMobile,
} from '@fortawesome/free-solid-svg-icons';

export default function ContactSection() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
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
              <h4>What&apos;s your story? Contact me.</h4>
              <p>
                Always available for freelancing if the right project comes
                along. Available to discuss if you have any full-time
                opportunity as well. Feel free to contact me.
              </p>
              <ul>
                <li className='media'>
                  <FontAwesomeIcon icon={faMap} />
                  <span className='media-body'>
                    Currently living in Ujjain, Madhya Pradesh
                  </span>
                </li>
                <li className='media'>
                  <FontAwesomeIcon icon={faMailForward} />
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
                        placeholder='Name...'
                        className='form-control'
                        type='text'
                        required
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <input
                        name='email'
                        id='email'
                        placeholder='Email...'
                        className='form-control'
                        type='email'
                        required
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <input
                        name='subject'
                        id='subject'
                        placeholder='Subject...'
                        className='form-control'
                        type='text'
                        required
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <textarea
                        name='message'
                        id='message'
                        placeholder='Your message...'
                        className='form-control'
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='send'>
                      <input
                        className='px-btn px-btn-theme'
                        type='submit'
                        value='Send Message'
                      />
                    </div>
                    {/* TODO - Add spans for success/failure message */}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='col-12'>
            <div className='google-map'>
              <div className='embed-responsive embed-responsive-21by9'>
                <iframe
                  title='map'
                  className='embed-responsive-item'
                  referrerPolicy='no-referrer-when-downgrade'
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58688.52668488091!2d75.79722045!3d23.16899865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82abdf7899d412!2sUjjain%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1656359717223!5m2!1sen!2sin'
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
