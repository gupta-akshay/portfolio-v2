import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      id='not-found'
      data-nav-tooltip='not-found'
      className='pp-section pp-scrollable'
    >
      <div className='not-found'>
        <div className='container'>
          <div className='col-12 d-flex flex-column justify-content-center align-items-center not-found-content'>
            <h2>Are you lost?</h2>
            <p>Could not find what you were looking for!</p>
            <Link href='/' className='px-btn px-btn-theme'>
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
