import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { MdEmail } from 'react-icons/md';

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-[hsl(0_0%_7.5%)] text-[hsl(0_0%_90%)] py-16 sm:py-16 flex flex-col">
      <div className="mx-auto w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] flex flex-col">
        <h2 className="mb-4 text-3xl font-bold text-center sm:text-3xl sm:mb-6">
          Contact Us
        </h2>
        <div className="w-full bg-[hsl(0_0%_10%)] rounded-xl shadow-lg border border-[hsl(0_0%_15%)] p-4 sm:p-6 flex-grow flex flex-col">
          <form onSubmit={handleSubmit} className="flex-grow space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                required
                className="bg-[hsl(0_0%_12.5%)] border-[hsl(0_0%_15%)] mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                required
                className="bg-[hsl(0_0%_12.5%)] border-[hsl(0_0%_15%)] mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-sm">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message"
                required
                className="bg-[hsl(0_0%_12.5%)] border-[hsl(0_0%_15%)] mt-1 h-full min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[hsl(0_0%_12.5%)] hover:bg-[hsl(0_0%_15%)] py-2"
            >
              Send Message
            </Button>
          </form>
          <div className="mt-4 py-4border-t border-[hsl(0_0%_15%)]">
            {/* <p className="text-[hsl(0_0%_60%)] text-center text-sm mb-2">
              Connect with us
            </p> */}
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.instagram.com/decker.veranstaltungstechnik/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200"
              >
                <FaInstagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://wa.me/+4917695449722"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200"
              >
                <FaWhatsapp className="w-6 h-6" />
                <span className="sr-only">WhatsApp</span>
              </a>
              <a
                href="mailto:Info@decker-vt.de"
                className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200"
              >
                <MdEmail className="w-6 h-6" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}