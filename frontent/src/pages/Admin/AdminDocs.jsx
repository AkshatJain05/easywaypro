import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// ----------------- React Icons Imports -----------------
import {
  MdOutlineLibraryBooks,
  MdAdd,
  MdEdit,
  MdSave,
  MdDelete,
  MdVisibility,
  MdOutlineFormatListBulleted,
  MdCode,
  MdRefresh, // Using for a generic spinner style
  MdCheckCircleOutline,
} from "react-icons/md";
import { BiParagraph } from "react-icons/bi";
// ----------------- Toast Imports -----------------
import toast, { Toaster } from "react-hot-toast";

const API_URL = "http://localhost:8000/api/docs";
const CODE_STYLE = oneDark;

/* ---------------------- Helper Component: Loading Spinner ---------------------- */
const Spinner = () => (
  <div className="inline-block w-6 h-6 border-4 border-t-sky-500 border-gray-700 rounded-full animate-spin"></div>
);

/* ---------------------- Sub-Component: Document List View ---------------------- */
function DocList({
  docs,
  loading,
  selectedDoc,
  setSelectedDoc,
  deleteDoc,
  isDeleting,
}) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {loading ? (
        <p className="text-center text-gray-400 py-10 flex items-center justify-center">
          <Spinner /> Loading documents...
        </p>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div
              key={d._id}
              className={`p-3 rounded-lg cursor-pointer border transition duration-150 flex justify-between items-start ${
                selectedDoc?._id === d._id
                  ? "border-sky-500 bg-[#0f172a] shadow-inner"
                  : "border-[#334155] hover:border-sky-500 hover:bg-[#253245]"
              }`}
              onClick={() => setSelectedDoc(d)}
            >
              <div>
                <h3 className="font-semibold text-sky-300 text-base line-clamp-1 flex items-center">
                  <MdOutlineLibraryBooks className="mr-2 text-yellow-400" />
                  {d.subject}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {d.description}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Check if this specific doc is currently being deleted
                  if (isDeleting === d._id) return;
                  deleteDoc(d._id);
                }}
                disabled={isDeleting === d._id}
                className="text-red-400 hover:text-red-500 text-lg p-1 ml-2 rounded-full hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Document"
              >
                {isDeleting === d._id ? <Spinner /> : <MdDelete />}
              </button>
            </div>
          ))}
          {docs.length === 0 && !loading && (
            <p className="text-center text-gray-500 text-sm py-4">
              No documents found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------- Main Component: Admin Panel ---------------------- */
export default function AdminPanel() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState({ title: "", Q: "", ans: [] });
  const [ansType, setAnsType] = useState("paragraph");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [ansContent, setAnsContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("editor");

  // New Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Stores the ID of the doc being deleted

  /* ---------------------- API & Document Handlers ---------------------- */
  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL);
      setDocs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateNew = () => {
    setSelectedDoc({ subject: "", description: "", questions: [] });
    setQuestion({ title: "", Q: "", ans: [] });
    setAnsContent("");
    setPreview(false);
    setViewMode("editor");
  };

  const deleteDoc = async (id) => {
    const confirmDelete = new Promise((resolve, reject) => {
      // Custom confirmation logic here, but for simplicity, we'll use window.confirm
      if (window.confirm("Are you sure you want to delete this doc?")) {
        resolve(id);
      } else {
        reject(new Error("Deletion cancelled"));
      }
    });

    toast.promise(confirmDelete, {
      loading: "Waiting for confirmation...",
      success: (id) => {
        setIsDeleting(id);
        // Execute actual delete logic immediately after confirmation
        return performDelete(id);
      },
      error: (err) => {
        if (err.message === "Deletion cancelled") {
          return "Deletion cancelled.";
        }
        setIsDeleting(null);
        return "Deletion failed.";
      },
    });
  };

  const performDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchDocs();
      if (selectedDoc?._id === id) {
        handleCreateNew();
      }
      setIsDeleting(null);
      return "Doc successfully deleted!";
    } catch (err) {
      setIsDeleting(null);
      throw new Error("Failed to delete doc!");
    }
  };

  const saveDoc = async () => {
    if (!selectedDoc.subject) {
      toast.error("Subject is required before saving!");
      return;
    }

    setIsSaving(true);

    try {
      let savePromise;
      if (selectedDoc._id) {
        savePromise = axios.put(`${API_URL}/${selectedDoc._id}`, selectedDoc);
      } else {
        savePromise = axios.post(API_URL, selectedDoc);
      }

      await toast.promise(savePromise, {
        loading: selectedDoc._id
          ? "Updating document..."
          : "Creating document...",
        success: (response) => {
          fetchDocs();
          setViewMode("list");
          setSelectedDoc(null);
          return selectedDoc._id
            ? "Doc updated successfully!"
            : "Doc created successfully!";
        },
        error: "Failed to save document.",
      });
    } catch (err) {
      // The toast.promise handles the error state internally
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------- Question Editor Handlers ---------------------- */
  const addAnswer = () => {
    if (!ansContent.trim()) {
      toast.error("Enter answer content first");
      return;
    }

    setIsAddingAnswer(true);

    // Simulate async operation for demonstration (remove in production if sync)
    setTimeout(() => {
      let answerObject = { type: ansType, content: ansContent };

      if (ansType === "points") {
        answerObject.content = ansContent
          .split("\n")
          .map((i) => i.trim())
          .filter((i) => i);
      } else if (ansType === "code") {
        answerObject.language = codeLanguage;
      }

      setQuestion({
        ...question,
        ans: [...question.ans, answerObject],
      });
      setAnsContent("");
      setIsAddingAnswer(false);
      toast.success("Answer part added!");
    }, 300); // Short delay to show loading state
  };

  const addQuestion = () => {
    if (!question.title || !question.Q || question.ans.length === 0) {
      toast.error(
        "Question must have a title, body, and at least one answer part!"
      );
      return;
    }

    const updated = {
      ...selectedDoc,
      questions: [...selectedDoc.questions, question],
    };
    setSelectedDoc(updated);
    setQuestion({ title: "", Q: "", ans: [] });
    toast.success("Question committed to document!");
  };

  const deleteQuestion = (qid) => {
    const updated = {
      ...selectedDoc,
      questions: selectedDoc.questions.filter((_, i) => i !== qid),
    };
    setSelectedDoc(updated);
    toast("Question removed from doc.", { icon: "🗑️" });
  };

  /* ---------------------- Initial Load & State Management ---------------------- */
  useEffect(() => {
    fetchDocs();
    if (!selectedDoc) {
      setSelectedDoc({ subject: "", description: "", questions: [] });
    }
  }, [fetchDocs]);

  useEffect(() => {
    if (selectedDoc?._id) {
      setViewMode("editor");
    }
  }, [selectedDoc]);

  /* ---------------------- Render ---------------------- */
  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- Top Header / Controls --- */}
      <header className="max-w-75xl mx-auto mb-6 p-4 rounded-xl bg-[#01040a] shadow-2xl border border-[#334155]">
        <h1 className="text-2xl font-extrabold text-white mb-4">
          📝 Documentation CMS
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 rounded-lg font-semibold transition flex items-center ${
              viewMode === "list"
                ? "bg-sky-600 text-white shadow-lg"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <MdOutlineLibraryBooks className="mr-2 text-xl" /> Manage Docs
          </button>
          <button
            onClick={handleCreateNew}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center ${
              viewMode === "editor" && !selectedDoc?._id
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <MdAdd className="mr-2 text-xl" /> Create New
          </button>
          {selectedDoc?._id && viewMode === "editor" && (
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition bg-sky-600 text-white shadow-lg flex items-center`}
            >
              <MdEdit className="mr-2 text-xl" /> Editing:{" "}
              {selectedDoc.subject || "Untitled"}
            </button>
          )}
        </div>
      </header>

      {/* --- Main Content Layout --- */}
      <div className="max-w-7xl mx-auto bg-[#040109] p-5 rounded-xl border border-[#334155] shadow-2xl">
        {/* 1. Docs List View (Only visible when viewMode is 'list') */}
        {viewMode === "list" && (
          <div>
            <h2 className="text-2xl font-bold text-sky-400 mb-4 border-b border-[#334155] pb-2">
              All Documents
            </h2>
            <DocList
              docs={docs}
              loading={loading}
              selectedDoc={selectedDoc}
              setSelectedDoc={setSelectedDoc}
              deleteDoc={deleteDoc}
              isDeleting={isDeleting}
            />
          </div>
        )}

        {/* 2. Editor View (Visible when viewMode is 'editor' AND selectedDoc is present) */}
        {viewMode === "editor" && selectedDoc && (
          <>
            <div className="flex items-center justify-between mb-5 border-b border-[#334155] pb-3">
              <h2 className="text-2xl font-bold text-sky-400 flex items-center">
                <MdEdit className="mr-2" />{" "}
                {selectedDoc._id ? "Edit Document" : "New Document"}
              </h2>
              <button
                onClick={() => setPreview(!preview)}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm font-semibold transition shadow-md flex items-center"
              >
                {preview ? (
                  <MdEdit className="mr-2 text-lg" />
                ) : (
                  <MdVisibility className="mr-2 text-lg" />
                )}
                {preview ? "Editor" : "Preview"}
              </button>
            </div>

            {!preview ? (
              /* --- EDITOR MODE --- */
              <div className="space-y-6">
                {/* Doc Metadata */}
                <div className="bg-[#01040a] p-4 rounded-lg border border-[#334155]">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    Document Details
                  </h3>
                  <input
                    type="text"
                    placeholder="Subject (e.g., React Hooks)"
                    value={selectedDoc.subject}
                    onChange={(e) =>
                      setSelectedDoc({
                        ...selectedDoc,
                        subject: e.target.value,
                      })
                    }
                    className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155] focus:border-sky-500 text-base"
                  />
                  <textarea
                    placeholder="Description"
                    value={selectedDoc.description}
                    onChange={(e) =>
                      setSelectedDoc({
                        ...selectedDoc,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-[#080f1b] border border-[#334155] focus:border-sky-500 text-base"
                    rows={3}
                  />
                </div>

                {/* Add Question Area */}
                <div className="bg-[#03060d] p-4 rounded-lg border border-[#334155]">
                  <h3 className="text-lg font-semibold text-green-400 mb-3 border-b border-[#334155] pb-2 flex items-center">
                    <MdAdd className="mr-1 text-xl" /> Add New Question
                  </h3>
                  <input
                    type="text"
                    placeholder="Question Title (e.g., What is useState?)"
                    value={question.title}
                    onChange={(e) =>
                      setQuestion({ ...question, title: e.target.value })
                    }
                    className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155]"
                  />
                  <textarea
                    placeholder="Question body (Q)"
                    value={question.Q}
                    onChange={(e) =>
                      setQuestion({ ...question, Q: e.target.value })
                    }
                    className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155]"
                    rows={2}
                  />

                  {/* Answer Type & Content */}
                  <div className="mb-3">
                    <div className="flex gap-4 flex-wrap mb-3">
                      <select
                        value={ansType}
                        onChange={(e) => setAnsType(e.target.value)}
                        className="bg-[#080f1b] border border-[#334155] rounded-lg p-2 text-sm flex-shrink-0"
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="points">Points (One per line)</option>
                        <option value="code">Code Block</option>

                      </select>
                      {ansType === "code" && (
                        <select 
                          value={codeLanguage}
                          onChange={(e) => setCodeLanguage(e.target.value)}
                          className="bg-[#080f1b] border border-[#334155] rounded-lg p-2 text-sm flex-shrink-0"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="css">CSS</option>
                          <option value="html">HTML</option>
                          <option value="jsx">JSX</option>
                          <option value="python">Python</option>
                          <option value="bash">Shell/Bash</option>
                        </select>
                      )}
                    </div>

                    {/* Code Input Area (VS Code Style) */}
                    <div className="relative rounded-lg overflow-hidden border border-[#444] shadow-xl mb-3">
                      {/* VS Code Style Header Bar */}
                      <div className="flex items-center bg-[#010003] px-3 py-2 border-b border-[#444]">
                        <div className="flex space-x-1.5">
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        </div>
                        <span className="ml-auto text-xs text-gray-400 font-mono">
                          {ansType === "code" ? codeLanguage : ansType}
                        </span>
                      </div>

                      <textarea
                        placeholder={
                          ansType === "points"
                            ? "Enter points, one per line."
                            : "Answer content (code or text)"
                        }
                        value={ansContent}
                        onChange={(e) => setAnsContent(e.target.value)}
                        className="w-full p-4 rounded-b-lg bg-black border-none text-sm resize-none font-mono focus:outline-none"
                        rows={8}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addAnswer}
                    disabled={isAddingAnswer}
                    className="px-4 py-2 bg-sky-600 rounded-lg hover:bg-sky-700 text-sm font-semibold transition shadow-md flex items-center disabled:opacity-50 disabled:cursor-wait"
                  >
                    {isAddingAnswer ? (
                      <Spinner />
                    ) : (
                      <MdAdd className="mr-1 text-lg" />
                    )}{" "}
                    Add Answer Part
                  </button>

                  {/* Current Answer Parts Preview */}
                  <div className="mt-4 space-y-2 border-t border-[#334155] pt-4">
                    <h4 className="text-sm font-semibold text-gray-400">
                      Answer Parts ({question.ans.length})
                    </h4>
                    {question.ans.map((a, i) => (
                      <div
                        key={i}
                        className="bg-[#1e293b] border border-[#334155] p-2 rounded-lg flex justify-between items-center"
                      >
                        <p className="text-xs flex items-center">
                          {a.type === "paragraph" && (
                            <BiParagraph className="mr-1 text-base text-sky-400" />
                          )}
                          {a.type === "points" && (
                            <MdOutlineFormatListBulleted className="mr-1 text-base text-sky-400" />
                          )}
                          {a.type === "code" && (
                            <MdCode className="mr-1 text-base text-sky-400" />
                          )}
                          <span className="font-semibold mr-2">
                            [{a.type.toUpperCase()}]
                          </span>
                          {Array.isArray(a.content)
                            ? a.content.join(" / ")
                            : a.content.substring(0, 80) +
                              (a.content.length > 80 ? "..." : "")}
                          {a.language && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({a.language})
                            </span>
                          )}
                        </p>
                        <button
                          onClick={() => deleteQuestion(i)}
                          className="text-red-400 hover:text-red-500 text-lg p-1"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addQuestion}
                    className="w-full mt-4 px-4 py-2.5 bg-green-600 rounded-lg hover:bg-green-700 font-bold transition shadow-lg flex justify-center items-center"
                  >
                    <MdCheckCircleOutline className="mr-1 text-xl" /> Commit
                    Question to Doc
                  </button>
                </div>

                {/* Existing Questions List */}
                <div className="space-y-3 p-4 bg-[#02060f] rounded-lg border border-[#334155]">
                  <h3 className="text-lg font-semibold text-yellow-400 border-b border-[#334155] pb-2">
                    Doc Questions ({selectedDoc.questions.length})
                  </h3>
                  {selectedDoc.questions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 border border-[#334155] rounded-lg bg-[#1e293b] flex justify-between items-start"
                    >
                      <div>
                        <h4 className="text-yellow-400 font-semibold text-base">
                          {i + 1}. {q.title}
                        </h4>
                        <p className="text-xs opacity-70 mt-1">{q.Q}</p>
                      </div>
                      <button
                        onClick={() => deleteQuestion(i)}
                        className="text-red-400 hover:text-red-500 text-lg p-1"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="mt-8 text-center border-t border-[#334155] pt-5">
                  <button
                    onClick={saveDoc}
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 font-bold text-lg transition shadow-2xl flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-wait"
                  >
                    {isSaving ? (
                      <Spinner />
                    ) : (
                      <MdSave className="mr-2 text-xl" />
                    )}
                    {isSaving
                      ? selectedDoc._id
                        ? "Updating..."
                        : "Saving..."
                      : selectedDoc._id
                      ? "Update Document"
                      : "Save Document"}
                  </button>
                </div>
              </div>
            ) : (
              /* --- PREVIEW MODE (Responsive) --- */
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-3 break-words text-center sm:text-left">
                  {selectedDoc.subject}
                </h2>

                <p className="text-sm sm:text-base mb-5 opacity-80 border-b border-[#334155] pb-4 leading-relaxed text-center sm:text-left break-words">
                  {selectedDoc.description}
                </p>

                {selectedDoc.questions.length === 0 && (
                  <p className="italic text-gray-500 text-center">
                    No questions to preview.
                  </p>
                )}

                <div className="flex flex-col gap-8">
                  {selectedDoc.questions.map((q, i) => (
                    <div
                      key={i}
                      className="border border-[#334155] rounded-xl p-4 sm:p-6 bg-[#02050c] shadow-lg hover:shadow-sky-900/40 transition-all"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-2 break-words">
                        {q.title}
                      </h3>
                      <p className="text-xs sm:text-sm mb-3 text-gray-400 italic break-words">
                        {q.Q}
                      </p>

                      {/* --- Answer Parts --- */}
                      <div className="flex flex-col gap-4">
                        {q.ans.map((a, j) => (
                          <div key={j} className="mb-3">
                            {a.type === "code" ? (
                              <div className="relative rounded-lg overflow-hidden border border-[#444] shadow-xl">
                                {/* VS Code style header */}
                                <div className="flex items-center justify-between bg-[#030000] px-3 py-2 border-b border-[#444]">
                                  <div className="flex space-x-1.5">
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                  </div>
                                  <span className="text-xs text-gray-400 font-mono truncate  max-w-[100px] sm:max-w-none">
                                    {a.language || "Code"}
                                  </span>
                                </div>

                                {/* Scrollable code block for mobile */}
                                <div className="overflow-x-auto">
                                  <SyntaxHighlighter
                                    language={a.language || "javascript"}
                                    style={CODE_STYLE}
                                    customStyle={{
                                      background: "#000000",
                                      padding: "1rem",
                                      fontSize: "0.8rem",
                                      margin: 0,
                                      minWidth: "300px",
                                    }}
                                  >
                                    {a.content}
                                  </SyntaxHighlighter>
                                </div>
                              </div>
                            ) : Array.isArray(a.content) ? (
                              <ul className="list-disc list-inside text-sm sm:text-base pl-4 text-gray-300 space-y-1">
                                {a.content.map((p, idx) => (
                                  <li
                                    key={idx}
                                    className="marker:text-sky-400 break-words"
                                  >
                                    {p}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm sm:text-base opacity-90 p-2 bg-[#1e293b] rounded-md break-words leading-relaxed">
                                {a.content}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
