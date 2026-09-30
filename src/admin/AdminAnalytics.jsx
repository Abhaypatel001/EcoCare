import {
  BarChart3,
  FileWarning,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Recycle,
} from "lucide-react";

function AdminAnalytics() {
  const monthlyData = [
    { month: "Apr", complaints: 32, resolved: 24 },
    { month: "May", complaints: 41, resolved: 30 },
    { month: "Jun", complaints: 48, resolved: 36 },
    { month: "Jul", complaints: 55, resolved: 42 },
    { month: "Aug", complaints: 62, resolved: 48 },
    { month: "Sep", complaints: 72, resolved: 58 },
  ];

  const wasteData = [
    {
      type: "Wet Waste",
      value: 38,
      className: "wet",
    },
    {
      type: "Dry Waste",
      value: 27,
      className: "dry",
    },
    {
      type: "Plastic Waste",
      value: 20,
      className: "plastic",
    },
    {
      type: "E-Waste",
      value: 15,
      className: "ewaste",
    },
  ];

  const maxComplaints = Math.max(
    ...monthlyData.map((item) => item.complaints)
  );

  return (
    <div className="admin-analytics-page">

      {/* ================= HEADER ================= */}

      <section className="admin-page-header">

        <div>
          <span className="admin-header-label">
            ADMIN PANEL
          </span>

          <h1>Analytics</h1>

          <p>
            Track waste management performance and system
            activity.
          </p>
        </div>

        <div className="admin-total-complaints">
          <BarChart3 size={20} />
          <span>System Analytics</span>
        </div>

      </section>


      {/* ================= OVERVIEW ================= */}

      <section className="analytics-overview">

        <div className="analytics-overview-card">

          <div className="analytics-icon green">
            <FileWarning size={22} />
          </div>

          <div>
            <span>Total Complaints</span>
            <strong>248</strong>
            <small>
              <TrendingUp size={13} />
              12% this month
            </small>
          </div>

        </div>


        <div className="analytics-overview-card">

          <div className="analytics-icon blue">
            <Truck size={22} />
          </div>

          <div>
            <span>Total Pickups</span>
            <strong>186</strong>
            <small>
              <TrendingUp size={13} />
              8% this month
            </small>
          </div>

        </div>


        <div className="analytics-overview-card">

          <div className="analytics-icon purple">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Resolved Complaints</span>
            <strong>102</strong>
            <small>
              <TrendingUp size={13} />
              15% this month
            </small>
          </div>

        </div>


        <div className="analytics-overview-card">

          <div className="analytics-icon orange">
            <Recycle size={22} />
          </div>

          <div>
            <span>Waste Collected</span>
            <strong>1.8K kg</strong>
            <small>
              <TrendingUp size={13} />
              10% this month
            </small>
          </div>

        </div>

      </section>


      {/* ================= MAIN ANALYTICS ================= */}

      <section className="analytics-main-grid">


        {/* COMPLAINT CHART */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>Complaints Overview</h2>
              <p>
                Monthly complaints and resolved cases
              </p>
            </div>

            <div className="analytics-legend">

              <span>
                <i className="legend complaints"></i>
                Complaints
              </span>

              <span>
                <i className="legend resolved"></i>
                Resolved
              </span>

            </div>

          </div>


          <div className="analytics-chart">

            {monthlyData.map((item) => (

              <div
                className="chart-column"
                key={item.month}
              >

                <div className="chart-bars">

                  <div
                    className="chart-bar complaints-bar"
                    style={{
                      height: `${
                        (item.complaints /
                          maxComplaints) *
                        100
                      }%`,
                    }}
                    title={`${item.complaints} complaints`}
                  ></div>

                  <div
                    className="chart-bar resolved-bar"
                    style={{
                      height: `${
                        (item.resolved /
                          maxComplaints) *
                        100
                      }%`,
                    }}
                    title={`${item.resolved} resolved`}
                  ></div>

                </div>

                <span>{item.month}</span>

              </div>

            ))}

          </div>

        </div>


        {/* STATUS SUMMARY */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>Complaint Status</h2>
              <p>Current complaint distribution</p>
            </div>

          </div>


          <div className="status-summary">

            <div className="status-summary-item">

              <div className="status-summary-left">
                <span className="status-dot pending-dot"></span>

                <div>
                  <strong>Pending</strong>
                  <small>64 complaints</small>
                </div>
              </div>

              <strong>26%</strong>

            </div>


            <div className="status-summary-item">

              <div className="status-summary-left">
                <span className="status-dot progress-dot"></span>

                <div>
                  <strong>In Progress</strong>
                  <small>82 complaints</small>
                </div>
              </div>

              <strong>33%</strong>

            </div>


            <div className="status-summary-item">

              <div className="status-summary-left">
                <span className="status-dot resolved-dot"></span>

                <div>
                  <strong>Resolved</strong>
                  <small>102 complaints</small>
                </div>
              </div>

              <strong>41%</strong>

            </div>

          </div>


          <div className="resolution-box">

            <CheckCircle size={21} />

            <div>
              <strong>41%</strong>
              <span>Resolution Rate</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= LOWER SECTION ================= */}

      <section className="analytics-lower-grid">


        {/* WASTE TYPE */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>Waste Type Distribution</h2>
              <p>
                Percentage of collected waste
              </p>
            </div>

          </div>


          <div className="waste-list">

            {wasteData.map((item) => (

              <div
                className="waste-item"
                key={item.type}
              >

                <div className="waste-item-header">

                  <span>{item.type}</span>

                  <strong>
                    {item.value}%
                  </strong>

                </div>

                <div className="waste-progress">

                  <div
                    className={`waste-progress-fill ${item.className}`}
                    style={{
                      width: `${item.value}%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* PERFORMANCE */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>System Performance</h2>
              <p>
                Current operational summary
              </p>
            </div>

          </div>


          <div className="performance-list">

            <div className="performance-item">

              <div className="performance-icon green">
                <CheckCircle size={19} />
              </div>

              <div>
                <span>Pickup Completion</span>
                <strong>91%</strong>
              </div>

            </div>


            <div className="performance-item">

              <div className="performance-icon blue">
                <Truck size={19} />
              </div>

              <div>
                <span>On-Time Pickups</span>
                <strong>87%</strong>
              </div>

            </div>


            <div className="performance-item">

              <div className="performance-icon orange">
                <Clock size={19} />
              </div>

              <div>
                <span>Avg. Response Time</span>
                <strong>4.2 hrs</strong>
              </div>

            </div>


            <div className="performance-item">

              <div className="performance-icon purple">
                <AlertCircle size={19} />
              </div>

              <div>
                <span>Active Complaints</span>
                <strong>146</strong>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminAnalytics;