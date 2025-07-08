import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";
import {
import { Helmet } from 'react-helmet';
  DollarSign,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  MessageCircle,
  Video,
  CheckCircle,
  XCircle,
  MoreVertical,
  Settings,
  Eye,
  Edit,
  Send,
  Bell,
  BookOpen,
  UserCheck,
  Wallet,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Gift,
  HelpCircle,
  Globe,
  Filter,
  Download,
  FileText,
  UserPlus,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface LessonRequest {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  language: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  price: number;
  message: string;
  requestedAt: string;
  urgency: "normal" | "urgent";
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<any>(null);
  const [requests, setRequests] = useState<LessonRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LessonRequest | null>(
    null,
  );
  const [lessons, setLessons] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [lessonsModalOpen, setLessonsModalOpen] = useState(false);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [meetingPlatforms, setMeetingPlatforms] = useState({
    zoom: "",
    googleMeet: "",
    skype: "",
    voov: "",
    preferredPlatform: "zoom" as "zoom" | "googleMeet" | "skype" | "voov",
  });
  const [accountMode, setAccountMode] = useState<"teacher" | "student">(
    "teacher",
  );

  useEffect(() => {
    loadTeacherData();
  }, [user]);

  const loadTeacherData = async () => {
    if (!user || !user.email) {
      setLoading(false);
      return;
    }

    try {
      // Get teacher data from database
      const teacher = db.getTeacherByEmail(user.email);
      if (teacher) {
        setTeacherData(teacher);

        // Get lessons for this teacher
        const teacherLessons = db.getLessons({ teacherId: teacher.id });
        setLessons(teacherLessons);

        // Calculate stats
        const completedLessons = teacherLessons.filter(
          (l) => l.status === "completed",
        );
        const upcomingLessons = teacherLessons.filter(
          (l) => l.status === "scheduled",
        );
        const totalEarnings = completedLessons.reduce(
          (sum, lesson) => sum + lesson.price,
          0,
        );
        const thisMonthLessons = completedLessons.filter((l) => {
          const lessonDate = new Date(l.date);
          const now = new Date();
        <Helmet>
            <title>Teacherdashboard | Talkcon</title>
            <meta name="description" content="Teacherdashboard page of Talkcon platform." />
        </Helmet>
          return (
            lessonDate.getMonth() === now.getMonth() &&
            lessonDate.getFullYear() === now.getFullYear()
          );
        });

        setStats({
          totalStudents: new Set(teacherLessons.map((l) => l.studentId)).size,
          totalLessons: completedLessons.length,
          thisMonthLessons: thisMonthLessons.length,
          totalEarnings,
          upcomingLessons: upcomingLessons.length,
          rating: teacher.rating,
          reviewCount: teacher.reviewCount,
        });

        // Load payout requests
        const payouts = db.getPayoutRequests({ teacherId: teacher.id });
        setPayoutRequests(payouts);

        // Load meeting platforms
        const platforms = teacher.meetingPlatforms || {};
        setMeetingPlatforms({
          zoom: platforms.zoom || "",
          googleMeet: platforms.googleMeet || "",
          skype: platforms.skype || "",
          voov: platforms.voov || "",
          preferredPlatform: platforms.preferredPlatform || "zoom",
        });

        // Convert pending lessons to lesson requests for approval
        const lessonRequests = teacherLessons
          .filter((l) => l.status === "pending")
          .map((lesson) => {
            const student = db.getUserById(lesson.studentId);
            return {
              id: lesson.id,
              studentName: student?.name || "Unknown Student",
              studentAvatar: student?.avatar || "/placeholder.svg",
              studentLevel: "Beginner", // You can enhance this with real student level
              language: lesson.language,
              preferredDate: lesson.date,
              preferredTime: new Date(lesson.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              duration: lesson.duration,
              price: lesson.price,
              message: lesson.notes || "Looking forward to learning with you!",
              requestedAt: lesson.createdAt || new Date().toISOString(),
              urgency: lesson.type === "trial" ? "normal" : "normal",
            };
          });

        setRequests(lessonRequests);
      }
    } catch (error) {
      console.error("Error loading teacher data:", error);
      toast({
        title: "Error",
        description: "Failed to load teacher data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    // Update lesson status to scheduled in database
    const success = db.updateLesson(requestId, { status: "scheduled" });

    if (success) {
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      toast({
        title: "Lesson Request Accepted",
        description:
          "The lesson has been confirmed. The student will be notified.",
      });
      // Reload data to update stats
      loadTeacherData();
    } else {
      toast({
        title: "Error",
        description: "Failed to accept the lesson request.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    // Update lesson status to cancelled in database
    const success = db.updateLesson(requestId, { status: "cancelled" });

    if (success) {
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      toast({
        title: "Lesson Request Declined",
        description:
          "The lesson request has been declined. The student will be notified.",
      });
      // Reload data to update stats
      loadTeacherData();
    } else {
      toast({
        title: "Error",
        description: "Failed to decline the lesson request.",
        variant: "destructive",
      });
    }
  };

  const handleSetAvailability = () => {
    setAvailabilityModalOpen(true);
  };

  const handleEditProfile = () => {
    setProfileEditModalOpen(true);
  };

  const handleViewProfile = () => {
    if (teacherData) {
      // Open teacher profile in new tab
      window.open(`/teachers/${teacherData.id}`, "_blank");
      toast({
        title: "Profile Opened",
        description: "Your public teacher profile opened in a new tab.",
      });
    }
  };

  const handleUpdateAvailability = (newAvailability: string[]) => {
    if (teacherData) {
      // Update teacher availability in database
      // This would be a real API call in production
      toast({
        title: "Availability Updated",
        description:
          "Your teaching availability has been updated successfully.",
      });
    }
  };

  const handleUpdateResponseTime = (responseTime: string) => {
    if (teacherData) {
      // Update response time in database
      toast({
        title: "Response Time Updated",
        description: `Your response time has been set to ${responseTime}.`,
      });
    }
  };

  const handleAccountModeSwitch = (mode: "teacher" | "student") => {
    setAccountMode(mode);
    if (mode === "student") {
      // Navigate to student dashboard while keeping teacher status
      toast({
        title: "Switched to Student Mode",
        description:
          "You are now viewing as a student. You can switch back anytime.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Switched to Teacher Mode",
        description: "You are now in teacher mode.",
      });
    }
  };

  const handleToggleAutoAccept = (autoAccept: boolean) => {
    toast({
      title: autoAccept ? "Auto-Accept Enabled" : "Auto-Accept Disabled",
      description: autoAccept
        ? "New lesson requests will be automatically accepted."
        : "You'll need to manually review each lesson request.",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const statsArray = [
    {
      title: "Total Earnings",
      value: `$${(stats.totalEarnings || 0).toFixed(0)}`,
      change: teacherData ? `${stats.totalLessons || 0} lessons` : "0 lessons",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Students",
      value: (stats.totalStudents || 0).toString(),
      change: `${stats.upcomingLessons || 0} upcoming`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Lessons This Month",
      value: (stats.thisMonthLessons || 0).toString(),
      change: `${stats.totalLessons || 0} total`,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: stats.rating ? stats.rating.toFixed(1) : "0.0",
      change: `${stats.reviewCount || 0} reviews`,
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  // Real upcoming lessons are loaded from database in loadTeacherData()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Teacher Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't find your teacher profile. Please contact support.
          </p>
          <Button asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/">
              <div className="flex items-center space-x-3 font-bold text-xl">
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg transform rotate-3">
                  <div className="absolute inset-0.5 rounded-lg bg-gradient-to-br from-red-500/90 to-red-800/90">
                    <div className="absolute top-0.5 left-0.5 w-2.5 h-2 bg-white/90 rounded-sm"></div>
                    <div className="absolute top-2 right-0.5 w-2 h-1.5 bg-white/70 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1 w-1.5 h-1 bg-white/50 rounded-sm"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white font-bold text-xs leading-none">
                        T
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-sm"></div>
                </div>
                <span className="bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent">
                  Talkcon
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Account Mode Switch */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={accountMode === "teacher" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleAccountModeSwitch("teacher")}
                className="h-8 px-3 text-xs font-medium"
              >
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Teacher
              </Button>
              <Button
                variant={accountMode === "student" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleAccountModeSwitch("student")}
                className="h-8 px-3 text-xs font-medium"
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                Student
              </Button>
            </div>

            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="px-2 py-1.5 text-sm font-medium text-gray-900 border-b">
                  {teacherData?.name}
                </div>
                <div className="px-2 py-1 text-xs text-gray-500 mb-1">
                  Current mode:{" "}
                  {accountMode === "teacher" ? "Teaching" : "Learning"}
                </div>
                <DropdownMenuItem onClick={() => setSettingsModalOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleAccountModeSwitch(
                      accountMode === "teacher" ? "student" : "teacher",
                    )
                  }
                >
                  {accountMode === "teacher" ? (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Switch to Student View</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>Switch to Teacher View</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Fixed Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out pt-16 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Teacher Profile Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={teacherData.avatar}
                    alt={teacherData.name}
                  />
                  <AvatarFallback>
                    {teacherData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {teacherData.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {teacherData.rating.toFixed(1)} ({teacherData.reviewCount}{" "}
                      reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    {accountMode === "teacher" ? (
                      <Badge variant="default" className="text-xs">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Teaching Mode
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Student Mode
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacherData.languages.slice(0, 2).map((lang, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {lang}
                      </Badge>
                    ))}
                    {teacherData.languages.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{teacherData.languages.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 py-6">
              <nav className="space-y-1 px-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-primary/10 text-primary"
                  onClick={() => {
                    toast({
                      title: "Dashboard",
                      description: "You're already on the dashboard",
                    });
                  }}
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setLessonsModalOpen(true)}
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  My Lessons
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setStudentsModalOpen(true)}
                >
                  <Users className="mr-3 h-5 w-5" />
                  My Students
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setWalletModalOpen(true)}
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  My Wallet
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleViewProfile}
                >
                  <UserCheck className="mr-3 h-5 w-5" />
                  My Teacher Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setSettingsModalOpen(true)}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Account Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Support",
                      description: "Help center and support resources opened",
                    });
                  }}
                >
                  <HelpCircle className="mr-3 h-5 w-5" />
                  Support
                </Button>
              </nav>
            </div>

            <div className="border-t border-gray-200 p-3">
              {/* Quick Account Switch */}
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Quick Switch
                </div>
                <Button
                  variant={accountMode === "student" ? "default" : "outline"}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleAccountModeSwitch("student")}
                >
                  <BookOpen className="w-3 h-3 mr-2" />
                  Student Dashboard
                </Button>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Upgrade to</div>
                    <div className="text-lg font-bold">Professional</div>
                  </div>
                  <Gift className="h-8 w-8 opacity-80" />
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-white text-gray-900 hover:bg-gray-100"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {accountMode === "teacher"
                      ? "Teacher Dashboard"
                      : "Learning Dashboard"}
                  </h1>
                  <Badge
                    variant={
                      accountMode === "teacher" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {accountMode === "teacher" ? (
                      <>
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Teaching
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3 h-3 mr-1" />
                        Learning
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  {accountMode === "teacher"
                    ? `Welcome back, ${user?.name}! You have ${requests.length} new lesson requests.`
                    : `Welcome back, ${user?.name}! Ready to continue your learning journey?`}
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Settings",
                      description:
                        "Teacher settings and preferences panel opened",
                    });
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleViewProfile}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsArray.map((stat, index) => (
              <Card key={index} className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-1 ${stat.color} font-medium`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2">
              <Tabs defaultValue="requests" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
                  <TabsTrigger
                    value="requests"
                    className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Lesson Requests
                    {requests.length > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                        {requests.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="lessons"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Upcoming Lessons
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      New Lesson Requests ({requests.length})
                    </h3>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Auto-Accept Settings
                    </Button>
                  </div>

                  {requests.length === 0 ? (
                    <Card className="bg-white border border-gray-200">
                      <CardContent className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                          No new requests
                        </h3>
                        <p className="text-gray-600">
                          New lesson requests will appear here
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <Card
                          key={request.id}
                          className={`transition-all hover:shadow-md bg-white border border-gray-200 ${
                            request.urgency === "urgent"
                              ? "border-orange-200 bg-orange-50/30"
                              : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={request.studentAvatar}
                                    alt={request.studentName}
                                  />
                                  <AvatarFallback>
                                    {request.studentName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold">
                                      {request.studentName}
                                    </h4>
                                    <Badge variant="outline">
                                      {request.studentLevel}
                                    </Badge>
                                    {request.urgency === "urgent" && (
                                      <Badge className="bg-orange-500">
                                        Urgent
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {request.language} • {request.duration} min
                                    ��� ${request.price}
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {new Date(
                                      request.preferredDate,
                                    ).toLocaleDateString()}{" "}
                                    at {request.preferredTime}
                                  </div>
                                  <p className="text-sm">{request.message}</p>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Requested{" "}
                                    {formatTimeAgo(request.requestedAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedRequest(request)
                                      }
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Lesson Request Details
                                      </DialogTitle>
                                      <DialogDescription>
                                        Review the student's request and respond
                                        accordingly
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedRequest && (
                                      <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                          <Avatar className="h-16 w-16">
                                            <AvatarImage
                                              src={
                                                selectedRequest.studentAvatar
                                              }
                                              alt={selectedRequest.studentName}
                                            />
                                            <AvatarFallback>
                                              {selectedRequest.studentName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <h3 className="font-semibold text-lg">
                                              {selectedRequest.studentName}
                                            </h3>
                                            <p className="text-muted-foreground">
                                              {selectedRequest.studentLevel} •{" "}
                                              {selectedRequest.language}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <strong>Preferred Date:</strong>
                                            <br />
                                            {new Date(
                                              selectedRequest.preferredDate,
                                            ).toLocaleDateString()}
                                          </div>
                                          <div>
                                            <strong>Preferred Time:</strong>
                                            <br />
                                            {selectedRequest.preferredTime}
                                          </div>
                                          <div>
                                            <strong>Duration:</strong>
                                            <br />
                                            {selectedRequest.duration} minutes
                                          </div>
                                          <div>
                                            <strong>Price:</strong>
                                            <br />${selectedRequest.price}
                                          </div>
                                        </div>
                                        <div>
                                          <strong>Student's Message:</strong>
                                          <p className="mt-2 p-3 bg-muted rounded-lg">
                                            {selectedRequest.message}
                                          </p>
                                        </div>
                                        <div className="flex space-x-2">
                                          <Button
                                            className="flex-1"
                                            onClick={() =>
                                              handleAcceptRequest(
                                                selectedRequest.id,
                                              )
                                            }
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Accept Request
                                          </Button>
                                          <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                              handleDeclineRequest(
                                                selectedRequest.id,
                                              )
                                            }
                                          >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Decline
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleAcceptRequest(request.id)
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeclineRequest(request.id)
                                  }
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lessons" className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Lessons
                  </h3>
                  <div className="space-y-4">
                    {lessons.filter((l) => l.status === "scheduled").length ===
                    0 ? (
                      <Card className="bg-white border border-gray-200">
                        <CardContent className="p-6 text-center">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No upcoming lessons
                          </h3>
                          <p className="text-gray-600">
                            You don't have any lessons scheduled yet. Students
                            will be able to book lessons with you once your
                            profile is complete.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      lessons
                        .filter((l) => l.status === "scheduled")
                        .map((lesson) => {
                          const student = db.getUserById(lesson.studentId);
                          return (
                            <Card
                              key={lesson.id}
                              className="bg-white border border-gray-200"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold">
                                      {student
                                        ? student.name
                                        : "Unknown Student"}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                        lesson.date,
                                      ).toLocaleDateString()}{" "}
                                      • {lesson.duration} min •{" "}
                                      {lesson.language}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant={
                                        lesson.status === "scheduled"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {lesson.status}
                                    </Badge>

                                    {/* Join Lesson Button */}
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // Get teacher's meeting platform URL
                                        let meetingUrl = `https://meet.linguaconnect.com/room/${lesson.id}`; // fallback
                                        let platformName = "Virtual Classroom";

                                        if (teacherData?.meetingPlatforms) {
                                          const preferred =
                                            teacherData.meetingPlatforms
                                              .preferredPlatform;
                                          const platforms =
                                            teacherData.meetingPlatforms;

                                          switch (preferred) {
                                            case "zoom":
                                              if (platforms.zoom) {
                                                meetingUrl = platforms.zoom;
                                                platformName = "Zoom";
                                              }
                                              break;
                                            case "googleMeet":
                                              if (platforms.googleMeet) {
                                                meetingUrl =
                                                  platforms.googleMeet;
                                                platformName = "Google Meet";
                                              }
                                              break;
                                            case "skype":
                                              if (platforms.skype) {
                                                meetingUrl =
                                                  platforms.skype.startsWith(
                                                    "http",
                                                  )
                                                    ? platforms.skype
                                                    : `skype:${platforms.skype}?call`;
                                                platformName = "Skype";
                                              }
                                              break;
                                            case "voov":
                                              if (platforms.voov) {
                                                meetingUrl = platforms.voov;
                                                platformName = "VooV Meeting";
                                              }
                                              break;
                                          }
                                        }

                                        window.open(meetingUrl, "_blank");
                                        toast({
                                          title: "Joining Lesson",
                                          description: `${platformName} opened in new tab`,
                                        });
                                      }}
                                    >
                                      <Video className="w-4 h-4 mr-2" />
                                      Join
                                    </Button>

                                    {/* More Options Dropdown */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(
                                              "Dropdown trigger clicked",
                                            );
                                          }}
                                        >
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                        onCloseAutoFocus={(e) =>
                                          e.preventDefault()
                                        }
                                      >
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            console.log(
                                              "Copy Meeting Link clicked for lesson:",
                                              lesson.id,
                                            );
                                            e.preventDefault();
                                            e.stopPropagation();
                                            try {
                                              const meetingUrl = `https://meet.linguaconnect.com/room/${lesson.id}`;
                                              navigator.clipboard
                                                .writeText(meetingUrl)
                                                .then(() => {
                                                  toast({
                                                    title:
                                                      "Meeting Link Copied",
                                                    description:
                                                      "Lesson meeting link copied to clipboard",
                                                  });
                                                })
                                                .catch(() => {
                                                  // Fallback for older browsers
                                                  const textArea =
                                                    document.createElement(
                                                      "textarea",
                                                    );
                                                  textArea.value = meetingUrl;
                                                  document.body.appendChild(
                                                    textArea,
                                                  );
                                                  textArea.select();
                                                  document.execCommand("copy");
                                                  document.body.removeChild(
                                                    textArea,
                                                  );
                                                  toast({
                                                    title:
                                                      "Meeting Link Copied",
                                                    description:
                                                      "Lesson meeting link copied to clipboard",
                                                  });
                                                });
                                            } catch (error) {
                                              console.error(
                                                "Error copying link:",
                                                error,
                                              );
                                              toast({
                                                title: "Copy Failed",
                                                description:
                                                  "Could not copy meeting link",
                                                variant: "destructive",
                                              });
                                            }
                                          }}
                                        >
                                          <Video className="w-4 h-4 mr-2" />
                                          Copy Meeting Link
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toast({
                                              title: "Message Student",
                                              description: `Opening chat with ${student?.name || "student"}`,
                                            });
                                            // Future: Open actual messaging interface
                                          }}
                                        >
                                          <MessageCircle className="w-4 h-4 mr-2" />
                                          Message{" "}
                                          {student?.name?.split(" ")[0] ||
                                            "Student"}
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toast({
                                              title: "Lesson Details",
                                              description:
                                                "Opening lesson notes and preparation materials",
                                            });
                                            // Future: Open lesson details modal
                                          }}
                                        >
                                          <BookOpen className="w-4 h-4 mr-2" />
                                          View Lesson Notes
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toast({
                                              title: "Reschedule Lesson",
                                              description:
                                                "Opening rescheduling options",
                                            });
                                            // Future: Open reschedule modal
                                          }}
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Reschedule
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            try {
                                              const success = db.updateLesson(
                                                lesson.id,
                                                { status: "completed" },
                                              );
                                              if (success) {
                                                toast({
                                                  title: "Lesson Completed",
                                                  description:
                                                    "Lesson marked as completed successfully",
                                                });
                                                loadTeacherData(); // Refresh data
                                              } else {
                                                toast({
                                                  title: "Error",
                                                  description:
                                                    "Failed to mark lesson as completed",
                                                  variant: "destructive",
                                                });
                                              }
                                            } catch (error) {
                                              console.error(
                                                "Error completing lesson:",
                                                error,
                                              );
                                              toast({
                                                title: "Error",
                                                description:
                                                  "Failed to mark lesson as completed",
                                                variant: "destructive",
                                              });
                                            }
                                          }}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Mark as Completed
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (
                                              confirm(
                                                "Are you sure you want to cancel this lesson? The student will be notified.",
                                              )
                                            ) {
                                              try {
                                                const success = db.updateLesson(
                                                  lesson.id,
                                                  { status: "cancelled" },
                                                );
                                                if (success) {
                                                  toast({
                                                    title: "Lesson Cancelled",
                                                    description:
                                                      "Lesson has been cancelled. Student will be notified.",
                                                    variant: "destructive",
                                                  });
                                                  loadTeacherData(); // Refresh data
                                                } else {
                                                  toast({
                                                    title: "Error",
                                                    description:
                                                      "Failed to cancel lesson",
                                                    variant: "destructive",
                                                  });
                                                }
                                              } catch (error) {
                                                console.error(
                                                  "Error cancelling lesson:",
                                                  error,
                                                );
                                                toast({
                                                  title: "Error",
                                                  description:
                                                    "Failed to cancel lesson",
                                                  variant: "destructive",
                                                });
                                              }
                                            }
                                          }}
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Cancel Lesson
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="analytics">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900">
                        Performance Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Analytics dashboard coming soon
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    onClick={handleSetAvailability}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleEditProfile}
                  >
                    <Edit className="h-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Messages",
                        description: "Student messaging interface opened",
                      });
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Students
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Request Settings",
                        description: "Lesson request settings updated",
                      });
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Request Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    Request Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 text-gray-900">
                        Response Time
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="responseTime"
                            value="3"
                            defaultChecked
                            className="text-primary focus:ring-primary"
                            onChange={(e) =>
                              handleUpdateResponseTime(
                                `${e.target.value} hours`,
                              )
                            }
                          />
                          <span className="text-sm text-gray-700">3 hours</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="responseTime"
                            value="4"
                            className="text-primary focus:ring-primary"
                            onChange={(e) =>
                              handleUpdateResponseTime(
                                `${e.target.value} hours`,
                              )
                            }
                          />
                          <span className="text-sm text-gray-700">4 hours</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="responseTime"
                            value="8"
                            className="text-primary focus:ring-primary"
                            onChange={(e) =>
                              handleUpdateResponseTime(
                                `${e.target.value} hours`,
                              )
                            }
                          />
                          <span className="text-sm text-gray-700">8 hours</span>
                        </label>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary"
                          onChange={(e) =>
                            handleToggleAutoAccept(e.target.checked)
                          }
                        />
                        <span className="text-sm text-gray-700">
                          Auto-accept from returning students
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Lessons Completed
                      </span>
                      <span className="font-semibold text-gray-900">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Hours Taught
                      </span>
                      <span className="font-semibold text-gray-900">18.5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Earnings</span>
                      <span className="font-semibold text-gray-900">
                        $462.50
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        New Students
                      </span>
                      <span className="font-semibold text-gray-900">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Availability Modal */}
      <Dialog
        open={availabilityModalOpen}
        onOpenChange={setAvailabilityModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Set Your Availability</DialogTitle>
            <DialogDescription>
              Choose the days and times when you're available to teach
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Available Days</h4>
              <div className="space-y-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="text-primary focus:ring-primary"
                      defaultChecked={[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].includes(day)}
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Available Hours</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Start Time</label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">End Time</label>
                  <Input type="time" defaultValue="17:00" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Timezone</label>
                  <select className="w-full p-2 border rounded">
                    <option>{teacherData?.timezone || "UTC"}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setAvailabilityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAvailabilityModalOpen(false);
                toast({
                  title: "Availability Updated",
                  description:
                    "Your teaching availability has been saved successfully.",
                });
              }}
            >
              Save Availability
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Edit Modal */}
      <Dialog
        open={profileEditModalOpen}
        onOpenChange={setProfileEditModalOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Your Teaching Profile</DialogTitle>
            <DialogDescription>
              Update your profile information to attract more students
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Profile Photo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={teacherData?.avatar}
                      alt={teacherData?.name}
                    />
                    <AvatarFallback>
                      {teacherData?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
              </div>
              <div>
                <Label>Display Name</Label>
                <Input defaultValue={teacherData?.name} />
              </div>
              <div>
                <Label>Hourly Rate (USD)</Label>
                <Input type="number" defaultValue={teacherData?.price} />
              </div>
              <div>
                <Label>Languages You Teach</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacherData?.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary">
                      {lang} ×
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    + Add Language
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Teaching Specialties</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacherData?.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty} ×
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">
                    + Add Specialty
                  </Button>
                </div>
              </div>
              <div>
                <Label>About Me</Label>
                <textarea
                  className="w-full p-3 border rounded h-32"
                  defaultValue={teacherData?.description}
                  placeholder="Tell students about your teaching style and experience..."
                />
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input type="number" defaultValue={teacherData?.experience} />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setProfileEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setProfileEditModalOpen(false);
                toast({
                  title: "Profile Updated",
                  description:
                    "Your teaching profile has been updated successfully.",
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Lessons Modal */}
      <Dialog open={lessonsModalOpen} onOpenChange={setLessonsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>My Lessons</DialogTitle>
            <DialogDescription>
              Manage your past, current, and upcoming lessons
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-4">
                {lessons.filter((l) => l.status === "scheduled").length ===
                0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No upcoming lessons
                    </h3>
                    <p className="text-gray-600">
                      Your upcoming lessons will appear here once students book
                      with you.
                    </p>
                  </div>
                ) : (
                  lessons
                    .filter((l) => l.status === "scheduled")
                    .map((lesson) => {
                      const student = db.getUserById(lesson.studentId);
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {student?.name?.charAt(0) || "S"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">
                                {student?.name || "Student"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(lesson.date).toLocaleDateString()} •{" "}
                                {lesson.duration} min • {lesson.language}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                // Get teacher's meeting platform URL
                                let meetingUrl = `https://meet.linguaconnect.com/room/${lesson.id}`; // fallback
                                let platformName = "Virtual Classroom";

                                if (teacherData?.meetingPlatforms) {
                                  const preferred =
                                    teacherData.meetingPlatforms
                                      .preferredPlatform;
                                  const platforms =
                                    teacherData.meetingPlatforms;

                                  switch (preferred) {
                                    case "zoom":
                                      if (platforms.zoom) {
                                        meetingUrl = platforms.zoom;
                                        platformName = "Zoom";
                                      }
                                      break;
                                    case "googleMeet":
                                      if (platforms.googleMeet) {
                                        meetingUrl = platforms.googleMeet;
                                        platformName = "Google Meet";
                                      }
                                      break;
                                    case "skype":
                                      if (platforms.skype) {
                                        meetingUrl = platforms.skype.startsWith(
                                          "http",
                                        )
                                          ? platforms.skype
                                          : `skype:${platforms.skype}?call`;
                                        platformName = "Skype";
                                      }
                                      break;
                                    case "voov":
                                      if (platforms.voov) {
                                        meetingUrl = platforms.voov;
                                        platformName = "VooV Meeting";
                                      }
                                      break;
                                  }
                                }

                                window.open(meetingUrl, "_blank");
                                toast({
                                  title: "Joining Lesson",
                                  description: `${platformName} opened in new tab`,
                                });
                              }}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Message Student",
                                  description: `Opening chat with ${student?.name || "student"}`,
                                });
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {lessons.filter((l) => l.status === "completed").length ===
                0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No completed lessons yet
                    </h3>
                    <p className="text-gray-600">
                      Your completed lessons will appear here.
                    </p>
                  </div>
                ) : (
                  lessons
                    .filter((l) => l.status === "completed")
                    .map((lesson) => {
                      const student = db.getUserById(lesson.studentId);
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {student?.name?.charAt(0) || "S"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">
                                {student?.name || "Student"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(lesson.date).toLocaleDateString()} •{" "}
                                {lesson.duration} min • ${lesson.price}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm ml-1">
                                {lesson.rating?.toFixed(1) || "5.0"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </TabsContent>
              <TabsContent value="cancelled" className="space-y-4">
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No cancelled lessons
                  </h3>
                  <p className="text-gray-600">
                    Cancelled lessons will appear here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Students Modal */}
      <Dialog open={studentsModalOpen} onOpenChange={setStudentsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>My Students</DialogTitle>
            <DialogDescription>
              Manage your student relationships and communication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Input placeholder="Search students..." className="max-w-sm" />
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {stats.totalStudents === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No students yet
                </h3>
                <p className="text-gray-600">
                  Your students will appear here once you start teaching
                  lessons.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from(new Set(lessons.map((l) => l.studentId))).map(
                  (studentId) => {
                    const student = db.getUserById(studentId);
                    const studentLessons = lessons.filter(
                      (l) => l.studentId === studentId,
                    );
                    const completedLessons = studentLessons.filter(
                      (l) => l.status === "completed",
                    );
                    const totalHours =
                      completedLessons.reduce((sum, l) => sum + l.duration, 0) /
                      60;

                    return (
                      <div
                        key={studentId}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {student?.name?.charAt(0) || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">
                              {student?.name || "Student"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {completedLessons.length} lessons •{" "}
                              {totalHours.toFixed(1)} hours
                            </p>
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm ml-1">5.0</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* My Wallet Modal */}
      <Dialog open={walletModalOpen} onOpenChange={setWalletModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>My Wallet</DialogTitle>
            <DialogDescription>
              Track your earnings and manage payments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm text-gray-600">Total Earnings</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${(stats.totalEarnings || 0).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm text-gray-600">This Month</h3>
                    <p className="text-2xl font-bold">
                      $
                      {(
                        (stats.thisMonthLessons || 0) *
                        (teacherData?.price || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-sm text-gray-600">Available</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ${(teacherData?.earnings || 0).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recent Transactions</h3>
              <div className="space-y-3">
                {lessons
                  .filter((l) => l.status === "completed")
                  .slice(0, 5)
                  .map((lesson) => {
                    const student = db.getUserById(lesson.studentId);
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">
                            Lesson with {student?.name || "Student"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(lesson.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            +${lesson.price}
                          </p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                    );
                  })}
                {lessons.filter((l) => l.status === "completed").length ===
                  0 && (
                  <div className="text-center py-6">
                    <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payout Requests */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Payout Requests</h3>
                <Button
                  onClick={() => setPayoutModalOpen(true)}
                  disabled={!teacherData?.earnings || teacherData.earnings < 25}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Request Payout
                </Button>
              </div>
              <div className="space-y-2">
                {payoutRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <p className="font-medium">
                        ${request.amount} via{" "}
                        {request.method === "paypal"
                          ? "PayPal"
                          : "Bank Transfer"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
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
                  </div>
                ))}
                {payoutRequests.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      No payout requests yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Download Statement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Settings Modal */}
      <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your account preferences and privacy settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input defaultValue={teacherData?.name} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue={teacherData?.email} disabled />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input defaultValue={teacherData?.country} />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <select className="w-full p-2 border rounded">
                    <option>{teacherData?.timezone}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications for new lesson requests</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked />
                  <span>SMS reminders for upcoming lessons</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked />
                  <span>Weekly earnings summary</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Privacy Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked />
                  <span>Show my profile to new students</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" />
                  <span>Allow students to see my response time</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Meeting Platforms</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure your video call links for lessons. Students will use
                these links to join your lessons.
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Preferred Platform</Label>
                  <select
                    className="w-full p-2 border rounded mt-1"
                    value={meetingPlatforms.preferredPlatform}
                    onChange={(e) =>
                      setMeetingPlatforms({
                        ...meetingPlatforms,
                        preferredPlatform: e.target.value as
                          | "zoom"
                          | "googleMeet"
                          | "skype"
                          | "voov",
                      })
                    }
                  >
                    <option value="zoom">Zoom</option>
                    <option value="googleMeet">Google Meet</option>
                    <option value="skype">Skype</option>
                    <option value="voov">VooV Meeting</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Zoom Meeting Link</Label>
                    <Input
                      placeholder="https://zoom.us/j/..."
                      value={meetingPlatforms.zoom}
                      onChange={(e) =>
                        setMeetingPlatforms({
                          ...meetingPlatforms,
                          zoom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Google Meet Link</Label>
                    <Input
                      placeholder="https://meet.google.com/..."
                      value={meetingPlatforms.googleMeet}
                      onChange={(e) =>
                        setMeetingPlatforms({
                          ...meetingPlatforms,
                          googleMeet: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Skype Username/Link</Label>
                    <Input
                      placeholder="live:username or https://join.skype.com/..."
                      value={meetingPlatforms.skype}
                      onChange={(e) =>
                        setMeetingPlatforms({
                          ...meetingPlatforms,
                          skype: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>VooV Meeting Link</Label>
                    <Input
                      placeholder="https://meeting.tencent.com/..."
                      value={meetingPlatforms.voov}
                      onChange={(e) =>
                        setMeetingPlatforms({
                          ...meetingPlatforms,
                          voov: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Your preferred platform will be shown
                    first to students. Make sure your links are permanent
                    meeting rooms or recurring meeting links.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-red-600">Danger Zone</h3>
              <Button variant="destructive" size="sm">
                Deactivate Account
              </Button>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setSettingsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Save meeting platforms to database
                if (teacherData?.id) {
                  const success = db.updateTeacherMeetingPlatforms(
                    teacherData.id,
                    meetingPlatforms,
                  );
                  if (success) {
                    setSettingsModalOpen(false);
                    toast({
                      title: "Settings Saved",
                      description:
                        "Your account settings and meeting platforms have been updated successfully.",
                    });
                  } else {
                    toast({
                      title: "Error",
                      description: "Failed to save meeting platform settings.",
                      variant: "destructive",
                    });
                  }
                } else {
                  setSettingsModalOpen(false);
                  toast({
                    title: "Settings Saved",
                    description:
                      "Your account settings have been updated successfully.",
                  });
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payout Request Dialog */}
      <PayoutRequestDialog
        open={payoutModalOpen}
        onOpenChange={setPayoutModalOpen}
        teacherData={teacherData}
        onSuccess={() => {
          loadTeacherData();
          setPayoutModalOpen(false);
        }}
      />
    </div>
  );
}

// Payout Request Dialog Component
function PayoutRequestDialog({
  open,
  onOpenChange,
  teacherData,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherData: any;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"paypal" | "bank_transfer">("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    bankName: "",
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minAmount = method === "paypal" ? 25 : 100;
  const availableBalance = teacherData?.earnings || 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && mountedRef.current) {
      setAmount("");
      setMethod("paypal");
      setPaypalEmail("");
      setBankDetails({
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
        bankName: "",
      });
      setNotes("");
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherData) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum withdrawal amount is $${minAmount} for ${method === "paypal" ? "PayPal" : "Bank Transfer"}`,
        variant: "destructive",
      });
      return;
    }

    if (amountNum > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentDetails =
        method === "paypal"
          ? { paypalEmail }
          : {
              bankAccountNumber: bankDetails.accountNumber,
              bankRoutingNumber: bankDetails.routingNumber,
              bankAccountHolderName: bankDetails.accountHolderName,
              bankName: bankDetails.bankName,
            };

      db.createPayoutRequest({
        teacherId: teacherData.id,
        amount: amountNum,
        method,
        paymentDetails,
        notes,
      });

      toast({
        title: "Payout Request Submitted",
        description: `Your withdrawal request for $${amountNum} has been submitted for admin review.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit payout request.",
        variant: "destructive",
      });
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Withdraw your earnings to your preferred payment method
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min={minAmount}
              max={availableBalance}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Minimum $${minAmount}`}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Available balance: ${availableBalance.toFixed(2)}
            </p>
          </div>

          <div>
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant={method === "paypal" ? "default" : "outline"}
                onClick={() => setMethod("paypal")}
                className="justify-start"
              >
                PayPal (Min $25)
              </Button>
              <Button
                type="button"
                variant={method === "bank_transfer" ? "default" : "outline"}
                onClick={() => setMethod("bank_transfer")}
                className="justify-start"
              >
                Bank (Min $100)
              </Button>
            </div>
          </div>

          {method === "paypal" ? (
            <div>
              <Label htmlFor="paypal">PayPal Email</Label>
              <Input
                id="paypal"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="your@paypal.com"
                required
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input
                  id="accountHolder"
                  value={bankDetails.accountHolderName}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountHolderName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bankName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={bankDetails.routingNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        routingNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !amount || parseFloat(amount) < minAmount
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
