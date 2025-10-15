//"Minimal — No Skill Category"
const ResumeTemplate4 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;

  const SectionTitle = ({ title }) => (
    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase">
      {title}
    </h2>
  );

  return (
    <div
      id="resume-preview"
      className="p-6 print:p-4 bg-white text-gray-800 font-sans text-sm leading-relaxed shadow-md aspect-[8.5/11]"
    >
      {/* HEADER */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-md font-semibold text-gray-700">
          {personalInfo.title || "Professional Title"}
        </p>

        <div className="flex justify-center flex-wrap gap-4 text-gray-600 mt-2 text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>

        <div className="flex justify-center flex-wrap gap-4 text-blue-700 mt-1 text-xs">
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* SUMMARY */}
      {personalInfo.summary && (
        <section className="mb-4">
          <SectionTitle title="Summary" />
          <p className="text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Experience" />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between text-sm font-semibold">
                <span>{exp.company}</span>
                <span className="text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="italic text-gray-700">{exp.position}</p>
              {exp.points?.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 pl-4">
                  {exp.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Education" />
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between text-sm font-semibold">
                <span>{edu.school}</span>
                <span className="text-gray-500">
                  {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                </span>
              </div>
              <p className="italic text-gray-700">
                {edu.degree}
                {edu.marks ? ` | ${edu.marks}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Skills" />
          <div className="flex flex-wrap gap-2 text-gray-700 text-sm">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                {skill.value}
              </span>
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
                    <li key={idx} className="leading-snug text-justify">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Certifications & Awards" />
          <ul className="list-disc list-inside text-gray-700 pl-4 text-sm">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                {cert.title}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 ml-1 text-xs"
                  >
                    View
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

export default ResumeTemplate4;
