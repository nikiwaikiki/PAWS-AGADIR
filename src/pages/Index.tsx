import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DonationSection from "@/components/DonationSection";
import { ArrowRight, Heart, Shield, AlertTriangle, Dog, Syringe, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsHelper } from "@/hooks/useHelperApplication";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  to,
  borderColor,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  borderColor: string;
}) => (
  <Link to={to} className="group">
    <div
      className={`glass-card rounded-xl p-5 sm:p-6 h-full flex flex-col items-start gap-3 transition-all duration-200 border-l-4 ${borderColor} hover:shadow-medium`}
    >
      <div className="p-2 rounded-lg bg-secondary">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <h3 className="font-sans font-semibold text-foreground text-sm sm:text-base">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
        {title} <ArrowRight className="w-3 h-3" />
      </span>
    </div>
  </Link>
);

const Index = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: isHelper } = useIsHelper(user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Mission / What We Do */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              {t('landing.mission.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
              {t('landing.mission.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Teasers */}
      <section className="py-12 sm:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              {t('landing.features.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={Dog}
              title={t('landing.features.taggedDogs.title')}
              description={t('landing.features.taggedDogs.description')}
              to="/dogs"
              borderColor="border-safe"
            />
            <FeatureCard
              icon={AlertTriangle}
              title={t('landing.features.sos.title')}
              description={t('landing.features.sos.description')}
              to="/add?type=sos"
              borderColor="border-destructive"
            />
            <FeatureCard
              icon={Syringe}
              title={t('landing.features.reportStray.title')}
              description={t('landing.features.reportStray.description')}
              to="/add"
              borderColor="border-warning"
            />
            <FeatureCard
              icon={Heart}
              title={t('landing.features.adopt.title')}
              description={t('landing.features.adopt.description')}
              to="/adoption"
              borderColor="border-primary"
            />
          </div>
        </div>
      </section>

      {/* Report Types (how you can help) */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              {t('reportTypes.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('reportTypes.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-4 sm:p-6 text-center animate-fade-in border-l-4 border-safe">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-safe mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{t('reportTypes.save.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('reportTypes.save.description')}</p>
            </div>
            <div className="glass-card rounded-xl p-4 sm:p-6 text-center animate-fade-in border-l-4 border-destructive">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{t('reportTypes.sos.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('reportTypes.sos.description')}</p>
            </div>
            <div className="glass-card rounded-xl p-4 sm:p-6 text-center animate-fade-in border-l-4 border-warning">
              <Dog className="w-6 h-6 sm:w-8 sm:h-8 text-warning mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{t('reportTypes.stray.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('reportTypes.stray.description')}</p>
            </div>
            <div className="glass-card rounded-xl p-4 sm:p-6 text-center animate-fade-in border-l-4 border-accent">
              <Syringe className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{t('reportTypes.vaccination.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('reportTypes.vaccination.description')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 px-4">
            <Link to="/add">
              <Button variant="default" className="gap-2 w-full sm:w-auto">
                <Heart className="w-4 h-4" />
                {t('hero.reportAnimal')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/info">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Info className="w-4 h-4" />
                {t('landing.learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Teaser */}
      <DonationSection />

      {/* Become a Helper Section (only for logged-in non-helpers) */}
      {user && !isHelper && (
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-xl p-6 sm:p-8 text-center max-w-2xl mx-auto animate-fade-in">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 text-balance">
                {t('helperCta.title')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 text-pretty">
                {t('helperCta.description')}
              </p>
              <Link to="/become-helper">
                <Button className="gap-2">
                  <Heart className="w-4 h-4" />
                  {t('helperCta.apply')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="Save The Paws" className="h-8 sm:h-10 w-auto" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {'\u00A9'} {new Date().getFullYear()} Niklas Schlichting
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
