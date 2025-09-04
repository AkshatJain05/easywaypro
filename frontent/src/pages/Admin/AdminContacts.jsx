import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import Loading from "../../component/Loading";
import toast from "react-hot-toast";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/contacts");
      setContacts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete contact");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) return <Loading/>

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl text-white font-bold mb-6 text-center">Contact Submissions</h1>

      {contacts.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No contact messages found.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map(contact => (
            <div key={contact._id} className="bg-gray-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-md hover:shadow-lg transition border-1 border-gray-500">
              <div className="mb-2 md:mb-0">
                <p className="text-white font-semibold">{contact.name}</p>
                <p className="text-gray-400 text-sm">{contact.email}</p>
                <p className="text-gray-200 mt-1">{contact.message}</p>
                <p className="text-gray-500 text-xs mt-1">{new Date(contact.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => deleteContact(contact._id)}
                className="text-red-500 hover:text-red-600 mt-2 md:mt-0"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
