/* eslint-disable @next/next/no-css-tags */
"use client";
import { useEffect } from "react";

const MailchimpForm = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    const inlineScript = document.createElement("script");
    inlineScript.type = "text/javascript";
    inlineScript.innerHTML = `
      (function($) {
        window.fnames = new Array();
        window.ftypes = new Array();
        fnames[0]='EMAIL';
        ftypes[0]='email';
        fnames[1]='FNAME';
        ftypes[1]='text';
        fnames[2]='LNAME';
        ftypes[2]='text';
        fnames[3]='ADDRESS';
        ftypes[3]='address';
        fnames[4]='PHONE';
        ftypes[4]='phone';
        fnames[5]='BIRTHDAY';
        ftypes[5]='birthday';
      }(jQuery));
      var $mcj = jQuery.noConflict(true);
    `;
    document.body.appendChild(inlineScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(inlineScript);
    };
  }, []);

  return (
    <div id="mc_embed_shell">
      <link
        href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
        rel="stylesheet"
        type="text/css"
      />
      <div id="mc_embed_signup items-center">
        <form
/*           action="https://fbmjoyas.us21.list-manage.com/subscribe/post?u=bd6557b84be4ed48a449c44ac&id=85b245df5a&f_id=00c982e6f0"
 */          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate mt-4"
          target="_blank"
        >
          <div id="mc_embed_signup_scroll">
            <div className="mc-field-group">
              <input
                type="email"
                name="EMAIL"
                placeholder="Ingresa tu mail"
                className="w-full p-2 text-black border-2 border-gray-400 required email"
                id="mce-EMAIL"
                required
              />
            </div>
            <div id="mce-responses" className="clear foot">
              <div
                className="response "
                id="mce-error-response"
                style={{ display: "none" }}
              />
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              />
            </div>
            <div
              style={{ position: "absolute", left: "-5000px" }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_bd6557b84be4ed48a449c44ac_85b245df5a"
                tabIndex={-1}
                defaultValue=""
              />
            </div>
            <div className="optionalParent">
              <div className="clear foot ">
                <button
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  style={{ width: "100%", marginLeft: "0" }}
                  className="mt-3 w-full bg-foreground hover:bg-secondary p-2 text-secondary hover:text-primary"
                >
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MailchimpForm;
