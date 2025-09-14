import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaGlobe,
} from "react-icons/fa";

const ResumeTemplate3 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;

  const SectionTitle = ({ title }) => (
    <h2 className="text-lg font-bold text-gray-800 pb-1 mb-2 border-b border-blue-200 uppercase tracking-widest text-left">
      {title}
    </h2>
  );

  return (
    <div
      id="resume-preview"
      className="p-8 print:p-6 bg-white shadow-lg aspect-[8.5/11] min-w-full text-gray-800 font-sans text-sm leading-snug"
    >
      {/* --- HEADER --- */}
      <header className="text-center mb-1 print:mb-1">
        <h1 className="text-[40px] font-semibold text-gray-900">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          {personalInfo.title || "Professional Title"}
        </p>

        <div className="flex justify-center flex-wrap gap-x-4 gap-b-1 text-gray-600 text-[14px] print:text-[14px]">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <FaEnvelope className="text-gray-600" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <FaPhone className="rotate-90 text-gray-600" />{" "}
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-gray-600" />{" "}
              {personalInfo.address}
            </span>
          )}
        </div>

        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-blue-700 mt-2 text-[14px] print:text-[14px]">
          {personalInfo.linkedin && (
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <FaLinkedin className="text-blue-800" /> LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <FaGithub className="text-blue-800" /> GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <FaGlobe className="text-blue-800" /> Portfolio
            </a>
          )}
        </div>
      </header>

      {/* --- SUMMARY --- */}
      {personalInfo.summary && (
        <section className="mb-6 print:mb-4 mt-3">
          <SectionTitle title="CAREER OBJECTIVE" />
          <p className="text-gray-700 text-sm leading-snug text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {experience?.length > 0 && (
        <section className="mb-6 print:mb-4">
          <SectionTitle title="Experience" />
          {experience.map((exp) => (
            <div
              key={exp.id}
              className="mb-3 pb-1 border-b border-gray-100 last:border-b-0 last:mb-0"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900 text-sm">
                  {exp.company}
                </h3>
                <p className="text-xs text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-0.5 mb-1">
                {exp.position || "Role"}
              </p>
              {exp.points?.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-3">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="leading-snug">
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                exp.description && (
                  <p className="text-gray-700 mt-1 leading-snug">
                    {exp.description}
                  </p>
                )
              )}
            </div>
          ))}
        </section>
      )}

      {/* --- EDUCATION --- */}
      {education?.length > 0 && (
        <section className="mb-6 print:mb-4">
          <SectionTitle title="Education" />
          {education.map((edu) => (
            <div
              key={edu.id}
              className="mb-2 pb-1 border-b border-gray-100 last:border-b-0 last:mb-0"
            >
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-700 text-sm">
                  {edu.school}
                </h3>
                <p className="text-xs text-gray-500">
                  {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                </p>
              </div>
              <div className="flex justify-between text-sm mt-0.5">
                <p className="italic text-gray-700">{edu.degree}</p>
                {edu.marks && (
                  <p className="font-semibold text-gray-700">{edu.marks}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* --- SKILLS --- */}
      {skills?.length > 0 && (
        <section className="mb-6 print:mb-4">
          <SectionTitle title="Skills" />
          <div className="space-y-1 text-gray-700">
            {Object.entries(
              resumeData.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.value);
                return acc;
              }, {})
            ).map(([category, skillList]) => (
              <p key={category} className=" text-sm">
                <span className="font-semibold text-gray-700">{category}:</span>{" "}
                <span className="font-medium">{skillList.join(", ")}.</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {/* --- PROJECTS --- */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <SectionTitle title="PROJECTS" />
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
                    className="text-blue-800 hover:underline text-xs sm:text-sm inline-flex items-center gap-1 mt-1"
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

      {/* --- CERTIFICATIONS --- */}
      {certifications?.length > 0 && (
        <section className="mb-6 print:mb-4">
          <SectionTitle title="Certifications & Awards" />
          <ul className="list-disc list-inside space-y-1 text-gray-700 pl-3">
            {certifications.map((cert, index) => (
              <li key={index} className="leading-snug text-sm">
                <span className="font-semibold">{cert?.title}</span>
                {cert?.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-blue-800 hover:underline text-xs"
                  >
                    <FaLink size={11} className="mr-0.5 ml-2" />{" "}
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

export default ResumeTemplate3;
