import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "@/hooks/use-toast";

const CTABanner = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, you would send this to an API
    toast({
      title: "Subscription Successful",
      description: "Thank you for subscribing to our newsletter!",
    });
    
    setEmail("");
  };

  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-2">Join Our Community</h2>
            <p className="text-white/80">
              Subscribe to receive updates on new products, special offers, and the stories behind our craftsmanship.
            </p>
          </div>
          <div>
            <form className="flex flex-col sm:flex-row" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-l-md sm:rounded-r-none rounded-r-md sm:mb-0 mb-2 text-neutral focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="bg-accent hover:bg-accent-dark text-white font-accent font-medium py-3 px-6 rounded-r-md sm:rounded-l-none rounded-l-md text-sm uppercase tracking-wider transition duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
