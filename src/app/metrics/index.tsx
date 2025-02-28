import React from 'react';
import GoogleAnalytics from '@/app/metrics/GoogleAnalytics';
import MicrosoftClarity from '@/app/metrics/MicrosoftClarity';

const Metrics: React.FC = () => {
  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
    </>
  );
};

export default Metrics;
