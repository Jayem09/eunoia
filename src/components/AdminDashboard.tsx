import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Eye, EyeOff, Trash2, Edit, Save, X, Shield, Users, MessageSquare, AlertTriangle, Phone, Calendar, Clock } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  eventType?: string;
  eventDate?: string;
  eventTime?: string;
  message: string;
  timestamp: any;
  createdAt?: any;
  status?: 'new' | 'read' | 'responded';
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<'new' | 'read' | 'responded'>('new');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    responded: 0
  });

  // Check if already authenticated on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchSubmissions();
    }
  }, []);

  const handleLogin = () => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      setError("Admin password not configured. Please set VITE_ADMIN_PASSWORD in your .env file.");
      return;
    }

    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem('adminAuthenticated', 'true');
      fetchSubmissions();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setSubmissions([]);
    setPassword("");
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "contact-submissions"));
      const submissionsData: Submission[] = [];

      querySnapshot.forEach((doc) => {
        submissionsData.push({
          id: doc.id,
          ...doc.data()
        } as Submission);
      });

      // Sort by timestamp (newest first) - check both timestamp and createdAt fields
      submissionsData.sort((a, b) => {
        const aTime = a.createdAt || a.timestamp;
        const bTime = b.createdAt || b.timestamp;

        if (aTime && bTime) {
          return bTime.seconds - aTime.seconds;
        }
        return 0;
      });

      setSubmissions(submissionsData);

      // Calculate stats
      const newStats = {
        total: submissionsData.length,
        new: submissionsData.filter(s => s.status === 'new' || !s.status).length,
        read: submissionsData.filter(s => s.status === 'read').length,
        responded: submissionsData.filter(s => s.status === 'responded').length
      };
      setStats(newStats);

    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to fetch submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "contact-submissions", id));
      setSubmissions(submissions.filter(sub => sub.id !== id));

      // Update stats
      const updatedSubmissions = submissions.filter(sub => sub.id !== id);
      const newStats = {
        total: updatedSubmissions.length,
        new: updatedSubmissions.filter(s => s.status === 'new' || !s.status).length,
        read: updatedSubmissions.filter(s => s.status === 'read').length,
        responded: updatedSubmissions.filter(s => s.status === 'responded').length
      };
      setStats(newStats);

    } catch (error) {
      console.error("Error deleting submission:", error);
      setError("Failed to delete submission. Please try again.");
    }
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'read' | 'responded') => {
    try {
      await updateDoc(doc(db, "contact-submissions", id), {
        status: newStatus
      });

      setSubmissions(submissions.map(sub =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      ));

      setEditingId(null);

      // Update stats
      const updatedSubmissions = submissions.map(sub =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      );
      const newStats = {
        total: updatedSubmissions.length,
        new: updatedSubmissions.filter(s => s.status === 'new' || !s.status).length,
        read: updatedSubmissions.filter(s => s.status === 'read').length,
        responded: updatedSubmissions.filter(s => s.status === 'responded').length
      };
      setStats(newStats);

    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Unknown date";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatEventDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatEventTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'new': return <AlertTriangle className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'responded': return <MessageSquare className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const isEventSubmission = (submission: Submission) => {
    return submission.eventType || submission.eventDate || submission.eventTime || submission.contactNumber;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter your password to access the admin dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-3xl font-bold text-red-600">{stats.new}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <Eye className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Contact & Event Submissions</h2>
              <button
                onClick={fetchSubmissions}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{submission.name}</p>
                          <p className="text-sm text-gray-600">{submission.email}</p>
                          {submission.contactNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-1" />
                              {submission.contactNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isEventSubmission(submission) ? (
                          <div className="space-y-1">
                            {submission.eventType && (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                {submission.eventType}
                              </div>
                            )}
                            {submission.eventDate && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatEventDate(submission.eventDate)}
                              </div>
                            )}
                            {submission.eventTime && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatEventTime(submission.eventTime)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">General Contact</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {submission.message ? (
                            <>
                              <p className={`text-sm text-gray-900 ${expandedMessage === submission.id ? '' : 'truncate'
                                }`}>
                                {submission.message}
                              </p>
                              {submission.message.length > 100 && (
                                <button
                                  onClick={() => setExpandedMessage(
                                    expandedMessage === submission.id ? null : submission.id
                                  )}
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                >
                                  {expandedMessage === submission.id ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-400 italic">No message</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === submission.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as 'new' | 'read' | 'responded')}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="responded">Responded</option>
                            </select>
                            <button
                              onClick={() => updateStatus(submission.id, editStatus)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                              {getStatusIcon(submission.status)}
                              <span className="capitalize">{submission.status || 'new'}</span>
                            </span>
                            <button
                              onClick={() => {
                                setEditingId(submission.id);
                                setEditStatus(submission.status || 'new');
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimestamp(submission.createdAt || submission.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteSubmission(submission.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;