import { useState } from "react";
import {
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  UserRound,
  ChevronDown,
} from "lucide-react";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [users] = useState([
    {
      id: "USR001",
      name: "Abhay Patel",
      email: "abhay@example.com",
      phone: "+91 98765 43210",
      role: "User",
      status: "Active",
      joined: "20 Sep 2026",
    },
    {
      id: "USR002",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 12345",
      role: "User",
      status: "Active",
      joined: "18 Sep 2026",
    },
    {
      id: "USR003",
      name: "Priya Singh",
      email: "priya@example.com",
      phone: "+91 91234 56789",
      role: "User",
      status: "Active",
      joined: "15 Sep 2026",
    },
    {
      id: "USR004",
      name: "Amit Verma",
      email: "amit@example.com",
      phone: "+91 99887 66554",
      role: "User",
      status: "Inactive",
      joined: "12 Sep 2026",
    },
    {
      id: "USR005",
      name: "Admin",
      email: "admin@ecocare.com",
      phone: "+91 90000 11111",
      role: "Admin",
      status: "Active",
      joined: "01 Sep 2026",
    },
    {
      id: "USR006",
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91 87654 32109",
      role: "User",
      status: "Active",
      joined: "28 Aug 2026",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.phone.toLowerCase().includes(searchText) ||
      user.id.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "All" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-users-page">

      {/* ================= HEADER ================= */}

      <section className="admin-page-header">

        <div>
          <span className="admin-header-label">
            ADMIN PANEL
          </span>

          <h1>Manage Users</h1>

          <p>
            View and manage registered EcoCare users.
          </p>
        </div>

        <div className="admin-total-complaints">
          <Users size={20} />

          <span>
            {filteredUsers.length} Users
          </span>
        </div>

      </section>


      {/* ================= FILTER BAR ================= */}

      <section className="admin-filter-bar">

        <div className="admin-search-box">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search user, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="admin-filter-select">

          <Filter size={18} />

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <option value="All">
              All Roles
            </option>

            <option value="User">
              User
            </option>

            <option value="Admin">
              Admin
            </option>
          </select>

          <ChevronDown size={16} />

        </div>

      </section>


      {/* ================= USERS GRID ================= */}

      <section className="admin-users-grid">

        {filteredUsers.length > 0 ? (

          filteredUsers.map((user) => (

            <article
              className="admin-user-card"
              key={user.id}
            >

              {/* TOP */}

              <div className="admin-user-top">

                <div className="admin-user-avatar">
                  {user.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="admin-user-heading">

                  <h2>{user.name}</h2>

                  <span>
                    #{user.id}
                  </span>

                </div>

                <span
                  className={`admin-user-status ${
                    user.status.toLowerCase()
                  }`}
                >
                  {user.status}
                </span>

              </div>


              {/* ROLE */}

              <div className="admin-user-role">

                {user.role === "Admin" ? (
                  <ShieldCheck size={17} />
                ) : (
                  <UserRound size={17} />
                )}

                <span>
                  {user.role}
                </span>

              </div>


              {/* USER DETAILS */}

              <div className="admin-user-details">

                <div>
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>

                <div>
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>

                <div>
                  <CalendarDays size={16} />
                  <span>
                    Joined {user.joined}
                  </span>
                </div>

              </div>


              {/* FOOTER */}

              <div className="admin-user-card-footer">

                <span>
                  Account
                </span>

                <strong>
                  {user.status}
                </strong>

              </div>

            </article>

          ))

        ) : (

          <div className="admin-no-results">

            <Users size={40} />

            <h3>
              No users found
            </h3>

            <p>
              Try changing your search or role filter.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminUsers;