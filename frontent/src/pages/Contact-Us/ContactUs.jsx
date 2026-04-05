import { useState } from "react";
import ScrollReveal from "../../component/ScllorAnimation";
import axios from "axios";
import toast from "react-hot-toast";

function ContactUs() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSumbit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post(`${API_URL}/contacts`, formData, { withCredentials: true })
      .then(() => {
        toast.success("Message sent successfully");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => toast.error("Failed to send message ❌"))
      .finally(() => setLoading(false));
  };

  return (
    <ScrollReveal from="bottom">
      <section className="px-4 py-6 flex flex-col items-center text-white">

        {/* Heading */}
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                          bg-black border border-sky-400/20 text-sky-300 text-[10px] uppercase tracking-widest">
            Contact
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mt-4">
            Get in{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>

          <p className="mt-3 text-gray-400 text-sm">
            We’re here to help you anytime. Send us a message and we’ll respond soon.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSumbit}
          className="mt-10 w-full max-w-3xl 
                     bg-gradient-to-br from-gray-950 to-black backdrop-blur-xl
                     border border-gray-600 
                     rounded-2xl p-6 md:p-10 
                     shadow-xl shadow-sky-500/10"
        >

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Name */}
            <div>
              <label className="text-xs text-gray-400">Your Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full mt-2 px-4 py-3 rounded-lg 
                            bg-transparent border border-white/20 
                           text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-sky-500/50
                           focus:border-sky-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-400">Your Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full mt-2 px-4 py-3 rounded-lg 
                           bg-transparent border border-white/20 
                           text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-sky-500/50
                           focus:border-sky-400 transition"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mt-5">
            <label className="text-xs text-gray-400">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message..."
              rows={5}
              className="w-full mt-2 px-4 py-3 rounded-lg 
                          bg-transparent border border-white/20 
                         text-white placeholder-gray-500 resize-none
                         focus:outline-none focus:ring-2 focus:ring-sky-500/50
                         focus:border-sky-400 transition"
            />
          </div>

          {/* Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`
                relative px-8 py-3 rounded-lg font-semibold transition-all duration-300
                ${loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 hover:shadow-lg hover:shadow-sky-500/30 active:scale-95"
                }
              `}
            >
              {loading ? "Sending..." : "Send Message"}

              {/* Glow */}
              {!loading && (
                <span className="absolute inset-0 rounded-lg bg-sky-400/20 blur-lg opacity-0 hover:opacity-100 transition" />
              )}
            </button>
          </div>

        </form>
      </section>
    </ScrollReveal>
  );
}

export default ContactUs;