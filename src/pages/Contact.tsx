import { useState } from 'react';
import type { FormEvent } from 'react';
import './Contact.css';

export default function Contact() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    formData.append("access_key", "02967982-1b6a-4f40-94bc-b2a3c0e6ee73");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        setMessage("Bedankt voor je bericht! Ik neem snel contact met je op.");
        (event.target as HTMLFormElement).reset();
      } else {
        setMessage("Er ging iets mis. Probeer het opnieuw.");
      }
    } catch {
      setMessage("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <img src="/logo.svg" alt="" className="page-bg-logo" aria-hidden="true" />
      <div className="contact-inner">
        <h1>Neem Contact Op</h1>
        <p className="contact-text">
          Heb je een project in gedachten? Laten we praten over hoe we kunnen samenwerken.
        </p>
        <form onSubmit={onSubmit} className="contact-form">
          <div className="input-row">
            <input 
              type="text" 
              name="name" 
              placeholder="Je naam"
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Je e-mail"
              required 
            />
          </div>
          <textarea 
            rows={8} 
            name="message" 
            placeholder="Je bericht"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Verzenden...' : 'Verstuur Bericht'}
          </button>
        </form>
        {message && <p className={`form-message ${message.includes('Bedankt') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
}
