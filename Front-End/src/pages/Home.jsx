import Header from '../components/Header';
import AboutPage from './Home/components/AboutPage';
import HomePage from './Home/components/HomePage';
import ProjectPage from './Home/components/ProjectPage';
import PartnershipPage from './Home/components/PartnershipPage';
import ClientPage from './Home/components/ClientPage';
import Footer from '../components/Footer';
import ProductPage from './Home/components/ProductPage';

const Home = () => {
  return (
    <>
      {/* 🌙 Konten utama */}
      <div className="min-h-screen">
        <Header />
        <HomePage />
        <AboutPage />
        <ProductPage />
        <ProjectPage />
        <PartnershipPage />
        <ClientPage />
        <Footer />
      </div>
    </>
  );
};

export default Home;
