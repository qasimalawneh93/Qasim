import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, Globe, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-primary">TalkCon</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/teachers"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Find Teachers
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Learn Languages with
            <span className="text-primary block">Native Speakers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with qualified language teachers from around the world. 
            Practice conversation, improve your skills, and achieve fluency 
            through personalized one-on-one lessons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Learning Today
            </Link>
            <Link
              to="/teachers"
              className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Browse Teachers
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TalkCon?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the most effective way to learn languages through 
              personalized conversation practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Native Speakers</h3>
              <p className="text-gray-600">
                Learn from qualified native speakers who understand the nuances 
                and cultural context of their language.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Community</h3>
              <p className="text-gray-600">
                Connect with teachers and students from around the world. 
                Practice with diverse accents and dialects.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Learning</h3>
              <p className="text-gray-600">
                Customized lessons tailored to your level, goals, and learning 
                style for maximum progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their language 
            skills with TalkCon.
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <MessageCircle className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold">TalkCon</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 TalkCon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;