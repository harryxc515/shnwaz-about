import { useState, useEffect } from "react";
import { Download, Smartphone, Share, MoreVertical, Plus, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-display text-primary tracking-wider">Install App</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg shadow-primary/20">
              <img src="/favicon.png" alt="App Icon" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
              Install SHNWAZX
            </h2>
            <p className="text-muted-foreground text-lg">
              Add this app to your home screen for the best experience
            </p>
          </div>

          {/* Already Installed */}
          {isInstalled && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-center">
              <Check className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Already Installed!</h3>
              <p className="text-muted-foreground">
                This app is already installed on your device. You can find it on your home screen.
              </p>
            </div>
          )}

          {/* Install Button for Android/Desktop */}
          {deferredPrompt && !isInstalled && (
            <div className="mb-8">
              <Button
                onClick={handleInstallClick}
                size="lg"
                className="w-full py-6 text-lg font-semibold"
              >
                <Download className="mr-2" size={24} />
                Install Now
              </Button>
            </div>
          )}

          {/* iOS Instructions */}
          {isIOS && !isInstalled && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="text-primary" size={28} />
                <h3 className="text-xl font-semibold text-foreground">Install on iPhone/iPad</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Tap the Share button</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Look for the <Share className="inline w-4 h-4" /> icon at the bottom of Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Scroll down and tap "Add to Home Screen"</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Look for the <Plus className="inline w-4 h-4" /> Add to Home Screen option
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Tap "Add" in the top right</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      The app will be added to your home screen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Instructions (fallback if no prompt) */}
          {isAndroid && !deferredPrompt && !isInstalled && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="text-primary" size={28} />
                <h3 className="text-xl font-semibold text-foreground">Install on Android</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Tap the menu button</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Look for the <MoreVertical className="inline w-4 h-4" /> icon in your browser
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Tap "Install app" or "Add to Home screen"</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      The option may vary depending on your browser
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Confirm the installation</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      The app will be added to your home screen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Instructions */}
          {!isIOS && !isAndroid && !deferredPrompt && !isInstalled && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Download className="text-primary" size={28} />
                <h3 className="text-xl font-semibold text-foreground">Install on Desktop</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Look for the install icon in your browser's address bar</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      In Chrome, it's a <Plus className="inline w-4 h-4" /> icon on the right side
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">Click "Install"</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      The app will open in its own window
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Why Install?</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Smartphone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Works like a native app</p>
                  <p className="text-muted-foreground text-sm">Full screen experience without browser UI</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Download className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Works offline</p>
                  <p className="text-muted-foreground text-sm">Access content even without internet</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Check className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-foreground font-medium">Quick access</p>
                  <p className="text-muted-foreground text-sm">Launch instantly from your home screen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Install;
