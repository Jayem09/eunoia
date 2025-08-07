import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FormData {
  name: string;
  email: string;
  contactNumber?: string;
  eventType?: string;
  eventDate?: string;
  eventTime?: string;
  message: string;
}

export const FormComponent = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        status: 'new',
        timestamp: serverTimestamp(),
        ip: sessionStorage.getItem('ip') || 'unknown'
      });
      
      // Store submission time for rate limiting
      sessionStorage.setItem('lastSubmission', Date.now().toString());
      setSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError('Failed to submit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {success ? (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          Thank you! Your submission has been received.
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          
          {error && (
            <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Name*</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email*</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="contactNumber">Phone Number</label>
            <input
              id="contactNumber"
              type="tel"
              value={formData.contactNumber || ''}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="message">Message*</label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </>
      )}
    </form>
  );
};