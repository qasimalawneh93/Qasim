import {
  Teacher,
  Student,
  Lesson,
  Booking,
  Review,
  Message,
} from "../../shared/api";

// Real local database simulation with localStorage persistence
class LocalDatabase {
  private storageKey = "linguaconnect_db";

  private defaultData = {
    users: [] as Array<
      Student & {
        password: string;
        status: "active" | "suspended";
        createdAt: string;
        walletBalance: number;
      }
    >,
    teachers: [] as Array<
      Teacher & {
        password: string;
        status: "pending" | "approved" | "rejected";
        applicationData: any;
        createdAt: string;
        earnings: number;
      }
    >,
    lessons: [] as Array<Lesson & { createdAt: string }>,
    bookings: [] as Array<Booking & { createdAt: string }>,
    reviews: [] as Review[],
    messages: [] as Message[],
    community: {
      posts: [] as Array<{
        id: string;
        title: string;
        content: string;
        authorId: string;
        authorName: string;
        authorType: "student" | "teacher";
        language: string;
        category: string;
        likes: number;
        replies: number;
        views: number;
        createdAt: string;
        updatedAt: string;
        tags: string[];
        isModerated: boolean;
      }>,
      events: [] as Array<{
        id: string;
        title: string;
        description: string;
        hostId: string;
        hostName: string;
        language: string;
        level: string;
        startTime: string;
        duration: number;
        maxParticipants: number;
        participants: string[];
        status: "upcoming" | "live" | "completed" | "cancelled";
        createdAt: string;
      }>,
      challenges: [] as Array<{
        id: string;
        title: string;
        description: string;
        language: string;
        difficulty: "Beginner" | "Intermediate" | "Advanced";
        startDate: string;
        endDate: string;
        participants: string[];
        reward: string;
        createdBy: string;
        isActive: boolean;
        createdAt: string;
      }>,
      studyGroups: [] as Array<{
        id: string;
        name: string;
        description: string;
        language: string;
        level: string;
        members: string[];
        maxMembers: number;
        createdBy: string;
        isPrivate: boolean;
        createdAt: string;
      }>,
    },
    recentActivity: [] as Array<{
      id: string;
      type:
        | "user_signup"
        | "teacher_application"
        | "lesson_booked"
        | "lesson_completed"
        | "post_created"
        | "teacher_approved"
        | "teacher_rejected"
        | "payout_requested"
        | "payout_approved"
        | "payout_rejected"
        | "wallet_recharge"
        | "lesson_payment";
      userId: string;
      userName: string;
      description: string;
      timestamp: string;
      metadata?: any;
    }>,
    payoutRequests: [] as Array<{
      id: string;
      teacherId: string;
      teacherName: string;
      teacherEmail: string;
      amount: number;
      method: "paypal" | "bank_transfer";
      status: "pending" | "approved" | "rejected" | "completed";
      requestedAt: string;
      processedAt?: string;
      processedBy?: string;
      paymentDetails: {
        paypalEmail?: string;
        bankAccountNumber?: string;
        bankRoutingNumber?: string;
        bankAccountHolderName?: string;
        bankName?: string;
      };
      notes?: string;
      adminNotes?: string;
    }>,
    walletTransactions: [] as Array<{
      id: string;
      userId: string;
      userName: string;
      type: "recharge" | "payment" | "refund";
      amount: number;
      method: "paypal" | "mastercard" | "visa" | "bank_transfer" | "wallet";
      status: "pending" | "completed" | "failed";
      description: string;
      lessonId?: string;
      teacherId?: string;
      teacherName?: string;
      createdAt: string;
      processedAt?: string;
      paymentDetails?: any;
    }>,
    systemStats: {
      dailySignups: [] as Array<{ date: string; count: number }>,
      dailyLessons: [] as Array<{ date: string; count: number }>,
      dailyRevenue: [] as Array<{ date: string; amount: number }>,
    },
    adminSettings: {
      platformFee: 0.2,
      currency: "USD",
      languages: [
        "English",
        "Spanish",
        "French",
        "German",
        "Italian",
        "Portuguese",
        "Chinese",
        "Japanese",
        "Korean",
        "Arabic",
      ],
      timezones: [
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
      ],
    },
    stats: {
      totalRevenue: 0,
      totalLessons: 0,
      totalUsers: 0,
      totalTeachers: 0,
    },
  };

  private data: typeof this.defaultData;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = { ...this.defaultData, ...JSON.parse(stored) };
      } else {
        this.data = { ...this.defaultData };
        this.saveData();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      this.data = { ...this.defaultData };
    }
  }

  private saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearAllData() {
    this.data = { ...this.defaultData };
    this.saveData();
  }

  // User Management
  createUser(userData: Omit<Student, "id"> & { password: string }): Student {
    // Check if email already exists
    const existingUser = this.data.users.find(
      (u) => u.email === userData.email,
    );
    const existingTeacher = this.data.teachers.find(
      (t) => t.email === userData.email,
    );

    if (existingUser || existingTeacher) {
      throw new Error("An account with this email already exists");
    }

    const user: Student & {
      password: string;
      status: "active" | "suspended";
      createdAt: string;
    } = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      status: "active",
      createdAt: new Date().toISOString(),
      completedLessons: 0,
      hoursLearned: 0,
      walletBalance: 0,
    };

    this.data.users.push(user);
    this.data.stats.totalUsers = this.data.users.length;

    // Log activity for admin dashboard
    this.logActivity(
      "user_signup",
      user.id,
      user.name,
      `New student signed up: ${user.name}`,
    );

    this.saveData();

    // Return user without password
    const { password, ...publicUser } = user;
    return publicUser;
  }

  getUsers(filters?: { search?: string; status?: string }): Student[] {
    let users = this.data.users.map(({ password, ...user }) => user);

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      );
    }

    if (filters?.status && filters.status !== "all") {
      users = users.filter((user) => user.status === filters.status);
    }

    return users;
  }

  getUserById(id: string): Student | null {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...publicUser } = user;
    return publicUser;
  }

  updateUser(id: string, updates: Partial<Student>): boolean {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return false;

    this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
    this.saveData();
    return true;
  }

  authenticateUser(
    email: string,
    password: string,
  ): (Student & { type: "student" }) | (Teacher & { type: "teacher" }) | null {
    // Check students
    const user = this.data.users.find(
      (u) =>
        u.email === email && u.password === password && u.status === "active",
    );
    if (user) {
      const { password: _, ...publicUser } = user;
      return { ...publicUser, type: "student" };
    }

    // Check teachers (allow approved, pending, and incomplete teachers to login)
    const teacher = this.data.teachers.find(
      (t) =>
        t.email === email &&
        t.password === password &&
        (t.status === "approved" ||
          t.status === "pending" ||
          t.status === "incomplete"),
    );
    if (teacher) {
      const { password: _, applicationData, ...publicTeacher } = teacher;
      return { ...publicTeacher, type: "teacher" };
    }

    return null;
  }

  // Teacher Management
  createBasicTeacher(teacherData: any) {
    // Check if email already exists
    const existingUser = this.data.users.find(
      (u) => u.email === teacherData.email,
    );
    const existingTeacher = this.data.teachers.find(
      (t) => t.email === teacherData.email,
    );

    if (existingUser || existingTeacher) {
      throw new Error("An account with this email already exists");
    }

    const teacher = {
      id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: teacherData.name,
      email: teacherData.email,
      password: teacherData.password,
      avatar: teacherData.avatar,
      languages: [],
      nativeLanguage: "",
      rating: 0,
      reviewCount: 0,
      price: 25,
      currency: "USD",
      availability: [],
      specialties: [],
      experience: 0,
      description: "",
      video: "",
      isOnline: false,
      responseTime: "24h",
      completedLessons: 0,
      badges: [],
      country: "",
      timezone: "UTC",
      status: "incomplete" as const, // New status for incomplete applications
      applicationData: null,
      createdAt: new Date().toISOString(),
      earnings: 0,
    };

    this.data.teachers.push(teacher);
    this.saveData();
    return teacher;
  }

  createTeacherApplication(applicationData: any): string {
    // Check if email already exists
    const existingUser = this.data.users.find(
      (u) => u.email === applicationData.email,
    );
    const existingTeacher = this.data.teachers.find(
      (t) => t.email === applicationData.email,
    );

    if (existingUser || existingTeacher) {
      throw new Error("An account with this email already exists");
    }

    const teacher = {
      id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      password: applicationData.password,
      avatar: "/placeholder.svg",
      languages: applicationData.languages || [],
      nativeLanguage: applicationData.nativeLanguage || "",
      rating: 0,
      reviewCount: 0,
      price: applicationData.hourlyRate || 25,
      currency: "USD",
      availability: [],
      specialties: applicationData.specialties || [],
      experience: applicationData.experience || 0,
      description: applicationData.teachingMethodology || "",
      video: applicationData.introVideo || "",
      isOnline: false,
      responseTime: "24h",
      completedLessons: 0,
      badges: [],
      country: applicationData.country || "",
      timezone: applicationData.timezone || "UTC",
      status: "pending" as const,
      applicationData,
      createdAt: new Date().toISOString(),
      earnings: 0,
    };

    this.data.teachers.push(teacher);

    // Log activity for admin dashboard
    this.logActivity(
      "teacher_application",
      teacher.id,
      teacher.name,
      `New teacher application submitted: ${teacher.name}`,
    );

    this.saveData();
    return teacher.id;
  }

  updateTeacherApplication(teacherId: string, applicationData: any): boolean {
    const teacherIndex = this.data.teachers.findIndex(
      (t) => t.id === teacherId,
    );
    if (teacherIndex === -1) return false;

    // Update teacher with application data
    this.data.teachers[teacherIndex] = {
      ...this.data.teachers[teacherIndex],
      languages: applicationData.teachingLanguages || [],
      nativeLanguage: applicationData.nativeLanguage || "",
      price: parseFloat(applicationData.hourlyRate) || 25,
      specialties: applicationData.specialties || [],
      experience: parseInt(applicationData.teachingExperience) || 0,
      description:
        applicationData.description || applicationData.teachingMethod || "",
      country: applicationData.country || "",
      timezone: applicationData.timezone || "UTC",
      status: "pending" as const,
      applicationData: applicationData,
      video: applicationData.introVideoUrl || "",
    };

    this.saveData();
    return true;
  }

  updateTeacherMeetingPlatforms(
    teacherId: string,
    meetingPlatforms: {
      zoom?: string;
      googleMeet?: string;
      skype?: string;
      voov?: string;
      preferredPlatform?: "zoom" | "googleMeet" | "skype" | "voov";
    },
  ): boolean {
    const teacherIndex = this.data.teachers.findIndex(
      (t) => t.id === teacherId,
    );
    if (teacherIndex === -1) return false;

    this.data.teachers[teacherIndex].meetingPlatforms = meetingPlatforms;
    this.saveData();
    return true;
  }

  getTeacherMeetingPlatforms(teacherId: string) {
    const teacher = this.data.teachers.find((t) => t.id === teacherId);
    return teacher?.meetingPlatforms || null;
  }

  getLessonMeetingInfo(lessonId: string) {
    const lesson = this.data.lessons.find((l) => l.id === lessonId);
    if (!lesson) return null;

    const teacher = this.data.teachers.find((t) => t.id === lesson.teacherId);
    if (!teacher?.meetingPlatforms) {
      return {
        lessonId,
        meetingUrl: `https://meet.linguaconnect.com/room/${lessonId}`,
        platformName: "Virtual Classroom",
      };
    }

    const platforms = teacher.meetingPlatforms;
    const preferred = platforms.preferredPlatform || "zoom";

    let meetingUrl = `https://meet.linguaconnect.com/room/${lessonId}`;
    let platformName = "Virtual Classroom";

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
          meetingUrl = platforms.skype.startsWith("http")
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

    return {
      lessonId,
      meetingUrl,
      platformName,
      teacherName: teacher.name,
    };
  }

  getTeachers(filters?: { search?: string; status?: string }): Teacher[] {
    let teachers = this.data.teachers
      .filter((t) => t.status === "approved")
      .map(({ password, applicationData, ...teacher }) => teacher);

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      teachers = teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(search) ||
          teacher.languages.some((lang) => lang.toLowerCase().includes(search)),
      );
    }

    return teachers;
  }

  getTeacherApplications(filters?: { search?: string; status?: string }) {
    let applications = this.data.teachers;

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      applications = applications.filter(
        (app) =>
          app.name.toLowerCase().includes(search) ||
          app.email.toLowerCase().includes(search),
      );
    }

    if (filters?.status && filters.status !== "all") {
      applications = applications.filter(
        (app) => app.status === filters.status,
      );
    }

    return applications.map(({ password, ...app }) => app);
  }

  getTeacherByEmail(email: string) {
    const teacher = this.data.teachers.find((t) => t.email === email);
    if (!teacher) return null;
    const { password, ...publicTeacher } = teacher;
    return publicTeacher;
  }

  approveTeacher(id: string): boolean {
    const teacherIndex = this.data.teachers.findIndex((t) => t.id === id);
    if (teacherIndex === -1) return false;

    this.data.teachers[teacherIndex].status = "approved";

    // Give new teachers some initial stats for better presentation
    if (this.data.teachers[teacherIndex].rating === 0) {
      this.data.teachers[teacherIndex].rating = 4.5 + Math.random() * 0.4; // 4.5-4.9
      this.data.teachers[teacherIndex].reviewCount =
        Math.floor(Math.random() * 50) + 10; // 10-60 reviews
      this.data.teachers[teacherIndex].completedLessons =
        Math.floor(Math.random() * 100) + 20; // 20-120 lessons
      this.data.teachers[teacherIndex].isOnline = Math.random() > 0.3; // 70% chance online
      this.data.teachers[teacherIndex].responseTime =
        Math.random() > 0.5 ? "1 hour" : "4 hours";

      // Add some badges
      const possibleBadges = [
        "Verified Teacher",
        "Quick Responder",
        "Student Favorite",
        "Professional",
      ];
      const numBadges = Math.floor(Math.random() * 2) + 1; // 1-2 badges
      this.data.teachers[teacherIndex].badges = possibleBadges.slice(
        0,
        numBadges,
      );
    }

    this.data.stats.totalTeachers = this.data.teachers.filter(
      (t) => t.status === "approved",
    ).length;

    // Log activity for admin dashboard
    const teacher = this.data.teachers[teacherIndex];
    this.logActivity(
      "teacher_approved",
      teacher.id,
      teacher.name,
      `Teacher application approved: ${teacher.name}`,
      { email: teacher.email, languages: teacher.teachingLanguages },
    );

    this.saveData();
    return true;
  }

  rejectTeacher(id: string): boolean {
    const teacherIndex = this.data.teachers.findIndex((t) => t.id === id);
    if (teacherIndex === -1) return false;

    const teacher = this.data.teachers[teacherIndex];
    teacher.status = "rejected";

    // Log activity for admin dashboard
    this.logActivity(
      "teacher_rejected",
      teacher.id,
      teacher.name,
      `Teacher application rejected: ${teacher.name}`,
      { email: teacher.email },
    );

    this.saveData();
    return true;
  }

  // Lesson Management
  createLesson(lessonData: Omit<Lesson, "id">): Lesson {
    const lesson: Lesson & { createdAt: string } = {
      id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...lessonData,
      createdAt: new Date().toISOString(),
    };

    this.data.lessons.push(lesson);
    this.data.stats.totalLessons = this.data.lessons.length;

    // Log activity for admin dashboard
    this.logActivity(
      "lesson_booked",
      lessonData.studentId,
      `Student ${lessonData.studentId}`,
      `Lesson booked with teacher ${lessonData.teacherId}`,
      { teacherId: lessonData.teacherId, language: lessonData.language },
    );

    // Update user completed lessons if lesson is completed
    if (lesson.status === "completed") {
      const userIndex = this.data.users.findIndex(
        (u) => u.id === lesson.studentId,
      );
      if (userIndex !== -1) {
        this.data.users[userIndex].completedLessons += 1;
        this.data.users[userIndex].hoursLearned += lesson.duration / 60;
      }

      // Add to teacher earnings
      const teacherIndex = this.data.teachers.findIndex(
        (t) => t.id === lesson.teacherId,
      );
      if (teacherIndex !== -1) {
        this.data.teachers[teacherIndex].completedLessons += 1;
        this.data.teachers[teacherIndex].earnings +=
          lesson.price * (1 - this.data.adminSettings.platformFee);
      }

      // Update total revenue
      this.data.stats.totalRevenue += lesson.price;

      // Log lesson completion activity
      this.logActivity(
        "lesson_completed",
        lesson.studentId,
        `Student ${lesson.studentId}`,
        `Completed lesson with teacher ${lesson.teacherId}`,
        {
          teacherId: lesson.teacherId,
          language: lesson.language,
          price: lesson.price,
        },
      );
    }

    this.saveData();
    return lesson;
  }

  getLessons(filters?: {
    search?: string;
    status?: string;
    teacherId?: string;
    studentId?: string;
  }): Lesson[] {
    let lessons = this.data.lessons;

    if (filters?.status && filters.status !== "all") {
      lessons = lessons.filter((lesson) => lesson.status === filters.status);
    }

    if (filters?.teacherId) {
      lessons = lessons.filter(
        (lesson) => lesson.teacherId === filters.teacherId,
      );
    }

    if (filters?.studentId) {
      lessons = lessons.filter(
        (lesson) => lesson.studentId === filters.studentId,
      );
    }

    return lessons;
  }

  updateLesson(id: string, updates: Partial<Lesson>): boolean {
    const lessonIndex = this.data.lessons.findIndex((l) => l.id === id);
    if (lessonIndex === -1) return false;

    this.data.lessons[lessonIndex] = {
      ...this.data.lessons[lessonIndex],
      ...updates,
    };
    this.saveData();
    return true;
  }

  // Activity logging for admin dashboard
  private logActivity(
    type:
      | "user_signup"
      | "teacher_application"
      | "lesson_booked"
      | "lesson_completed"
      | "post_created"
      | "teacher_approved"
      | "teacher_rejected"
      | "payout_requested"
      | "payout_approved"
      | "payout_rejected"
      | "wallet_recharge"
      | "lesson_payment",
    userId: string,
    userName: string,
    description: string,
    metadata?: any,
  ) {
    const activity = {
      id: this.generateId(),
      type,
      userId,
      userName,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.data.recentActivity.unshift(activity);

    // Keep only the last 100 activities
    if (this.data.recentActivity.length > 100) {
      this.data.recentActivity = this.data.recentActivity.slice(0, 100);
    }

    this.saveData();
  }

  // Get recent activities for admin dashboard
  getRecentActivities(limit: number = 20) {
    return this.data.recentActivity.slice(0, limit);
  }

  // Stats and Analytics
  getStats() {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lessonsThisMonth = this.data.lessons.filter(
      (l) => new Date(l.createdAt) >= lastMonth && l.status === "completed",
    );

    const revenueThisMonth = lessonsThisMonth.reduce(
      (sum, lesson) => sum + lesson.price,
      0,
    );

    return {
      totalUsers: this.data.users.filter((u) => u.status === "active").length,
      totalTeachers: this.data.teachers.filter((t) => t.status === "approved")
        .length,
      totalLessons: this.data.lessons.filter((l) => l.status === "completed")
        .length,
      totalRevenue: this.data.stats.totalRevenue,
      pendingApplications: this.data.teachers.filter(
        (t) => t.status === "pending",
      ).length,
      lessonsThisMonth: lessonsThisMonth.length,
      revenueThisMonth,
      activeUsers: this.data.users.filter((u) => u.status === "active").length,
    };
  }

  // Admin functions
  getAdminSettings() {
    return this.data.adminSettings;
  }

  updateAdminSettings(settings: Partial<typeof this.data.adminSettings>) {
    this.data.adminSettings = { ...this.data.adminSettings, ...settings };
    this.saveData();
  }

  // Reset data to clean state
  resetToCleanState() {
    localStorage.removeItem(this.storageKey);
    this.data = { ...this.defaultData };
    this.saveData();
    console.log("Database reset to clean state");
  }

  // Create demo community data
  createDemoCommunityData() {
    // Demo posts
    const demoPosts = [
      {
        title: "Best Spanish learning tips for beginners",
        content:
          "After teaching Spanish for 5 years, here are my top tips for beginners...",
        authorId: "teacher_demo",
        authorName: "María García",
        authorType: "teacher" as const,
        language: "Spanish",
        category: "Tips & Tricks",
        tags: ["beginner", "tips", "grammar"],
      },
      {
        title: "How to pronounce French nasal sounds correctly?",
        content:
          "I've been struggling with French nasal sounds. Can anyone help?",
        authorId: "student_demo",
        authorName: "John Smith",
        authorType: "student" as const,
        language: "French",
        category: "Questions & Answers",
        tags: ["pronunciation", "help"],
      },
      {
        title: "Japanese cultural insights for language learners",
        content:
          "Understanding Japanese culture is key to mastering the language...",
        authorId: "teacher_demo2",
        authorName: "Hiroshi Tanaka",
        authorType: "teacher" as const,
        language: "Japanese",
        category: "Cultural Content",
        tags: ["culture", "japan", "context"],
      },
    ];

    demoPosts.forEach((post) => {
      this.createPost(post);
    });

    // Demo events
    const demoEvents = [
      {
        title: "Spanish Conversation Circle",
        description: "Practice conversational Spanish with native speakers",
        hostId: "teacher_demo",
        hostName: "María García",
        language: "Spanish",
        level: "Intermediate",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        duration: 60,
        maxParticipants: 15,
      },
      {
        title: "French Pronunciation Workshop",
        description: "Master the French R and nasal sounds",
        hostId: "teacher_demo3",
        hostName: "Jean Dubois",
        language: "French",
        level: "Beginner",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        duration: 45,
        maxParticipants: 10,
      },
    ];

    demoEvents.forEach((event) => {
      this.createEvent(event);
    });

    // Demo challenges
    const demoChallenges = [
      {
        title: "30-Day Spanish Speaking Challenge",
        description: "Speak Spanish for 15 minutes every day",
        language: "Spanish",
        difficulty: "Intermediate" as const,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        reward: "Digital Certificate + 50 Talkcon Points",
        createdBy: "admin",
      },
      {
        title: "French Poetry Reading Contest",
        description: "Record yourself reading French poetry",
        language: "French",
        difficulty: "Advanced" as const,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        reward: "Free Premium Lesson + Teacher Feature",
        createdBy: "admin",
      },
    ];

    demoChallenges.forEach((challenge) => {
      this.createChallenge(challenge);
    });

    console.log("Demo community data created: posts, events, and challenges");
    return {
      postsCreated: demoPosts.length,
      eventsCreated: demoEvents.length,
      challengesCreated: demoChallenges.length,
    };
  }

  // Create demo approved teachers for testing
  createDemoApprovedTeachers() {
    const demoTeachers = [
      {
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@talkcon.com",
        password: "teacher123",
        teachingLanguages: ["Spanish", "English"],
        nativeLanguage: "Spanish",
        hourlyRate: "25",
        teachingExperience: "5",
        country: "Spain",
        timezone: "Europe/Madrid",
        specialties: ["Grammar", "Conversation", "Business Spanish"],
        description:
          "I focus on conversational practice with structured grammar lessons. My approach emphasizes real-world communication while building solid language foundations.",
        introVideoUrl: "https://www.youtube.com/embed/VXa9tXcMhXQ",
      },
      {
        firstName: "Jean",
        lastName: "Dubois",
        email: "jean.dubois@talkcon.com",
        password: "teacher123",
        teachingLanguages: ["French", "English"],
        nativeLanguage: "French",
        hourlyRate: "30",
        teachingExperience: "8",
        country: "France",
        timezone: "Europe/Paris",
        specialties: ["Literature", "Culture", "Pronunciation"],
        description:
          "I believe in immersive learning through cultural context and authentic materials. Students learn French through stories, films, and real French culture.",
        introVideoUrl: "https://www.youtube.com/embed/HDntl7yzzVI",
      },
      {
        firstName: "Hiroshi",
        lastName: "Tanaka",
        email: "hiroshi.tanaka@talkcon.com",
        password: "teacher123",
        teachingLanguages: ["Japanese", "English"],
        nativeLanguage: "Japanese",
        hourlyRate: "28",
        teachingExperience: "6",
        country: "Japan",
        timezone: "Asia/Tokyo",
        specialties: ["Hiragana/Katakana", "Kanji", "Business Japanese"],
        description:
          "I start with solid foundation in writing systems, then progress to practical conversation. I use visual aids and mnemonics to make kanji learning enjoyable.",
        introVideoUrl: "https://www.youtube.com/embed/bEQtkLNTmRs",
      },
      {
        firstName: "Anna",
        lastName: "Müller",
        email: "anna.muller@talkcon.com",
        password: "teacher123",
        teachingLanguages: ["German", "English"],
        nativeLanguage: "German",
        hourlyRate: "26",
        teachingExperience: "4",
        country: "Germany",
        timezone: "Europe/Berlin",
        specialties: ["Grammar", "Test Preparation", "Academic German"],
        description:
          "I use a systematic approach to German grammar with plenty of practice exercises. My lessons are structured but interactive, focusing on practical usage.",
        introVideoUrl: "https://www.youtube.com/embed/YnSKLqzuvbU",
      },
    ];

    demoTeachers.forEach((teacherData) => {
      // Create basic teacher first
      const basicTeacher = this.createBasicTeacher({
        name: `${teacherData.firstName} ${teacherData.lastName}`,
        email: teacherData.email,
        password: teacherData.password,
        avatar: "/placeholder.svg",
        type: "teacher",
      });

      // Update with application data
      this.updateTeacherApplication(basicTeacher.id, teacherData);

      // Approve the teacher
      this.approveTeacher(basicTeacher.id);
    });

    console.log("Demo approved teachers created:", demoTeachers.length);
    return demoTeachers.length;
  }

  // Community Management Methods
  createPost(postData: {
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    authorType: "student" | "teacher";
    language: string;
    category: string;
    tags: string[];
  }) {
    const post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...postData,
      likes: 0,
      replies: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isModerated: false,
    };

    this.data.community.posts.push(post);

    // Log activity for admin dashboard
    this.logActivity(
      "post_created",
      postData.authorId,
      postData.authorName,
      `Created new community post: ${postData.title}`,
      { language: postData.language, category: postData.category },
    );

    this.saveData();
    return post;
  }

  getPosts(filters?: {
    language?: string;
    category?: string;
    authorType?: string;
  }) {
    let posts = [...this.data.community.posts];

    if (filters?.language && filters.language !== "all") {
      posts = posts.filter(
        (post) =>
          post.language.toLowerCase() === filters.language.toLowerCase(),
      );
    }

    if (filters?.category) {
      posts = posts.filter((post) => post.category === filters.category);
    }

    if (filters?.authorType) {
      posts = posts.filter((post) => post.authorType === filters.authorType);
    }

    return posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  likePost(postId: string, userId: string) {
    const postIndex = this.data.community.posts.findIndex(
      (p) => p.id === postId,
    );
    if (postIndex !== -1) {
      this.data.community.posts[postIndex].likes += 1;
      this.saveData();
      return true;
    }
    return false;
  }

  createEvent(eventData: {
    title: string;
    description: string;
    hostId: string;
    hostName: string;
    language: string;
    level: string;
    startTime: string;
    duration: number;
    maxParticipants: number;
  }) {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...eventData,
      participants: [],
      status: "upcoming" as const,
      createdAt: new Date().toISOString(),
    };

    this.data.community.events.push(event);
    this.saveData();
    return event;
  }

  getEvents(filters?: { status?: string; language?: string }) {
    let events = [...this.data.community.events];

    if (filters?.status && filters.status !== "all") {
      events = events.filter((event) => event.status === filters.status);
    }

    if (filters?.language && filters.language !== "all") {
      events = events.filter(
        (event) =>
          event.language.toLowerCase() === filters.language.toLowerCase(),
      );
    }

    return events.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  }

  joinEvent(eventId: string, userId: string) {
    const eventIndex = this.data.community.events.findIndex(
      (e) => e.id === eventId,
    );
    if (eventIndex !== -1) {
      const event = this.data.community.events[eventIndex];
      if (
        event.participants.length < event.maxParticipants &&
        !event.participants.includes(userId)
      ) {
        event.participants.push(userId);
        this.saveData();
        return true;
      }
    }
    return false;
  }

  createChallenge(challengeData: {
    title: string;
    description: string;
    language: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    endDate: string;
    reward: string;
    createdBy: string;
  }) {
    const challenge = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...challengeData,
      startDate: new Date().toISOString(),
      participants: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.data.community.challenges.push(challenge);
    this.saveData();
    return challenge;
  }

  getChallenges(filters?: {
    language?: string;
    difficulty?: string;
    isActive?: boolean;
  }) {
    let challenges = [...this.data.community.challenges];

    if (filters?.language && filters.language !== "all") {
      challenges = challenges.filter(
        (c) => c.language.toLowerCase() === filters.language.toLowerCase(),
      );
    }

    if (filters?.difficulty) {
      challenges = challenges.filter(
        (c) => c.difficulty === filters.difficulty,
      );
    }

    if (filters?.isActive !== undefined) {
      challenges = challenges.filter((c) => c.isActive === filters.isActive);
    }

    return challenges.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  joinChallenge(challengeId: string, userId: string) {
    const challengeIndex = this.data.community.challenges.findIndex(
      (c) => c.id === challengeId,
    );
    if (challengeIndex !== -1) {
      const challenge = this.data.community.challenges[challengeIndex];
      if (!challenge.participants.includes(userId)) {
        challenge.participants.push(userId);
        this.saveData();
        return true;
      }
    }
    return false;
  }

  getCommunityStats() {
    return {
      totalPosts: this.data.community.posts.length,
      totalEvents: this.data.community.events.length,
      totalChallenges: this.data.community.challenges.length,
      activeChallenges: this.data.community.challenges.filter((c) => c.isActive)
        .length,
      liveEvents: this.data.community.events.filter((e) => e.status === "live")
        .length,
      upcomingEvents: this.data.community.events.filter(
        (e) => e.status === "upcoming",
      ).length,
      totalParticipants: new Set([
        ...this.data.community.events.flatMap((e) => e.participants),
        ...this.data.community.challenges.flatMap((c) => c.participants),
      ]).size,
    };
  }

  // Moderation methods for admin
  moderatePost(postId: string, action: "approve" | "reject" | "delete") {
    const postIndex = this.data.community.posts.findIndex(
      (p) => p.id === postId,
    );
    if (postIndex !== -1) {
      if (action === "delete") {
        this.data.community.posts.splice(postIndex, 1);
      } else {
        this.data.community.posts[postIndex].isModerated = action === "approve";
      }
      this.saveData();
      return true;
    }
    return false;
  }

  deleteEvent(eventId: string) {
    const eventIndex = this.data.community.events.findIndex(
      (e) => e.id === eventId,
    );
    if (eventIndex !== -1) {
      this.data.community.events.splice(eventIndex, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  deactivateChallenge(challengeId: string) {
    const challengeIndex = this.data.community.challenges.findIndex(
      (c) => c.id === challengeId,
    );
    if (challengeIndex !== -1) {
      this.data.community.challenges[challengeIndex].isActive = false;
      this.saveData();
      return true;
    }
    return false;
  }

  // Payout Management Methods
  createPayoutRequest(requestData: {
    teacherId: string;
    amount: number;
    method: "paypal" | "bank_transfer";
    paymentDetails: {
      paypalEmail?: string;
      bankAccountNumber?: string;
      bankRoutingNumber?: string;
      bankAccountHolderName?: string;
      bankName?: string;
    };
    notes?: string;
  }) {
    // Find teacher
    const teacher = this.data.teachers.find(
      (t) => t.id === requestData.teacherId,
    );
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Validate minimum amounts
    const minAmount = requestData.method === "paypal" ? 25 : 100;
    if (requestData.amount < minAmount) {
      throw new Error(
        `Minimum withdrawal amount is $${minAmount} for ${requestData.method === "paypal" ? "PayPal" : "Bank Transfer"}`,
      );
    }

    // Check if teacher has sufficient balance
    if (teacher.earnings < requestData.amount) {
      throw new Error("Insufficient balance for withdrawal");
    }

    const payoutRequest = {
      id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teacherId: requestData.teacherId,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      amount: requestData.amount,
      method: requestData.method,
      status: "pending" as const,
      requestedAt: new Date().toISOString(),
      paymentDetails: requestData.paymentDetails,
      notes: requestData.notes,
    };

    this.data.payoutRequests.push(payoutRequest);

    // Log activity
    this.logActivity(
      "payout_requested",
      teacher.id,
      teacher.name,
      `Requested payout of $${requestData.amount} via ${requestData.method}`,
      { amount: requestData.amount, method: requestData.method },
    );

    this.saveData();
    return payoutRequest;
  }

  getPayoutRequests(filters?: { status?: string; teacherId?: string }) {
    let requests = [...this.data.payoutRequests];

    if (filters?.status && filters.status !== "all") {
      requests = requests.filter((req) => req.status === filters.status);
    }

    if (filters?.teacherId) {
      requests = requests.filter((req) => req.teacherId === filters.teacherId);
    }

    return requests.sort(
      (a, b) =>
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    );
  }

  approvePayoutRequest(requestId: string, adminNotes?: string): boolean {
    const requestIndex = this.data.payoutRequests.findIndex(
      (r) => r.id === requestId,
    );
    if (requestIndex === -1) return false;

    const request = this.data.payoutRequests[requestIndex];
    if (request.status !== "pending") return false;

    // Find teacher and deduct amount from earnings
    const teacherIndex = this.data.teachers.findIndex(
      (t) => t.id === request.teacherId,
    );
    if (teacherIndex === -1) return false;

    const teacher = this.data.teachers[teacherIndex];
    if (teacher.earnings < request.amount) return false;

    // Update request status
    request.status = "approved";
    request.processedAt = new Date().toISOString();
    request.adminNotes = adminNotes;

    // Deduct from teacher earnings
    teacher.earnings -= request.amount;

    // Log activity
    this.logActivity(
      "payout_approved",
      request.teacherId,
      request.teacherName,
      `Payout request of $${request.amount} approved`,
      { amount: request.amount, method: request.method },
    );

    this.saveData();
    return true;
  }

  rejectPayoutRequest(requestId: string, adminNotes?: string): boolean {
    const requestIndex = this.data.payoutRequests.findIndex(
      (r) => r.id === requestId,
    );
    if (requestIndex === -1) return false;

    const request = this.data.payoutRequests[requestIndex];
    if (request.status !== "pending") return false;

    // Update request status
    request.status = "rejected";
    request.processedAt = new Date().toISOString();
    request.adminNotes = adminNotes;

    // Log activity
    this.logActivity(
      "payout_rejected",
      request.teacherId,
      request.teacherName,
      `Payout request of $${request.amount} rejected`,
      { amount: request.amount, method: request.method },
    );

    this.saveData();
    return true;
  }

  markPayoutCompleted(requestId: string): boolean {
    const requestIndex = this.data.payoutRequests.findIndex(
      (r) => r.id === requestId,
    );
    if (requestIndex === -1) return false;

    const request = this.data.payoutRequests[requestIndex];
    if (request.status !== "approved") return false;

    request.status = "completed";
    this.saveData();
    return true;
  }

  getTeacherPayoutStats(teacherId: string) {
    const requests = this.data.payoutRequests.filter(
      (r) => r.teacherId === teacherId,
    );
    const totalRequested = requests.reduce((sum, r) => sum + r.amount, 0);
    const totalApproved = requests
      .filter((r) => r.status === "approved" || r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = requests
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalRequested,
      totalApproved,
      pendingAmount,
      requestCount: requests.length,
      pendingCount: requests.filter((r) => r.status === "pending").length,
    };
  }

  // Create demo payout requests for testing
  createDemoPayoutRequests() {
    const teachers = this.data.teachers.filter((t) => t.status === "approved");
    let created = 0;

    teachers.slice(0, 5).forEach((teacher, index) => {
      if (teacher.earnings && teacher.earnings > 50) {
        const amount =
          index === 0
            ? 75
            : index === 1
              ? 150
              : index === 2
                ? 30
                : index === 3
                  ? 200
                  : 125;
        const method = index % 2 === 0 ? "paypal" : "bank_transfer";

        if (amount >= (method === "paypal" ? 25 : 100)) {
          const payoutRequest = {
            id: `payout_demo_${Date.now()}_${index}`,
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email,
            amount,
            method: method as "paypal" | "bank_transfer",
            status:
              index === 0
                ? "pending"
                : index === 1
                  ? "approved"
                  : index === 2
                    ? "rejected"
                    : ("pending" as const),
            requestedAt: new Date(
              Date.now() - index * 24 * 60 * 60 * 1000,
            ).toISOString(),
            processedAt:
              index !== 0 && index !== 3
                ? new Date(
                    Date.now() - (index - 1) * 12 * 60 * 60 * 1000,
                  ).toISOString()
                : undefined,
            paymentDetails:
              method === "paypal"
                ? { paypalEmail: teacher.email }
                : {
                    bankAccountNumber: "1234567890",
                    bankRoutingNumber: "123456789",
                    bankAccountHolderName: teacher.name,
                    bankName: "Demo Bank",
                  },
            notes: `Demo payout request for ${teacher.name}`,
            adminNotes:
              index === 2 ? "Insufficient verification documents" : undefined,
          };

          this.data.payoutRequests.push(payoutRequest);
          created++;
        }
      }
    });

    this.saveData();
    return created;
  }

  // Wallet Management Methods
  getUserWalletBalance(userId: string): number {
    const user = this.data.users.find((u) => u.id === userId);
    return user?.walletBalance || 0;
  }

  rechargeWallet(
    userId: string,
    amount: number,
    method: "paypal" | "mastercard" | "visa" | "bank_transfer",
    paymentDetails?: any,
  ): boolean {
    const userIndex = this.data.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return false;

    const user = this.data.users[userIndex];

    // Create transaction record
    const transaction = {
      id: this.generateId(),
      userId,
      userName: user.name,
      type: "recharge" as const,
      amount,
      method,
      status: "completed" as const, // In real app, this would be "pending" until payment confirms
      description: `Wallet recharge via ${method}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      paymentDetails,
    };

    // Add to wallet balance
    this.data.users[userIndex].walletBalance += amount;
    this.data.walletTransactions.push(transaction);

    // Log activity
    this.logActivity(
      "wallet_recharge",
      userId,
      user.name,
      `Recharged wallet with $${amount} via ${method}`,
      { amount, method },
    );

    this.saveData();
    return true;
  }

  processLessonPayment(
    userId: string,
    lessonId: string,
    teacherId: string,
    amount: number,
    method: "wallet" | "paypal" | "mastercard" | "visa",
  ): boolean {
    const userIndex = this.data.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return false;

    const user = this.data.users[userIndex];
    const teacher = this.data.teachers.find((t) => t.id === teacherId);

    if (method === "wallet") {
      // Check if user has sufficient balance
      if (user.walletBalance < amount) {
        return false;
      }
      // Deduct from wallet
      this.data.users[userIndex].walletBalance -= amount;
    }

    // Create transaction record
    const transaction = {
      id: this.generateId(),
      userId,
      userName: user.name,
      type: "payment" as const,
      amount,
      method,
      status: "completed" as const,
      description: `Lesson payment to ${teacher?.name || "teacher"}`,
      lessonId,
      teacherId,
      teacherName: teacher?.name || "teacher",
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };

    this.data.walletTransactions.push(transaction);

    // Log activity
    this.logActivity(
      "lesson_payment",
      userId,
      user.name,
      `Paid $${amount} for lesson with ${teacher?.name || "teacher"} via ${method}`,
      { amount, method, teacherId, lessonId },
    );

    this.saveData();
    return true;
  }

  getUserTransactions(userId: string, limit: number = 20): any[] {
    return this.data.walletTransactions
      .filter((t) => t.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }

  getWalletStats(userId: string) {
    const transactions = this.data.walletTransactions.filter(
      (t) => t.userId === userId,
    );
    const recharges = transactions.filter((t) => t.type === "recharge");
    const payments = transactions.filter((t) => t.type === "payment");

    return {
      totalRecharged: recharges.reduce((sum, t) => sum + t.amount, 0),
      totalSpent: payments.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: transactions.length,
      lastTransaction:
        transactions.length > 0 ? transactions[0].createdAt : null,
    };
  }

  // Check if email is available for registration
  isEmailAvailable(email: string): boolean {
    const existingUser = this.data.users.find((u) => u.email === email);
    const existingTeacher = this.data.teachers.find((t) => t.email === email);
    return !existingUser && !existingTeacher;
  }

  checkEmailExists(email: string): boolean {
    const existingUser = this.data.users.find((u) => u.email === email);
    const existingTeacher = this.data.teachers.find((t) => t.email === email);
    return !!(existingUser || existingTeacher);
  }

  // Get account type by email (for debugging/admin purposes)
  getAccountTypeByEmail(email: string): "student" | "teacher" | null {
    const user = this.data.users.find((u) => u.email === email);
    if (user) return "student";

    const teacher = this.data.teachers.find((t) => t.email === email);
    if (teacher) return "teacher";

    return null;
  }

  // Export data
  exportData() {
    return this.data;
  }
}

export const db = new LocalDatabase();
