import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { TeacherCard } from "@/components/ui/teacher-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Globe,
  Clock,
  Users,
} from "lucide-react";
import { Teacher, SearchFilters } from "@shared/api";
import { db } from "@/lib/database";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/ui/footer";
import { Helmet } from 'react-helmet';

// Constants for filters

const languages = [
  "All Languages",
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
  "Russian",
];

const specialties = [
  "Conversation",
  "Business",
  "Grammar",
  "Pronunciation",
  "Test Preparation",
  "Academic",
  "Travel",
  "Kids & Teens",
];

const countries = [
  "All Countries",
  "United States",
  "United Kingdom",
  "Spain",
  "France",
  "Germany",
  "Italy",
  "China",
  "Japan",
  "Brazil",
];

export default function Teachers() {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    language: "",
    priceMin: 5,
    priceMax: 100,
    rating: 0,
    country: "",
  });
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, [filters, sortBy, searchQuery]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Get approved teachers from database
      let approvedTeachers = db.getTeachers({ search: searchQuery });

      // Apply filters
      if (filters.language && filters.language !== "all-languages") {
        approvedTeachers = approvedTeachers.filter((teacher) =>
          teacher.languages.includes(filters.language!),
        );
      }

      if (filters.priceMin) {
        approvedTeachers = approvedTeachers.filter(
          (teacher) => teacher.price >= filters.priceMin!,
        );
      }

      if (filters.priceMax) {
        approvedTeachers = approvedTeachers.filter(
          (teacher) => teacher.price <= filters.priceMax!,
        );
      }

      if (filters.rating) {
        approvedTeachers = approvedTeachers.filter(
          (teacher) => teacher.rating >= filters.rating!,
        );
      }

      if (filters.country) {
        approvedTeachers = approvedTeachers.filter(
          (teacher) => teacher.country === filters.country,
        );
      }

      // Sort teachers
      if (sortBy === "rating") {
        approvedTeachers.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === "price-low") {
        approvedTeachers.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        approvedTeachers.sort((a, b) => b.price - a.price);
      } else if (sortBy === "reviews") {
        approvedTeachers.sort((a, b) => b.reviewCount - a.reviewCount);
      }

      setTeachers(approvedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Teachers are already filtered and sorted in fetchTeachers

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Language</h3>
        <Select
          value={filters.language}
          onValueChange={(value) => handleFilterChange("language", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem
                key={lang}
                value={lang.toLowerCase().replace(" ", "-")}
              >
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={[filters.priceMin || 5, filters.priceMax || 100]}
            onValueChange={([min, max]) => {
              handleFilterChange("priceMin", min);
              handleFilterChange("priceMax", max);
            }}
            max={100}
            min={5}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceMin}</span>
            <span>${filters.priceMax}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) =>
                  handleFilterChange("rating", checked ? rating : 0)
                }
              />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm flex items-center"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                {rating} & up
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Country</h3>
        <Select
          value={filters.country}
          onValueChange={(value) => handleFilterChange("country", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem
                key={country}
                value={country.toLowerCase().replace(" ", "-")}
              >
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Specialties</h3>
        <div className="space-y-2">
          {specialties.slice(0, 5).map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox id={specialty} />
              <label htmlFor={specialty} className="text-sm">
                {specialty}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setFilters({
            language: "",
            priceMin: 5,
            priceMax: 100,
            rating: 0,
            country: "",
          });
        }}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );

        <Helmet>
            <title>Teachers | Talkcon</title>
            <meta name="description" content="Explore top-rated language teachers and find your perfect match." />
        </Helmet>
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("teacher.findTeachers")}
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose from {teachers.length} verified teachers worldwide
          </p>
        </div>

        {/* Search and Sort */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filter Teachers</SheetTitle>
                      <SheetDescription>
                        Narrow down your search to find the perfect teacher
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterPanel />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <h2 className="font-semibold">Filters</h2>
                </div>
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          {/* Teachers Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-muted-foreground">
                Showing {teachers.length} teachers
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Globe className="w-3 h-3 mr-1" />
                  {new Set(teachers.map((t) => t.country)).size} countries
                </Badge>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {languages.length - 1} languages
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-48 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : teachers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No teachers found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({
                        language: "",
                        priceMin: 5,
                        priceMax: 100,
                        rating: 0,
                        country: "",
                      });
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {teachers.length > 0 && teachers.length >= 10 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Teachers
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
