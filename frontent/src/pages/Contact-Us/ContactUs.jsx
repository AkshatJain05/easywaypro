import { useState } from "react";
import ScrollReveal from "../../component/ScllorAnimation";
import axios from "axios";
import toast from "react-hot-toast";

function ContactUs() {

  const API_URL = import.meta.env.VITE_API_URL;
  // ---------- State ----------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // ---------- Input Handler ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const onSumbit = (e)=>{ 
  e.preventDefault()

   axios.post(`${API_URL}/contacts`, formData, {
    withCredentials: true,
  })
  .then((response) => {
    toast.success("Contact message sent successfully!")
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  })
  .catch((error) => {
    console.error("Error sending contact message:", error);
    toast.error("Failed to send contact message.");
  });

}

  return (
    <ScrollReveal from="bottom">
      <section className="flex flex-col items-center px-5 py-12 md:py-16 text-slate-100">
        
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100">
          Contact Us
        </h2>
        <div className="flex justify-center mt-1">
          <hr className="bg-orange-500 h-1 rounded-full w-26 md:w-32 lg:w-38 border-0" />
        </div>
          <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed">
            Feel free to contact <span className="text-yellow-500 font-medium">Easyway Classes</span> —
            we’re always here to help you learn better!
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSumbit}
          className="mt-10 w-full max-w-3xl bg-gradient-to-br from-gray-950 to-black opacity-95 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-800"
        >
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 h-12 px-4 rounded-lg  border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Your Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 h-12 px-4 rounded-lg  border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mt-6 flex flex-col">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-2 h-40 p-4 rounded-lg border-1 border-gray-700 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 font-semibold rounded-lg shadow-md transition 
                ${loading 
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-yellow-500 hover:bg-yellow-400 text-gray-950 active:scale-95"}`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </section>
    </ScrollReveal>
  );
}

export default ContactUs;
