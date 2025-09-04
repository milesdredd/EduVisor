import { GraduationCap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center animated-bg">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="glassmorphism rounded-2xl p-8 fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to EduPath</h1>
              <p className="text-white/80">Your personalized career guidance starts here</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-white/90 text-center">
                  Sign in to access personalized career guidance, aptitude assessments, and discover the perfect educational path for your future.
                </p>
              </div>

              <a
                href="/api/login"
                className="w-full bg-white text-primary font-semibold py-3 rounded-xl hover:bg-white/90 transition-all duration-200 transform hover:scale-105 block text-center"
                data-testid="button-login"
              >
                Sign In to Get Started
              </a>

              <div className="text-center">
                <p className="text-white/80 text-sm">
                  New here? Your account will be created automatically when you sign in.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center text-white/70">
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-xs">Students Guided</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1,200+</div>
                  <div className="text-xs">Colleges Listed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-xs">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
