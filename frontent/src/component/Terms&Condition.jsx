import { Link } from "react-router-dom";
export default function TermsAndConditions() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-300">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4">Last Updated: September 2025</p>

      <p className="mb-6">
        Welcome to <strong>Easyway Pro</strong>. By using our website and
        services, you agree to the following Terms and Conditions. Please read
        them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Services</h2>
      <p className="mb-4">
        Easyway Pro is provided for educational and demonstration purposes.
        Users agree not to misuse the platform or attempt to disrupt its
        functionality.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Accounts & Responsibility</h2>
      <p className="mb-4">
        If you create an account, you are responsible for maintaining the
        security of your login information and for all activities under your
        account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Intellectual Property</h2>
      <p className="mb-4">
        All content, tools, and services on Easyway Pro are owned by the project
        team unless otherwise stated. You may not copy, reproduce, or distribute
        without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
      <p className="mb-4">
        Easyway Pro is a college project and is provided “as is.” We do not
        guarantee accuracy, reliability, or availability. We are not responsible
        for any losses or damages caused by using the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Third-Party Services</h2>
      <p className="mb-4">
        Our platform may use third-party services (e.g., hosting on Render or
        APIs). We are not responsible for any issues caused by those services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate access to Easyway Pro at
        any time, without notice, if users violate these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms from time to time. Updates will be posted on
        this page with a new "Last Updated" date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Note:</h2>
      <p  className="mb-4">This project is for educational purposes only and not intended as a commercial service.</p>

       <p className="mt-8">
        If you have questions,  <Link to="/contact-us" className="text-blue-300 underline mx-2">Contact us</Link>
      </p>
    </div>
  );
}
