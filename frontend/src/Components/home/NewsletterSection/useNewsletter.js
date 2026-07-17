import { useState } from "react";
import { useSubscribeNewsletterMutation } from "../../../features/newsletter/rtkNewsletter";

export const useNewsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading, error }] = useSubscribeNewsletterMutation();
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const data = await subscribe(email).unwrap();
      setSuccessMsg(data?.message || "Abonare reușită.");
      setEmail("");
    } catch {
      // error afișat prin `error` din RTK
    }
  };

  return { email, setEmail, successMsg, handleSubscribe, isLoading, error };
};
