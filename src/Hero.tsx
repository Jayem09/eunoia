import { Button } from "./components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export function Hero() {
  return (
    <section id="home" className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl tracking-tight">
                Create Unforgettable
                <span className="text-primary"> Events</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                From intimate gatherings to grand celebrations, we organize, host, and coordinate 
                events that leave lasting impressions. Let us bring your vision to life.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Start Planning
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                View Our Work
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div>
                <div className="text-2xl font-medium text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Events Organized</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Attendees</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent to-secondary/30 p-8">
              <div className="w-full h-full rounded-xl bg-card shadow-2xl flex items-center justify-center">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=600&fit=crop"
                  alt="Elegant event venue with beautiful lighting"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}