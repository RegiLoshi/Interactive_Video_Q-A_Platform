import { Link } from "react-router";
import useUserStore from "../../stores/userStore.js"
const Navbar = () => {
  const user = useUserStore((state) => state.user);
  return (
    <nav className="bg-[#FEFEFE] w-full flex justify-between items-center py-4 px-6 shadow-sm">
      <span className="text-[#585D67] font-medium text-lg cursor-default">SurveyHub</span>

      <div className="flex items-center">
        <Link to={`/user/${user.user_id}/settings`} className="w-10 h-10 rounded-full overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                  {user.name.charAt(0)}{user.last_name.charAt(0)}
              </span>
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar;