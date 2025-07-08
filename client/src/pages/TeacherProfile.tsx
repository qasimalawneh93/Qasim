import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Clock,
  Globe,
  MessageCircle,
  Video,
  Award,
  Users,
  Calendar as CalendarIcon,
  Play,
  Heart,
  Share,
  MapPin,
  CheckCircle,
  BookOpen,
  Wallet,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Teacher } from "@shared/api";
import { db } from "@/lib/database";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from 'react-helmet';

const mockReviews = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentAvatar: "/placeholder.svg",
    rating: 5,
    comment:
      "Maria is an excellent teacher! She's patient, encouraging, and makes learning Spanish fun. I've improved so much in just a few months.",
    date: "2024-01-15",
    lessonType: "Conversation Practice",
  },
  {
    id: "2",
    studentName: "David Chen",
    studentAvatar: "/placeholder.svg",
    rating: 5,
    comment:
      "Great teacher with excellent methodology. She provides personalized materials and her explanations are very clear.",
    date: "2024-01-10",
    lessonType: "Business Spanish",
  },
  {
    id: "3",
    studentName: "Emma Thompson",
    studentAvatar: "/placeholder.svg",
    rating: 4,
    comment:
      "Very professional and well-prepared lessons. Maria helped me prepare for my DELE exam successfully.",
    date: "2024-01-05",
    lessonType: "DELE Preparation",
  },
];

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [lessonFocus, setLessonFocus] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [pendingLessonData, setPendingLessonData] = useState<any>(null);

  // Generate realistic time slots based on selected date
  const generateAvailableSlots = (date: Date | undefined) => {
    if (!date) return [];

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      const isAvailable = !isToday || hour > currentHour + 2; // Need 2 hours advance notice

      // Some random unavailable slots to make it realistic
      const randomUnavailable = Math.random() < 0.3;

      slots.push({
        time: timeString,
        available: isAvailable && !randomUnavailable,
      });
    }
    return slots;
  };

  const availableSlots = generateAvailableSlots(selectedDate);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        // Get real teacher data from database
        const teachers = db.getTeachers();
        const foundTeacher = teachers.find((t) => t.id === id);

        if (foundTeacher) {
          setTeacher(foundTeacher);
        } else {
          // If no teacher found with the ID, show error
          console.error("Teacher not found");
        }

        // Load user wallet data if logged in
        if (user) {
          const users = db.getUsers();
          const currentUser = users.find((u) => u.id === user.id);
          setUserData(currentUser);
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id, user]);

  const handleBookLesson = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { returnTo: `/teachers/${id}` } });
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time for your lesson");
      return;
    }

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Prepare lesson data and show payment selection
    const lessonData = {
      teacherId: teacher.id,
      studentId: user.id,
      language: teacher.nativeLanguage,
      date: selectedDate.toISOString(),
      duration: 50,
      price: teacher.price,
      status: "pending" as const,
      type: "trial" as const,
      notes:
        specialRequests ||
        `Lesson focus: ${lessonFocus || "General conversation"}`,
    };

    setPendingLessonData(lessonData);
    setIsBookingDialogOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (
    paymentMethod: "wallet" | "paypal" | "mastercard" | "visa",
  ) => {
    if (!pendingLessonData || !teacher) return;

    setBookingLoading(true);
    try {
      // Process payment
      const paymentSuccess = db.processLessonPayment(
        pendingLessonData.studentId,
        "temp_lesson_id", // Will be replaced with actual lesson ID
        pendingLessonData.teacherId,
        pendingLessonData.price,
        paymentMethod,
      );

      if (!paymentSuccess && paymentMethod === "wallet") {
        toast({
          title: "Insufficient Wallet Balance",
          description:
            "Please recharge your wallet or choose a different payment method.",
          variant: "destructive",
        });
        return;
      }

      // Create lesson after successful payment
      const lesson = db.createLesson(pendingLessonData);

      // Update the transaction with the actual lesson ID
      if (paymentSuccess) {
        const transactions = db.getUserTransactions(user!.id, 1);
        const latestTransaction = transactions[0];
        if (latestTransaction) {
          latestTransaction.lessonId = lesson.id;
        }
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast
      toast({
        title: "Lesson Booked Successfully!",
        description: `Your ${teacher.nativeLanguage} lesson with ${teacher.name} has been confirmed and paid for via ${paymentMethod}.`,
      });

      setPaymentModalOpen(false);

      // Navigate to booking confirmation
      navigate(`/booking/${lesson.id}`, {
        state: {
          bookingData: lessonData,
          teacher,
          lesson,
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book lesson. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
        <Helmet>
            <title>Teacherprofile | Talkcon</title>
            <meta name="description" content="Teacherprofile page of Talkcon platform." />
        </Helmet>
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-48 bg-muted rounded-lg" />
              </div>
              <div className="h-96 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Teacher not found</h3>
              <p className="text-muted-foreground mb-4">
                The teacher you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to="/teachers">Browse Teachers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="w-32 h-32 ring-4 ring-background">
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback className="text-2xl">
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {teacher.isOnline && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2" />
                      Online
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{teacher.country}</span>
                      <span className="mx-2">•</span>
                      <span>Speaks {teacher.nativeLanguage} (Native)</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold">{teacher.rating}</span>
                        <span className="text-muted-foreground ml-1">
                          ({teacher.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{teacher.completedLessons} lessons</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Responds in {teacher.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-1">
                      ${teacher.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per lesson
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      50-min lesson
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.badges.map((badge) => (
                    <Badge key={badge} variant="secondary">
                      <Award className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Languages */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Teaching Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="bg-primary">
                      {teacher.nativeLanguage} (Native)
                    </Badge>
                    {teacher.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Dialog
                    open={isBookingDialogOpen}
                    onOpenChange={setIsBookingDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="lg" className="flex-1 min-w-[150px]">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Book Trial Lesson - $1
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          Book a lesson with {teacher.name}
                        </DialogTitle>
                        <DialogDescription>
                          Choose your preferred date and time for the lesson.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Select Date</h4>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">
                            Available Times
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {selectedDate &&
                            selectedDate.toDateString() ===
                              new Date().toDateString()
                              ? "Today - Book at least 2 hours in advance"
                              : selectedDate && selectedDate.toDateString()}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={
                                  selectedTime === slot.time
                                    ? "default"
                                    : "outline"
                                }
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className="w-full"
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                          <div className="mt-4 space-y-3">
                            <div>
                              <label className="text-sm font-medium">
                                Lesson Focus
                              </label>
                              <Select
                                value={lessonFocus}
                                onValueChange={setLessonFocus}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose focus area" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="conversation">
                                    Conversation Practice
                                  </SelectItem>
                                  <SelectItem value="grammar">
                                    Grammar
                                  </SelectItem>
                                  <SelectItem value="business">
                                    Business Spanish
                                  </SelectItem>
                                  <SelectItem value="exam">
                                    Exam Preparation
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Special Requests
                              </label>
                              <Textarea
                                placeholder="Tell the teacher what you'd like to focus on..."
                                className="mt-1"
                                value={specialRequests}
                                onChange={(e) =>
                                  setSpecialRequests(e.target.value)
                                }
                              />
                            </div>
                            <Button
                              className="w-full"
                              size="lg"
                              onClick={handleBookLesson}
                              disabled={
                                bookingLoading || !selectedDate || !selectedTime
                              }
                            >
                              {bookingLoading
                                ? "Booking..."
                                : "Confirm Booking - $1"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="lg" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="lg" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="ghost">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="ghost">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{teacher.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {teacher.specialties.map((specialty) => (
                        <div
                          key={specialty}
                          className="flex items-center p-3 rounded-lg border"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span>{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Years of Experience</span>
                        <span className="font-semibold">
                          {teacher.experience} years
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span>Lessons Completed</span>
                        <span className="font-semibold">
                          {teacher.completedLessons}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span>Response Time</span>
                        <span className="font-semibold">
                          {teacher.responseTime}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Platform Information */}
                {teacher.meetingPlatforms && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Video className="w-5 h-5 mr-2" />
                        Lesson Platform
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Video className="w-6 h-6 text-blue-600" />
                            <div>
                              <h4 className="font-semibold text-blue-900">
                                {teacher.meetingPlatforms.preferredPlatform ===
                                  "zoom" && "Zoom"}
                                {teacher.meetingPlatforms.preferredPlatform ===
                                  "googleMeet" && "Google Meet"}
                                {teacher.meetingPlatforms.preferredPlatform ===
                                  "skype" && "Skype"}
                                {teacher.meetingPlatforms.preferredPlatform ===
                                  "voov" && "VooV Meeting"}
                                {!teacher.meetingPlatforms.preferredPlatform &&
                                  "Virtual Classroom"}
                              </h4>
                              <p className="text-sm text-blue-700">
                                Preferred platform for lessons
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {teacher.meetingPlatforms.zoom && (
                            <div className="flex items-center p-2 border rounded">
                              <Video className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-sm">Zoom</span>
                            </div>
                          )}
                          {teacher.meetingPlatforms.googleMeet && (
                            <div className="flex items-center p-2 border rounded">
                              <Video className="w-4 h-4 mr-2 text-green-600" />
                              <span className="text-sm">Google Meet</span>
                            </div>
                          )}
                          {teacher.meetingPlatforms.skype && (
                            <div className="flex items-center p-2 border rounded">
                              <Video className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="text-sm">Skype</span>
                            </div>
                          )}
                          {teacher.meetingPlatforms.voov && (
                            <div className="flex items-center p-2 border rounded">
                              <Video className="w-4 h-4 mr-2 text-purple-600" />
                              <span className="text-sm">VooV Meeting</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600">
                          After booking, you'll receive the meeting link to join
                          your lesson on the scheduled platform.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {teacher && teacher.reviewCount > 0 ? (
                      // Show real reviews if available (you can add real review data later)
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {teacher.reviewCount} Reviews
                        </h3>
                        <p className="text-gray-600">
                          Average rating: {teacher.rating.toFixed(1)} stars
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Detailed reviews coming soon
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-gray-600">
                          Be the first to leave a review for this teacher!
                        </p>
                      </div>
                    )}
                    {/* Temporarily keeping one sample review structure for when real reviews are added */}
                    {false &&
                      mockReviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-6 last:border-b-0"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={review.studentAvatar}
                                alt={review.studentName}
                              />
                              <AvatarFallback>
                                {review.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">
                                  {review.studentName}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {review.lessonType}
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video">
                <Card>
                  <CardHeader>
                    <CardTitle>Introduction Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Button variant="outline" size="lg">
                        <Play className="w-6 h-6 mr-2" />
                        Watch Introduction Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Schedule Coming Soon
                      </h3>
                      <p className="text-muted-foreground">
                        Full schedule view will be available here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ${teacher.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    50-minute lesson
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Book Lesson
                </Button>
                <Button className="w-full" variant="outline" size="lg">
                  Try $1 Trial Lesson
                </Button>
                <div className="text-xs text-muted-foreground text-center">
                  Usually responds in {teacher.responseTime}
                </div>
              </CardContent>
            </Card>

            {/* Teaching Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Students</span>
                  <span className="font-semibold">200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Repeat Students</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On-time Rate</span>
                  <span className="font-semibold">99%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-semibold">100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Teachers */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Discover more {teacher.nativeLanguage} teachers
                  </p>
                  <Button variant="outline" className="mt-3" asChild>
                    <Link to="/teachers">Browse Teachers</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Selection Modal */}
      <PaymentSelectionModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        teacher={teacher}
        userData={userData}
        lessonPrice={teacher?.price || 0}
        onPaymentSelect={handlePaymentComplete}
        isProcessing={bookingLoading}
      />
    </div>
  );
}

// Payment Selection Modal Component
function PaymentSelectionModal({
  open,
  onOpenChange,
  teacher,
  userData,
  lessonPrice,
  onPaymentSelect,
  isProcessing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  userData: any;
  lessonPrice: number;
  onPaymentSelect: (
    method: "wallet" | "paypal" | "mastercard" | "visa",
  ) => void;
  isProcessing: boolean;
}) {
  const walletBalance = userData?.walletBalance || 0;
  const hasEnoughBalance = walletBalance >= lessonPrice;

  const paymentMethods = [
    {
      id: "wallet",
      name: "Wallet Balance",
      description: `$${walletBalance.toFixed(2)} available`,
      icon: <Wallet className="w-5 h-5" />,
      available: hasEnoughBalance,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay securely with PayPal",
      icon: <CreditCard className="w-5 h-5" />,
      available: true,
    },
    {
      id: "mastercard",
      name: "Mastercard",
      description: "Pay with your Mastercard",
      icon: <CreditCard className="w-5 h-5" />,
      available: true,
    },
    {
      id: "visa",
      name: "Visa",
      description: "Pay with your Visa card",
      icon: <CreditCard className="w-5 h-5" />,
      available: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>
            Select how you'd like to pay for your lesson with {teacher?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lesson Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Lesson with {teacher?.name}
              </span>
              <span className="font-semibold">${lessonPrice.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">
              50-minute trial lesson • {teacher?.nativeLanguage}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant="outline"
                className={`w-full justify-start h-auto p-4 ${
                  !method.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  method.available && onPaymentSelect(method.id as any)
                }
                disabled={!method.available || isProcessing}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-blue-600">{method.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-xs text-gray-500">
                      {method.description}
                    </div>
                    {method.id === "wallet" && !method.available && (
                      <div className="text-xs text-red-500">
                        Insufficient balance
                      </div>
                    )}
                  </div>
                  {method.id === "wallet" && method.available && (
                    <div className="text-xs text-green-600 font-medium">
                      Instant
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {/* Wallet recharge suggestion */}
          {!hasEnoughBalance && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Recharge your wallet for faster
                payments! You need ${(lessonPrice - walletBalance).toFixed(2)}{" "}
                more.
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            All payments are secure and encrypted
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
