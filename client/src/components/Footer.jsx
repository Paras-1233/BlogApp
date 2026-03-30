import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-10">

          {/* BRAND */}
          <div className="space-y-4">
            <img
              src={logo}
              alt="BlogiFy"
              className="w-40 object-contain"
            />

            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              A calm space for writers and readers. Share your ideas,
              stories, and creativity with the world.
            </p>

            <div className="flex gap-4 text-gray-500">
              <FaTwitter className="hover:text-black hover:scale-110 transition duration-200 cursor-pointer" />
              <FaLinkedin className="hover:text-black hover:scale-110 transition duration-200 cursor-pointer" />
              <FaGithub className="hover:text-black hover:scale-110 transition duration-200 cursor-pointer" />
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-black hover:translate-x-1 transition cursor-pointer">Home</li>
              <li className="hover:text-black hover:translate-x-1 transition cursor-pointer">Blogs</li>
              <li className="hover:text-black hover:translate-x-1 transition cursor-pointer">Dashboard</li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-black hover:translate-x-1 transition cursor-pointer">Help Center</li>
              <li className="hover:text-black hover:translate-x-1 transition cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black hover:translate-x-1 transition cursor-pointer">Terms</li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get latest blogs directly in your inbox.
            </p>

            <div className="flex rounded-lg overflow-hidden border max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 w-full text-sm outline-none"
              />
              <button className="bg-black text-white px-4 text-sm whitespace-nowrap hover:bg-gray-800 transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} BlogiFy. All rights reserved.</p>
          <p className="text-xs">Built with MERN ⚡ by Paras</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;