//Clean Layout (No Divider Lines)
const ResumeTemplate5 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.value);
    return acc;
  }, {});

  const SectionTitle = ({ title }) => (
    <h2 className="text-gray-900 font-bold text-sm uppercase mb-1">{title}</h2>
  );

  return (
    <div
      id="resume-preview"
      className="p-6 bg-white text-gray-900 font-sans text-sm leading-relaxed w-full max-w-[8.5in] min-h-[11in]"
    >
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-semibold">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-sm font-semibold mb-1">
          {personalInfo.title || "Professional Title"}
        </p>
        <p className="text-xs ">
          {personalInfo.email} | {personalInfo.phone} | {personalInfo.address}
        </p>
        <p className="text-xs mt-1 flex flex-wrap gap-4 text-gray-700  justify-center">
          {personalInfo.linkedin && (
            <a
              href={
                personalInfo.linkedin.startsWith("http")
                  ? personalInfo.linkedin
                  : `https://${personalInfo.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-600 font-medium"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={
                personalInfo.github.startsWith("http")
                  ? personalInfo.github
                  : `https://${personalInfo.github}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-600 font-medium"
            >
              GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a
              href={
                personalInfo.portfolio.startsWith("http")
                  ? personalInfo.portfolio
                  : `https://${personalInfo.portfolio}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-600 font-medium"
            >
              Portfolio
            </a>
          )}
        </p>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <SectionTitle title="Summary" />
          <p className="text-justify">{personalInfo.summary}</p>
        </section>
      )}

   {/* EXPERIENCE */}
{experience?.length > 0 && (
  <section className="mb-6">
    <SectionTitle title="Experience" />

    <div className="space-y-3">
      {experience.map((exp, index) => (
        <div
          key={exp.id || index}
          className="pb-2 border-b border-gray-200 last:border-none"
        >
          {/* TOP ROW */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="text-sm font-semibold text-gray-900">
              {exp.company || "Company Name"}
            </span>

            <span className="text-xs sm:text-sm text-gray-500">
              {exp.startDate || "Start"} — {exp.endDate || "Present"}
            </span>
          </div>

          {/* POSITION */}
          <p className="text-sm italic text-gray-700 mt-0.5">
            {exp.position || "Role"}
          </p>

          {/* ✅ POINTS OR DESCRIPTION */}
          {exp.points?.length > 0 ? (
            <ul className="mt-1.5 pl-5 list-disc text-gray-700 text-sm space-y-1 marker:text-gray-400">
              {exp.points.map((point, idx) => (
                <li key={`${exp.id}-${idx}`} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          ) : exp.description ? (
            <p className="mt-1.5 text-sm text-gray-700 leading-relaxed text-justify">
              {exp.description}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  </section>
)}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Education" />
          {education.map((edu) => (
            <div key={edu.id} className="mb-2 last:mb-0">
              <div className="flex justify-between font-semibold text-sm">
                <span>{edu.school}</span>
                <span className="text-gray-500 text-xs">
                  {edu.startDate} {edu.endDate && ` - ${edu.endDate}`}
                </span>
              </div>
              <p className="italic text-sm">
                {edu.degree}
                {edu.marks ? ` | ${edu.marks}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Skills" />
          {Object.entries(groupedSkills).map(([category, skillList]) => (
            <p key={category} className="text-sm mb-0.5">
              <span className="font-semibold">{category}:</span>{" "}
              {skillList.join(", ")}.
            </p>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2 last:mb-0">
              <div className="flex justify-between font-semibold text-sm">
                <span>{proj.name}</span>
                {proj.link && (
                  <span className="text-blue-700 underline text-xs">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  </span>
                )}
              </div>
              {proj.technologies && (
                <p className="italic text-sm mb-0.5">
                  Tech: {proj.technologies}
                </p>
              )}
              {proj.points?.length > 0 && (
                <ul className="list-disc pl-5 space-y-0.5">
                  {proj.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section>
          <SectionTitle title="Certifications & Awards" />
          <ul className="list-disc pl-5 space-y-0.5 text-sm">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                {cert.title}{" "}
                {cert.link && (
                  <a href={cert.link} className="text-blue-700 underline">
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

export default ResumeTemplate5;
