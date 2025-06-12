export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    // CPP: 54,
  };

  return languageMap[language.toUpperCase()] || null;
};

export function getLanguageName(language_id) {
  const LANGUAGE_NAMES = {
    63: "Javascript",
    71: "Python",
    62: "Java",
    // 54: "CPP",
  };

  return LANGUAGE_NAMES[language_id] || "Unknown"
}