import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PlaneTakeoff, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
          <PlaneTakeoff className="w-8 h-8 text-primary" />
        </div>
        <h1 className="mb-2 font-display text-5xl font-bold text-primary">404</h1>
        <p className="mb-1 text-lg text-foreground">This route never departed.</p>
        <p className="mb-8 text-sm text-muted-foreground">
          The page you're looking for isn't on the board.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to JetSweep
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
