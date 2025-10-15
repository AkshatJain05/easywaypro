//Two-Column Simple Layout
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaGlobe,
} from "react-icons/fa";

const ResumeTemplate2 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;

  return (
    <div
      id="resume-preview"
      className="p-6 bg-white text-gray-800 font-sans text-sm leading-normal grid grid-cols-12 gap-6 print:p-4 print:gap-4"
    >
      {/* Left Column */}
      <div className="col-span-4 pr-4 border-r border-gray-200 print:col-span-3">
        {/* Name & Title */}
        <div className="text-center mb-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            {personalInfo.name || "Your Name"}
          </h1>
          <p className="text-md text-gray-700 font-medium">
            {personalInfo.title || "Professional Title"}
          </p>
        </div>

        {/* Contact */}
        <section className="mb-6">
          <h2 className="text-md font-bold text-gray-700 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
            Contact
          </h2>
          <div className="space-y-1 text-xs">
            {personalInfo.email && (
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" /> {personalInfo.email}
              </p>
            )}
            {personalInfo.phone && (
              <p className="flex items-center gap-2">
                <FaPhone className="rotate-90 text-gray-500" />{" "}
                {personalInfo.phone}
              </p>
            )}
            {personalInfo.address && (
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" />{" "}
                {personalInfo.address}
              </p>
            )}
            {personalInfo.linkedin && (
              <a
                href={`https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:underline"
              >
                <FaLinkedin /> LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a
                href={`https://${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:underline"
              >
                <FaGithub /> GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a
                href={personalInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:underline"
              >
                <FaGlobe /> Portfolio
              </a>
            )}
          </div>
        </section>

        {/* Skills */}
        {skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold text-gray-700 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
              Skills
            </h2>
            <div className="space-y-3 text-sm">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill.value);
                  return acc;
                }, {})
              ).map(([category, skillList]) => (
                <div key={category}>
                  <p className="font-semibold text-gray-800 mb-1">
                    {category}:
                  </p>
                  <ul className="list-disc list-inside ml-4 text-gray-700 space-y-0.5">
                    {skillList.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-md font-bold text-gray-700 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
              Certifications
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 pl-2">
              {certifications.map((cert, index) => (
                <li key={index} className="leading-tight">
                  <span className="font-semibold">{cert?.title}</span>
                  {cert?.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center text-blue-600 hover:underline"
                    >
                      <FaLink size={9} className="mr-0.5" /> View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {/* Right Column */}
      <div className="col-span-8 pl-4 print:col-span-9">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
              CAREER OBJECTIVE
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between flex-wrap items-baseline gap-y-1">
                    <h3 className="font-bold text-gray-800 text-md">
                      {exp.company}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {exp.position || "Role"}
                  </p>
                  {exp.points?.length > 0 ? (
                    <ul className="list-disc list-inside pl-5 text-gray-700 space-y-1 leading-relaxed">
                      {exp.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    exp.description && (
                      <p className="text-gray-700 mt-1">{exp.description}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between flex-wrap items-baseline gap-y-1">
                    <h3 className="font-semibold text-gray-800 text-md">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                    </p>
                  </div>
                  <p className="italic text-gray-700">{edu.school}</p>
                  {edu.marks && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Marks/Grade:</span>{" "}
                      {edu.marks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 pb-1 mb-2 uppercase tracking-wide border-b border-gray-300">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between flex-wrap items-baseline gap-y-1">
                    <h3 className="font-bold text-gray-800 text-md">
                      {proj.name}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs inline-flex items-center gap-1"
                      >
                        <FaLink className="w-3 h-3" /> View Project
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <p className="text-xs italic text-gray-600 mt-0.5">
                      <span className="font-semibold">Tech:</span>{" "}
                      {proj.technologies}
                    </p>
                  )}
                  {proj.points?.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 pl-2 space-y-1 leading-relaxed">
                      {proj.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate2;
