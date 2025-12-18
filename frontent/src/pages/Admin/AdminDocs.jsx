import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  MdOutlineLibraryBooks,
  MdAdd,
  MdEdit,
  MdSave,
  MdDelete,
  MdVisibility,
  MdOutlineFormatListBulleted,
  MdCode,
  MdCheckCircleOutline,
} from "react-icons/md";
import { BiParagraph } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

// Environment
const API_URL = import.meta.env.VITE_API_URL || "";
const CODE_STYLE = oneDark;

const Spinner = ({ size = 6 }) => (
  <div
    className={`inline-block w-${size} h-${size} border-4 border-t-sky-500 border-gray-700 rounded-full animate-spin`}
  />
);

/* ------------------------- DocList Component ------------------------- */
function DocList({
  docs,
  loading,
  selectedDocId,
  onSelect,
  onDelete,
  deletingId,
}) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {loading ? (
        <p className="text-center text-gray-400 py-10 flex items-center justify-center">
          <Spinner /> Loading documents...
        </p>
      ) : (
        <div className="space-y-3">
          {docs.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No documents found.
            </p>
          )}

          {docs.map((d) => (
            <div
              key={d._id || d.tempId}
              className={`p-3 rounded-lg cursor-pointer border transition duration-150 flex justify-between items-start ${
                selectedDocId === d._id
                  ? "border-sky-500 bg-[#0f172a] shadow-inner"
                  : "border-[#334155] hover:border-sky-500 hover:bg-[#253245]"
              }`}
              onClick={() => onSelect(d)}
            >
              <div>
                <h3 className="font-semibold text-sky-300 text-base line-clamp-1 flex items-center">
                  <MdOutlineLibraryBooks className="mr-2 text-yellow-400" />
                  {d.subject || "Untitled"}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {d.description}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (deletingId === d._id) return;
                  onDelete(d._id);
                }}
                disabled={deletingId === d._id}
                className="text-red-400 hover:text-red-500 text-lg p-1 ml-2 rounded-full hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Document"
              >
                {deletingId === d._id ? <Spinner /> : <MdDelete />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------- Main AdminPanel Component --------------------- */
export default function AdminPanel() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Question editor state
  const [questionDraft, setQuestionDraft] = useState({
    title: "",
    Q: "",
    ans: [],
  });
  const [ansType, setAnsType] = useState("paragraph");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [ansContent, setAnsContent] = useState("");

  // UI state
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  // operation states
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // Editing support
  const [editingIndex, setEditingIndex] = useState(null);

  /* ---------------------- Fetch Documents ---------------------- */
  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/docs`);
      setDocs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  /* ---------------------- Create New Document (local only) ---------------------- */
  const handleCreateNew = () => {
    setSelectedDoc({ subject: "", description: "", questions: [] });
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setAnsContent("");
    setPreview(false);
    setViewMode("editor");
    setEditingIndex(null);
  };

  /* ---------------------- Delete Document ---------------------- */
  const deleteDoc = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this document?")) {
      toast("Deletion cancelled.");
      return;
    }

    const promise = axios.delete(`${API_URL}/docs/${id}`);
    toast.promise(promise, {
      loading: "Deleting document...",
      success: async () => {
        // refresh list after deletion
        await fetchDocs();
        if (selectedDoc?._id === id) {
          setSelectedDoc({ subject: "", description: "", questions: [] });
          setViewMode("editor");
        }
        setIsDeleting(null);
        return "Document deleted.";
      },
      error: "Failed to delete document.",
    });

    try {
      setIsDeleting(id);
      await promise;
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  /* ---------------------- Save Document (create / update) ---------------------- */
  const saveDoc = async () => {
    if (!selectedDoc) return toast.error("No document to save");
    if (!selectedDoc.subject || !selectedDoc.subject.trim()) {
      return toast.error("Subject is required before saving!");
    }

    setIsSaving(true);
    try {
      let promise;
      if (selectedDoc._id) {
        promise = axios.put(`${API_URL}/docs/${selectedDoc._id}`, selectedDoc);
      } else {
        promise = axios.post(`${API_URL}/docs`, selectedDoc);
      }

      await toast.promise(promise, {
        loading: selectedDoc._id
          ? "Updating document..."
          : "Creating document...",
        success: async (res) => {
          await fetchDocs();
          // after create, set selected doc to null to show list OR use returned doc
          setViewMode("list");
          setSelectedDoc(null);
          return selectedDoc._id
            ? "Doc updated successfully!"
            : "Doc created successfully!";
        },
        error: "Failed to save document.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------- Answer / Question Handlers ---------------------- */
  const addAnswerPart = () => {
    if (!ansContent.trim()) return toast.error("Enter answer content first");

    setIsAddingAnswer(true);

    // build answer object
    const answerObject = { type: ansType };
    if (ansType === "points") {
      answerObject.content = ansContent
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    } else if (ansType === "code") {
      answerObject.content = ansContent;
      answerObject.language = codeLanguage;
    } else {
      answerObject.content = ansContent;
    }

    // update draft question immutably
    setQuestionDraft((prev) => ({ ...prev, ans: [...prev.ans, answerObject] }));
    setAnsContent("");
    setIsAddingAnswer(false);
    toast.success("Answer part added!");
  };

  const commitQuestionToDoc = () => {
    // if editingIndex is set, do update instead
    if (editingIndex !== null) {
      updateQuestionInDoc();
      return;
    }

    if (
      !questionDraft.title.trim() ||
      !questionDraft.Q.trim() ||
      questionDraft.ans.length === 0
    ) {
      return toast.error(
        "Question must have a title, body, and at least one answer part!"
      );
    }

    setSelectedDoc((prev) => {
      const prevQuestions = Array.isArray(prev?.questions)
        ? prev.questions
        : [];
      return { ...prev, questions: [...prevQuestions, questionDraft] };
    });

    setQuestionDraft({ title: "", Q: "", ans: [] });
    toast.success("Question committed to document!");
  };

  const updateQuestionInDoc = () => {
    if (editingIndex === null) return;

    setSelectedDoc((prev) => {
      const questions = Array.isArray(prev.questions)
        ? [...prev.questions]
        : [];
      // replace at index
      questions[editingIndex] = questionDraft;
      return { ...prev, questions };
    });

    setQuestionDraft({ title: "", Q: "", ans: [] });
    setEditingIndex(null);
    toast.success("Question updated successfully!");
  };

  const loadQuestionForEdit = (q, index) => {
    setQuestionDraft(JSON.parse(JSON.stringify(q)));
    setEditingIndex(index);
    // ensure editor visible
    setViewMode("editor");
    setPreview(false);
  };

  const removeQuestionFromDoc = (index) => {
    setSelectedDoc((prev) => {
      const questions = Array.isArray(prev.questions)
        ? [...prev.questions]
        : [];
      questions.splice(index, 1);
      return { ...prev, questions };
    });
    toast("Question removed from doc.", { icon: "🗑️" });
  };

  const cancelEdit = () => {
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setEditingIndex(null);
    toast("Edit cancelled.");
  };

  const removeAnswerPartFromDraft = (index) => {
    setQuestionDraft((prev) => {
      const ans = [...prev.ans];
      ans.splice(index, 1);
      return { ...prev, ans };
    });
    toast("Answer part removed.");
  };

  /* ---------------------- UI helper: select doc ---------------------- */
  const handleSelectDoc = (doc) => {
    // ensure a copy to avoid accidental mutation
    setSelectedDoc(JSON.parse(JSON.stringify(doc)));
    setViewMode("editor");
    setPreview(false);
    setQuestionDraft({ title: "", Q: "", ans: [] });
    setEditingIndex(null);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("all");
  const topics = Array.from(
    new Set((selectedDoc?.questions || []).map((q) => q.title).filter(Boolean))
  );
  const filteredQuestions = (selectedDoc?.questions || []).filter((q) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      (q.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.Q || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === "all" || q.title === filterTopic;
    return matchesSearch && matchesTopic;
  });

  /* ---------------------- Render ---------------------- */
  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <header className="max-w-7xl mx-auto mb-6 p-4 rounded-xl bg-[#01040a] shadow-2xl border border-[#334155]">
        <h1 className="text-2xl font-extrabold text-white mb-4">
          📝 Documentation CMS
        </h1>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setViewMode("list")}
            className={`px-1 py-2 rounded-lg font-semibold transition flex items-center ${
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
            <div className="px-4 py-2 rounded-lg font-semibold transition bg-sky-600 text-white shadow-lg flex items-center">
              <MdEdit className="mr-2 text-xl" /> Editing:{" "}
              {selectedDoc.subject || "Untitled"}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-[#040109] p-5 rounded-xl border border-[#334155] shadow-2xl">
        {viewMode === "list" && (
          <div>
            <h2 className="text-2xl font-bold text-sky-400 mb-4 border-b border-[#334155] pb-2">
              All Documents
            </h2>
            <DocList
              docs={docs}
              loading={loading}
              selectedDocId={selectedDoc?._id}
              onSelect={handleSelectDoc}
              onDelete={deleteDoc}
              deletingId={isDeleting}
            />
          </div>
        )}

        {viewMode === "editor" && selectedDoc && (
          <>
            <div className="flex items-center justify-between mb-5 border-b border-[#334155] pb-3">
              <h2 className="text-2xl font-bold text-sky-400 flex items-center">
                <MdEdit className="mr-2" />{" "}
                {selectedDoc._id ? "Edit Document" : "New Document"}
              </h2>

              <button
                onClick={() => setPreview((p) => !p)}
                className="px-2 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm font-semibold transition shadow-md flex items-center"
              >
                {!preview ? (
                  <MdVisibility className="mr-1 text-lg" />
                ) : (
                  <MdEdit className="mr-2 text-lg" />
                )}
                {preview ? "Editor" : "Preview"}
              </button>
            </div>

            {!preview ? (
              <div className="space-y-6">
                <div className="bg-[#01040a] p-4 rounded-lg border border-[#334155]">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    Document Details
                  </h3>
                  <input
                    type="text"
                    placeholder="Subject (e.g., React Hooks)"
                    value={selectedDoc.subject}
                    onChange={(e) =>
                      setSelectedDoc((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155] focus:border-sky-500 text-base"
                  />
                  <textarea
                    placeholder="Description"
                    value={selectedDoc.description}
                    onChange={(e) =>
                      setSelectedDoc((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-[#080f1b] border border-[#334155] focus:border-sky-500 text-base"
                    rows={3}
                  />
                </div>

                {/* Question Editor */}
                <div className="bg-[#03060d] p-4 rounded-lg border border-[#334155]">
                  <h3 className="text-lg font-semibold text-green-400 mb-3 border-b border-[#334155] pb-2 flex items-center">
                    <MdAdd className="mr-1 text-xl" />{" "}
                    {editingIndex !== null
                      ? "Edit Question"
                      : "Add New Question"}
                  </h3>

                  <input
                    type="text"
                    placeholder="Question Title"
                    value={questionDraft.title}
                    onChange={(e) =>
                      setQuestionDraft((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155]"
                  />

                  <textarea
                    placeholder="Question body (Q)"
                    value={questionDraft.Q}
                    onChange={(e) =>
                      setQuestionDraft((prev) => ({
                        ...prev,
                        Q: e.target.value,
                      }))
                    }
                    className="w-full mb-3 p-3 rounded-lg bg-[#080f1b] border border-[#334155]"
                    rows={2}
                  />

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

                    <div className="relative rounded-lg overflow-hidden border border-[#444] shadow-xl mb-3">
                      <div className="flex items-center bg-[#010003] px-3 py-2 border-b border-[#444]">
                        <div className="flex space-x-1.5">
                          <span className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <span className="w-3 h-3 bg-green-500 rounded-full" />
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

                  <div className="flex gap-3">
                    <button
                      onClick={addAnswerPart}
                      disabled={isAddingAnswer}
                      className="px-4 py-2 bg-sky-600 rounded-lg hover:bg-sky-700 text-sm font-semibold transition shadow-md flex items-center disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isAddingAnswer ? (
                        <Spinner />
                      ) : (
                        <MdAdd className="mr-1 text-lg" />
                      )}
                      Add Answer Part
                    </button>

                    <button
                      onClick={() => {
                        setAnsContent("");
                      }}
                      className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm font-semibold transition shadow-md"
                    >
                      Clear
                    </button>

                    {editingIndex !== null && (
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-sm font-semibold transition shadow-md"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-[#334155] pt-4">
                    <h4 className="text-sm font-semibold text-gray-400">
                      Answer Parts ({questionDraft.ans.length})
                    </h4>

                    {questionDraft.ans.map((a, idx) => (
                      <div
                        key={idx}
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
                            : (a.content || "").substring(0, 120) +
                              ((a.content || "").length > 120 ? "..." : "")}

                          {a.language && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({a.language})
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeAnswerPartFromDraft(idx)}
                            className="text-red-400 hover:text-red-500 text-lg p-1"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={commitQuestionToDoc}
                    className="w-full mt-4 px-4 py-2.5 bg-green-600 rounded-lg hover:bg-green-700 font-bold transition shadow-lg flex justify-center items-center"
                  >
                    <MdCheckCircleOutline className="mr-1 text-xl" />{" "}
                    {editingIndex !== null
                      ? "Update Question"
                      : "Commit Question to Doc"}
                  </button>
                </div>

                {/* Existing Questions */}
                <div className="space-y-3 p-4 bg-[#02060f] rounded-lg border border-[#334155]">
                  <h3 className="text-lg font-semibold text-yellow-400 border-b border-[#334155] pb-2">
                    Doc Questions ({selectedDoc.questions?.length || 0})
                  </h3>

                  {(selectedDoc.questions || []).map((q, i) => (
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

                      <div className="flex gap-2">
                        <button
                          onClick={() => loadQuestionForEdit(q, i)}
                          className="text-sky-400 hover:text-sky-500 text-lg p-1"
                          title="Edit Question"
                        >
                          <MdEdit />
                        </button>

                        <button
                          onClick={() => removeQuestionFromDoc(i)}
                          className="text-red-400 hover:text-red-500 text-lg p-1"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

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
              /* Preview Mode */
              /* Preview Mode */
              <div className="space-y-6">
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 p-3 rounded-lg bg-[#080f1b] border border-[#334155] text-sm"
                  />
                  <select
                    value={filterTopic}
                    onChange={(e) => setFilterTopic(e.target.value)}
                    className="w-full sm:w-1/4 p-3 rounded-lg bg-[#080f1b] border border-[#334155] text-sm"
                  >
                    <option value="all">All Topics</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-3 break-words text-center sm:text-left">
                  {selectedDoc.subject}
                </h2>

                <p className="text-sm sm:text-base mb-5 opacity-80 border-b border-[#334155] pb-4 leading-relaxed sm:text-left break-words text-justify">
                  {selectedDoc.description}
                </p>

                {(!selectedDoc.questions ||
                  selectedDoc.questions.length === 0) && (
                  <p className="italic text-gray-500 text-center">
                    No questions to preview.
                  </p>
                )}

                <div className="flex flex-col gap-8">
                  {(filteredQuestions || []).length === 0 ? (
                    <p className="text-center text-gray-400">
                      No questions match your search / filter.
                    </p>
                  ) : (
                    (filteredQuestions || []).map((q, i) => (
                      <div
                        key={i}
                        className="border border-[#334155] rounded-xl p-4 sm:p-6 bg-[#02050c] shadow-lg hover:shadow-sky-900/40 transition-all"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-2 break-words">
                          {q.title}
                        </h3>
                        <p className="text-xs sm:text-sm mb-3 text-gray-400 italic break-words text-justify">
                          {q.Q}
                        </p>

                        <div className="flex flex-col gap-4">
                          {q.ans.map((a, j) => (
                            <div key={j} className="mb-3">
                              {a.type === "code" ? (
                                <div className="relative rounded-lg overflow-hidden border border-[#444] shadow-xl">
                                  <div className="flex items-center justify-between bg-[#030000] px-3 py-2 border-b border-[#444]">
                                    <div className="flex space-x-1.5">
                                      <span className="w-3 h-3 bg-red-500 rounded-full" />
                                      <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                                      <span className="w-3 h-3 bg-green-500 rounded-full" />
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono truncate max-w-[100px] sm:max-w-none">
                                      {a.language || "Code"}
                                    </span>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <SyntaxHighlighter
                                      language={a.language || "javascript"}
                                      style={CODE_STYLE}
                                      customStyle={{
                                        background: "#000000",
                                        padding: "1rem",
                                        fontSize: "0.8rem",
                                        margin: 0,
                                      }}
                                    >
                                      {a.content}
                                    </SyntaxHighlighter>
                                  </div>
                                </div>
                              ) : Array.isArray(a.content) ? (
                                <ul className="list-disc list-inside text-sm sm:text-base pl-4 text-gray-300 space-y-1 text-justify">
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
                                <p className="text-sm sm:text-base opacity-90 p-2 bg-[#1e293b] rounded-md break-words leading-relaxed text-justify">
                                  {a.content}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
