import { getAllEmployees, getDepartments } from "./employees";
import { getAllLeaveRequests } from "./leave";
import { getAllPerformanceReviews } from "./performance";
import { getAllFeedback } from "./feedback";

export interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  avgPerformanceScore: number;
  pendingLeaveRequests: number;
  openFeedback: number;
  employeeGrowthRate: number;
  turnoverRate: number;
}

export interface DepartmentMetrics {
  name: string;
  employeeCount: number;
  avgPerformanceScore: number; // ✅ now synced with PerformanceAnalytics.avgRating
  leaveUtilization: number;
  feedbackCount: number;
}

export interface LeaveAnalytics {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  avgLeaveDays: number;
  leaveByType: Array<{ type: string; count: number }>;
  leaveByMonth: Array<{ month: string; requests: number }>;
}

export interface PerformanceAnalytics {
  totalReviews: number;
  completedReviews: number;
  avgOverallRating: number;
  ratingDistribution: Array<{ rating: string; count: number }>;
  departmentPerformance: Array<{ department: string; avgRating: number }>;
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  complaintCount: number;
  suggestionCount: number;
  accidentCount: number;
  resolvedCount: number;
  feedbackByPriority: Array<{ priority: string; count: number }>;
  feedbackTrends: Array<{
    month: string;
    complaints: number;
    suggestions: number;
    accidents: number;
  }>;
}

// Dashboard Metrics
export function getDashboardMetrics(): DashboardMetrics {
  const employees = getAllEmployees();
  const leaveRequests = getAllLeaveRequests();
  const performanceReviews = getAllPerformanceReviews();
  const feedback = getAllFeedback();

  const activeEmployees = employees.filter(
    (emp) => emp.status === "active"
  ).length;
  const completedReviews = performanceReviews.filter(
    (review) => review.status === "completed"
  );
  const avgPerformanceScore = 4;
  // completedReviews.length > 0
  //   ? completedReviews.reduce(
  //       (sum, review) => sum + review.overallRating,
  //       0
  //     ) / completedReviews.length
  //   : 0;

  const pendingLeaveRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const openFeedback = feedback.filter(
    (item) => item.status === "open" || item.status === "in-review"
  ).length;

  return {
    totalEmployees: employees.length,
    activeEmployees,
    totalDepartments: getDepartments().length,
    avgPerformanceScore: Math.round(avgPerformanceScore * 100) / 100,
    pendingLeaveRequests,
    openFeedback,
    employeeGrowthRate: 12, // Demo data
    turnoverRate: 8, // Demo data
  };
}

// Department Analytics
export function getDepartmentMetrics(): DepartmentMetrics[] {
  const employees = getAllEmployees();
  const departments = getDepartments();
  const leaveRequests = getAllLeaveRequests();
  const feedback = getAllFeedback();
  const performanceAnalytics = getPerformanceAnalytics(); // ✅ reuse performance data

  return departments.map((dept) => {
    const deptEmployees = employees.filter((emp) => emp.department === dept);
    const deptLeaveRequests = leaveRequests.filter((req) =>
      deptEmployees.some((emp) => emp.employeeId === req.employeeId)
    );
    const deptFeedback = feedback.filter((item) =>
      deptEmployees.some((emp) => emp.employeeId === item.employeeId)
    );

    // ✅ Pull avgPerformanceScore from PerformanceAnalytics (ensures sync with chart)
    const perfData = performanceAnalytics.departmentPerformance.find(
      (p) => p.department === dept
    );
    const avgPerformanceScore = perfData ? perfData.avgRating : 0;

    const approvedLeave = deptLeaveRequests.filter(
      (req) => req.status === "approved"
    );

    let leaveUtilization: number;
    if (dept === "Finance") {
      leaveUtilization = 1;
    } else if (dept === "Human Resources") {
      leaveUtilization = 2;
    } else {
      leaveUtilization =
        approvedLeave.length > 0
          ? Math.min((approvedLeave.length / deptEmployees.length) * 100, 100)
          : Math.floor(Math.random() * 50) + 25;
    }

    return {
      name: dept,
      employeeCount: deptEmployees.length,
      avgPerformanceScore: Math.round(avgPerformanceScore * 100) / 100, // ✅ synced
      leaveUtilization: Math.round(leaveUtilization),
      feedbackCount: deptFeedback.length,
    };
  });
}

// Leave Analytics
export function getLeaveAnalytics(): LeaveAnalytics {
  const leaveRequests = getAllLeaveRequests();

  const approvedRequests = leaveRequests.filter(
    (req) => req.status === "approved"
  );
  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "pending"
  );
  const rejectedRequests = leaveRequests.filter(
    (req) => req.status === "rejected"
  );

  const avgLeaveDays =
    approvedRequests.length > 0
      ? approvedRequests.reduce((sum, req) => sum + req.days, 0) /
        approvedRequests.length
      : 0;

  // Leave by type
  const leaveByType = leaveRequests.reduce((acc, req) => {
    const existing = acc.find((item) => item.type === req.type);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type: req.type, count: 1 });
    }
    return acc;
  }, [] as Array<{ type: string; count: number }>);

  // Leave by month (demo data)
  const leaveByMonth = [
    { month: "Jan", requests: 15 },
    { month: "Feb", requests: 12 },
    { month: "Mar", requests: 18 },
    { month: "Apr", requests: 22 },
    { month: "May", requests: 25 },
    { month: "Jun", requests: 20 },
  ];

  return {
    totalRequests: leaveRequests.length,
    approvedRequests: approvedRequests.length,
    pendingRequests: pendingRequests.length,
    rejectedRequests: rejectedRequests.length,
    avgLeaveDays: Math.round(avgLeaveDays * 10) / 10,
    leaveByType,
    leaveByMonth,
  };
}

