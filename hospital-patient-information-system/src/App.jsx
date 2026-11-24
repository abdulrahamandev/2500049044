import { useMemo, useState } from "react";

const patients = [
  { id: "PT-2048", name: "Olivia Rhye", doctor: "Dr. Olivia Rhye", time: "09:00 AM" },
  { id: "PT-2047", name: "Phoenix Baker", doctor: "Dr. Phoenix Baker", time: "09:30 AM" },
  { id: "PT-2046", name: "Lana Steiner", doctor: "Dr. Lana Steiner", time: "10:00 AM" },
  { id: "PT-2045", name: "Demi Wilkinson", doctor: "Dr. Demi Wilkinson", time: "10:30 AM" },
  { id: "PT-2044", name: "Candice Wu", doctor: "Dr. Olivia Rhye", time: "11:00 AM" },
  { id: "PT-2043", name: "Natali Craig", doctor: "Dr. Phoenix Baker", time: "11:30 AM" },
];

function App() {
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const search = query.trim().toLowerCase();
    return patients.filter((patient) =>
      [patient.id, patient.name, patient.doctor].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }, [query]);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">HOSPITAL MANAGEMENT</p>
          <h1>Patient appointments</h1>
          <p className="subtitle">View patient details and scheduled appointment times.</p>
        </div>
        <span className="appointment-count">{filteredPatients.length} patients</span>
      </header>

      <section className="patient-list" aria-label="Patient appointments">
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by patient, ID, or doctor"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient name</th>
                <th>Doctor assigned</th>
                <th>Appointment time</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="patient-id">{patient.id}</td>
                  <td className="patient-name">{patient.name}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.time}</td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td className="empty-state" colSpan="4">No matching patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <footer>Patient information is sample data for demonstration.</footer>
    </main>
  );
}

export default App;
