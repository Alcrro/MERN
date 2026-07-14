import { useState } from "react";
import { useSubscribeNewsletterMutation } from "../../../features/newsletter/rtkNewsletter";

export const useNewsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading, error }] = useSubscribeNewsletterMutation();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribe(email).unwrap();
      setSubscribed(true);
      setEmail("");
    } catch {
      // error afișat prin `error` din RTK
    }
  };

  return { email, setEmail, subscribed, handleSubscribe, isLoading, error };
};
