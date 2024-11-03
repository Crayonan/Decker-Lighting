import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaWhatsapp, FaInstagram} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export default function ContactForm() {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null },
  });
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleServerResponse = (ok: boolean, msg: string) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({
        name: "",
        email: "",
        message: "",
      });
    } else {
      setStatus((prevStatus) => ({
        ...prevStatus,
        info: { error: true, msg },
      }));
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    axios({
      method: "POST",
      url: "https://formspree.io/f/mgvevwav",
      data: inputs,
    })
      .then(() => {
        handleServerResponse(
          true,
          "Thank you, your message has been submitted."
        );
      })
      .catch((error) => {
        handleServerResponse(
          false,
          error.response?.data?.error || "Error submitting form"
        );
      });
  };

  return (
    <div className="min-h-screen bg-[hsl(0_0%_7.5%)] text-[hsl(0_0%_90%)] py-16 sm:py-16 flex flex-col">
      <div className="mx-auto w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] flex flex-col">
        <h2 className="mb-4 text-3xl font-bold text-center sm:text-3xl sm:mb-6">
          Kontaktieren Sie Uns
        </h2>
        <div className="w-full bg-[hsl(0_0%_10%)] rounded-xl shadow-lg border border-[hsl(0_0%_15%)] p-4 sm:p-6 flex-grow flex flex-col">
          <form onSubmit={handleSubmit} className="flex-grow space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                required
                onChange={handleOnChange}
                value={inputs.name}
                className="bg-[hsl(0_0%_12.5%)] border-[hsl(0_0%_15%)] mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                required
                onChange={handleOnChange}
                value={inputs.email}
                className="bg-[hsl(0_0%_12.5%)] border-[hsl(0_0%_15%)] mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-sm">
                Nachricht
              </Label>
              <Textarea
                id="message"
                placeholder="Your message"
                required
                onChange={handleOnChange}
                value={inputs.message}
                className="bg-[hsl(0_0%_12.5%)] border-[hsl(0_0%_15%)] mt-1 h-full min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              disabled={status.submitting}
              className="w-full bg-[hsl(0_0%_12.5%)] hover:bg-[hsl(0_0%_15%)] py-2"
            >
              {!status.submitting
                ? !status.submitted
                  ? "Abschicken"
                  : "Nachricht gesendet"
                : "Sending..."}
            </Button>
          </form>
          {status.info.error && (
            <div className="mt-4 text-red-500 error">{status.info.msg}</div>
          )}
          {!status.info.error && status.info.msg && (
            <p className="mt-4 text-green-500">{status.info.msg}</p>
          )}
          <div className="mt-4 py-4 border-t border-[hsl(0_0%_15%)]">
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
                href="mailto:info@decker-eventtechnik.com"
                className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200"
              >
                <MdEmail className="w-6 h-6" />
                <span className="sr-only">Email</span>
              </a>
              <a
                href="tel:+4917695449722"
                className="text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_90%)] transition-colors duration-200"
              >
                <MdPhone className="w-6 h-6" />
                <span className="sr-only">Phone</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
