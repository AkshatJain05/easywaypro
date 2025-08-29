import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegDotCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
// import axios from "axios";
// import { useEffect } from "react";

// -------- DATA --------
// const roadmapData = [
//   {
//     month: "Month 1 — Java & DSA Foundation",
//     steps: [
//       { day: "Day 1–5", topic: "Java Basics", details: ["Syntax", "Variables", "Data Types", "Loops", "Conditions", "Practice Problems"] },
//       { day: "Day 6–10", topic: "OOP in Java", details: ["Classes & Objects", "Constructors", "Encapsulation", "Inheritance", "Polymorphism", "Abstraction"] },
//       { day: "Day 11–15", topic: "DSA: Recursion", details: ["Introduction", "Basic Problems", "Recursion Tree", "Backtracking Basics"] },
//       { day: "Day 16–20", topic: "Arrays & Strings", details: ["1D & 2D Arrays", "String Handling", "Sliding Window", "Problems on Arrays & Strings"] },
//       { day: "Day 21–25", topic: "Linked List", details: ["Singly LL", "Doubly LL", "Cycle Detection", "Problems"] },
//       { day: "Day 26–30", topic: "Stack & Queue", details: ["Stack Implementation", "Queue Implementation", "Problems", "Applications"] },
//     ],  
//   },
//   {
//     month: "Month 2 — Advanced DSA + Core Java",
//     steps: [
//       { day: "Day 31–35", topic: "Sorting & Searching", details: ["Bubble", "Selection", "Insertion", "Merge", "Quick", "Binary Search Applications"] },
//       { day: "Day 36–40", topic: "Hashing & Maps", details: ["HashMap", "HashSet", "Problems", "Frequency Maps"] },
//       { day: "Day 41–45", topic: "Trees", details: ["Binary Tree Basics", "Traversals", "Binary Search Tree", "Problems"] },
//       { day: "Day 46–50", topic: "Graph Basics", details: ["Representation", "DFS", "BFS", "Topological Sort"] },
//       { day: "Day 51–55", topic: "Java Advanced Features", details: ["Exception Handling", "Generics", "Collections Framework", "Streams & Lambda"] },
//       { day: "Day 56–60", topic: "Mini Project (Console)", details: ["Library System / ATM Simulation", "Plan", "Code", "Test", "Refactor"] },
//     ],
//   },
//   {
//     month: "Month 3 — SQL, JDBC & Backend Basics",
//     steps: [
//       { day: "Day 61–65", topic: "Databases & SQL", details: ["RDBMS Basics", "DDL", "DML", "Joins", "Indexes", "Subqueries"] },
//       { day: "Day 66–70", topic: "Advanced SQL", details: ["Stored Procedures", "Views", "Triggers", "Transactions"] },
//       { day: "Day 71–75", topic: "JDBC", details: ["JDBC Setup", "Connecting Java with MySQL/Postgres", "CRUD Operations"] },
//       { day: "Day 76–80", topic: "Servlets & JSP", details: ["Servlet Lifecycle", "JSP Basics", "Session Handling", "Mini App"] },
//       { day: "Day 81–90", topic: "Spring Core", details: ["IoC", "Dependency Injection", "Spring Beans", "Configuration", "Practice Examples"] },
//     ],
//   },
//   {
//     month: "Month 4 — Spring Boot & REST APIs",
//     steps: [
//       { day: "Day 91–95", topic: "Spring Boot Basics", details: ["Setup Project", "Annotations", "Spring Boot Starters", "Configuration"] },
//       { day: "Day 96–100", topic: "REST APIs", details: ["Controller", "Request Mapping", "CRUD REST API", "Postman Testing"] },
//       { day: "Day 101–105", topic: "Spring Data JPA", details: ["Entity Mapping", "Repositories", "JPQL Queries", "Relationships"] },
//       { day: "Day 106–110", topic: "Security Basics", details: ["Spring Security", "JWT Authentication", "Role-Based Access"] },
//       { day: "Day 111–120", topic: "Mini Project (Backend)", details: ["Employee Management System / Blog API", "Plan", "Code", "Test"] },
//     ],
//   },
//   {
//     month: "Month 5 — Frontend (React + Basics)",
//     steps: [
//       { day: "Day 121–125", topic: "HTML, CSS, JS Basics", details: ["HTML5", "Flex/Grid", "JavaScript ES6+", "DOM Manipulation"] },
//       { day: "Day 126–130", topic: "React Basics", details: ["Components", "Props & State", "Events", "Conditional Rendering"] },
//       { day: "Day 131–135", topic: "React Advanced", details: ["Hooks", "Context API", "Routing", "Forms & Validation"] },
//       { day: "Day 136–140", topic: "Integration", details: ["Fetching API Data", "Axios/Fetch", "Connecting with Spring Boot API"] },
//       { day: "Day 141–150", topic: "Mini Project (Frontend)", details: ["UI Design", "React CRUD App", "Test", "Refactor"] },
//     ],
//   },
//   {
//     month: "Month 6 — Full Stack Projects & Deployment",
//     steps: [
//       { day: "Day 151–160", topic: "Full Stack Integration", details: ["Connect React Frontend with Spring Boot Backend", "API Calls", "CORS", "Testing"] },
//       { day: "Day 161–165", topic: "Final Project Setup", details: ["Choose Idea (E-Commerce, Blog, Task Manager)", "Database Design", "Architecture"] },
//       { day: "Day 166–175", topic: "Full Stack Project Development", details: ["Frontend", "Backend", "API Integration", "Auth", "Role Management"] },
//       { day: "Day 176–180", topic: "Testing & Deployment", details: ["JUnit Tests", "Postman Tests", "Docker Basics", "Deploy on AWS/Heroku/Render"] },
//     ],
//   },
// ];


