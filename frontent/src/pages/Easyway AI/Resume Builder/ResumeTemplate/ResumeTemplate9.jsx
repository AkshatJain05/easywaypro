//IndigoPro — Modern Professional Design

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaGlobe,
} from "react-icons/fa";

// --- Define Primary Accent Colors ---
const ACCENT_COLOR_TITLE = "text-indigo-900";
const ACCENT_COLOR_DIVIDER = "border-indigo-400";
const ACCENT_COLOR_LINK = "text-indigo-700";
const TEXT_COLOR_BODY = "text-slate-950";
const TEXT_COLOR_HEADER = "text-slate-900";

const ResumeTemplate9 = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications,
  } = resumeData;

  // --- SectionTitle Component ---
  const SectionTitle = ({ title }) => (
    <>
      <h2
        className={`text-xl font-bold ${ACCENT_COLOR_TITLE} uppercase tracking-wide text-left mt-4 mb-1 print:mt-3`}
      >
        {title}
      </h2>
      <hr className={`border-t-2 ${ACCENT_COLOR_DIVIDER} mb-3 print:mb-2`} />
    </>
  );

  return (
    <div
      id="resume-preview"
      // Added max-w-3xl for better readability on very large screens, but kept min-w-full
      className={`
        mx-auto bg-white shadow-xl rounded-lg overflow-hidden
        w-full max-w-[794px] min-h-[1123px]  /* A4 size (210×297mm @96DPI) */
        aspect-[210/297] p-8 print:p-6
        print:shadow-none print:rounded-none
        font-sans text-sm leading-relaxed ${TEXT_COLOR_BODY}
      `}
    >
      {/* ========================================
        --- HEADER (Responsive 2-column for wide view/print) ---
        ========================================
      */}
      <header
        className={`flex flex-col sm:flex-row justify-between sm:items-center border-b-4 ${ACCENT_COLOR_TITLE} pb-4 mb-6`}
      >
        {/* Left — Name & Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className={`text-3xl sm:text-4xl font-bold ${TEXT_COLOR_HEADER}`}>
            {personalInfo.name || "Your Name"}
          </h1>
          <p className="text-sm text-indigo-700 font-medium mt-1">
            {personalInfo.title || "Professional Title"}
          </p>
        </div>

        {/* Right — Contact Info */}
        <div className="flex flex-col sm:items-end text-slate-700 gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-start sm:justify-end text-sm">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1 hover:text-indigo-700 transition-colors"
              >
                <FaEnvelope className="text-indigo-800 text-xs" />
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && (
              <a
                href={`tel:${personalInfo.phone}`}
                className="flex items-center gap-1 hover:text-indigo-700 transition-colors"
              >
                <FaPhone className="text-indigo-800 text-xs rotate-90" />
                {personalInfo.phone}
              </a>
            )}
            {personalInfo.address && (
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-indigo-800 text-xs" />
                {personalInfo.address}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-1 justify-start sm:justify-end">
            {personalInfo.linkedin && (
              <a
                href={`https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ACCENT_COLOR_LINK} flex items-center gap-1 hover:underline`}
              >
                <FaLinkedin />
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a
                href={`https://${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ACCENT_COLOR_LINK} flex items-center gap-1 hover:underline`}
              >
                <FaGithub />
                GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a
                href={personalInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ACCENT_COLOR_LINK} flex items-center gap-1 hover:underline`}
              >
                <FaGlobe />
                Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ========================================
        --- MAIN CONTENT SECTIONS --- 
        The main body naturally stacks on small screens (mobile/default flex-col)
        and flows nicely for print/desktop.
        ========================================
      */}

      {/* PROFESSIONAL SUMMARY */}
      {personalInfo.summary && (
        <section className="mb-5 print:mb-4">
          <SectionTitle title="PROFESSIONAL SUMMARY" />
          <p className="text-slate-700 leading-relaxed text-left">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {experience?.length > 0 && (
        <section className="mb-5 print:mb-4">
          <SectionTitle title="PROFESSIONAL EXPERIENCE" />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 last:mb-0">
              {/* Added flex-col-reverse for sm:flex-row to ensure dates stack nicely on mobile */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-baseline">
                <h3 className={`font-bold text-base ${TEXT_COLOR_HEADER}`}>
                  {exp.company}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-0.5 sm:mb-0">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p
                className={`text-sm italic font-semibold ${ACCENT_COLOR_TITLE} mb-1`}
              >
                {exp.position || "Role"}
              </p>
              {exp.points?.length > 0 && (
                <ul className="list-disc text-slate-700 space-y-1 ml-5">
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

      {/* TECHNICAL SKILLS */}
      {skills?.length > 0 && (
        <section className="mb-5 print:mb-4">
          <SectionTitle title="TECHNICAL SKILLS" />
          <div className="space-y-1.5 text-slate-700">
            {Object.entries(
              resumeData.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.value);
                return acc;
              }, {})
            ).map(([category, skillList]) => (
              <p key={category}>
                <span
                  className={`font-bold ${TEXT_COLOR_HEADER} uppercase text-sm mr-2`}
                >
                  {category}:
                </span>
                <span className="font-normal">{skillList.join(", ")}.</span>
              </p>
            ))}
          </div>
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

      {/* KEY PROJECTS */}
      {projects?.length > 0 && (
        <section className="mb-5 print:mb-4">
          <SectionTitle title="KEY PROJECTS" />
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4 last:mb-0">
              {/* Added flex-col-reverse for sm:flex-row for link stacking on small screens */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-baseline">
                <h3 className={`font-bold text-base ${TEXT_COLOR_HEADER}`}>
                  {proj.name}
                </h3>
                {/* Link stacking on small screens */}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${ACCENT_COLOR_LINK} hover:underline text-sm inline-flex items-center gap-1 font-medium mb-1 sm:mb-0`}
                  >
                    <FaLink className="w-3 h-3" />
                    View Project
                  </a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-sm text-slate-700 mb-1">
                  <span className={`font-semibold ${ACCENT_COLOR_TITLE}`}>
                    Tech Stack:{" "}
                  </span>
                  {proj.technologies}
                </p>
              )}
              {proj.points?.length > 0 && (
                <ul className="list-disc text-slate-700 space-y-1 ml-5">
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

      {/* CERTIFICATIONS & AWARDS */}
      {certifications?.length > 0 && (
        <section>
          <SectionTitle title="CERTIFICATIONS & AWARDS" />
          <ul className="list-disc text-slate-700 space-y-1.5 ml-5">
            {certifications.map((cert, index) => (
              <li key={index} className="leading-snug">
                <span className={`font-semibold ${TEXT_COLOR_HEADER}`}>
                  {cert?.title}
                </span>
                {cert?.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ml-2 inline-flex items-center gap-1 ${ACCENT_COLOR_LINK} hover:underline font-medium`}
                  >
                    <FaLink size={12} />
                    View Credential
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

export default ResumeTemplate9;
