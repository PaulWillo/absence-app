import React from "react";


export const Config = React.createContext({});
export const Language = React.createContext({});

//Provider allows for the passing of information within wrapped components
export const ConfigProvider = Config.Provider;
export const LanguageProvider = Language.Provider;