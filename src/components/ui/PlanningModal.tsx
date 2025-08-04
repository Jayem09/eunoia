import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, FirestoreError } from "firebase/firestore";
import { X } from "lucide-react";

interface PlanningModalProps {
  onClose: () => void;
}

export function PlanningModal({ onClose }: PlanningModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form data being submitted:", form);
    console.log("Firebase db instance:", db);

    try {
      // Validate form data
      if (!form.name || !form.email || !form.contactNumber || !form.eventType || !form.eventDate || !form.eventTime) {
        throw new Error("Please fill in all required fields");
      }

      const docData = {
        ...form,
        createdAt: serverTimestamp(),
        status: "pending", // Add status field for admin tracking
      };

      console.log("Document data to be added:", docData);

      const docRef = await addDoc(collection(db, "contact-submissions"), docData);

      console.log("Document successfully added with ID:", docRef.id);

      alert("Successfully submitted! We'll contact you soon.");
      setForm({ name: "", email: "", contactNumber: "", eventType: "", eventDate: "", eventTime: "", message: "" });
      onClose();
    } catch (err) {
      console.error("Detailed error:", err);

      // Type-safe error handling
      if (err instanceof Error) {
        if ('code' in err) {
          // Firebase error
          const firebaseError = err as FirestoreError;
          if (firebaseError.code === 'permission-denied') {
            alert("Permission denied. Please check your Firebase security rules.");
          } else if (firebaseError.code === 'unavailable') {
            alert("Service unavailable. Please try again later.");
          } else {
            alert(`Firebase Error: ${firebaseError.message}`);
          }
        } else {
          // Regular Error
          alert(`Error: ${err.message}`);
        }
      } else {
        // Unknown error type
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center px-4">
      <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-foreground">Start Planning Your Event</h2>
          <p className="text-sm text-muted-foreground">
            Fill out the form and we'll reach out to make your event unforgettable.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-input rounded-md px-3 py-2 text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-input rounded-md px-3 py-2 text-sm"
          />

          <input
            type="tel"
            name="contactNumber"
            placeholder="Your contact number (e.g., +1 234 567 8900)"
            value={form.contactNumber}
            onChange={handleChange}
            required
            className="w-full border border-input rounded-md px-3 py-2 text-sm"
          />

          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            required
            className="w-full border border-input rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Event Type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="graduation">Graduation</option>
            <option value="baby-shower">Baby Shower</option>
            <option value="other">Other</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full border border-input rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">
                Event Time
              </label>
              <input
                type="time"
                id="eventTime"
                name="eventTime"
                value={form.eventTime}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <textarea
            name="message"
            rows={3}
            placeholder="Tell us about your event, special requirements, or any additional details..."
            value={form.message}
            onChange={handleChange}
            className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Event Request"}
          </button>
        </form>
      </div>
    </div>
  );
}