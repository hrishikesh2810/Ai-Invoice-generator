import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, DollarSign, Plus, TrendingUp, ArrowUpRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import AIInsightsCard from "../../components/AIInsightsCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const invoices = response.data;

        const totalInvoices = invoices.length;
        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });
        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      iconColor: "text-violet-600",
    },
    {
      icon: TrendingUp,
      label: "Total Paid",
      value: `$${stats.totalPaid.toFixed(2)}`,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: Clock,
      label: "Total Unpaid",
      value: `$${stats.totalUnpaid.toFixed(2)}`,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
          <div className="absolute inset-0 blur-xl bg-violet-400 opacity-30 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <Button
            onClick={() => navigate("/invoices/new")}
            icon={Plus}
            className="self-start sm:self-auto"
          >
            New Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-3">
                    {stat.label}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </p>
                </div>
                
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              
              <div className="relative mt-4 flex items-center text-xs text-slate-500">
                <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-600" />
                <span>View details</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights Card */}
        <AIInsightsCard />

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
              <p className="text-sm text-slate-600 mt-1">Your latest transactions</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/invoices")}>
              View All
            </Button>
          </div>

          {recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-blue-50/30 cursor-pointer transition-colors duration-150 group"
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {invoice.billTo.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                              {invoice.billTo.clientName}
                            </div>
                            <div className="text-xs text-slate-500">
                              #{invoice.invoiceNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">
                          ${invoice.total.toFixed(2)}
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : invoice.status === "Pending"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {moment(invoice.dueDate).format("MMM D, YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-violet-600" />
                </div>
                <div className="absolute inset-0 bg-violet-400 blur-2xl opacity-20 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No Invoices Yet
              </h3>
              <p className="text-slate-600 mb-8 max-w-md text-center">
                You haven't created any invoices yet. Get started by creating your first one.
              </p>
              <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
                Create Your First Invoice
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;