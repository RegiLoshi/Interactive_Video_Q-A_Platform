const Navbar = () => {
  return (
    <nav className="bg-[#FEFEFE] w-full flex justify-between items-center py-4 px-6 shadow-sm">
      <span className="text-[#585D67] font-medium text-lg cursor-default">Video Q&A</span>

      <ul className="flex justfiy-between items-center space-x-4">
        <li className="text-[#585D67] hover:text-[#101726] cursor-pointer">Dashboard</li>
        <li className="text-[#585D67] hover:text-[#101726] cursor-pointer">My Questions</li>
        <li className="text-[#585D67] hover:text-[#101726] cursor-pointer">Explore</li>
      </ul>

      <div className="flex items-center space-x-4">
        <button className="border px-4 py-2 bg-[#101726] rounded-lg text-white hover:bg-[#1c2a43] transition-colors cursor-pointer">
          Create a Question
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            className="w-full h-full object-cover  cursor-pointer"
            src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="profile picture" 
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar;