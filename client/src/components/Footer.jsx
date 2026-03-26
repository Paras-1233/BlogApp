const Footer = () => {
  return (
    <footer className="mt-16 border-t pt-10 pb-6 bg-white/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* BRAND */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              BlogiFy
            </h2>
            <p className="text-sm text-gray-500">
              A calm space for writers and readers. Share your ideas with the world.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">Home</li>
              <li className="hover:text-black cursor-pointer">Blogs</li>
              <li className="hover:text-black cursor-pointer">Dashboard</li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">Help Center</li>
              <li className="hover:text-black cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black cursor-pointer">Terms</li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span className="hover:text-black cursor-pointer">Twitter</span>
              <span className="hover:text-black cursor-pointer">LinkedIn</span>
              <span className="hover:text-black cursor-pointer">GitHub</span>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Digital Curator. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;