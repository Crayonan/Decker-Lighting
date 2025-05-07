// src/pages/Shop/Shop.tsx
import { useState, useEffect } from "react";
import { FaChevronDown, FaWhatsapp } from "react-icons/fa";
import { PiPackageDuotone } from "react-icons/pi";
import { Check } from "lucide-react";
// Remove Contentful client, import Payload client functions
// import { client as contentfulClient } from "../../contentfulClient";
import { fetchShopPackages, fetchSiteTexts } from "../../payloadClient";
import type {
  ShopPackage as PayloadGeneratedShopPackage,
  SiteText as PayloadGeneratedSiteText,
} from "@/types/payload-types"; // Assuming payload-types.ts is in src/types/
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Interface for display purposes in this component
interface DisplayShopPackage {
  id: number;
  name: string;
  description: string; // Assuming description is plain text. If RichText, type 'any' and use RichText renderer
  price: string;
  features: string[];
  whatsappLink: string;
}

export default function Shop() {
  const [packages, setPackages] = useState<DisplayShopPackage[]>([]);
  const [shopText, setShopText] = useState<string | any>(""); // Can be string or RichText JSON
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch packages from Payload
        const packagesResponse = await fetchShopPackages();
        const fetchedPackages = packagesResponse.docs.map((item: PayloadGeneratedShopPackage) => ({
          id: item.id,
          name: item.name,
          description: item.description || "", // Handle if description is optional
          price: item.price,
          // The 'features' field in Payload is an array of objects like { feature: string, id?: string }
          // We need to map it to an array of strings for the DisplayShopPackage interface
          features: item.features?.map(f => f.feature) || [],
          whatsappLink: item.whatsappLink || "",
        }));
        setPackages(fetchedPackages);

        // Fetch site texts (including shopText) from Payload
        const siteTextsResponse = await fetchSiteTexts();
        if (siteTextsResponse && siteTextsResponse.shopIntroText) {
          // Assuming shopIntroText is plain text or you'll render RichText
          // If shopIntroText is RichText from Payload, it will be JSON
          setShopText(siteTextsResponse.shopIntroText);
        }

      } catch (err) {
        console.error("Error fetching data for Shop page:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prevState) => (prevState === index ? null : index));
  };

  const handleWhatsAppClick = (whatsappLink: string) => {
    if (whatsappLink) { // Ensure link is not empty
      window.open(whatsappLink, "_blank");
    } else {
      console.warn("WhatsApp link is missing for this package.");
      // Optionally, provide user feedback here
    }
  };

  if (loading) {
    // Basic skeleton loader
    return (
      <div className="min-h-screen py-8 pb-32 bg-dark-bg text-dark-text">
        <div className="max-w-4xl px-4 pb-24 mx-auto sm:pb-4">
          <div className="mb-12 text-center">
            <Skeleton className="w-1/2 h-8 mx-auto mb-4" /> {/* Title */}
            <Skeleton className="w-3/4 h-16 mx-auto" />   {/* shopText */}
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,15%)] shadow-md rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                      <Skeleton className="w-48 h-6 mb-1" />
                      <Skeleton className="w-64 h-4" />
                    </div>
                  </div>
                  <Skeleton className="w-6 h-6" />
                </div>
                <Skeleton className="w-24 h-8 mb-4" />
                <div className="mb-6 space-y-2">
                  <Skeleton className="w-full h-5" />
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-full h-5" />
                </div>
                <Skeleton className="w-full h-10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg text-dark-text">
        {error}
      </div>
    );
  }

  // If shopText or package descriptions are RichText from Payload, import and use the RichText renderer
  // import { RichText } from '@payloadcms/richtext-lexical/react';
  // <RichText data={shopText} />
  // <RichText data={pkg.description} />

  return (
    <div className="min-h-screen py-8 pb-32 bg-dark-bg text-dark-text">
      <div className="max-w-4xl px-4 pb-24 mx-auto sm:pb-4">
        <div className="mb-12 text-center">
          <h1 className="py-8 mx-auto text-3xl font-bold text-center sm:px-4">
            Unsere Pakete
          </h1>
           {/* Render shopText: Check if it's RichText (object) or plain string */}
          {typeof shopText === 'object' && shopText !== null && Object.keys(shopText).length > 0 ? (
            <div className="max-w-2xl mx-auto text-dark-text-secondary rich-text-content">
              {/* <RichText data={shopText} /> Ensure RichText is imported if using */}
              <p>Rich text content for shopText needs a renderer.</p> {/* Placeholder */}
            </div>
          ) : (
            <p className="max-w-2xl mx-auto text-dark-text-secondary">
              {shopText || "Loading introduction..."}
            </p>
          )}
        </div>
        <div className="space-y-4">
          {packages.length === 0 && !loading && (
             <p className="text-center text-dark-text-secondary">No packages available at the moment.</p>
          )}
          {packages.map((pkg, index) => (
            <div
              key={pkg.id} // Use numeric ID from Payload
              className="bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,15%)] shadow-md rounded-xl overflow-hidden"
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
                      {pkg.name}
                    </h2>
                    {/* Render pkg.description: Check if it's RichText or plain string */}
                    {typeof pkg.description === 'object' && pkg.description !== null && Object.keys(pkg.description).length > 0 ? (
                       <div className="text-sm sm:text-base text-[hsl(0,0%,60%)] rich-text-content">
                         {/* <RichText data={pkg.description} /> Ensure RichText is imported if using */}
                         <p>Rich text content for description needs a renderer.</p> {/* Placeholder */}
                       </div>
                    ) : (
                      <p className="text-sm sm:text-base text-[hsl(0,0%,60%)]">
                        {pkg.description}
                      </p>
                    )}
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
                    disabled={!pkg.whatsappLink} // Disable if no link
                  >
                    <FaWhatsapp className="mr-2" />
                    Erkundigen Sie sich auf WhatsApp
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