import axios from "axios";

// this will give us language id based on language
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    // CPP: 54,
  };

  return languageMap[language.toUpperCase()] || null;
};

export const submitBatch = async (submissions) => {
  // Url looks like : POST https://ce.judge0.com/submissions/batch?base64_encoded=false
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions },
  );
  console.log(`Submission data : `, data);

  return data; // {[token] [token] [token]}
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    // Url looks like : GET https://ce.judge0.com/submissions/batch?tokens=db54881d-bcf5-4c7b-a2e3-d33fe7e25de7,ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1,1b35ec3b-5776-48ef-b646-d5522bdeb2cc&base64_encoded=false&fields=token,stdout,stderr,status_id,language_id
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      { params: { tokens: tokens.join(","), base64_encoded: false } },
    );

    const result = data.submissions;

    const isAllDone = result.every(
      (r) => r.status.id !== 1 && r.status.id !== 2,
    );

    if (isAllDone) return result;

    await sleep(1000);
  }
};

const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms))
