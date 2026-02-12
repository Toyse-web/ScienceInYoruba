import React, {createContext, useEffect, useState, useeffect} from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState(() => {
        // Get saved language preference or default to Yoruba
        return localStorage.getItem("preferredLanguage") || "yo";
    });

    const toggleLanguage = () => {
        const newLang = language === "yo" ? "en" : "yo";
        setLanguage(newLang);
        localStorage.setItem("preferredLanguage", newLang);
        document.documentElement.lang = newLang;
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const translations = {
    yo: {
      nav: {
        home: 'Ilé',
        topics: 'Àwọn Ohun Tí A Ǹ Kọ́',
        articles: 'Àwọn Àkọ́ọ́lẹ̀',
        about: 'Nípa Wa',
        contact: 'Àdírẹ́sì',
        search: 'Ṣàwárí'
      },
       hero: {
        title: 'Ìmọ̀ Ìjìnlẹ̀ ní Yorùbá',
        subtitle: 'Ìgbìnyánjú wà láti riíi dájú pé a lè fi èdè Yorùbá sọ̀rọ̀ nípa gbogbo ẹ̀ka ìmọ̀ ìjìnlẹ̀.',
        cta: 'Bẹ̀rẹ̀ Ìkẹ́kọ̀'
      }
    },
    en: {
      nav: {
        home: 'Home',
        topics: 'Topics',
        articles: 'Articles',
        about: 'About',
        contact: 'Contact',
        search: 'Search'
      },
      hero: {
        title: 'Science in Yorùbá',
        subtitle: 'Our mission is to ensure we can discuss all fields of science in Yorùbá language.',
        cta: 'Start Learning'
      }
    }
};

return (
    <LanguageContext.Provider value={{language, toggleLanguage, translations}}>
        {children}
    </LanguageContext.Provider>
);
};