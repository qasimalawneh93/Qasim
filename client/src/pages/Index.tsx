import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/ui/hero-section";
import { FeatureSection } from "@/components/ui/feature-section";
import { TeacherCard } from "@/components/ui/teacher-card";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  ArrowRight,
  CheckCircle,
  Quote,
  Globe,
  MessageCircle,
  Video,
} from "lucide-react";
import { Teacher } from "@shared/api";
import { db } from "@/lib/database";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from 'react-helmet';

const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "I went from zero Spanish to conversational in just 6 months! Maria is an amazing teacher who made every lesson engaging and fun.",
    language: "Spanish",
    flag: "🇪🇸",
  },
  {
    name: "David Chen",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "The flexibility of scheduling and quality of teachers is unmatched. I can finally speak confident English in business meetings.",
    language: "English",
    flag: "🇺���",
  },
  {
    name: "Emma Thompson",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "Learning French has never been this enjoyable. The interactive lessons and cultural insights make all the difference.",
    language: "French",
    flag: "🇫🇷",
  },
];

export default function Index() {
  const { t } = useLanguage();
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTeachers();
  }, []);

  useEffect(() => {
    // Filter teachers when language selection changes
    filterTeachersByLanguage(selectedLanguage);
  }, [selectedLanguage, allTeachers]);

  const fetchFeaturedTeachers = async () => {
    try {
      // Get approved teachers from database
      const approvedTeachers = db.getTeachers();
      console.log(
        "Approved teachers loaded for homepage:",
        approvedTeachers.length,
      );

      // Log teacher details to verify application data is present
      approvedTeachers.forEach((teacher) => {
        console.log(
          `Teacher: ${teacher.name}, Languages: ${teacher.languages.join(", ")}, Price: $${teacher.price}, Specialties: ${teacher.specialties.join(", ")}`,
        );
      });

      // Sort by rating
      const sortedTeachers = approvedTeachers.sort(
        (a, b) => b.rating - a.rating,
      );

      setAllTeachers(sortedTeachers);
      // Initially show English teachers
      filterTeachersByLanguage("English", sortedTeachers);
    } catch (error) {
      console.error("Error fetching featured teachers:", error);
      setFeaturedTeachers([]);
      setAllTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachersByLanguage = (
    language: string,
    teachers = allTeachers,
  ) => {
    // Filter teachers by the language they teach
    const filtered = teachers
      .filter((teacher) =>
        teacher.languages.some(
          (lang) =>
            lang.toLowerCase().includes(language.toLowerCase()) ||
            teacher.nativeLanguage.toLowerCase() === language.toLowerCase(),
        ),
      )
      .slice(0, 6); // Show max 6 teachers

    setFeaturedTeachers(filtered);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

        <Helmet>
            <title>Index | Talkcon</title>
            <meta name="description" content="Welcome to Talkcon - connect with language teachers around the world." />
        </Helmet>
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        selectedTeacherLanguage={selectedLanguage}
        onLanguageSelect={handleLanguageSelect}
      />

      {/* Featured Teachers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 bg-primary/10 text-primary border-primary/20"
            >
              {selectedLanguage} Teachers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learn <span className="text-primary">{selectedLanguage}</span>{" "}
              with expert teachers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {featuredTeachers.length > 0
                ? `Showing ${featuredTeachers.length} certified ${selectedLanguage} teachers with excellent reviews.`
                : `No ${selectedLanguage} teachers available at the moment. Try selecting a different language.`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-64 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to={`/teachers?language=${selectedLanguage.toLowerCase()}`}>
                View All {selectedLanguage} Teachers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What our students say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of happy learners from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <span className="mr-1">{testimonial.flag}</span>
                        Learning {testimonial.language}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to start your
              <br />
              <span className="text-primary">language journey?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join over 10 million learners and start speaking a new language
              today. First lesson is just $1!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="px-8" asChild>
                <Link to="/teachers">
                  <Globe className="w-4 h-4 mr-2" />
                  Find Your Teacher
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Try Free Lesson
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No subscription required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Pay per lesson
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Money-back guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