// -----------------------

export default function Roadmap() {

   const [roadmapData, setRoadmaps] = useState([]);
   const [title, setTitle] = useState("");
   const { id } = useParams();

  useEffect(()=>{
    axios.get(`http://localhost:8000/api/roadmap/title/${id}`).then((res)=>{
      setRoadmaps(res.data?.months);
      setTitle(res.data?.title);
   })},[]);

  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState({});

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem("roadmap-progress-v3");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("roadmap-progress-v3", JSON.stringify(completed));
  }, [completed]);

  // Progress calculation
  const totalSteps = useMemo(() => roadmapData.reduce((acc, m) => acc + m.steps.length, 0), []);
  const doneCount = useMemo(() => Object.values(completed).reduce((acc, v) => (v ? acc + 1 : acc), 0), [completed]);
  const progressPct = totalSteps ? Math.round((doneCount / totalSteps) * 100) : 0;

  const toggleDone = (key) => setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="relative w-full flex justify-center py-16 px-4 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* glowing backgrounds */}
      <div className="pointer-events-none absolute top-0 left-1/3 w-96 h-96 bg-fuchsia-500/20 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 w-96 h-96 bg-sky-500/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="z-60 relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="mt-4 w-full max-w-sm mx-auto h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                progressPct < 40
                  ? "bg-gradient-to-r from-red-400 to-yellow-400"
                  : progressPct < 80
                  ? "bg-gradient-to-r from-yellow-400 to-sky-400"
                  : "bg-gradient-to-r from-sky-400 to-emerald-400"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-1">{progressPct}% complete</p>
        </div>

        {/* Timeline line */}
        <div className="absolute z-1 top-49 left-1/2 -translate-x-1/2 w-1.5 h-full bg-slate-700/50 rounded-full">
          {/* Progress overlay */}
          <div
            className="absolute top-0 left-0 w-full transition-all duration-700 
               bg-gradient-to-b from-pink-400 via-sky-400 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.6)]"
            style={{ height: `${progressPct}%` }}
          />
        </div>

        <div className="relative flex flex-col gap-20">
          {roadmapData.map((section, mIdx) => (
            <section key={mIdx}>
              {/* Month Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-fit mb-10"
              >
                <div className="z-20 relative px-6 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-fuchsia-500/20 to-sky-500/20 border border-white/20">
                  <span className="font-semibold tracking-wide">{section.month}</span>
                </div>
              </motion.div>

              <div className="flex flex-col gap-14">
                {section.steps.map((step, sIdx) => {
                  const key = `${mIdx}-${sIdx}`;
                  const isLeft = sIdx % 2 === 0;
                  const isDone = !!completed[key];
                  const isOpen = !!expanded[key];

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.5 }}
                      className={`relative flex ${isLeft ? "justify-start" : "justify-end"}`}
                    >
                      {/* Connector line to box */}
                      <div
                        className={`hidden md:block absolute top-1/2 w-[11%] h-0.5 bg-slate-600/50 
                          ${isLeft ?"right-1/2":"left-1/2"} 
                          ${isDone ? "bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]" : ""}
                        `}
                      />

                      {/* Marker */}
                      <button
                        onClick={() => toggleDone(key)}
                        className="absolute left-1/2 -translate-x-1/2 z-10"
                      >
                        <span
                          className={`grid place-items-center w-7 h-7 rounded-full border-4 transition-all duration-300 ${
                            isDone
                              ? "border-emerald-400 bg-emerald-500/20"
                              : "border-gray-500 bg-gray-800"
                          }`}
                        >
                          <FaRegDotCircle size={14} />
                        </span>
                      </button>

                      {/* Card */}
                      <div
                        onClick={() => toggleExpand(key)}
                        className={`cursor-pointer relative max-w-md w-full md:w-[40%] ${isLeft ? "mr-auto" : "ml-auto"}`}
                      >
                        <div
                          className={`rounded-2xl p-5 border shadow-xl transition-all duration-300
                          ${
                            isDone
                              ? "border-emerald-400/50 bg-gradient-to-r from-emerald-900/40 to-sky-900/40"
                              : "border-white/20 bg-gradient-to-r from-gray-800/60 to-gray-900/60"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-300">{step.day}</h3>
                            {isDone && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                Done
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-lg font-bold text-white">{step.topic}</p>

                          {/* Details expand */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 pl-4 list-disc text-gray-300 text-sm space-y-1"
                              >
                                {step.details.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* End marker */}
        <div className="text-center mt-20">
          <span className="z-20 relative px-6 py-3 bg-gradient-to-r from-pink-400 via-sky-500 to-emerald-500 rounded-2xl font-bold shadow-lg border-1 border-yellow-900">
            🎉 End of Roadmap
          </span>
        </div>
      </div>
    </div>
  );
}
