import { Toaster } from 'react-hot-toast';
import Layout from '@/app/components/Layout';
import HomeSection from '@/app/components/Sections/HomeSection';

export default function Home() {
  return (
    <Layout>
      <Toaster />
      <HomeSection />
    </Layout>
  );
}
