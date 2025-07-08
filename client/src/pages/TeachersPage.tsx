import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Star, Search, Filter, Globe, Clock } from 'lucide-react';

const TeachersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const teachers = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      language: 'Spanish',
      country: 'Spain',
      rating: 4.9,
      reviews: 127,
      price: 25,
      avatar: 'M',
      specialties: ['Conversation', 'Grammar', 'Business'],
      experience: '5 years',
    },
    {
      id: 2,
      name: 'Jean Dupont',
      language: 'French',
      country: 'France',
      rating: 4.8,
      reviews: 89,
      price: 30,
      avatar: 'J',
      specialties: ['Pronunciation', 'Literature', 'Culture'],
      experience: '8 years',
    },
    {
      id: 3,
      name: 'Anna Schmidt',
      language: 'German',
      country: 'Germany',
      rating: 4.9,
      reviews: 156,
      price: 28,
      avatar: 'A',
      specialties: ['Grammar', 'Business', 'Exam Prep'],
      experience: '6 years',
    },
    {
      id: 4,
      name: 'Yuki Tanaka',
      language: 'Japanese',
      country: 'Japan',
      rating: 4.7,
      reviews: 94,
      price: 35,
      avatar: 'Y',
      specialties: ['Conversation', 'Culture', 'Writing'],
      experience: '4 years',
    },
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === '' || teacher.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <MessageCircle className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-primary">TalkCon</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Language Teacher
          </h1>
          <p className="text-gray-600">
            Choose from our qualified native speakers and start learning today
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search teachers or languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Languages</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-semibold mr-4">
                    {teacher.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Globe className="h-4 w-4 mr-1" />
                      {teacher.country}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-primary">{teacher.language}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {teacher.rating} ({teacher.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    {teacher.experience} experience
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {teacher.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${teacher.price}</span>
                    <span className="text-gray-600 text-sm">/hour</span>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Book Lesson
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No teachers found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;