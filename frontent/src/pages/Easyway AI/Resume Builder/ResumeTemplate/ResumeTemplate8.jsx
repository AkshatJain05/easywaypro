// Modern Two-Column Resume
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
    <>
      <h2 className="text-xl font-extrabold text-indigo-800 uppercase tracking-wide mt-4 mb-1">
        {title}
      </h2>
      <hr className="border-t-2 border-indigo-400 mb-3" />
    </>
  );

  const MainSection = ({ title, children }) => (
    <section className="mb-6 break-inside-avoid">
      <h3 className="text-lg font-bold text-gray-700 uppercase tracking-wider mb-2 border-b-2 border-gray-300 pb-1">
        {title}
      </h3>
      {children}
    </section>
  );

  const SidebarSection = ({ title, children }) => (
    <section className="mb-6 break-inside-avoid">
      <h3 className="text-indigo-300 uppercase font-bold tracking-wider text-sm mb-2">
        {title}
      </h3>
      {children}
    </section>
  );

  return (
    <div id="resume-container" className="bg-gray-100">
      <div
        id="resume-preview"
        className="
          w-full max-w-4xl mx-auto bg-white
          shadow-2xl rounded-lg overflow-hidden
          flex flex-col md:flex-row
          font-sans text-gray-800
        "
      >
        {/* LEFT SIDEBAR */}
        <aside className="w-full md:w-1/3 bg-gray-800 text-white p-6 print:p-8 flex flex-col gap-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {personalInfo.name || "Your Name"}
            </h1>
            <h2 className="text-sm font-semibold text-indigo-300 mt-1">
              {personalInfo.title || "Professional Title"}
            </h2>
          </div>

          {/* Contact */}
          <SidebarSection title="Contact">
            <div className="flex flex-col gap-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2 break-all">
                  <FaEnvelope className="text-indigo-300 w-4 h-4 flex-shrink-0" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-indigo-300 w-4 h-4 flex-shrink-0 rotate-90" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-indigo-300 w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{personalInfo.address}</span>
                </div>
              )}
            </div>
          </SidebarSection>

          {/* Social Links */}
          <SidebarSection title="Links">
            <div className="flex flex-col gap-2 text-sm">
              {personalInfo.linkedin && (
                <a
                  href={
                    !personalInfo.linkedin.startsWith("http")
                      ? `https://${personalInfo.linkedin}`
                      : personalInfo.linkedin
                  }
                  className="flex items-center gap-2 hover:text-indigo-300 break-all"
                >
                  <FaLinkedin className="text-indigo-300 w-4 h-4 flex-shrink-0" />
                  <span>LinkedIn</span>
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={
                    !personalInfo.github.startsWith("http")
                      ? `https://${personalInfo.github}`
                      : personalInfo.github
                  }
                  className="flex items-center gap-2 hover:text-indigo-300 break-all"
                >
                  <FaGithub className="text-indigo-300 w-4 h-4 flex-shrink-0" />
                  <span>GitHub</span>
                </a>
              )}
              {personalInfo.portfolio && (
                <a
                  href={
                    !personalInfo.portfolio.startsWith("http")
                      ? `https://${personalInfo.portfolio}`
                      : personalInfo.portfolio
                  }
                  className="flex items-center gap-2 hover:text-indigo-300 break-all"
                >
                  <FaGlobe className="text-indigo-300 w-4 h-4 flex-shrink-0" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </SidebarSection>

          {/* Skills */}
          {skills?.length > 0 && (
            <SidebarSection title="Skills">
              <div className="space-y-3 text-sm">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill.value);
                    return acc;
                  }, {})
                ).map(([category, skillList]) => (
                  <div key={category} className="break-inside-avoid">
                    <h4 className="font-semibold text-gray-100 mb-1">
                      {category}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {skillList.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <SidebarSection title="Education">
              <div className="space-y-4 text-sm">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <h4 className="font-bold text-gray-100">{edu.school}</h4>
                    <p className="text-gray-300 italic">{edu.degree}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {edu.startDate} {edu.endDate && "-"} {edu.endDate}
                    </p>
                    {edu.marks && (
                      <p className="text-gray-400 text-xs">{edu.marks}</p>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="w-full md:w-2/3 p-6 print:p-8 bg-white">
          {personalInfo.summary && (
            <MainSection title="Professional Summary">
              <p className="text-sm text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </MainSection>
          )}

          {experience?.length > 0 && (
            <MainSection title="Experience">
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h4 className="text-base font-bold text-gray-800">
                        {exp.position}
                      </h4>
                      <p className="text-xs font-medium text-gray-500">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-indigo-600 mb-1">
                      {exp.company}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {exp.points?.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {projects?.length > 0 && (
            <MainSection title="Projects">
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                      <h4 className="text-base font-bold text-gray-800">
                        {proj.name}
                      </h4>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline text-xs font-semibold flex items-center gap-1"
                        >
                          <FaLink /> View Project
                        </a>
                      )}
                    </div>
                    {proj.technologies && (
                      <p className="text-xs text-gray-600 italic mb-1">
                        <span className="font-semibold not-italic">
                          Tech Stack:
                        </span>{" "}
                        {proj.technologies}
                      </p>
                    )}
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {proj.points?.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {certifications?.length > 0 && (
            <MainSection title="Certifications">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {certifications.map((cert, index) => (
                  <li key={index} className="break-inside-avoid">
                    <span className="font-semibold">{cert.title}</span> from{" "}
                    <span className="italic">{cert.issuer}</span>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-indigo-600 hover:underline text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <FaLink size={10} /> View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </MainSection>
          )}
        </main>

        {/* PRINT CSS */}
        <style jsx global>{`
          @media print {
            html,
            body {
              font-size: 10pt;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background: white;
            }
            #resume-container {
              padding: 0;
              margin: 0;
            }
            #resume-preview {
              width: 100%;
              height: 100%;
              max-width: none;
              box-shadow: none;
              border-radius: 0;
              margin: 0;
              display: flex !important;
              flex-direction: row !important;
            }
            aside {
              width: 35% !important;
              // padding-right: 1rem;
            }
            main {
              width: 65% !important;
            }
            .break-inside-avoid {
              page-break-inside: avoid;
            }
            a {
              text-decoration: none;
              color: inherit;
            }
            a[href]:after {
              content: none !important;
            }
          }
          @page {
            size: A4;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ResumeTemplate3;
