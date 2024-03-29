import { Toaster } from 'react-hot-toast';
import Layout from '@/app/components/Layout';
import HomeSection from '@/app/components/Sections/HomeSection';
import AboutSection from '@/app/components/Sections/AboutSection';
import ContactSection from '@/app/components/Sections/ContactSection';

export default function Home() {
  return (
    <Layout>
      <Toaster />
      <HomeSection />
      <AboutSection />
      <ContactSection />
    </Layout>
  );
}
