import { useState } from 'react';
import type { FormEvent } from 'react';
import logoPng from '../assets/Logo studio.png';
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
        setMessage("Thanks for your message! I'll get back to you soon.");
        (event.target as HTMLFormElement).reset();
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <img src={logoPng} alt="" className="page-bg-logo" aria-hidden="true" />
      <div className="contact-inner">
        <h1>Get in Touch</h1>
        <p className="contact-text">
          Have a project in mind? Let's talk about how we can work together.
        </p>
        <form onSubmit={onSubmit} className="contact-form">
          <div className="input-row">
            <input 
              type="text" 
              name="name" 
              placeholder="Your name" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your email" 
              required 
            />
          </div>
          <textarea 
            rows={8} 
            name="message" 
            placeholder="Your message" 
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {message && <p className={`form-message ${message.includes('Thanks') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
}
