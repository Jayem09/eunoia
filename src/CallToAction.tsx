import { Button } from "./components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "./components/ui/badge";

export function CallToAction() {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Rating */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
              ))}
            </div>
            <span className="text-primary-foreground/80">4.9/5 from 200+ clients</span>
          </div>

          {/* Content */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <Badge variant="secondary" className="w-fit mx-auto">
              Free Consultation Available
            </Badge>
            <h2 className="text-3xl md:text-5xl">
              Ready to Create Your
              <span className="block">Perfect Event?</span>
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Let's bring your vision to life. Schedule a free consultation with our expert
              event planners and discover how we can make your next event extraordinary.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="group">
              Book Free Consultation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" className="bg-white text-black"
            >
              View Our Portfolio
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 border-t border-primary-foreground/20">
            <p className="text-sm text-primary-foreground/60 mb-4">Trusted by organizations and individuals</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-medium">Fortune 500 Companies</div>
              <div className="text-lg font-medium">Local Businesses</div>
              <div className="text-lg font-medium">Non-Profits</div>
              <div className="text-lg font-medium">Private Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}