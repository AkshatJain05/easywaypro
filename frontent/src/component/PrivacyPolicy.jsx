import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-10 text-gray-300">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last Updated: September 2025</p>

      <p className="mb-6">
        At <strong>Easyway Pro</strong>, your privacy is important to us. This
        Privacy Policy explains how we collect, use, and protect your
        information when you use our website and services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>Personal Information (if provided):</strong> Name, email
          address, or contact details (e.g., when using a contact form).
        </li>
        <li>
          <strong>Non-Personal Information:</strong> Browser type, device info,
          and usage data.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide and improve our services.</li>
        <li>To respond to questions or feedback.</li>
        <li>To maintain security and prevent misuse.</li>
        <li>For educational/demo purposes (college project).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing of Information</h2>
      <p className="mb-4">
        We do <strong>not sell or rent</strong> your personal information. We
        may share data only if required by law or for security reasons.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We use reasonable technical measures to protect your information.
        However, no website is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cookies</h2>
      <p className="mb-4">
        Easyway Pro may use cookies to improve user experience. You can disable
        cookies in your browser settings if you prefer.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Third-Party Services</h2>
      <p className="mb-4">
        If we use third-party tools (like analytics, APIs, or hosting on
        Render), those services may collect limited information according to
        their own privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Children’s Privacy</h2>
      <p className="mb-4">
        Our platform is intended for students and learners. We do not knowingly
        collect data from children under 13.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Updates will be
        posted on this page with a new "Last Updated" date.
      </p>


      <h2 className="text-xl font-semibold mt-6 mb-2">9. Note:</h2>
      <p  className="mb-4">This project is for educational purposes only and not intended as a commercial service.</p>

      <p className="mt-8">
        If you have questions,  <Link to="/contact-us" className="text-blue-300 underline mx-2">Contact us</Link>
      </p>
    </div>
  );
}
