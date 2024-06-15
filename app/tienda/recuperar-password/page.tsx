"use client";
import React, { useState } from "react";
import axios from "axios";

function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [recoveryId, setRecoveryId] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/recoveries?siteId=${SiteId}`,
        { email }
      );

      if (response.data.code === 0) {
        setRecoveryId(response.data.recovery.id);
        setMessage("Check your email for the recovery code.");
      } else {
        setError("Failed to initiate recovery. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleRecoverySubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!securityCode || !newPassword || !confirmNewPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/recoveries/${recoveryId}/validations?siteId=${siteId}`,
        { securityCode, newPassword, confirmNewPassword }
      );

      if (response.data.code === 0) {
        setMessage("Password reset successfully");
        setSecurityCode("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className=" mx-auto flex w-full justify-center items-center h-screen bg-gradient-to-r from-primary/90 from-10% via-primary/60 via-30% to-primary/90 to-90%">
        <div className="w-full max-w-md px-6 py-10 rounded-2xl bg-white shadow-three dark:bg-dark sm:p-10">
          <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Recuperar Contraseña
          </h3>
          {!recoveryId ? (
            <>
              <h4 className="text-xs text-center mb-4">
                Ingresa tu email y recibirás un correo con el código para
                reiniciar tu contraseña.
              </h4>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-8">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-secondary shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                  >
                    Recuperar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h4 className="text-xs text-center mb-4">
                Ingresa el código de seguridad recibido por correo y tu nueva
                contraseña.
              </h4>
              <form onSubmit={handleRecoverySubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    name="securityCode"
                    placeholder="Security Code"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {message && (
                  <p className="text-green-500 text-sm mt-2">{message}</p>
                )}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-secondary shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
