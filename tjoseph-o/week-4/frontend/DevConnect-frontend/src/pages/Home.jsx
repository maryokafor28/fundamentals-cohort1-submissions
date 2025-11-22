import { Link } from 'react-router-dom';
import { FaCode, FaUsers, FaRocket, FaComments } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to DevConnect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              A platform where developers collaborate, share ideas, and build amazing projects together
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
              <Link to="/projects" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why DevConnect?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCode className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Projects</h3>
              <p className="text-gray-600">
                Showcase your projects and get feedback from the developer community
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Connect with other developers and work together on exciting projects
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaComments className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Feedback</h3>
              <p className="text-gray-600">
                Receive constructive feedback and improve your development skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaRocket className="mx-auto text-primary-600 mb-6" size={48} />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers sharing their projects and collaborating
          </p>
          <Link to="/signup" className="btn-primary text-lg px-8 py-3">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;