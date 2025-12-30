import { Link } from 'react-router-dom';
import { Plane, Clock, Shield, MapPin, ArrowLeft } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="pt-safe">
        <div className="container py-6">
          <Link 
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          <div className="mt-8">
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-2">
              About
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              JetSweep
            </h1>
          </div>
        </div>
      </header>

      <main className="container pb-12">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Mission */}
          <section className="card-elevated rounded-2xl p-6 deco-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Why JetSweep?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  "When should I leave for the airport?" is a question with too many variables—security type, 
                  airport size, checked bags, traffic, holidays. JetSweep calculates backward from your departure 
                  time using airport-specific data to give you a precise leave time.
                </p>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              How It Works
            </h2>
            
            <div className="space-y-3">
              <div className="card-elevated rounded-xl p-4 deco-border flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-mono text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Select your airport</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We have specific data for the top 25 US airports—walk distances, security wait multipliers, 
                    parking patterns, and more.
                  </p>
                </div>
              </div>

              <div className="card-elevated rounded-xl p-4 deco-border flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-mono text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Enter your details</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    TSA PreCheck? CLEAR? Checked bags? Family with kids? We factor in everything that affects 
                    your airport timeline.
                  </p>
                </div>
              </div>

              <div className="card-elevated rounded-xl p-4 deco-border flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-mono text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Get your timeline</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A stage-by-stage breakdown from leaving home to boarding, adjusted for your risk tolerance—
                    Early Bird, Balanced, or Seat of Pants.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Smart Features */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Smart Features
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card-elevated rounded-xl p-4 deco-border">
                <MapPin className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium text-foreground text-sm">Airport Intelligence</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Specific friction data for top airports—JFK's long walks, LAX's curb chaos, ATL's train transfers.
                </p>
              </div>

              <div className="card-elevated rounded-xl p-4 deco-border">
                <Shield className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium text-foreground text-sm">Security Modeling</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Accurate estimates for Standard, PreCheck, and CLEAR—including airport-specific multipliers.
                </p>
              </div>

              <div className="card-elevated rounded-xl p-4 deco-border">
                <Clock className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium text-foreground text-sm">Rush Hour Detection</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically detects if you'll be driving during peak traffic and adjusts your drive time.
                </p>
              </div>

              <div className="card-elevated rounded-xl p-4 deco-border">
                <Plane className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-medium text-foreground text-sm">Holiday Awareness</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Knows Thanksgiving Wednesday is brutal, Christmas Day is quiet, and spring break varies by week.
                </p>
              </div>
            </div>
          </section>

          {/* About the calculations */}
          <section className="card-elevated rounded-2xl p-6 deco-border">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              About Our Calculations
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                JetSweep uses a conservative, range-based approach. Every stage has a minimum and maximum time, 
                and your risk preference determines where in that range we target.
              </p>
              <p>
                <strong className="text-foreground">Early Bird:</strong> Uses maximum estimates—you'll likely have time to spare.
              </p>
              <p>
                <strong className="text-foreground">Balanced:</strong> Targets 75th percentile—comfortable with small buffer.
              </p>
              <p>
                <strong className="text-foreground">Seat of Pants:</strong> Uses minimum estimates—works if everything goes smoothly.
              </p>
              <p className="pt-2 border-t border-border mt-4">
                Drive times default to typical city-center estimates. For precision, check Google Maps or Apple Maps 
                for your specific route and departure time.
              </p>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="text-center pt-4">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <Plane className="w-4 h-4" />
              Plan your next trip
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
