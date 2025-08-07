import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Eye, EyeOff, Ellipsis, Edit, Save, X, Users,
  MessageSquare, AlertTriangle, Clock, Calendar,
  RefreshCw, Search, LogOut, Mail, Settings,
  MailCheck, Check, Contact, ChartNoAxesColumnIncreasing,
} from "lucide-react";

import * as XLSX from 'xlsx';



interface Submission {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  phone?: string;
  date?: string;
  time?: string;
  location?: string;
  eventType?: string;
  eventDate?: string;
  eventTime?: string;
  message: string;
  timestamp: any;
  createdAt?: any;
  status?: 'new' | 'read' | 'responded' | 'pending' | 'approved' | 'denied';
}

interface SubmissionActionsProps {
  submission: Submission;
  deleteSubmission: (id: string) => void;
  onViewDetails?: () => void;
  onSendMessage?: () => void;
}

type StatusFilter = 'all' | 'new' | 'read' | 'responded';
type SubmissionType = 'all' | 'event' | 'contact';

const AdminDashboard = () => {

  const [lastUpdated, setLastUpdated] = useState<string>('-----');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<'new' | 'read' | 'responded' | 'pending' | 'approved' | 'denied'>('new');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<SubmissionType>('all');

  const isEventSubmission = (submission: Submission) => {
    return submission.eventType || submission.eventDate || submission.eventTime;
  };


  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSubmissions.map(submission => ({
      Name: submission.name,
      Email: submission.email,
      'Contact Number': submission.contactNumber || '',
      'Event Type': submission.eventType || '',
      'Event Date': submission.eventDate || '',
      'Event Time': submission.eventTime || '',
      Message: submission.message,
      Status: submission.status || 'new',
      Submitted: formatTimestamp(submission.timestamp || submission.createdAt),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    // Generate buffer
    XLSX.writeFile(workbook, 'eunoia-submissions.xlsx');
  };

  const updateTimestamp = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(formattedTime);
  };

  useEffect(() => {
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const SubmissionActions = ({
    submission,
    deleteSubmission,
    onViewDetails,
    onSendMessage,
  }: SubmissionActionsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside as any);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside as any);
      };
    }, []);

    return (
      <div ref={dropdownRef}>
        <button onClick={toggleDropdown} className="ml-5">
          <Ellipsis size={18} />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Eye size={16} />
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendMessage?.();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <MessageSquare size={16} />
                Send Message
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubmission(submission.id);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <X size={16} />
                Delete Submission
              </button>
            </div>
          </div>

        )}
      </div>
    );
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchSubmissions();
    }
  }, []);

  useEffect(() => {
    let result = [...submissions];
    if (statusFilter !== 'all') {
      result = result.filter(sub =>
        statusFilter === 'new' ? (!sub.status || sub.status === 'new') : sub.status === statusFilter
      );
    }
    if (typeFilter !== 'all') {
      result = result.filter(sub =>
        typeFilter === 'event' ? isEventSubmission(sub) : !isEventSubmission(sub)
      );
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sub =>
        sub.name.toLowerCase().includes(term) ||
        sub.email.toLowerCase().includes(term) ||
        (sub.contactNumber && sub.contactNumber.includes(term)) ||
        (sub.phone && sub.phone.includes(term)) ||
        (sub.eventType && sub.eventType.toLowerCase().includes(term)) ||
        (sub.message && sub.message.toLowerCase().includes(term))
      );
    }
    setFilteredSubmissions(result);
  }, [submissions, statusFilter, typeFilter, searchTerm]);

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
      const submissionsData: Submission[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Submission));
      setSubmissions(submissionsData);
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
    } catch (error) {
      console.error("Error deleting submission:", error);
      setError("Failed to delete submission. Please try again.");
    }
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'read' | 'responded' | 'pending' | 'approved' | 'denied') => {
    try {
      await updateDoc(doc(db, "contact-submissions", id), { status: newStatus });
      setSubmissions(submissions.map(sub =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleEdit = (id: string) => {
    const submission = submissions.find(s => s.id === id);
    if (submission) {
      setEditingId(id);
      setNewStatus(submission.status || 'new');
    }
  };

  const handleSave = async (id: string) => {
    await updateStatus(id, newStatus);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatEventDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
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
      case 'new': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'read': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'denied': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'new': return <AlertTriangle size={14} />;
      case 'read': return <Eye size={14} />;
      case 'responded': return <MessageSquare size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'approved': return <Check size={14} />;
      case 'denied': return <X size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Enter your password to access the admin dashboard</p>
          </div>

          <div className="mb-6">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">Eunioa</span>
          </div>
        </div>
        <nav className="mt-8 px-4">
          <div className="space-y-1">
            <a href="#" className="bg-blue-50 text-blue-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Users className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <MessageSquare className="mr-3 h-5 w-5" />
              Submissions
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {submissions.filter(sub => sub.status === 'new' || !sub.status).length}
              </span>
            </a>
            <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Calendar className="mr-3 h-5 w-5" />
              Events
            </a>
            <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Users className="mr-3 h-5 w-5" />
              Clients
            </a>
            <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Search className="mr-3 h-5 w-5" />
              Reports
            </a>
            <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Mail className="mr-3 h-5 w-5" />
              Documents
            </a>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
          </div>
          <div className="mt-4 flex items-center">
            <Settings className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-700">Settings</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">A</span>
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">Admin User</div>

              </div>
            </div>


            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>


          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your events today.</p>
            < div className="text-sm text-gray-500 mt-1">Last updated: {lastUpdated}</div>
          </div>

          {/* Dashboard Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Submissions Dashboard</h2>
            <p className="text-gray-600">Manage and respond to customer inquiries and event requests.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-6 gap-3 mb-8">
            <StatCard
              title="Total"
              value={submissions.length}
              icon={<ChartNoAxesColumnIncreasing className="w-5 h-5 text-black-500" />}
              color="grey"
            />
            <StatCard title="New"
              value={submissions.filter(sub => sub.status === 'new' || !sub.status).length}
              icon={<Eye className="w-5 h-5 text-black-500" />}
              color="grey" />
            <StatCard title="Read"
              value={submissions.filter(sub => sub.status === 'read').length}
              icon={<MailCheck className="w-5 h-5 text-black-500" />}
              color="grey" />
            <StatCard title="Responded"
              value={submissions.filter(sub => sub.status === 'responded').length}
              icon={<Check className="w-5 h-5 text-black-500" />}
              color="grey" />
            <StatCard title="Events"
              value={submissions.filter(isEventSubmission).length}
              icon={<Calendar className="w-5 h-5 text-black-500" />}
              color="grey" />
            <StatCard title="Contacts"
              value={submissions.filter(sub => !isEventSubmission(sub)).length}
              icon={<Contact className="w-5 h-5 text-black-500" />}
              color="grey" />
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-center gap-3 ml-6">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as SubmissionType)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="event">Events</option>
                  <option value="contact">Contacts</option>
                </select>



                <button
                  onClick={fetchSubmissions}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={exportExcel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors"
                >
                  Export Excel
                </button>

                {/* <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button> */}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {filteredSubmissions.length} of {submissions.length} submissions
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* Submissions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {submissions.length === 0 ?
                    "There are no submissions yet." :
                    "Try adjusting your search or filter criteria."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
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
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="bg-white hover:bg-gray-50">
                        {/* Contact Info */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                          <div className="text-sm text-gray-500">{submission.email}</div>
                          {(submission.contactNumber || submission.phone) && (
                            <div className="text-sm text-gray-500">
                              {submission.contactNumber || submission.phone}
                            </div>
                          )}
                        </td>

                        {/* Event Details */}
                        <td className="px-6 py-4">
                          {isEventSubmission(submission) ? (
                            <div>
                              {submission.eventType && (
                                <div className="text-sm font-medium text-gray-900">{submission.eventType}</div>
                              )}
                              {(submission.eventDate || submission.date) && (
                                <div className="text-sm text-gray-500">
                                  {formatEventDate(submission.eventDate || submission.date || '')}
                                </div>
                              )}
                              {(submission.eventTime || submission.time) && (
                                <div className="text-sm text-gray-500">
                                  {formatEventTime(submission.eventTime || submission.time || '')}
                                </div>
                              )}
                              {submission.location && (
                                <div className="text-sm text-gray-500">{submission.location}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">General inquiry</span>
                          )}
                        </td>

                        {/* Message */}
                        <td className="px-6 py-4 max-w-xs">
                          {submission.message ? (
                            <div>
                              <p className={`text-sm text-gray-900`}>
                                {submission.message.length > 64 && expandedMessage !== submission.id
                                  ? submission.message.slice(0, 64) + '...'
                                  : submission.message}
                              </p>
                              <button
                                className="text-blue-500 hover:underline mt-1 text-xs"
                                onClick={() =>
                                  setExpandedMessage(expandedMessage === submission.id ? null : submission.id)
                                }
                              >
                                {expandedMessage === submission.id ? "Show Less" : "Read More"}
                              </button>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {editingId === submission.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as any)}
                                className="text-sm border rounded p-1"
                              >
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="responded">Responded</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="denied">Denied</option>
                              </select>
                              <button
                                onClick={() => handleSave(submission.id)}
                                className="text-green-500 hover:text-green-700"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-1">{submission.status || 'new'}</span>
                              </span>
                              <button
                                onClick={() => handleEdit(submission.id)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Submitted */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatTimestamp(submission.timestamp || submission.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 relative">
                          <SubmissionActions
                            submission={submission}
                            deleteSubmission={deleteSubmission}
                            onSendMessage={() => {
                              const subject = encodeURIComponent(`Regarding your inquiry/event submission to Eunoia`);
                              const body = encodeURIComponent(
                                `Hi ${submission.name},\n\nThank you for reaching out to Eunoia!\n\n` +
                                `Your message: ${submission.message}\n\n` +
                                `[Type your response here]\n\n` +
                                `Best regards,\nEunoia Team`
                              );

                              // Gmail Compose URL
                              const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${submission.email}&su=${subject}&body=${body}`;

                              // Open in a new tab
                              window.open(gmailUrl, '_blank');
                            }}



                          />
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
    </div>
  );
};

// Updated Stat Card Component
const StatCard = ({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'blue' | 'orange' | 'purple' | 'green' | 'pink' | 'grey';
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-700',
    grey: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {title === 'New' && value > 0 && (
              <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                Unread inquiries
              </span>
            )}
          </div>
          {title.toLowerCase() === 'events' && (
            <p className="text-xs text-gray-500 mt-1">Event requests</p>
          )}
          {title.toLowerCase() === 'contacts' && (
            <p className="text-xs text-gray-500 mt-1">General inquiries</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;