import Header from '../components/Header';
import HomePage from './Project/components/HomePage';
import ProjectPage from './Project/components/ProjectPage';
import Footer from '../components/Footer';
import ProductPage from './Project/components/ProductPage';

const Project = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HomePage />
      <ProductPage />
      <ProjectPage />
      <Footer />
    </div>
  );
};

export default Project;
