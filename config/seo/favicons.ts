const BASE_URL = "/pic.jpg";

const FAVICONS = {
  icon: [
    { url: `${BASE_URL}`, type: "image/x-icon" },
    { url: `${BASE_URL}`, sizes: "32x32", type: "image/png" },
    {
      url: `${BASE_URL}`,
      sizes: "192x192",
      type: "image/png",
    },
  ],
  apple: [
    { url: `${BASE_URL}` },
    {
      url: `${BASE_URL}`,
      sizes: "180x180",
      type: "image/png",
    },
  ],
  other: [
    {
      rel: "apple-touch-icon-precomposed",
      url: `${BASE_URL}`,
    },
  ],
};

export default FAVICONS;
