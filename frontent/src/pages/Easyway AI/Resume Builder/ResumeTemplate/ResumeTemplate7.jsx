const ResumeTemplate1 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    skills,
    projects,
    experience,
    certifications,
  } = resumeData;

  return (
    <div
      id="resume-preview"
      className="p-6 print:p-6 bg-white shadow text-gray-900 font-sans leading-relaxed text-sm max-w-3xl mx-auto"
    >
      {/* --- HEADER --- */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-semibold">{personalInfo.name}</h1>
        {personalInfo.title && (
          <p className="text-base font-medium text-gray-700">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-700 mt-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-blue-700 mt-1">
          {personalInfo.linkedin && (
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          )}
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
        <section className="mb-3">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-1 uppercase">
            Career Objective
          </h2>
          <p className="text-xs text-gray-800 text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* --- EDUCATION --- */}
      {education?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-1 uppercase">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{edu.school}</span>
                <span className="text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="text-xs italic text-gray-700">{edu.degree}</p>
              {edu.marks && (
                <p className="text-xs text-gray-700">{edu.marks}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* --- SKILLS --- */}
      {skills?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-1 uppercase">
            Skills
          </h2>
          <div className="space-y-0.5 text-xs">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.value);
                return acc;
              }, {})
            ).map(([category, skillList]) => (
              <p key={category}>
                <span className="font-semibold">{category}:</span>{" "}
                {skillList.join(", ")}.
              </p>
            ))}
          </div>
        </section>
      )}

      {/* --- PROJECTS --- */}
      {projects?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-1 uppercase">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              {/* Project Title + Link */}
              <div className="flex justify-between text-xs">
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

              {/* Tech Stack */}
              {proj.technologies && (
                <p className="text-xs italic text-gray-700">
                  Tech: {proj.technologies}
                </p>
              )}

              {/* Bullet Points */}
              {proj.points?.length > 0 && (
                <ul className="list-disc pl-4 text-xs text-gray-800 space-y-1">
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

      {/* --- EXPERIENCE --- */}
      {experience?.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-1 uppercase">
            Internships / Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{exp.company}</span>
                <span className="text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-xs font-medium">{exp.position}</p>
              {exp.points?.length > 0 && (
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                  {exp.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* --- CERTIFICATIONS --- */}
      {certifications?.length > 0 && (
        <section>
          <h2 className="text-sm font-bold border-b border-gray-300 mb-1 uppercase">
            Certifications
          </h2>
          <ul className="list-disc list-inside text-xs text-gray-800 space-y-0.5">
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

export default ResumeTemplate1;