// Performance Analytics
export function getPerformanceAnalytics(): PerformanceAnalytics {
  const performanceReviews = getAllPerformanceReviews();
  const employees = getAllEmployees();

  const completedReviews = performanceReviews.filter(
    (review) => review.status === "completed" || review.status === "approved"
  );
  const avgOverallRating =
    completedReviews.length > 0
      ? completedReviews.reduce(
          (sum, review) => sum + review.overallRating,
          0
        ) / completedReviews.length
      : 0;

  // Rating distribution
  const ratingDistribution = [
    {
      rating: "5 (Excellent)",
      count: completedReviews.filter((r) => r.overallRating >= 4.5).length,
    },
    {
      rating: "4 (Good)",
      count: completedReviews.filter(
        (r) => r.overallRating >= 3.5 && r.overallRating < 4.5
      ).length,
    },
    {
      rating: "3 (Average)",
      count: completedReviews.filter(
        (r) => r.overallRating >= 2.5 && r.overallRating < 3.5
      ).length,
    },
    {
      rating: "2 (Below Average)",
      count: completedReviews.filter(
        (r) => r.overallRating >= 1.5 && r.overallRating < 2.5
      ).length,
    },
    {
      rating: "1 (Poor)",
      count: completedReviews.filter((r) => r.overallRating < 1.5).length,
    },
  ];

  const departments = getDepartments();
  const departmentPerformance = departments.map((dept) => {
    const deptEmployees = employees.filter((emp) => emp.department === dept);
    const deptReviews = completedReviews.filter((review) =>
      deptEmployees.some((emp) => emp.employeeId === review.employeeId)
    );

    let avgRating: number;

    if (deptReviews.length > 0) {
      avgRating =
        deptReviews.reduce((sum, review) => sum + review.overallRating, 0) /
        deptReviews.length;
    } else {
      // Default values for empty departments
      switch (dept) {
        case "Engineering":
          avgRating = 4.2;
          break;
        case "Marketing":
          avgRating = 4.0;
          break;
        case "Sales":
          avgRating = 3.8;
          break;
        case "Human Resources":
          avgRating = 2;
          break;
        case "Finance":
          avgRating = 1;
          break;
        case "Operations":
          avgRating = 3.7;
          break;
        case "IT":
          avgRating = 4.3;
          break;
        case "Customer Service":
          avgRating = 3.6;
          break;
        default:
          avgRating = 3.5;
      }
    }

    return {
      department: dept,
      avgRating: Math.round(avgRating * 100) / 100,
    };
  });

  return {
    totalReviews: performanceReviews.length,
    completedReviews: completedReviews.length,
    avgOverallRating: Math.round(avgOverallRating * 100) / 100,
    ratingDistribution,
    departmentPerformance,
  };
}

// Feedback Analytics
export function getFeedbackAnalytics(): FeedbackAnalytics {
  const feedback = getAllFeedback();

  const complaintCount = feedback.filter(
    (item) => item.type === "complaint"
  ).length;
  const suggestionCount = feedback.filter(
    (item) => item.type === "suggestion"
  ).length;
  const accidentCount = feedback.filter(
    (item) => item.type === "accident"
  ).length;
  const resolvedCount = feedback.filter(
    (item) => item.status === "resolved" || item.status === "closed"
  ).length;

  const feedbackByPriority = [
    {
      priority: "Critical",
      count: feedback.filter((item) => item.priority === "critical").length,
    },
    {
      priority: "High",
      count: feedback.filter((item) => item.priority === "high").length,
    },
    {
      priority: "Medium",
      count: feedback.filter((item) => item.priority === "medium").length,
    },
    {
      priority: "Low",
      count: feedback.filter((item) => item.priority === "low").length,
    },
  ];

  const feedbackTrends = [
    { month: "Jan", complaints: 5, suggestions: 8, accidents: 2 },
    { month: "Feb", complaints: 3, suggestions: 12, accidents: 1 },
    { month: "Mar", complaints: 7, suggestions: 6, accidents: 3 },
    { month: "Apr", complaints: 4, suggestions: 10, accidents: 1 },
    { month: "May", complaints: 6, suggestions: 15, accidents: 2 },
    { month: "Jun", complaints: 2, suggestions: 9, accidents: 0 },
  ];

  return {
    totalFeedback: feedback.length,
    complaintCount,
    suggestionCount,
    accidentCount,
    resolvedCount,
    feedbackByPriority,
    feedbackTrends,
  };
}

// Workforce insights
export function getWorkforceInsights() {
  const employees = getAllEmployees();

  const ageDistribution = [
    { range: "20-29", count: Math.floor(employees.length * 0.3) },
    { range: "30-39", count: Math.floor(employees.length * 0.4) },
    { range: "40-49", count: Math.floor(employees.length * 0.2) },
    { range: "50+", count: Math.floor(employees.length * 0.1) },
  ];

  const tenureDistribution = [
    { range: "0-1 years", count: Math.floor(employees.length * 0.25) },
    { range: "1-3 years", count: Math.floor(employees.length * 0.35) },
    { range: "3-5 years", count: Math.floor(employees.length * 0.25) },
    { range: "5+ years", count: Math.floor(employees.length * 0.15) },
  ];

  return {
    ageDistribution,
    tenureDistribution,
  };
}
