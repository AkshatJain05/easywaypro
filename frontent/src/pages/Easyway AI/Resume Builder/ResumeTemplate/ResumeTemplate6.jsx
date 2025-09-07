import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaGlobe,
} from "react-icons/fa";

const ResumeTemplate6 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;

  const SectionTitle = ({ title }) => (
    <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 uppercase tracking-widest">
      {title}
    </h2>
  );

  return (
    <div
      id="resume-preview"
      className="p-8 print:p-6 bg-white text-gray-800 font-sans text-sm leading-relaxed min-w-full shadow-lg"
    >
      {/* --- HEADER --- */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-xl text-gray-700 font-medium mt-1">
          {personalInfo.title || "Professional Title"}
        </p>

        <div className="flex justify-center flex-wrap gap-4 mt-3 text-gray-600 text-sm">
          {personalInfo.email && (
            <span className="flex items-center gap-2">
              <FaEnvelope className="text-gray-600" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-2">
              <FaPhone className="text-gray-600 rotate-90" />{" "}
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-600" />{" "}
              {personalInfo.address}
            </span>
          )}
        </div>

        <div className="flex justify-center flex-wrap gap-4 mt-2 text-blue-600">
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
              className="hover:underline flex items-center gap-1"
            >
              <FaGlobe /> Portfolio
            </a>
          )}
        </div>
      </header>

      {/* --- SUMMARY --- */}
      {personalInfo.summary && (
        <section className="mb-6">
          <SectionTitle title="CAREER OBJECTIVE" />
          <p className="text-gray-700 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Experience" />
          {experience.map((exp) => (
            <div
              key={exp.id}
              className="mb-5 pb-2 border-b border-gray-300 last:border-b-0 last:mb-0"
            >
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <h3 className="font-semibold text-gray-900">{exp.company}</h3>
                <p className="text-xs text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p className="text-gray-700 font-medium mt-0.5 mb-1">
                {exp.position || "Role"}
              </p>
              {exp.points?.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="leading-snug">
                      {point}
                    </li>
                  ))}
                </ul>
              ) : exp.description ? (
                <p className="text-gray-700 mt-1.5 leading-relaxed">
                  {exp.description}
                </p>
              ) : null}
            </div>
          ))}
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
      {/* --- SKILLS --- */}
      {skills?.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Skills" />
          <div className="space-y-1.5">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.value);
                return acc;
              }, {})
            ).map(([category, skillList]) => (
              <p key={category} className="leading-relaxed">
                <span className="font-semibold text-gray-900">{category}:</span>{" "}
                <span className="">{skillList.join(", ")}.</span>
              </p>
            ))}
          </div>
        </section>
      )}
      {/* --- PROJECTS --- */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Projects" />
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="mb-6 pb-2 border-b border-gray-300 last:border-b-0 last:mb-0"
            >
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-1 sm:mt-0"
                  >
                    <FaLink className="w-3 h-3" /> View Project
                  </a>
                )}
              </div>

              {proj.technologies && (
                <p className="text-xs italic text-gray-500 mt-1 mb-2">
                  <span className="font-semibold">Technologies: </span>
                  {proj.technologies}
                </p>
              )}

              {proj.points?.length > 0 && (
                <ul className="list-disc text-gray-700 space-y-1 pl-5">
                  {proj.points.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* --- CERTIFICATIONS --- */}
      {certifications?.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Certifications & Awards" />
          <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
            {certifications.map((cert, index) => (
              <li key={index} className="leading-snug">
                <span className="font-semibold">{cert?.title}</span>
                {cert?.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-blue-600 hover:underline text-xs gap-0.5"
                  >
                    <FaLink size={11} /> View Credential
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

export default ResumeTemplate6;
