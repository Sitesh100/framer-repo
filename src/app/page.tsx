import Header from '../components/shared/Header'
import Hero from '../components/home/Hero'
import TrustedBrands from '../components/home/TrustedBrands'
import Features from '../components/home/Features'
import ContentGeneration from '../components/home/ContentGeneration'
import Testimonials from '../components/home/Testimonials'
import FAQ from '../components/home/FAQ'
import CTABanner from '../components/home/CTABanner'
import Newsletter from '../components/home/Newsletter'
import Footer from '../components/shared/Footer'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main >
        <div className="hero">
          <Hero />
        </div>
        <div className='max-w-6xl mx-auto'>
        <TrustedBrands />
        <Features />
        <ContentGeneration />
        {/* <Testimonials /> */}
        <FAQ />
        <CTABanner />
        <Newsletter />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Homepage