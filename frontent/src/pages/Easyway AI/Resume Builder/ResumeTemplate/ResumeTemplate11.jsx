//BluePro(2) — Modern Professional Design


import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe, FaLink } from "react-icons/fa";

const SectionTitle = ({ title }) => (
  <div className="mb-2.5">
    <h2 className="text-[10.5px] font-semibold tracking-[1.4px] text-blue-600 uppercase pb-1.5 border-b border-blue-100">
      {title}
    </h2>
  </div>
);

const ResumeTemplate11 = ({ resumeData }) => {
  const { personalInfo, education, experience, skills, projects, certifications } = resumeData;

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.value);
    return acc;
  }, {}) ?? {};

  return (
    <div
      id="resume-preview"
      className="bg-white text-gray-900 font-sans text-[13px] leading-relaxed
                 px-8 py-10 shadow-sm aspect-[8.5/11] min-w-full print:px-8 print:py-6"
    >
     
      {/* ── HEADER ── */}
      <header className="mb-3">
        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight leading-none">
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-sm font-medium text-blue-600 mt-1 mb-3">
          {personalInfo.title || "Professional Title"}
        </p>

        {/* Contact Row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-slate-500 items-center">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <FaEnvelope className="text-slate-400" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <FaPhone className="rotate-90 text-slate-400" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-slate-400" /> {personalInfo.address}
            </span>
          )}
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-blue-600 hover:underline">
              <FaLinkedin /> LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-blue-600 hover:underline">
              <FaGithub /> GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-blue-600 hover:underline">
              <FaGlobe /> Portfolio
            </a>
          )}
        </div>

        {/* Gradient divider */}
        <div className="h-[1.5px] bg-gradient-to-r from-blue-500 to-slate-100 mt-4" />
      </header>

      {/* ── SUMMARY ── */}
      {personalInfo.summary && (
        <section className="mb-4">
          <SectionTitle title="Professional Summary" />
          <p className="text-[12.5px] text-slate-600 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {experience?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Professional Experience" />
          {experience.map((exp) => (
            <div key={exp.id}
                 className="mb-3 pb-3 border-b border-slate-50 last:border-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[13.5px] text-slate-900">{exp.company}</span>
                <span className="text-[11.5px] text-slate-400 whitespace-nowrap">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className="text-[12.5px] font-medium text-blue-600 mt-0.5 mb-1.5">
                {exp.position || "Role"}
              </p>
              {exp.points?.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {exp.points.map((pt, i) => (
                    <li key={i} className="text-[12.5px] leading-snug">{pt}</li>
                  ))}
                </ul>
              ) : exp.description ? (
                <p className="text-[12.5px] text-slate-700">{exp.description}</p>
              ) : null}
            </div>
          ))}
        </section>
      )}

      {/* ── SKILLS ── */}
      {skills?.length > 0 && (
        <section className="mb-4">
          <SectionTitle title="Skills" />
          <div className="space-y-1.5">
            {Object.entries(groupedSkills).map(([category, list]) => (
              <div key={category} className="flex items-start gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-slate-900 min-w-[100px]">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1">
                  {list.map((s) => (
                    <span key={s}
                          className="bg-blue-50 text-blue-800 text-[11.5px] px-2.5 py-0.5
                                     rounded border border-blue-100 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION + CERTIFICATIONS (2-col) ── */}
      <div className="grid grid-cols-1 gap-8 mb-4">
        {education?.length > 0 && (
          <section>
            <SectionTitle title="Education" />
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between text-[13px] font-semibold">
                  <span>{edu.school}</span>
                  <span className="text-slate-400 text-[11.5px]">
                    {edu.startDate}{edu.endDate && ` – ${edu.endDate}`}
                  </span>
                </div>
                <p className="text-[12.5px] italic text-slate-500">
                  {edu.degree}{edu.marks && ` · ${edu.marks}`}
                </p>
              </div>
            ))}
          </section>
        )}

        {certifications?.length > 0 && (
          <section>
            <SectionTitle title="Certifications & Awards" />
            <ul className="space-y-1">
              {certifications.map((cert, i) => (
                <li key={i} className="flex items-center gap-2 text-[12.5px] text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="font-medium">{cert.title}</span>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-0.5 text-blue-600 hover:underline text-[11px] ml-1">
                      <FaLink size={10} /> View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ── PROJECTS ── */}
      {projects?.length > 0 && (
        <section>
          <SectionTitle title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id}
                 className="mb-3 pb-3 border-b border-slate-50 last:border-0 last:mb-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[13px] text-slate-900">{proj.name}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1 text-blue-600 hover:underline text-[11.5px]">
                    <FaLink size={11} /> View Project
                  </a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-[11.5px] font-medium text-blue-500 mt-0.5 mb-1">
                  {proj.technologies}
                </p>
              )}
              {proj.points?.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {proj.points.map((pt, i) => (
                    <li key={i} className="text-[12.5px] leading-snug text-justify">{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ResumeTemplate11;