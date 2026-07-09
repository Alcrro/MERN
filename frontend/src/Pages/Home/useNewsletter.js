import { useState } from "react";

export const useNewsletter = () => {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return { email, setEmail, subscribed, handleSubscribe };
};
