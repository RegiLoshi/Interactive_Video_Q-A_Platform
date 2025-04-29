import { Link } from "react-router-dom";
import useUserStore from "../../stores/userStore.js";
import { HiCog, HiLogout, HiShieldCheck } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#FEFEFE] w-full flex justify-between items-center py-4 px-6 shadow-sm">
      <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="text-[#585D67] font-medium text-lg hover:text-blue-600 transition-colors">
        SurveyHub
      </Link>

      <div className="flex items-center relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user?.name?.charAt(0)}{user?.last_name?.charAt(0)}
            </span>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setDropdownOpen(false)}
              >
                <HiShieldCheck className="mr-2 h-5 w-5 text-blue-500" />
                Admin Dashboard
              </Link>
            )}
            <Link
              to={`/user/${user?.user_id}/settings`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setDropdownOpen(false)}
            >
              <HiCog className="mr-2 h-5 w-5 text-gray-500" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <HiLogout className="mr-2 h-5 w-5 text-red-500" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;