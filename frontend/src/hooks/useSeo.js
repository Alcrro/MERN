import { useEffect } from "react";

const SITE = "alcrro";
const BASE_URL = "https://alcrro.ro";

const setMeta = (attr, name, content) => {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (path) => {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${BASE_URL}${path}`);
};

export const useSeo = ({ title, description, path = "" }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : SITE;
    document.title = fullTitle;

    if (description) setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    if (description) setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", `${BASE_URL}${path}`);
    setCanonical(path);
  }, [title, description, path]);
};
