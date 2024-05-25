import { Toaster } from 'react-hot-toast';
import Layout from '@/app/components/Layout';
import ContactSection from '@/app/components/Sections/ContactSection';

export default function Home() {
  return (
    <Layout>
      <Toaster />
      <ContactSection />
    </Layout>
  );
}
