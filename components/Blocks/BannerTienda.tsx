import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

function BannerTienda() {
  const [loading, setLoading] = useState(false);
  const [storeBannerData, setStoreBannerData] = useState({
    title: "",
    contentText: "",
  });

  const handleChangeStoreBanner = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setStoreBannerData({
      ...storeBannerData,
      [name]: value,
    });
  };

  const handleSubmitStoreBanner = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      setLoading(true); // Show loading indicator
      const bannerId = "be00fd66-7cfd-4e1d-9ab1-3d1239679417"; // Reemplazar con el ID correcto del banner de tienda
      const token = getCookie("AdminTokenAuth");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${bannerId}`,
        {
          title: storeBannerData.title,
          contentText: storeBannerData.contentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear form data after submission
      setStoreBannerData({
        title: "",
        contentText: "",
      });

      console.log("Data sent successfully:", storeBannerData);
      fetchStoreBanner();
    } catch (error) {
      console.error("Error sending data:", error);
      // Handle error as needed
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const fetchStoreBanner = async () => {
    try {
      setLoading(true); // Show loading indicator
      const bannerId = "be00fd66-7cfd-4e1d-9ab1-3d1239679417";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      const bannerImage = response.data.contentBlock;
      setStoreBannerData(bannerImage);
    } catch (error) {
      console.error("Error fetching store banner:", error);
      // Handle error as needed
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchStoreBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Should only run on initial mount

  return (
    <section className="border border-dashed border-dark/50 rounded-lg p-4 bg-white">
      <h4 className="uppercase font-bold mb-4">Store Banner</h4>
      <div className="border border-dashed border-dark/50 rounded-lg p-4 ">
        <div className="text-[#333] p-8 font-[sans-serif]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl  font-extrabold relative after:absolute after:-bottom-5 after:h-1 after:w-1/2 after:bg-primary after:left-0 after:right-0 after:mx-auto after:rounded-full">
              {storeBannerData?.title}
            </h2>
            <div className="mt-12">
              <p className="text-base">{storeBannerData?.contentText}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs flex items-center gap-2 mt-4">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </span>
        Lpsum dolor sit amet consectetur adipisicing elit.
      </p>
      <form
        onSubmit={handleSubmitStoreBanner}
        className="px-4 mx-auto mt-8"
      >
        <input
          type="text"
          name="title"
          onChange={handleChangeStoreBanner}
          className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Title"
        />
        <input
          type="text"
          name="contentText"
          onChange={handleChangeStoreBanner}
          className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Content Text"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className={`inline w-4 h-4 me-3 text-white animate-spin ${
              loading ? "block" : "hidden"
            }`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
    </section>
  );
}

export default BannerTienda;
