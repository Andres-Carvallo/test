/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useContactConfig } from "@/hooks/useContactConfig";

const ContactForm01: React.FC = () => {
  const { config, loading: configLoading, bannerData } = useContactConfig();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      setLoading(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("contact_form");

      const data = {
        ...formData,
        recaptchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/contacts?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Mensaje enviado exitosamente");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        }); // Limpiar el formulario
        router.push("/");
      } else {
        toast.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje", error);
      setError("Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

     return (
     <div>
       {/* Formulario y Foto */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 grid-cols-1 md:grid-cols-2 md:gap-12">
            {/* Formulario */}
            <div className="rounded-lg bg-white p-4 shadow-lg md:p-8">
              <h2 className="mb-6 text-2xl md:text-3xl font-bold text-gray-800">
                {config.formTitle}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                                     <label
                     htmlFor="name"
                     className="mb-2 block text-sm md:text-base font-medium text-gray-700"
                   >
                     Nombre completo
                   </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm md:text-base rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                    required
                  />
                </div>

                <div>
                                     <label
                     htmlFor="email"
                     className="mb-2 block text-sm md:text-base font-medium text-gray-700"
                   >
                     Correo Electrónico
                   </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm md:text-base rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                    required
                  />
                </div>

                <div>
                                     <label
                     htmlFor="subject"
                     className="mb-2 block text-sm md:text-base font-medium text-gray-700"
                   >
                     Asunto
                   </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm md:text-base rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                    required
                  />
                </div>

                <div>
                                     <label
                     htmlFor="message"
                     className="mb-2 block text-sm md:text-base font-medium text-gray-700"
                   >
                     Mensaje
                   </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 text-sm md:text-base rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md px-4 py-2.5 font-medium transition-colors duration-300 text-sm md:text-base bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                                     {loading ? "Cargando..." : config.submitButtonText}
                </button>
              </form>
            </div>

                         {/* Foto */}
             <div className="hidden md:block">
               <img
                 src={bannerData?.banner?.images?.[0]?.mainImage?.url}
                 alt="Contacto"
                 className="w-full rounded-lg object-cover shadow-xl h-[600px]"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      {config.showContactInfo && (
        <section className="pb-10 md:pb-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-lg bg-white p-4 shadow-lg md:p-8">
            <h3 className="mb-6 text-center text-xl md:text-2xl font-bold text-gray-800">
              {config.contactInfoTitle}
            </h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-8">
              <div className="flex items-center rounded-lg p-4 md:p-6 bg-primary/10">
                <div className="mr-4 flex-shrink-0 text-primary">
                  <svg
                    className="h-8 w-8 md:h-10 md:w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-base md:text-lg font-semibold text-gray-800">
                    {config.emailLabelInfo}
                  </h4>
                  <p className="text-sm md:text-base text-gray-600">
                  {config.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center rounded-lg p-4 md:p-6 bg-primary/10">
                <div className="mr-4 flex-shrink-0 text-primary">
                  <svg
                    className="h-8 w-8 md:h-10 md:w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-base md:text-lg font-semibold text-gray-800">
                    {config.phoneLabelInfo}
                  </h4>
                  <p className="text-sm md:text-base text-gray-600">
                  {config.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

// Wrapper con GoogleReCaptchaProvider
const ContactForm01WithRecaptcha: React.FC = () => {
  const siteKey = process.env.RECAPTCHA_PUBLIC_SITE_KEY || "";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ContactForm01 />
    </GoogleReCaptchaProvider>
  );
};

export default ContactForm01WithRecaptcha;
