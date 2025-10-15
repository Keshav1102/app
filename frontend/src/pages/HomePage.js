import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Upload, Pill, Heart, Stethoscope, Baby, ShieldCheck, Truck, Clock } from 'lucide-react';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = [
    { id: 'rx-medicines', name: 'Rx Medicines', icon: Pill, color: 'bg-[hsl(188_72%_38%)]' },
    { id: 'wellness', name: 'Wellness', icon: Heart, color: 'bg-[hsl(161_93%_24%)]' },
    { id: 'devices', name: 'Medical Devices', icon: Stethoscope, color: 'bg-[hsl(199_84%_55%)]' },
    { id: 'baby-care', name: 'Baby Care', icon: Baby, color: 'bg-[hsl(32_96%_45%)]' }
  ];

  const features = [
    { icon: ShieldCheck, title: 'Verified Pharmacists', description: 'All prescriptions reviewed by licensed professionals' },
    { icon: Truck, title: 'Fast Delivery', description: 'Free shipping on orders over $50' },
    { icon: Clock, title: '24/7 Support', description: 'Expert help whenever you need it' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="absolute inset-x-0 -top-20 h-[320px] bg-[radial-gradient(80%_60%_at_50%_0%,_rgba(199,240,227,0.65),_rgba(237,242,245,0.4)_60%,_transparent_100%)] pointer-events-none" aria-hidden="true" />
        
        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 data-testid="hero-heading" className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
              Your trusted online pharmacy
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Medicines, wellness products, and rapid prescription refills—delivered to your door with care.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <Button
                  size="lg"
                  onClick={() => navigate('/profile')}
                  data-testid="upload-prescription-cta"
                  className="shadow-[0_6px_14px_rgba(29,154,138,0.18)]"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Prescription
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  data-testid="upload-prescription-cta"
                  className="shadow-[0_6px_14px_rgba(29,154,138,0.18)]"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Prescription
                </Button>
              )}
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/catalog')}
                data-testid="shop-now-button"
              >
                Shop Now
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4" data-testid="trust-badges">
              <Badge variant="secondary" className="px-3 py-1">
                <ShieldCheck className="h-4 w-4 mr-2" />
                SSL Secured
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verified Pharmacists
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Stripe Protected
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1698466632366-09fa1d925de6?auto=format&fit=crop&w=1200&q=80"
              alt="Clean pharmacy aisle"
              className="rounded-lg border shadow-[0_8px_24px_rgba(9,35,31,0.08)] w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Find what you need quickly</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                >
                  <Card
                    className="p-6 text-center cursor-pointer hover:translate-y-[-2px] transition-transform duration-150 will-change-transform shadow-[0_1px_2px_rgba(9,35,31,0.06),_0_8px_24px_rgba(9,35,31,0.06)] hover:shadow-[0_8px_24px_rgba(9,35,31,0.10)]"
                    onClick={() => navigate(`/catalog?category=${category.id}`)}
                    data-testid={`category-card-${category.id}`}
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${category.color} text-white mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;