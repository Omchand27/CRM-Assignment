import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Call",
  });

  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    let err = {};

    if (!form.name.trim()) {
      err.name = "Name required";
    }

    if (!form.phone) {
      err.phone = "Phone required";
    } else if (form.phone.length !== 10) {
      err.phone = "Phone must be 10 digits";
    }

    return err;
  };

  // Fetch leads
  const fetchLeads = async () => {
    const res = await API.get("/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);

    if (Object.keys(err).length > 0) return;

    await API.post("/leads", form);
    setForm({ name: "", phone: "", source: "Call" });
    setErrors({});
    fetchLeads();
  };

  // Update
  const updateStatus = async (id, status) => {
    await API.put(`/leads/${id}`, { status });
    fetchLeads();
  };

  // Delete
  const deleteLead = async (id) => {
    await API.delete(`/leads/${id}`);
    fetchLeads();
  };

  // Filter
  const filteredLeads = leads.filter((l) => {
    return (
      (l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search)) &&
      (filterStatus === "All" || l.status === filterStatus)
    );
  });

  // Dashboard
  const total = leads.length;
  const interested = leads.filter(l => l.status === "Interested").length;
  const notInterested = leads.filter(l => l.status === "Not Interested").length;
  const converted = leads.filter(l => l.status === "Converted").length;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mini CRM</h2>

      {/* Dashboard */}
      <div>
        <b>Total:</b> {total} | <b>Interested:</b> {interested} |{" "}
        <b>Not Interested:</b> {notInterested} | <b>Converted:</b> {converted}
      </div>

      {/* Search */}
      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option>All</option>
        <option>Interested</option>
        <option>Not Interested</option>
        <option>Converted</option>
      </select>

      <hr />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <input
            placeholder="Phone"
            maxLength={10}
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value.replace(/\D/g, ""),
              })
            }
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        <select
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Field</option>
        </select>

        <button type="submit">Add</button>
      </form>

      <hr />

      {/* List */}
      {filteredLeads.map((l) => (
        <div key={l.id}>
          <b>{l.name}</b> ({l.phone}) - {l.source}
          <br />
          Status: {l.status}
          <br />

          <button onClick={() => updateStatus(l.id, "Interested")}>
            Interested
          </button>
          <button onClick={() => updateStatus(l.id, "Not Interested")}>
            Not Interested
          </button>
          <button onClick={() => updateStatus(l.id, "Converted")}>
            Converted
          </button>
          <button onClick={() => deleteLead(l.id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;