import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
import { Helmet } from 'react-helmet';
  Settings,
  Clock,
  Users,
  Bell,
  Calendar,
  DollarSign,
  Shield,
  MessageCircle,
  Star,
  Info,
} from "lucide-react";

export default function TeacherSettings() {
  const [settings, setSettings] = useState({
    // Request Management
    responseTime: "3", // hours
    autoAcceptReturning: true,
    autoAcceptVerified: false,
    maxRequestsPerDay: "10",
    requireMessage: true,

    // Availability
    minAdvanceBooking: "2", // hours
    maxAdvanceBooking: "30", // days
    breakBetweenLessons: "15", // minutes
    workingHours: {
      start: "09:00",
      end: "18:00",
    },

    // Pricing
    baseRate: "25",
    trialLessonRate: "15",
    packageDiscount: "10", // percentage
    instantBookingFee: "2", // additional fee

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    requestReminders: true,
    lessonReminders: true,

    // Auto-messages
    welcomeMessage:
      "Welcome! I'm excited to help you learn Spanish. Let me know your goals and we'll create a personalized learning plan.",
    confirmationMessage:
      "Your lesson is confirmed! I'll send you materials 24 hours before our session.",
    reschedulePolicy:
      "You can reschedule lessons up to 4 hours in advance at no charge.",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Save settings to API
    console.log("Saving settings:", settings);
  };

        <Helmet>
            <title>Teachersettings | Talkcon</title>
            <meta name="description" content="Teachersettings page of Talkcon platform." />
        </Helmet>
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Settings className="w-8 h-8 mr-3 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Teacher Settings</h1>
              <p className="text-muted-foreground">
                Manage your teaching preferences and automation settings
              </p>
            </div>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Request Response Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Response time affects your teacher rating. Faster
                      responses lead to more bookings.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Maximum Response Time</Label>
                    <Select
                      value={settings.responseTime}
                      onValueChange={(value) =>
                        handleSettingChange("responseTime", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour (Premium)</SelectItem>
                        <SelectItem value="3">3 hours (Recommended)</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      You'll need to respond to lesson requests within this
                      timeframe
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxRequests">
                      Maximum Requests per Day
                    </Label>
                    <Input
                      id="maxRequests"
                      type="number"
                      value={settings.maxRequestsPerDay}
                      onChange={(e) =>
                        handleSettingChange("maxRequestsPerDay", e.target.value)
                      }
                      min="1"
                      max="50"
                    />
                    <p className="text-sm text-muted-foreground">
                      Limit daily requests to manage your workload
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require Student Message</Label>
                      <p className="text-sm text-muted-foreground">
                        Students must include a message with their request
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireMessage}
                      onCheckedChange={(checked) =>
                        handleSettingChange("requireMessage", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Auto-Accept Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Auto-accept can increase your booking rate but reduces
                      control over your schedule.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-accept returning students</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept requests from students you've
                        taught before
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptReturning}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoAcceptReturning", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-accept verified students</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept requests from verified students
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptVerified}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoAcceptVerified", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Booking Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAdvance">
                        Minimum advance booking (hours)
                      </Label>
                      <Select
                        value={settings.minAdvanceBooking}
                        onValueChange={(value) =>
                          handleSettingChange("minAdvanceBooking", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAdvance">
                        Maximum advance booking (days)
                      </Label>
                      <Select
                        value={settings.maxAdvanceBooking}
                        onValueChange={(value) =>
                          handleSettingChange("maxAdvanceBooking", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">1 week</SelectItem>
                          <SelectItem value="14">2 weeks</SelectItem>
                          <SelectItem value="30">1 month</SelectItem>
                          <SelectItem value="60">2 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breakTime">
                      Break between lessons (minutes)
                    </Label>
                    <Select
                      value={settings.breakBetweenLessons}
                      onValueChange={(value) =>
                        handleSettingChange("breakBetweenLessons", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No break</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Time buffer between back-to-back lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseRate">
                        Regular Lesson Rate ($/hour)
                      </Label>
                      <Input
                        id="baseRate"
                        type="number"
                        value={settings.baseRate}
                        onChange={(e) =>
                          handleSettingChange("baseRate", e.target.value)
                        }
                        min="10"
                        max="200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trialRate">
                        Trial Lesson Rate ($/hour)
                      </Label>
                      <Input
                        id="trialRate"
                        type="number"
                        value={settings.trialLessonRate}
                        onChange={(e) =>
                          handleSettingChange("trialLessonRate", e.target.value)
                        }
                        min="5"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packageDiscount">
                        Package Discount (%)
                      </Label>
                      <Input
                        id="packageDiscount"
                        type="number"
                        value={settings.packageDiscount}
                        onChange={(e) =>
                          handleSettingChange("packageDiscount", e.target.value)
                        }
                        min="0"
                        max="50"
                      />
                      <p className="text-sm text-muted-foreground">
                        Discount for lesson packages (5+ lessons)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instantFee">
                        Instant Booking Fee ($)
                      </Label>
                      <Input
                        id="instantFee"
                        type="number"
                        value={settings.instantBookingFee}
                        onChange={(e) =>
                          handleSettingChange(
                            "instantBookingFee",
                            e.target.value,
                          )
                        }
                        min="0"
                        max="20"
                      />
                      <p className="text-sm text-muted-foreground">
                        Additional fee for instant bookings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive lesson requests and updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser notifications for urgent updates
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("pushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Text messages for critical updates only
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("smsNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Request Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for pending lesson requests
                      </p>
                    </div>
                    <Switch
                      checked={settings.requestReminders}
                      onCheckedChange={(checked) =>
                        handleSettingChange("requestReminders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Lesson Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders before upcoming lessons
                      </p>
                    </div>
                    <Switch
                      checked={settings.lessonReminders}
                      onCheckedChange={(checked) =>
                        handleSettingChange("lessonReminders", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Automated Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={settings.welcomeMessage}
                      onChange={(e) =>
                        handleSettingChange("welcomeMessage", e.target.value)
                      }
                      rows={3}
                      placeholder="Message sent to new students..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Sent automatically to first-time students
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmationMessage">
                      Lesson Confirmation Message
                    </Label>
                    <Textarea
                      id="confirmationMessage"
                      value={settings.confirmationMessage}
                      onChange={(e) =>
                        handleSettingChange(
                          "confirmationMessage",
                          e.target.value,
                        )
                      }
                      rows={3}
                      placeholder="Message sent when lesson is confirmed..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Sent when you accept a lesson request
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reschedulePolicy">Reschedule Policy</Label>
                    <Textarea
                      id="reschedulePolicy"
                      value={settings.reschedulePolicy}
                      onChange={(e) =>
                        handleSettingChange("reschedulePolicy", e.target.value)
                      }
                      rows={2}
                      placeholder="Your reschedule and cancellation policy..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Shown to students when booking lessons
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Save Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure to save your changes before leaving this page
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
