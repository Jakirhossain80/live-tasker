import CTASection from '../../components/landing/CTASection'
import FeaturesSection from '../../components/landing/FeaturesSection'
import HeroSection from '../../components/landing/HeroSection'
import HowItWorksSection from '../../components/landing/HowItWorksSection'
import LandingFooter from '../../components/landing/LandingFooter'
import LandingNavbar from '../../components/landing/LandingNavbar'
import PricingSection from '../../components/landing/PricingSection'

function Landing() {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-950">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}

export default Landing
