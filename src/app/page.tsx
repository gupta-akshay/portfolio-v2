import Layout from '@/app/components/Layout';
import HomeSection from '@/app/components/Sections/HomeSection';
import AboutSection from '@/app/components/Sections/AboutSection';

export default function Home() {
  return (
    <Layout>
      <HomeSection />
      <AboutSection />
    </Layout>
  );
}
