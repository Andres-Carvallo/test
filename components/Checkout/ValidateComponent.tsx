"use client";
import React, { useState, useEffect } from "react";

interface ValidateComponentProps {
  orderId: string;
  token_ws: string;
}

const ValidateComponent: React.FC<ValidateComponentProps> = ({
  orderId,
  token_ws,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidationDone, setIsValidationDone] = useState(false);
  useEffect(() => {
    if (!isValidationDone) {
      const handleValidate = async () => {
        setIsLoading(true);

        const data = {
          statusCode: "PAYMENT_COMPLETED",
          confirmTransactionInfo: {
            paymentGatewayToken: token_ws,
          },
        };

        try {
          console.log(data, "data incoming");
          const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID || "";
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/orders/${orderId}?siteId=${SiteId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
          }

          console.log("Data sent successfully!");
          console.log(response);
        } catch (error) {
          console.error("Error sending data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      handleValidate(); // Call the validation function when the component mounts
      setIsValidationDone(true);
    }
  }, [isValidationDone, orderId, token_ws]); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      {isLoading ? (
        <p>Validating...</p>
      ) : (
        <p>Validation successful!</p> // Replace with actual content based on response
      )}
    </div>
  );
};

export default ValidateComponent;
