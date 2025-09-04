import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AddRoadmap() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [months, setMonths] = useState([{ month: "", steps: [{ day: "", topic: "", details: [""] }] }]);
  const [loading, setLoading] = useState(false);

  // Add new month
  const addMonth = () => setMonths([...months, { month: "", steps: [{ day: "", topic: "", details: [""] }] }]);

  // Remove month
  const removeMonth = (monthIndex) => setMonths(months.filter((_, i) => i !== monthIndex));

  // Add step in month
  const addStep = (monthIndex) => {
    const newMonths = [...months];
    newMonths[monthIndex].steps.push({ day: "", topic: "", details: [""] });
    setMonths(newMonths);
  };

  // Remove step
  const removeStep = (monthIndex, stepIndex) => {
    const newMonths = [...months];
    newMonths[monthIndex].steps.splice(stepIndex, 1);
    setMonths(newMonths);
  };

  // Add detail in step
  const addDetail = (monthIndex, stepIndex) => {
    const newMonths = [...months];
    newMonths[monthIndex].steps[stepIndex].details.push("");
    setMonths(newMonths);
  };

  // Remove detail
  const removeDetail = (monthIndex, stepIndex, detailIndex) => {
    const newMonths = [...months];
    newMonths[monthIndex].steps[stepIndex].details.splice(detailIndex, 1);
    setMonths(newMonths);
  };

  // Update month
  const handleMonthChange = (index, value) => {
    const newMonths = [...months];
    newMonths[index].month = value;
    setMonths(newMonths);
  };

  // Update step
  const handleStepChange = (monthIndex, stepIndex, field, value) => {
    const newMonths = [...months];
    newMonths[monthIndex].steps[stepIndex][field] = value;
    setMonths(newMonths);
  };

  // Update detail
  const handleDetailChange = (monthIndex, stepIndex, detailIndex, value) => {
    const newMonths = [...months];
    newMonths[monthIndex].steps[stepIndex].details[detailIndex] = value;
    setMonths(newMonths);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || months.some(m => !m.month || m.steps.some(s => !s.day || !s.topic || s.details.some(d => !d)))) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/roadmap", { title, description, months });
      setTitle(""); setDescription(""); setMonths([{ month: "", steps: [{ day: "", topic: "", details: [""] }] }]);
      toast.success("Roadmap added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add roadmap");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Add New Roadmap</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Roadmap Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-full focus:outline-none"
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-full focus:outline-none"
        />

        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="bg-gray-800 p-2 sm:p-4 rounded space-y-3">
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                placeholder={`Month ${monthIndex + 1} Name`}
                value={month.month}
                onChange={(e) => handleMonthChange(monthIndex, e.target.value)}
                className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none"
              />
              {months.length > 1 && (
                <button type="button" onClick={() => removeMonth(monthIndex)} className="ml-2 text-red-500 hover:text-red-600">
                  <FaTrash />
                </button>
              )}
            </div>

            {month.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="bg-gray-700 p-2 sm:p-3 rounded space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Day"
                    value={step.day}
                    onChange={(e) => handleStepChange(monthIndex, stepIndex, "day", e.target.value)}
                    className="p-2 rounded bg-gray-600 text-white w-full sm:flex-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Topic"
                    value={step.topic}
                    onChange={(e) => handleStepChange(monthIndex, stepIndex, "topic", e.target.value)}
                    className="p-2 rounded bg-gray-600 text-white w-full sm:flex-1 focus:outline-none"
                  />
                  {month.steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(monthIndex, stepIndex)} className="text-red-500 hover:text-red-600 self-end sm:self-center">
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* Details */}
                {step.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Detail ${detailIndex + 1}`}
                      value={detail}
                      onChange={(e) => handleDetailChange(monthIndex, stepIndex, detailIndex, e.target.value)}
                      className="p-2 rounded bg-gray-600 text-white flex-1 focus:outline-none"
                    />
                    {step.details.length > 1 && (
                      <button type="button" onClick={() => removeDetail(monthIndex, stepIndex, detailIndex)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addDetail(monthIndex, stepIndex)}
                  className="bg-yellow-400 text-gray-900 py-1 px-3 rounded hover:bg-yellow-500 flex items-center gap-2 text-sm"
                >
                  <FaPlus /> Add Detail
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addStep(monthIndex)}
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex items-center gap-2 mt-2 text-sm"
            >
              <FaPlus /> Add Step
            </button>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={addMonth}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Month
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 flex items-center justify-center gap-2"
          >
            {loading ? "Adding..." : "Submit Roadmap"}
          </button>
        </div>
      </form>
    </div>
  );
}
