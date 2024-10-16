import { useState, useEffect } from "react";
import { FaChevronDown, FaWhatsapp } from "react-icons/fa";
import { PiPackageDuotone } from "react-icons/pi";
import { Check } from "lucide-react";
import { HiSparkles } from "react-icons/hi";
import { client } from "../../contentfulClient";

interface Package {
  name: string;
  description: string;
  price: string;
  features: string[];
  whatsappLink: string;
}

const whatsappLinks = [
  "https://wa.me/p/8832657406755863/4917695449722",
  "https://wa.me/p/7956263721141873/4917695449722",
  "https://wa.me/p/7240885382703181/4917695449722",
];

export default function Shop() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await client.getEntries({
          content_type: "package",
        });
        const fetchedPackages = response.items.map(
          (item: any, index: number) => ({
            name: item.fields.name,
            description: item.fields.description,
            price: item.fields.price,
            features: item.fields.features,
            whatsappLink: whatsappLinks[index] || whatsappLinks[0], // Fallback to first link if index out of bounds
          })
        );
        setPackages(fetchedPackages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to fetch packages. Please try again later.");
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prevState) => (prevState === index ? null : index));
  };

  const handleWhatsAppClick = (whatsappLink: string) => {
    window.open(whatsappLink, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,7.5%)] text-[hsl(0,0%,90%)] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,7.5%)] text-[hsl(0,0%,90%)] flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 bg-[hsl(0,0%,7.5%)] text-[hsl(0,0%,90%)]">
      <div className="max-w-4xl p-4 pb-24 mx-auto sm:pb-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Our packages</h2>
          <p className="max-w-2xl mx-auto text-dark-text-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className="bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,15%)] rounded-lg overflow-hidden"
            >
              <button
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[hsl(0,0%,40%)] focus:ring-opacity-50"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openAccordion === index}
                aria-controls={`package-content-${index}`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <PiPackageDuotone className="w-6 h-6 sm:w-8 sm:h-8 text-[hsl(0,0%,60%)]" />
                  <div>
                    <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
                      {pkg.name} Package
                    </h2>
                    <p className="text-sm sm:text-base text-[hsl(0,0%,60%)]">
                      {pkg.description}
                    </p>
                  </div>
                </div>
                <FaChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-[hsl(0,0%,60%)] transition-transform duration-300 ${
                    openAccordion === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`package-content-${index}`}
                className={`transition-all duration-300 ease-in-out ${
                  openAccordion === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 pt-2 sm:p-6">
                  <p className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
                    {pkg.price}
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm sm:text-base"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[hsl(128,83%,60%)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleWhatsAppClick(pkg.whatsappLink)}
                    className="mt-4 sm:mt-6 w-full bg-[#25D366] text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#128C7E] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2" />
                    Inquire on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
