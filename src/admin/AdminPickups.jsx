import { useState } from "react";
import {
  Search,
  Filter,
  Truck,
  MapPin,
  CalendarDays,
  Clock,
  ChevronDown,
} from "lucide-react";

function AdminPickups() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [pickups, setPickups] = useState([
    {
      id: "PK204",
      user: "Rahul Sharma",
      wasteType: "Wet Waste",
      quantity: "5 kg",
      address: "Arya Nagar, Kanpur",
      date: "30 Sep 2026",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: "PK203",
      user: "Priya Singh",
      wasteType: "Dry Waste",
      quantity: "8 kg",
      address: "Mall Road, Kanpur",
      date: "30 Sep 2026",
      time: "12:30 PM",
      status: "Scheduled",
    },
    {
      id: "PK202",
      user: "Amit Verma",
      wasteType: "E-Waste",
      quantity: "3 kg",
      address: "Kakadeo, Kanpur",
      date: "29 Sep 2026",
      time: "04:00 PM",
      status: "Completed",
    },
    {
      id: "PK201",
      user: "Neha Gupta",
      wasteType: "Plastic Waste",
      quantity: "6 kg",
      address: "Swaroop Nagar, Kanpur",
      date: "29 Sep 2026",
      time: "11:00 AM",
      status: "Scheduled",
    },
    {
      id: "PK200",
      user: "Rohit Kumar",
      wasteType: "Mixed Waste",
      quantity: "10 kg",
      address: "Civil Lines, Kanpur",
      date: "28 Sep 2026",
      time: "02:00 PM",
      status: "Completed",
    },
    {
      id: "PK199",
      user: "Anjali Singh",
      wasteType: "Dry Waste",
      quantity: "4 kg",
      address: "Kidwai Nagar, Kanpur",
      date: "28 Sep 2026",
      time: "09:30 AM",
      status: "Pending",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setPickups((prev) =>
      prev.map((pickup) =>
        pickup.id === id
          ? {
              ...pickup,
              status: newStatus,
            }
          : pickup
      )
    );
  };

  const filteredPickups = pickups.filter((pickup) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      pickup.id.toLowerCase().includes(searchText) ||
      pickup.user.toLowerCase().includes(searchText) ||
      pickup.wasteType.toLowerCase().includes(searchText) ||
      pickup.address.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      pickup.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "admin-status completed";
    }

    if (status === "Scheduled") {
      return "admin-status scheduled";
    }

    return "admin-status pending";
  };

  return (
    <div className="admin-pickups-page">

      {/* ================= HEADER ================= */}

      <section className="admin-page-header">

        <div>
          <span className="admin-header-label">
            ADMIN PANEL
          </span>

          <h1>Pickup Requests</h1>

          <p>
            Manage and monitor waste pickup requests.
          </p>
        </div>

        <div className="admin-total-complaints">
          <Truck size={20} />

          <span>
            {filteredPickups.length} Requests
          </span>
        </div>

      </section>


      {/* ================= FILTER BAR ================= */}

      <section className="admin-filter-bar">

        <div className="admin-search-box">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search request, user or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="admin-filter-select">

          <Filter size={18} />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

          <ChevronDown size={16} />

        </div>

      </section>


      {/* ================= PICKUP GRID ================= */}

      <section className="admin-pickups-grid">

        {filteredPickups.length > 0 ? (

          filteredPickups.map((pickup) => (

            <article
              className="admin-pickup-card"
              key={pickup.id}
            >

              {/* TOP */}

              <div className="admin-pickup-card-top">

                <div className="admin-pickup-big-icon">
                  <Truck size={23} />
                </div>

                <div className="admin-pickup-id">
                  #{pickup.id}
                </div>

                <span
                  className={getStatusClass(
                    pickup.status
                  )}
                >
                  {pickup.status}
                </span>

              </div>


              {/* USER */}

              <div className="admin-pickup-user">

                <h2>{pickup.user}</h2>

                <span>
                  {pickup.wasteType}
                </span>

              </div>


              {/* QUANTITY */}

              <div className="admin-pickup-quantity">

                <span>Waste Quantity</span>

                <strong>
                  {pickup.quantity}
                </strong>

              </div>


              {/* DETAILS */}

              <div className="admin-pickup-details">

                <div>
                  <MapPin size={16} />
                  <span>{pickup.address}</span>
                </div>

                <div>
                  <CalendarDays size={16} />
                  <span>{pickup.date}</span>
                </div>

                <div>
                  <Clock size={16} />
                  <span>{pickup.time}</span>
                </div>

              </div>


              {/* UPDATE */}

              <div className="admin-pickup-card-bottom">

                <span>
                  Update Status
                </span>

                <select
                  value={pickup.status}
                  onChange={(e) =>
                    updateStatus(
                      pickup.id,
                      e.target.value
                    )
                  }
                  className="admin-status-select"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

            </article>

          ))

        ) : (

          <div className="admin-no-results">

            <Truck size={40} />

            <h3>
              No pickup requests found
            </h3>

            <p>
              Try changing your search or filter.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminPickups;