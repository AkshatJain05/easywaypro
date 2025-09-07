import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaGlobe,
} from "react-icons/fa";

const ResumeTemplate1 = ({ resumeData }) => {
  const { personalInfo, education, experience, skills, projects } = resumeData;

  return (
    <div
      id="resume-preview"
      className="p-8 print:p-6 bg-white shadow-md aspect-[8.5/11] min-w-full text-gray-900 font-sans leading-relaxed"
    >
      {/* --- HEADER --- */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-wide pb-1">
          {personalInfo.name}
        </h1>
        <div className="flex justify-center flex-wrap gap-4 text-sm mt-2 text-gray-700">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <FaEnvelope /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <FaPhone className="rotate-90" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt /> {personalInfo.address}
            </span>
          )}
        </div>
        <div className="flex justify-center gap-4 text-sm mt-2 text-blue-700">
          {personalInfo.linkedin && (
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <FaLinkedin /> LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <FaGithub /> GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <FaGlobe className="w-4 h-4" /> Portfolio
            </a>
          )}
        </div>
      </header>

      {/* --- OBJECTIVE --- */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
            CAREER OBJECTIVE
          </h2>
          <p className="text-sm text-gray-800 text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* --- EDUCATION --- */}
      {education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-4 uppercase">
            Education
          </h2>
          {education.map((edu) => (
            <div
              key={edu.id}
              className="mb-5 pb-2 border-b border-gray-200 last:border-b-0 last:mb-0"
            >
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-semibold text-gray-900 text-md">
                  {edu.school}
                </h3>
                <p className="text-sm text-gray-500">
                  {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                </p>
              </div>
              <div className="flex justify-between items-start flex-wrap gap-2 mt-1 text-sm">
                <p className="italic text-gray-700">{edu.degree}</p>
                {edu.marks && (
                  <p className="font-medium text-gray-700">{edu.marks}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
            EXPERIENCE
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{exp.company}</h3>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {exp.position || "Role"}
              </p>

              {exp.points?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                  {exp.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              ) : (
                exp.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {exp.description}
                  </p>
                )
              )}
            </div>
          ))}
        </section>
      )}

      {/* --- SKILLS --- */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1 mb-2">
            SKILLS
          </h2>
          <div className="space-y-1 text-sm">
            {Object.entries(
              resumeData.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.value);
                return acc;
              }, {})
            ).map(([category, skillList]) => (
              <p key={category}>
                <span className="font-semibold text-gray-800">{category}:</span>{" "}
                <span className=" text-gray-700">{skillList.join(", ")}.</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {/* --- PROJECTS --- */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">
            PROJECTS
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              {/* Project Title + Link */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-md">{proj.name}</h3>
                {/* Link */}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs sm:text-sm inline-flex items-center gap-1 mt-1"
                  >
                    <FaLink className="w-3.5 h-3.5" />
                    <span className="font-medium">View Project</span>
                  </a>
                )}
              </div>

              {/* Technologies */}
              {proj.technologies && (
                <p className="text-sm italic text-gray-700 mb-1">
                  <span className="font-medium">Tech: </span>
                  {proj.technologies}
                </p>
              )}

              {/* Bullet Points */}
              {proj.points && proj.points.length > 0 && (
                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                  {proj.points.map((point, idx) => (
                    <li key={idx} className="leading-snug">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800  border-b pb-1 mb-2">
            Certifications & Achievements
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {resumeData.certifications.map((cert, index) => (
              <li key={index} className="text-sm text-gray-700">
                {/* Show Certification Name */}
                <span className="font-semi">{cert?.title}</span>

                {/* Show Certification Link */}
                {cert?.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-blue-600 hover:underline text-xs"
                  >
                    <FaLink size={12} className="mx-1" />{" "}
                    <span className="text-sm">View</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate1;
