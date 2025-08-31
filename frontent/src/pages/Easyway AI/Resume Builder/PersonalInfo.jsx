const PersonalInfo = ({ resumeData, setResumeData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-600">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={resumeData.personalInfo.name}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={resumeData.personalInfo.email}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={resumeData.personalInfo.phone}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address (City, State)"
          value={resumeData.personalInfo.address}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* LinkedIn */}
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn Profile URL"
          value={resumeData.personalInfo.linkedin}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* GitHub */}
        <input
          type="text"
          name="github"
          placeholder="GitHub Profile URL"
          value={resumeData.personalInfo.github}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Portfolio */}
        <input
          type="text"
          name="portfolio"
          placeholder="Portfolio Website URL"
          value={resumeData.personalInfo.portfolio || ""}
          onChange={handleChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white md:col-span-2"
        />
      </div>

      {/* Professional Summary */}
      <textarea
        name="summary"
        placeholder="Professional Summary or Career Objective..."
        rows="4"
        value={resumeData.personalInfo.summary}
        onChange={handleChange}
        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
};

export default PersonalInfo;
