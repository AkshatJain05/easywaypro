const PersonalInfo = ({ resumeData, updateResumeData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateResumeData("personalInfo", { ...resumeData.personalInfo, [name]: value });
  };

  return (
    <div className="space-y-4 ">
      <h2 className="text-xl font-semibold text-gray-950 dark:text-white border-b pb-2 dark:border-gray-600">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={resumeData.personalInfo.name}
          onChange={handleChange}
          className="p-2 border rounded-md  border-gray-600"
        />
         <input
          type="text"
          name="title"
          placeholder="Professional Title"
          value={resumeData.personalInfo.title}
          onChange={handleChange}
          className="p-2 border rounded-md  border-gray-600"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={resumeData.personalInfo.email}
          onChange={handleChange}
          className="p-2 border rounded-md  border-gray-600"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={resumeData.personalInfo.phone}
          onChange={handleChange}
          className="p-2 border rounded-md border-gray-600"
        />

        <input
          type="text"
          name="address"
          placeholder="Address (City, State)"
          value={resumeData.personalInfo.address}
          onChange={handleChange}
          className="p-2 border rounded-md  border-gray-600"
        />

        <input
          type="text"
          name="linkedin"
          placeholder="linkedin.com/in/your-profile-name"
          value={resumeData.personalInfo.linkedin}
          onChange={handleChange}
          className="p-2 border rounded-md  border-gray-600"
        />

        <input
          type="text"
          name="github"
          placeholder="github.com/username"
          value={resumeData.personalInfo.github}
          onChange={handleChange}
          className="p-2 border rounded-md  border-gray-600"
        />

        <input
          type="text"
          name="portfolio"
          placeholder="Portfolio Website URL"
          value={resumeData.personalInfo.portfolio || ""}
          onChange={handleChange}
          className="p-2 border rounded-md border-gray-600 "
        />
      </div>

      <textarea
        name="summary"
        placeholder="Professional Summary or Career Objective..."
        rows="4"
        value={resumeData.personalInfo.summary}
        onChange={handleChange}
        className="w-full p-2  border rounded-md  border-gray-600"
      />
    </div>
  );
};

export default PersonalInfo;
