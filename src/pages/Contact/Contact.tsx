import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(0_0%_7.5%)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[hsl(0_0%_10%)] rounded-xl shadow-lg border border-[hsl(0_0%_15%)]">
        <h2 className="text-3xl font-bold text-center text-[hsl(0_0%_90%)]">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[hsl(0_0%_90%)]">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name" 
              required 
              className="bg-[hsl(0_0%_12.5%)] text-[hsl(0_0%_90%)] border-[hsl(0_0%_15%)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[hsl(0_0%_90%)]">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Your email" 
              required 
              className="bg-[hsl(0_0%_12.5%)] text-[hsl(0_0%_90%)] border-[hsl(0_0%_15%)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-[hsl(0_0%_90%)]">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Your message" 
              required 
              className="bg-[hsl(0_0%_12.5%)] text-[hsl(0_0%_90%)] border-[hsl(0_0%_15%)]"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[hsl(0_0%_12.5%)] text-[hsl(0_0%_90%)] hover:bg-[hsl(0_0%_15%)]"
          >
            Send Message
          </Button>
        </form>
        <div className="pt-4 border-t border-[hsl(0_0%_15%)]">
          <p className="text-[hsl(0_0%_60%)] text-center mb-4">Connect with us</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200">
              <FaTwitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200">
              <FaFacebookF className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200">
              <FaInstagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200">
              <FaLinkedinIn className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}