import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
  const { user } = useAuth();

  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/classrooms", label: "My Classrooms" },
    { to: "/student/results", label: "My Results" },
  ];

  const teacherLinks = [
  { to: "/teacher/dashboard", label: "Dashboard" },
  { to: "/teacher/classrooms", label: "Manage Classrooms" },
  {
    to: "/teacher/assignments/create",
    label: "Create Assignment",
  },
  {
    to: "/teacher/announcements",
    label: "Announcements",
  },
  { to: "/teacher/submissions", label: "Submissions" },
  { to: "/teacher/analytics", label: "Analytics" },
]; 

  const links =
    user?.role === "teacher"
      ? teacherLinks
      : studentLinks;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;