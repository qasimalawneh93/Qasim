import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
  MessageCircle,
  Video,
  Award,
  Wallet,
  Plus,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [userLessons, setUserLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletStats, setWalletStats] = useState<any>({});
  const [isTeacher, setIsTeacher] = useState(false);
  const [accountMode, setAccountMode] = useState<"teacher" | "student">(
    "student",
  );

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      // Get user details
      const users = db.getUsers();
      const currentUser = users.find((u) => u.id === user?.id);
      setUserData(currentUser);

      // Check if user is also a teacher
      if (user?.email) {
        const teacherAccount = db.getTeacherByEmail(user.email);
        setIsTeacher(!!teacherAccount && teacherAccount.status === "approved");
      }

      // Get user's lessons
      const lessons = db.getLessons({ studentId: user?.id });
      setUserLessons(lessons);

      // Get wallet data
      if (user?.id) {
        const userTransactions = db.getUserTransactions(user.id);
        setTransactions(userTransactions);

        const stats = db.getWalletStats(user.id);
        setWalletStats(stats);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountModeSwitch = (mode: "teacher" | "student") => {
    setAccountMode(mode);
    if (mode === "teacher") {
      toast({
        title: "Switched to Teacher Mode",
        description: "Redirecting to your teacher dashboard...",
      });
      navigate("/teacher-dashboard");
    } else {
      toast({
        title: "Switched to Student Mode",
        description: "You are now in student mode.",
      });
    }
  };

  if (loading) {
        <Helmet>
            <title>Dashboard | Talkcon</title>
            <meta name="description" content="Your personalized dashboard with all your lessons and settings." />
        </Helmet>
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {t("dashboard.welcome")}, {user?.name || "Student"}! 👋
                </h1>
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Student Mode
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Continue your language learning journey
              </p>
            </div>

            {/* Account Mode Switch - Only show if user is also a teacher */}
            {isTeacher && (
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium"
                  disabled
                >
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Student
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAccountModeSwitch("teacher")}
                  className="h-8 px-3 text-xs font-medium hover:bg-primary hover:text-white"
                >
                  <GraduationCap className="w-4 h-4 mr-1.5" />
                  Teacher
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">
                    {Math.round(userData?.hoursLearned || 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold">
                    {userData?.completedLessons || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setWalletModalOpen(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Wallet Balance
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(userData?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      teacher: "Maria Rodriguez",
                      language: "Spanish",
                      time: "Today, 3:00 PM",
                      type: "Conversation Practice",
                    },
                    {
                      teacher: "James Wilson",
                      language: "English",
                      time: "Tomorrow, 10:00 AM",
                      type: "Business English",
                    },
                  ].map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{lesson.teacher}</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.language} - {lesson.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Spanish</span>
                      <span className="text-sm text-muted-foreground">
                        Intermediate
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">English</span>
                      <span className="text-sm text-muted-foreground">
                        Advanced
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: "90%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Teacher
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Materials
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      🔥
                    </div>
                    <div>
                      <p className="font-medium text-sm">10-Day Streak</p>
                      <p className="text-xs text-muted-foreground">
                        Keep it up!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <div>
                      <p className="font-medium text-sm">Conversation Master</p>
                      <p className="text-xs text-muted-foreground">
                        50 lessons completed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Messages
                  <Badge>3</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">Maria Rodriguez</p>
                    <p className="text-xs text-muted-foreground">
                      Great job in today's lesson! Here's your homework...
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">James Wilson</p>
                    <p className="text-xs text-muted-foreground">
                      Don't forget about tomorrow's business presentation...
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-3" size="sm">
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Teacher Mode Switch - Only show if user is also a teacher */}
      {isTeacher && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => handleAccountModeSwitch("teacher")}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <GraduationCap className="w-6 h-6" />
          </Button>
          <div className="absolute -top-2 -left-16 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Switch to Teacher
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      <WalletModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        userData={userData}
        transactions={transactions}
        walletStats={walletStats}
        onRecharge={() => setRechargeModalOpen(true)}
        onRefresh={loadUserData}
      />

      {/* Recharge Modal */}
      <RechargeModal
        open={rechargeModalOpen}
        onOpenChange={setRechargeModalOpen}
        userId={user?.id}
        onSuccess={() => {
          loadUserData();
          setRechargeModalOpen(false);
          toast({
            title: "Wallet Recharged!",
            description: "Your wallet has been successfully recharged.",
          });
        }}
      />
    </div>
  );
}

// Wallet Modal Component
function WalletModal({
  open,
  onOpenChange,
  userData,
  transactions,
  walletStats,
  onRecharge,
  onRefresh,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  transactions: any[];
  walletStats: any;
  onRecharge: () => void;
  onRefresh: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            My Wallet
          </DialogTitle>
          <DialogDescription>
            Manage your wallet balance and view transaction history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600">Current Balance</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${(userData?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600">Total Recharged</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(walletStats.totalRecharged || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm text-gray-600">Total Spent</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    ${(walletStats.totalSpent || 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onRecharge} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Recharge Wallet
            </Button>
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "recharge"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "recharge" ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                          via {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === "recharge"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "recharge" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400">
                    Recharge your wallet to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Recharge Modal Component
function RechargeModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<
    "paypal" | "mastercard" | "visa" | "bank_transfer"
  >("paypal");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = async () => {
    if (!userId || !amount) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = db.rechargeWallet(userId, amountNum, method, {
        method,
        amount: amountNum,
        timestamp: new Date().toISOString(),
      });

      if (success) {
        onSuccess();
        setAmount("");
        setMethod("paypal");
      }
    } catch (error) {
      console.error("Recharge failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: "paypal", label: "PayPal", icon: "💳" },
    { value: "mastercard", label: "Mastercard", icon: "💳" },
    { value: "visa", label: "Visa", icon: "💳" },
    { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recharge Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet for lesson payments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="5"
              step="5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <Select
              value={method}
              onValueChange={(value: any) => setMethod(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    <div className="flex items-center gap-2">
                      <span>{pm.icon}</span>
                      {pm.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick amounts */}
          <div>
            <Label>Quick amounts</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[10, 25, 50, 100].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecharge}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : `Recharge $${amount || "0"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
