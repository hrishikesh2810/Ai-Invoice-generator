import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Loader2, Trash2, Edit, Search, FileText, Plus, AlertCircle, Sparkles, Mail, Filter, TrendingUp, DollarSign } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import CreateWithAIModal from '../../components/invoices/CreateWithAIModal';
import ReminderModal from '../../components/invoices/ReminderModal';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)));
      } catch (err) {
        setError('Failed to fetch invoices.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      } catch (err) {
        setError('Failed to delete invoice.');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (invoice) => {
    setStatusChangeLoading(invoice._id);
    try {
      const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
      const updatedInvoice = { ...invoice, status: newStatus };
      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), updatedInvoice);
      setInvoices(invoices.map(inv => inv._id === invoice._id ? response.data : inv));
    } catch (err) {
      setError('Failed to update invoice status.');
      console.error(err);
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const handleOpenReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => statusFilter === 'All' || invoice.status === statusFilter)
      .filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [invoices, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className="relative">
          <Loader2 className='w-12 h-12 animate-spin text-violet-600' />
          <div className="absolute inset-0 blur-xl bg-violet-400 opacity-30 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8'>
      <div className="max-w-7xl mx-auto space-y-6">
        <CreateWithAIModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={selectedInvoiceId} />

        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              All Invoices
            </h1>
            <p className='text-slate-600 mt-2 text-sm sm:text-base flex items-center gap-2'>
              <TrendingUp className="w-4 h-4" />
              Manage and track all your invoices in one place
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button variant="secondary" onClick={() => setIsAiModalOpen(true)} icon={Sparkles}>
              AI Assistant
            </Button>
            <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
              New Invoice
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-sm'>
            <div className='flex items-start'>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className='w-5 h-5 text-red-600' />
              </div>
              <div className='flex-1 ml-3'>
                <h3 className='text-sm font-semibold text-red-800 mb-1'>Error</h3>
                <p className='text-sm text-red-700'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Card */}
        <div className='bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50'>
          <div className='p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50/50 to-purple-50/50'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-grow group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <Search className='w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors' />
                </div>
                <input
                  type="text"
                  placeholder='Search invoices...'
                  className='w-full h-12 pl-12 pr-4 py-2 border-2 border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className='flex-shrink-0 relative group'>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <select
                  className='w-full sm:w-auto h-12 pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none cursor-pointer transition-all'
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice List */}
          {filteredInvoices.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-4'>
              <div className='relative mb-6'>
                <div className='w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center'>
                  <FileText className='w-12 h-12 text-violet-600' />
                </div>
                <div className="absolute inset-0 bg-violet-400 blur-3xl opacity-20 animate-pulse"></div>
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>No Invoices Found</h3>
              <p className='text-slate-600 mb-8 max-w-md text-center'>
                {invoices.length === 0
                  ? "Get started by creating your first invoice"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {invoices.length === 0 && (
                <Button onClick={() => navigate('/invoices/new')} icon={Plus}>
                  Create First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gradient-to-r from-slate-50 to-slate-100'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider'>
                      Invoice
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider'>
                      Client
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider'>
                      Due Date
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className='bg-white divide-y divide-slate-100'>
                  {filteredInvoices.map(invoice => (
                    <tr
                      key={invoice._id}
                      className='hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-purple-50/30 transition-all duration-150 group'
                    >
                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className='px-6 py-4 whitespace-nowrap cursor-pointer'
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            #
                          </div>
                          <span className='text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors'>
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>

                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-semibold text-sm">
                            {invoice.billTo.clientName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {invoice.billTo.clientName}
                          </span>
                        </div>
                      </td>

                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-bold text-slate-900">
                            {invoice.total.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      <td
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className='px-6 py-4 whitespace-nowrap cursor-pointer'
                      >
                        <span className="text-sm text-slate-600">
                          {moment(invoice.dueDate).format('MMM D, YYYY')}
                        </span>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : invoice.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-right'>
                        <div className='flex items-center justify-end gap-2' onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={() => handleStatusChange(invoice)}
                            isLoading={statusChangeLoading === invoice._id}
                          >
                            {invoice.status === 'Paid' ? 'Unpaid' : 'Paid'}
                          </Button>
                          <Button
                            size="small"
                            variant='ghost'
                            onClick={() => navigate(`/invoices/${invoice._id}`)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleDelete(invoice._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                          {invoice.status !== 'Paid' && (
                            <Button
                              size="small"
                              variant="ghost"
                              onClick={() => handleOpenReminderModal(invoice._id)}
                              title="Generate Reminder"
                            >
                              <Mail className='w-4 h-4 text-blue-500' />
                            </Button>
                          )}
                        </div>
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

export default AllInvoices;