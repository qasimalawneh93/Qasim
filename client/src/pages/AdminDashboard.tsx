import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
  Settings,
  Shield,
  Bell,
  BookOpen,
  MessageCircle,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  Mail,
  Eye,
  Edit,
  Download,
  CreditCard,
  FileText,
  Home,
  Globe,
  Video,
  Award,
  Wallet,
  Info,
  User,
} from "lucide-react";
import { db } from "../lib/database";
import { populateDemoData, resetDemoData } from "../lib/demo-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Student, Teacher, Lesson } from "../../shared/api";
import { Helmet } from 'react-helmet';

// Teacher Application Details Component
function TeacherApplicationDetails({ application }: { application: any }) {
  if (!application) return null;

  const applicationData = application.applicationData || {};

        <Helmet>
            <title>Admindashboard | Talkcon</title>
            <meta name="description" content="Admindashboard page of Talkcon platform." />
        </Helmet>
  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {application.name}
                </div>
                <div>
                  <strong>Email:</strong> {application.email}
                </div>
                <div>
                  <strong>Country:</strong> {application.country}
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
                  {applicationData.phone || "Not provided"}
                </div>
                <div>
                  <strong>City:</strong>{" "}
                  {applicationData.city || "Not provided"}
                </div>
                <div>
                  <strong>Timezone:</strong> {application.timezone}
                </div>
                <div>
                  <strong>Date of Birth:</strong>{" "}
                  {applicationData.dateOfBirth || "Not provided"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Application Status</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Status:</strong>
                  <Badge
                    className="ml-2"
                    variant={
                      application.status === "approved"
                        ? "default"
                        : application.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {application.status}
                  </Badge>
                </div>
                <div>
                  <strong>Applied:</strong>{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Experience:</strong> {application.experience} years
                </div>
                <div>
                  <strong>Hourly Rate:</strong> ${application.price}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teaching" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <div className="space-y-2">
                <div>
                  <strong>Native Language:</strong>
                  <Badge className="ml-2" variant="default">
                    {application.nativeLanguage}
                  </Badge>
                </div>
                <div>
                  <strong>Teaching Languages:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.languages.map((lang: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Other Languages:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(applicationData.otherLanguages || []).map(
                      (lang: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {lang}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Teaching Preferences</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Specialties:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.specialties.map(
                      (specialty: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {specialty}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <strong>Lesson Types:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(applicationData.lessonTypes || []).map(
                      (type: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {type}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <strong>Age Groups:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(applicationData.ageGroups || []).map(
                      (age: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {age}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Education Background</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Education Level:</strong>{" "}
                  {applicationData.education || "Not provided"}
                </div>
                <div>
                  <strong>University:</strong>{" "}
                  {applicationData.university || "Not provided"}
                </div>
                <div>
                  <strong>Degree:</strong>{" "}
                  {applicationData.degree || "Not provided"}
                </div>
                <div>
                  <strong>Graduation Year:</strong>{" "}
                  {applicationData.graduationYear || "Not provided"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                Certifications & Experience
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Teaching Experience:</strong>{" "}
                  {applicationData.teachingExperience ||
                    application.experience + " years"}
                </div>
                <div>
                  <strong>Certifications:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(applicationData.certifications || []).map(
                      (cert: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {cert}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Professional Profile</h4>
              <div className="space-y-3">
                <div>
                  <strong>Headline:</strong>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {applicationData.headline || "Not provided"}
                  </p>
                </div>
                <div>
                  <strong>Description:</strong>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {application.description || "Not provided"}
                  </p>
                </div>
                <div>
                  <strong>Teaching Method:</strong>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {applicationData.teachingMethod || "Not provided"}
                  </p>
                </div>
                <div>
                  <strong>Why I Teach:</strong>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {applicationData.whyTeach || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Introduction Video</h4>
              {application.video ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black/5 border">
                  <iframe
                    src={application.video}
                    title={`${application.name} - Introduction Video`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">
                    No introduction video provided
                  </p>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Documents & Files</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Profile Photo:</strong>{" "}
                  {applicationData.profilePhoto ? "Provided" : "Not provided"}
                </div>
                <div>
                  <strong>Resume:</strong>{" "}
                  {applicationData.resume ? "Provided" : "Not provided"}
                </div>
                <div>
                  <strong>Certificates:</strong>{" "}
                  {applicationData.certificates?.length || 0} files
                </div>
                <div>
                  <strong>Government ID:</strong>{" "}
                  {applicationData.governmentId ? "Provided" : "Not provided"}
                </div>
                <div>
                  <strong>Proof of Address:</strong>{" "}
                  {applicationData.proofOfAddress ? "Provided" : "Not provided"}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("overview");
  const [roleFilter, setRoleFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [lessonFilter, setLessonFilter] = useState("all");

  // Real data from database
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<Student[]>([]);
  const [teacherApplications, setTeacherApplications] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityEvents, setCommunityEvents] = useState<any[]>([]);
  const [communityChallenges, setCommunityChallenges] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState<any>({});
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userActivities, setUserActivities] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  const loadData = () => {
    const dbStats = db.getStats();
    setStats(dbStats);
    setUsers(db.getUsers({ search: searchTerm, status: roleFilter }));
    setTeacherApplications(
      db.getTeacherApplications({ search: searchTerm, status: teacherFilter }),
    );
    setLessons(db.getLessons({ status: lessonFilter }));

    // Load community data
    setCommunityPosts(db.getPosts());
    setCommunityEvents(db.getEvents());
    setCommunityChallenges(db.getChallenges());
    setCommunityStats(db.getCommunityStats());

    // Load recent activities
    setRecentActivities(db.getRecentActivities(15));

    // Load payout requests
    setPayoutRequests(db.getPayoutRequests());
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, roleFilter, teacherFilter, lessonFilter]);

  // Memoized payout calculations to prevent render issues
  const payoutStats = useMemo(() => {
    const pending = payoutRequests.filter((p) => p.status === "pending");
    const approved = payoutRequests.filter(
      (p) => p.status === "approved" || p.status === "completed",
    );
    const completed = payoutRequests.filter((p) => p.status === "completed");
    const today = new Date().toDateString();
    const approvedToday = payoutRequests.filter(
      (p) =>
        p.status === "approved" &&
        p.processedAt &&
        new Date(p.processedAt).toDateString() === today,
    );

    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
      approvedCount: approved.length,
      approvedAmount: approved.reduce((sum, p) => sum + p.amount, 0),
      completedAmount: completed.reduce((sum, p) => sum + p.amount, 0),
      approvedTodayCount: approvedToday.length,
    };
  }, [payoutRequests]);

  const overviewStats = [
    {
      title: "Total Students",
      value: stats.totalUsers?.toString() || "0",
      change: "+15.2%",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
      description: "Active learners on platform",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers?.toString() || "0",
      change: "+8.7%",
      trend: "up" as const,
      icon: GraduationCap,
      color: "text-green-600",
      description: "Approved language instructors",
    },
    {
      title: "Active Lessons",
      value: stats.totalLessons?.toString() || "0",
      change: "+22.3%",
      trend: "up" as const,
      icon: Calendar,
      color: "text-purple-600",
      description: "Completed learning sessions",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      change: "+18.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-orange-600",
      description: "Platform earnings this month",
    },
  ];

  const handleApproveTeacher = (id: string) => {
    const success = db.approveTeacher(id);
    if (success) {
      toast({
        title: "Teacher Approved",
        description: `Teacher application has been approved successfully.`,
      });
      loadData();
    } else {
      toast({
        title: "Error",
        description: "Failed to approve teacher application.",
        variant: "destructive",
      });
    }
  };

  const handleRejectTeacher = (id: string) => {
    const success = db.rejectTeacher(id);
    if (success) {
      toast({
        title: "Teacher Rejected",
        description: `Teacher application has been rejected.`,
        variant: "destructive",
      });
      loadData();
    } else {
      toast({
        title: "Error",
        description: "Failed to reject teacher application.",
        variant: "destructive",
      });
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    if (action === "View Details") {
      const user = db.getUserById(userId);
      if (user) {
        setSelectedUser(user);
        // Load user's activity history
        const activities = db
          .getRecentActivities(100)
          .filter((activity) => activity.userId === userId);
        setUserActivities(activities);
        // Load user's wallet transactions
        const transactions = db.getUserTransactions(userId);
        setUserTransactions(transactions);
        setUserDetailsModal(true);
      }
    } else {
      toast({
        title: "User Action",
        description: `${action} action performed on user ${userId}.`,
      });
    }
  };

  const handleExportData = () => {
    const csvData = [
      ["Type", "Count", "Change"],
      ["Students", stats.totalUsers || 0, "+15.2%"],
      ["Teachers", stats.totalTeachers || 0, "+8.7%"],
      ["Lessons", stats.totalLessons || 0, "+22.3%"],
      ["Revenue", `$${stats.totalRevenue || 0}`, "+18.5%"],
    ]
      .map((row) => row.join(","))
      .join("\\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "linguaconnect-admin-report.csv";
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Admin report has been downloaded successfully.",
    });
  };

  const handleModeratePost = (
    postId: string,
    action: "approve" | "reject" | "delete",
  ) => {
    try {
      db.moderatePost(postId, action);
      loadData();
      toast({
        title: "Post Moderated",
        description: `Post has been ${action}d successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to moderate post.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    try {
      db.deleteEvent(eventId);
      loadData();
      toast({
        title: "Event Deleted",
        description: "Event has been removed from the community.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateChallenge = (challengeId: string) => {
    try {
      db.deactivateChallenge(challengeId);
      loadData();
      toast({
        title: "Challenge Deactivated",
        description: "Challenge has been deactivated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate challenge.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleApprovePayoutRequest = (requestId: string) => {
    try {
      db.approvePayoutRequest(requestId, "Approved by admin");
      loadData();
      toast({
        title: "Payout Approved",
        description: "The payout request has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve payout request.",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayoutRequest = (requestId: string) => {
    try {
      db.rejectPayoutRequest(requestId, "Rejected by admin");
      loadData();
      toast({
        title: "Payout Rejected",
        description: "The payout request has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject payout request.",
        variant: "destructive",
      });
    }
  };

  // Sample chart data
  const chartData = [
    { name: "Jan", students: 400, lessons: 240, revenue: 2400 },
    { name: "Feb", students: 300, lessons: 380, revenue: 2210 },
    { name: "Mar", students: 500, lessons: 520, revenue: 2290 },
    { name: "Apr", students: 280, lessons: 390, revenue: 2000 },
    { name: "May", students: 590, lessons: 480, revenue: 2181 },
    { name: "Jun", students: 320, lessons: 380, revenue: 2500 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Talkcon Admin</h1>
            <p className="text-gray-600">Platform Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Homepage
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const result = populateDemoData();
                loadData();
                toast({
                  title: "Demo Data Created",
                  description: `Created ${result.studentsCreated} students, ${result.teacherApplicationsCreated} teachers, and ${result.lessonsCreated} lessons`,
                });
              }}
            >
              Add Demo Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const count = db.createDemoApprovedTeachers();
                loadData();
                toast({
                  title: "Demo Teachers Added",
                  description: `Created ${count} approved teachers for homepage testing`,
                });
              }}
            >
              Add Demo Teachers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const result = db.createDemoCommunityData();
                loadData();
                toast({
                  title: "Demo Community Data Added",
                  description: `Created ${result.postsCreated} posts, ${result.eventsCreated} events, and ${result.challengesCreated} challenges`,
                });
              }}
            >
              Add Community Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const count = db.createDemoPayoutRequests();
                loadData();
                toast({
                  title: "Demo Payout Requests Added",
                  description: `Created ${count} payout requests for testing`,
                });
              }}
            >
              Add Community Data
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    "⚠️ WARNING: This will permanently delete ALL users, teachers, applications, and lessons. This action cannot be undone.\n\nAre you absolutely sure?",
                  )
                ) {
                  db.clearAllData();
                  loadData();
                  toast({
                    title: "All Data Deleted",
                    description:
                      "All fake users, teachers, students, and lessons have been permanently removed.",
                    variant: "destructive",
                  });
                }
              }}
            >
              🗑️ Delete All Fake Users
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
            </div>
            <nav className="space-y-1">
              {[
                {
                  id: "overview",
                  icon: BarChart3,
                  label: "Overview",
                  tab: "overview",
                  description: "Platform dashboard and statistics",
                  badge: null,
                },
                {
                  id: "users",
                  icon: Users,
                  label: "User Management",
                  tab: "users",
                  description: "Manage students and accounts",
                  badge: stats.totalUsers?.toString(),
                },
                {
                  id: "teachers",
                  icon: GraduationCap,
                  label: "Teacher Applications",
                  tab: "teachers",
                  description: "Review and approve teachers",
                  badge: stats.pendingApplications?.toString(),
                },
                {
                  id: "lessons",
                  icon: Calendar,
                  label: "Lessons & Bookings",
                  tab: "lessons",
                  description: "Monitor learning sessions",
                  badge: null,
                },
                {
                  id: "community",
                  icon: Globe,
                  label: "Community",
                  tab: "community",
                  description: "Manage discussions and events",
                  badge: communityStats.totalPosts?.toString(),
                },
                {
                  id: "content",
                  icon: BookOpen,
                  label: "Content Management",
                  tab: "content",
                  description: "Pages and learning materials",
                  badge: null,
                },
                {
                  id: "system",
                  icon: Settings,
                  label: "System Monitoring",
                  tab: "system",
                  description: "Performance and health",
                  badge: "OK",
                },
                {
                  id: "payouts",
                  icon: CreditCard,
                  label: "Payout Requests",
                  tab: "payouts",
                  description: "Teacher payout management",
                  badge: payoutRequests
                    .filter((p) => p.status === "pending")
                    .length.toString(),
                },
                {
                  id: "activity",
                  icon: Activity,
                  label: "Activity Log",
                  tab: "activity",
                  description: "Platform activity tracking",
                  badge: recentActivities.length.toString(),
                },
              ].map((item) => (
                <div key={item.id} className="relative group">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-3 hover:bg-gray-50 transition-colors ${
                      selectedSidebarItem === item.id
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedSidebarItem(item.id);
                      setActiveTab(item.tab);
                      toast({
                        title: `Switched to ${item.label}`,
                        description: item.description,
                      });
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon
                          className={`w-4 h-4 mr-3 ${
                            selectedSidebarItem === item.id
                              ? "text-primary"
                              : "text-gray-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 hidden group-hover:block">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs ml-2 bg-gray-100"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </div>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Active Session: 2h 34m</div>
                <div>Last Update: Just now</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  System Healthy
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              const tabToSidebarMapping: { [key: string]: string } = {
                overview: "overview",
                users: "users",
                teachers: "teachers",
                lessons: "lessons",
                content: "content",
                system: "system",
              };
              setSelectedSidebarItem(tabToSidebarMapping[value] || value);
            }}
            className="space-y-6"
          >
            <div className="border-b border-gray-200 pb-4">
              <TabsList className="grid w-full grid-cols-8 h-12 bg-gray-50 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Teachers
                </TabsTrigger>
                <TabsTrigger
                  value="lessons"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Lessons
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  System
                </TabsTrigger>
                <TabsTrigger
                  value="payouts"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payouts
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-500">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}
                        >
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          axisLine={true}
                          tickLine={true}
                          tick={true}
                        />
                        <YAxis axisLine={true} tickLine={true} tick={true} />
                        <Tooltip />
                        <Bar dataKey="students" fill="#3b82f6" />
                        <Bar dataKey="lessons" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => {
                          const timeAgo = new Date(activity.timestamp);
                          const diffMs = Date.now() - timeAgo.getTime();
                          const diffMins = Math.floor(diffMs / 60000);
                          const diffHours = Math.floor(diffMs / 3600000);
                          const diffDays = Math.floor(diffMs / 86400000);

                          let timeString = "";
                          if (diffDays > 0) {
                            timeString = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                          } else if (diffHours > 0) {
                            timeString = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                          } else if (diffMins > 0) {
                            timeString = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
                          } else {
                            timeString = "Just now";
                          }

                          const getActivityColor = (type: string) => {
                            switch (type) {
                              case "user_signup":
                              case "lesson_completed":
                              case "teacher_approved":
                              case "payout_approved":
                                return "bg-green-500";
                              case "teacher_application":
                              case "post_created":
                                return "bg-blue-500";
                              case "lesson_booked":
                                return "bg-purple-500";
                              case "teacher_rejected":
                              case "payout_rejected":
                                return "bg-red-500";
                              case "payout_requested":
                                return "bg-orange-500";
                              case "wallet_recharge":
                                return "bg-green-500";
                              case "lesson_payment":
                                return "bg-blue-500";
                              default:
                                return "bg-gray-500";
                            }
                          };

                          return (
                            <div
                              key={activity.id}
                              className="flex items-center space-x-3"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {timeString}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            No recent activities
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* User Management */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Lessons</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">
                                  Student
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.joinedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{user.completedLessons}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("View Details", user.id)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("Edit User", user.id)
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("Send Message", user.id)
                                  }
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleUserAction("Suspend", user.id)
                                  }
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teachers" className="space-y-6">
              {/* Teacher Applications */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Teacher Applications</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search applications..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Select
                    value={teacherFilter}
                    onValueChange={setTeacherFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Languages</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={application.avatar} />
                                <AvatarFallback>
                                  {application.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {application.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {application.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {application.languages
                                .slice(0, 2)
                                .map((lang: string) => (
                                  <Badge
                                    key={lang}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {lang}
                                  </Badge>
                                ))}
                              {application.languages.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{application.languages.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{application.experience} years</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                application.status === "approved"
                                  ? "default"
                                  : application.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              application.createdAt,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setSelectedApplication(application)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Teacher Application Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Complete application information for{" "}
                                      {application.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedApplication && (
                                    <TeacherApplicationDetails
                                      application={selectedApplication}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                              {application.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApproveTeacher(application.id)
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleRejectTeacher(application.id)
                                    }
                                  >
                                    <UserX className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lessons" className="space-y-6">
              {/* Lessons Management */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lessons & Bookings</h2>
                <Select value={lessonFilter} onValueChange={setLessonFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lessons</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons.map((lesson) => (
                        <TableRow key={lesson.id}>
                          <TableCell>
                            {new Date(lesson.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{lesson.teacherId}</TableCell>
                          <TableCell>{lesson.studentId}</TableCell>
                          <TableCell>{lesson.language}</TableCell>
                          <TableCell>{lesson.duration} min</TableCell>
                          <TableCell>${lesson.price}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                lesson.status === "completed"
                                  ? "default"
                                  : lesson.status === "scheduled"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {lesson.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {lesson.status === "scheduled" && (
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Reschedule
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Content Management */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Content Management</h2>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Create New Page
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Pages & Navigation</CardTitle>
                  <p className="text-sm text-gray-600">
                    Manage all website pages and navigation structure
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Homepage",
                        status: "Live",
                        lastUpdated: "2 days ago",
                        path: "/",
                        views: "12,847",
                        type: "landing",
                      },
                      {
                        name: "Find Teachers",
                        status: "Live",
                        lastUpdated: "1 week ago",
                        path: "/find-teachers",
                        views: "8,234",
                        type: "marketplace",
                      },
                      {
                        name: "How it Works",
                        status: "Live",
                        lastUpdated: "3 days ago",
                        path: "/how-it-works",
                        views: "4,567",
                        type: "informational",
                      },
                    ].map((page, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-lg">
                              {page.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {page.path}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Updated {page.lastUpdated}
                            </div>
                          </div>
                          <Badge
                            variant={
                              page.status === "Live" ? "default" : "secondary"
                            }
                            className="ml-2"
                          >
                            {page.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Views:</span>
                            <div className="font-medium">{page.views}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <div className="font-medium capitalize">
                              {page.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              window.open(page.path, "_blank");
                              toast({
                                title: `Viewing ${page.name}`,
                                description: `Opened ${page.name} in new tab`,
                              });
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              toast({
                                title: `Editing ${page.name}`,
                                description: `Content management system opened for ${page.name}`,
                              });
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              {/* System Monitoring */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">System Monitoring</h2>
                <Button variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Server Status</p>
                        <p className="text-2xl font-bold text-green-600">
                          Online
                        </p>
                        <p className="text-sm text-gray-500">99.9% uptime</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-100">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Database</p>
                        <p className="text-2xl font-bold text-green-600">
                          Healthy
                        </p>
                        <p className="text-sm text-gray-500">Response: 23ms</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-100">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold">1,247</p>
                        <p className="text-sm text-gray-500">Current online</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-100">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Scheduled maintenance on Sunday 3:00 AM - 5:00 AM EST
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Database backup completed successfully at 2:00 AM
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Community Management</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <span>
                    <strong>{communityStats.totalPosts || 0}</strong> posts
                  </span>
                  <span>
                    <strong>{communityStats.totalEvents || 0}</strong> events
                  </span>
                  <span>
                    <strong>{communityStats.activeChallenges || 0}</strong>{" "}
                    challenges
                  </span>
                </div>
              </div>

              {/* Community Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <MessageCircle className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Posts</p>
                        <p className="text-2xl font-bold">
                          {communityStats.totalPosts || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Video className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Live Events</p>
                        <p className="text-2xl font-bold">
                          {communityStats.liveEvents || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Challenges</p>
                        <p className="text-2xl font-bold">
                          {communityStats.activeChallenges || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Participants</p>
                        <p className="text-2xl font-bold">
                          {communityStats.totalParticipants || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Community Posts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {communityPosts.slice(0, 8).map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {post.authorName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {post.authorName}
                                </div>
                                <Badge
                                  variant={
                                    post.authorType === "teacher"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {post.authorType}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium text-sm">
                                {post.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {post.content}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {post.language}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>❤️ {post.likes}</div>
                              <div>👁️ {post.views}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.isModerated ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {post.isModerated ? "Approved" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {!post.isModerated && (
                                <Button size="sm" className="text-xs h-7 px-2">
                                  Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs h-7 px-2"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payouts Tab */}
            <TabsContent value="payouts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Teacher Payout Requests
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <span>
                    <strong>{payoutStats.pendingCount}</strong> pending
                  </span>
                  <span>
                    <strong>${payoutStats.approvedAmount.toFixed(2)}</strong>{" "}
                    approved
                  </span>
                </div>
              </div>

              {/* Payout Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CreditCard className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">
                          Pending Requests
                        </p>
                        <p className="text-2xl font-bold">
                          {payoutStats.pendingCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Approved Today</p>
                        <p className="text-2xl font-bold">
                          {payoutStats.approvedTodayCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Pending Amount</p>
                        <p className="text-2xl font-bold">
                          ${payoutStats.pendingAmount.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Total Paid</p>
                        <p className="text-2xl font-bold">
                          ${payoutStats.completedAmount.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payout Requests Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Payout Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payoutRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">
                                {request.teacherName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {request.teacherEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-lg text-green-600">
                              ${request.amount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {request.method === "paypal" ? (
                                <CreditCard className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Wallet className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="text-sm">
                                {request.method === "paypal"
                                  ? "PayPal"
                                  : "Bank Transfer"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {request.method === "paypal"
                                ? request.paymentDetails.paypalEmail
                                : `${request.paymentDetails.bankName} - ****${request.paymentDetails.bankAccountNumber?.slice(-4)}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(
                                request.requestedAt,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                request.requestedAt,
                              ).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "approved" ||
                                request.status === "completed"
                                  ? "default"
                                  : request.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {request.status}
                            </Badge>
                            {request.adminNotes && (
                              <div className="text-xs text-gray-500 mt-1">
                                {request.adminNotes}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {request.status === "pending" && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  className="text-xs h-7 px-2"
                                  onClick={() =>
                                    handleApprovePayoutRequest(request.id)
                                  }
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="text-xs h-7 px-2"
                                  onClick={() =>
                                    handleRejectPayoutRequest(request.id)
                                  }
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {request.status === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 px-2"
                                onClick={() => {
                                  db.markPayoutCompleted(request.id);
                                  loadData();
                                  toast({
                                    title: "Payout Completed",
                                    description: "Payout marked as completed.",
                                  });
                                }}
                              >
                                Mark Completed
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {payoutRequests.length === 0 && (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Payout Requests</h3>
                      <p className="text-gray-500">
                        Teacher payout requests will appear here when submitted.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Log Tab */}
            <TabsContent value="activity" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Platform Activity Log</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <span>
                    <strong>{recentActivities.length}</strong> recent activities
                  </span>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Platform Activities</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivities.map((activity) => {
                        const getActivityIcon = (type: string) => {
                          switch (type) {
                            case "user_signup":
                              return (
                                <UserCheck className="w-4 h-4 text-green-500" />
                              );
                            case "teacher_application":
                              return (
                                <FileText className="w-4 h-4 text-blue-500" />
                              );
                            case "lesson_booked":
                              return (
                                <Calendar className="w-4 h-4 text-purple-500" />
                              );
                            case "lesson_completed":
                              return (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              );
                            case "post_created":
                              return (
                                <MessageCircle className="w-4 h-4 text-blue-500" />
                              );
                            case "teacher_approved":
                              return (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              );
                            case "teacher_rejected":
                              return (
                                <XCircle className="w-4 h-4 text-red-500" />
                              );
                            case "payout_requested":
                              return (
                                <CreditCard className="w-4 h-4 text-orange-500" />
                              );
                            case "payout_approved":
                              return (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              );
                            case "payout_rejected":
                              return (
                                <XCircle className="w-4 h-4 text-red-500" />
                              );
                            case "wallet_recharge":
                              return (
                                <Wallet className="w-4 h-4 text-green-500" />
                              );
                            case "lesson_payment":
                              return (
                                <DollarSign className="w-4 h-4 text-blue-500" />
                              );
                            default:
                              return (
                                <Activity className="w-4 h-4 text-gray-500" />
                              );
                          }
                        };

                        const getActivityBadge = (type: string) => {
                          switch (type) {
                            case "user_signup":
                              return <Badge variant="secondary">Signup</Badge>;
                            case "teacher_application":
                              return (
                                <Badge variant="default">Application</Badge>
                              );
                            case "lesson_booked":
                              return <Badge variant="secondary">Booking</Badge>;
                            case "lesson_completed":
                              return <Badge variant="default">Lesson</Badge>;
                            case "post_created":
                              return (
                                <Badge variant="secondary">Community</Badge>
                              );
                            case "teacher_approved":
                              return <Badge variant="default">Approved</Badge>;
                            case "teacher_rejected":
                              return (
                                <Badge variant="destructive">Rejected</Badge>
                              );
                            case "payout_requested":
                              return (
                                <Badge variant="secondary">
                                  Payout Request
                                </Badge>
                              );
                            case "payout_approved":
                              return (
                                <Badge variant="default">Payout Approved</Badge>
                              );
                            case "payout_rejected":
                              return (
                                <Badge variant="destructive">
                                  Payout Rejected
                                </Badge>
                              );
                            case "wallet_recharge":
                              return (
                                <Badge variant="default">Wallet Recharge</Badge>
                              );
                            case "lesson_payment":
                              return (
                                <Badge variant="secondary">
                                  Lesson Payment
                                </Badge>
                              );
                            default:
                              return <Badge variant="outline">Activity</Badge>;
                          }
                        };

                        return (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getActivityIcon(activity.type)}
                                {getActivityBadge(activity.type)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-sm">
                                  {activity.userName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {activity.userId}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-sm">
                                <div className="font-medium text-sm">
                                  {activity.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(activity.timestamp).toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {activity.metadata && (
                                <div className="text-xs text-gray-500">
                                  {activity.metadata.language && (
                                    <Badge variant="outline" className="mr-1">
                                      {activity.metadata.language}
                                    </Badge>
                                  )}
                                  {activity.metadata.price && (
                                    <span className="text-green-600 font-medium">
                                      ${activity.metadata.price}
                                    </span>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {recentActivities.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Activities Yet</h3>
                      <p className="text-gray-500">
                        Platform activities will appear here as users interact
                        with the system.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* User Details Modal */}
      <Dialog open={userDetailsModal} onOpenChange={setUserDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedUser?.avatar} />
                <AvatarFallback>
                  {selectedUser?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {selectedUser?.name || "Unknown User"}
                </div>
                <div className="text-sm text-gray-500 font-normal">
                  User Details
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Account Status
                        </div>
                        <Badge
                          variant={
                            selectedUser.status === "active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {selectedUser.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Wallet Balance
                        </div>
                        <div className="font-semibold text-lg">
                          ${selectedUser.walletBalance?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Member Since
                        </div>
                        <div className="font-semibold">
                          {new Date(
                            selectedUser.createdAt || selectedUser.joinedDate,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Full Name
                      </label>
                      <div className="text-sm font-semibold">
                        {selectedUser.name || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email Address
                      </label>
                      <div className="text-sm font-semibold">
                        {selectedUser.email || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        User ID
                      </label>
                      <div className="text-sm font-mono">
                        {selectedUser.id || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Account Type
                      </label>
                      <Badge variant="secondary">Student</Badge>
                    </div>
                    {selectedUser.level &&
                      Object.keys(selectedUser.level).length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Language Levels
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(selectedUser.level).map(
                              ([lang, level]) => (
                                <Badge
                                  key={lang}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {lang}: {level}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {selectedUser.learningLanguages &&
                      selectedUser.learningLanguages.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Learning Languages
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedUser.learningLanguages.map(
                              (lang: string) => (
                                <Badge
                                  key={lang}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {lang}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Learning Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedUser.completedLessons || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        Lessons Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedUser.hoursLearned || 0}
                      </div>
                      <div className="text-sm text-gray-500">Hours Learned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedUser.streak || 0}
                      </div>
                      <div className="text-sm text-gray-500">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Recent Transactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userTransactions.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {userTransactions.slice(0, 10).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {transaction.type === "recharge" ? (
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {transaction.description}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  transaction.createdAt,
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-semibold ${
                                transaction.type === "recharge"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "recharge" ? "+" : "-"}$
                              {transaction.amount.toFixed(2)}
                            </div>
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : transaction.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Transactions</h3>
                      <p className="text-gray-500">
                        This user hasn't made any wallet transactions yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Activity History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userActivities.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {userActivities.slice(0, 10).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {activity.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold mb-2">No Activity</h3>
                      <p className="text-gray-500">
                        This user's activity history will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admin Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Admin Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Message Sent",
                          description: `Message sent to ${selectedUser.name}.`,
                        });
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "User Updated",
                          description: `${selectedUser.name}'s profile has been updated.`,
                        });
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "User Suspended",
                          description: `${selectedUser.name} has been suspended.`,
                          variant: "destructive",
                        });
                        setUserDetailsModal(false);
                      }}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Suspend User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
