// import React, { useEffect } from "react";

// function GoogleTranslateWidget() {
//   useEffect(() => {
//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         { pageLanguage: "en" }, // Set your default language here
//         "google_translate_element"
//       );
//     };

//     const script = document.createElement("script");
//     script.src =
//       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   return <div id="google_translate_element"></div>;
// }

// export default GoogleTranslateWidget;
import React, { useEffect, useState } from "react";
import "./GoogleTranslateWidget.css";

function GoogleTranslateWidget() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "ur", name: "Urdu" },
    { code: "gu", name: "Gujarati" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
    // Add more languages as needed
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    const googleTranslateSelect = document.querySelector(".goog-te-combo");
    if (googleTranslateSelect) {
      googleTranslateSelect.value = language;
      googleTranslateSelect.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div style={{ marginRight: 20 }}>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <div className="select-container">
        <select
          className="styled-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default GoogleTranslateWidget;
