// Professional — Skills & Projects Focus

const ResumeTemplate7 = ({ resumeData }) => {
  const {
    personalInfo,
    experience,
    skills,
    projects,
    certifications,
    education,
  } = resumeData;

  return (
    <div
      id="resume-preview"
      className="p-8 max-w-3xl mx-auto bg-white text-gray-900 font-sans text-sm leading-relaxed print:p-6"
    >
      {/* --- HEADER --- */}
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold tracking-wide">
          {personalInfo.name}
        </h1>
        {personalInfo.title && (
          <p className="text-base text-gray-700 ">{personalInfo.title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-700 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}|
          {personalInfo.phone && <span>{personalInfo.phone}</span>}|
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-blue-700 mt-2">
          {personalInfo.linkedin && (
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          )}{" "}
          |
          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          )}{" "}
          |
          {personalInfo.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* --- SUMMARY --- */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase">
            Career Objective
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase">
            Internships / Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="font-semibold">{exp.company}</span>
                <span className="text-gray-600">
                  {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                </span>
              </div>
              <p className="text-xs font-medium mb-1">{exp.position}</p>
              {exp.points?.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                  {exp.points.map((point, idx) => (
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

      {/* --- SKILLS --- */}
      {skills?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase">
            Skills
          </h2>
          <div className="space-y-1 text-xs">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.value);
                return acc;
              }, {})
            ).map(([category, skillList]) => (
              <p key={category}>
                <span className="font-semibold">{category}:</span>{" "}
                {skillList.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* --- PROJECTS --- */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="font-semibold">{proj.name}</span>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-xs italic text-gray-700 mb-1">
                  Tech: {proj.technologies}
                </p>
              )}
              {proj.points?.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
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

      {/* --- EDUCATION (LAST) --- */}
      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-3 uppercase">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                {/* School & Degree */}
                <div>
                  <p className="font-semibold text-gray-900">{edu.school}</p>
                  <p className="text-xs italic text-gray-700 mt-0.5">
                    {edu.degree}
                    {edu.marks ? ` | ${edu.marks}` : ""}
                  </p>
                </div>

                {/* Dates */}
                <div className="text-xs text-gray-500 text-right">
                  <p>
                    {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* --- CERTIFICATIONS --- */}
      {certifications?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase">
            Certifications
          </h2>
          <ul className="list-disc pl-5 text-xs text-gray-800 space-y-1">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                {cert.title}{" "}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    (View)
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

export default ResumeTemplate7;
