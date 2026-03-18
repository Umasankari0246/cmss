import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { destroyUserSession } from '../auth/sessionController';
import { cmsRoles, getValidRole, roleMenuGroups } from '../data/roleConfig';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRealAnalyticsData, getAnalyticsData, insertSampleAnalyticsData } from '../services/analyticsService';

// Fetch real analytics data from MongoDB
const fetchRealAnalytics = async () => {
  try {
    console.log('Fetching real analytics from MongoDB...');
    const data = await getRealAnalyticsData();
    if (data) {
      console.log('Real analytics data loaded:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch real analytics:', error);
    return null;
  }
};

// Icons
const Ico = {
  Calendar: () => <span style={{fontSize: '15px'}}>📅</span>,
  Download: () => <span style={{fontSize: '15px'}}>⬇️</span>,
};

// Constants
const YEAR_RANGES = [
  { label: '2023-2027', start: '2023', end: '2027' },
  { label: '2024-2028', start: '2024', end: '2028' },
  { label: '2025-2029', start: '2025', end: '2029' }
];
const SEMESTER_OPTS = ['Semester 4 (Current)','Semester 3','Semester 2','Semester 1'];
const DEPT_OPTS = ['All Departments','Computer Science','Physics','Mathematics','Electronics','Mechanical'];

// Helper functions
function myToKey(year){return parseInt(year);}
function keyToYear(k){return k.toString();}
function myLabel(year){return year;}

// Year and semester-specific static data
function getYearSemesterSpecificStaticData(year, semester) {
  const yearData = {
    '2027': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2027', attendance: 85, target: 90},
          {year: '2027', attendance: 87, target: 90},
          {year: '2027', attendance: 86, target: 90},
        ],
        performanceData: [
          {year: '2027', passRate: 88, avgMarks: 78},
          {year: '2027', passRate: 90, avgMarks: 82},
          {year: '2027', passRate: 85, avgMarks: 80},
        ],
        departmentData: [
          {name: 'Computer Science', students: 680, faculty: 82, avgAttendance: 86, cgpa: 8.4},
          {name: 'Physics', students: 420, faculty: 68, avgAttendance: 82, cgpa: 7.9},
          {name: 'Mathematics', students: 390, faculty: 58, avgAttendance: 80, cgpa: 8.1},
          {name: 'Electronics', students: 580, faculty: 94, avgAttendance: 85, cgpa: 8.2},
          {name: 'Mechanical', students: 510, faculty: 86, avgAttendance: 81, cgpa: 7.8},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 120, color: '#22c55e'},
          {grade: 'A', count: 280, color: '#3b82f6'},
          {grade: 'B+', count: 200, color: '#06b6d4'},
          {grade: 'B', count: 150, color: '#8b5cf6'},
          {grade: 'C', count: 80, color: '#f59e0b'},
          {grade: 'F', count: 30, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,690',
          faculty: '400',
          departments: '5',
          courses: '48',
          income: 4100000,
          expense: 2300000,
          scholarships: 140
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2027', attendance: 83, target: 90},
          {year: '2027', attendance: 85, target: 90},
          {year: '2027', attendance: 84, target: 90},
        ],
        performanceData: [
          {year: '2027', passRate: 86, avgMarks: 76},
          {year: '2027', passRate: 88, avgMarks: 80},
          {year: '2027', passRate: 83, avgMarks: 78},
        ],
        departmentData: [
          {name: 'Computer Science', students: 650, faculty: 80, avgAttendance: 84, cgpa: 8.3},
          {name: 'Physics', students: 410, faculty: 66, avgAttendance: 80, cgpa: 7.8},
          {name: 'Mathematics', students: 380, faculty: 56, avgAttendance: 78, cgpa: 8.0},
          {name: 'Electronics', students: 560, faculty: 92, avgAttendance: 83, cgpa: 8.1},
          {name: 'Mechanical', students: 500, faculty: 84, avgAttendance: 79, cgpa: 7.7},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 100, color: '#22c55e'},
          {grade: 'A', count: 260, color: '#3b82f6'},
          {grade: 'B+', count: 180, color: '#06b6d4'},
          {grade: 'B', count: 140, color: '#8b5cf6'},
          {grade: 'C', count: 70, color: '#f59e0b'},
          {grade: 'F', count: 40, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,550',
          faculty: '390',
          departments: '5',
          courses: '46',
          income: 3900000,
          expense: 2100000,
          scholarships: 130
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2027', attendance: 81, target: 90},
          {year: '2027', attendance: 83, target: 90},
          {year: '2027', attendance: 82, target: 90},
        ],
        performanceData: [
          {year: '2027', passRate: 84, avgMarks: 74},
          {year: '2027', passRate: 86, avgMarks: 78},
          {year: '2027', passRate: 83, avgMarks: 76},
        ],
        departmentData: [
          {name: 'Computer Science', students: 620, faculty: 78, avgAttendance: 82, cgpa: 8.2},
          {name: 'Physics', students: 400, faculty: 64, avgAttendance: 78, cgpa: 7.7},
          {name: 'Mathematics', students: 370, faculty: 54, avgAttendance: 76, cgpa: 7.9},
          {name: 'Electronics', students: 540, faculty: 90, avgAttendance: 81, cgpa: 8.0},
          {name: 'Mechanical', students: 490, faculty: 82, avgAttendance: 77, cgpa: 7.6},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 80, color: '#22c55e'},
          {grade: 'A', count: 240, color: '#3b82f6'},
          {grade: 'B+', count: 160, color: '#06b6d4'},
          {grade: 'B', count: 130, color: '#8b5cf6'},
          {grade: 'C', count: 60, color: '#f59e0b'},
          {grade: 'F', count: 50, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,410',
          faculty: '380',
          departments: '5',
          courses: '44',
          income: 3700000,
          expense: 1900000,
          scholarships: '120'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2027', attendance: 79, target: 90},
          {year: '2027', attendance: 81, target: 90},
          {year: '2027', attendance: 80, target: 90},
        ],
        performanceData: [
          {year: '2027', passRate: 82, avgMarks: 72},
          {year: '2027', passRate: 84, avgMarks: 74},
          {year: '2027', passRate: 81, avgMarks: 74},
        ],
        departmentData: [
          {name: 'Computer Science', students: 590, faculty: 76, avgAttendance: 80, cgpa: 8.1},
          {name: 'Physics', students: 380, faculty: 62, avgAttendance: 76, cgpa: 7.5},
          {name: 'Mathematics', students: 350, faculty: 52, avgAttendance: 74, cgpa: 7.7},
          {name: 'Electronics', students: 520, faculty: 88, avgAttendance: 79, cgpa: 7.9},
          {name: 'Mechanical', students: 470, faculty: 80, avgAttendance: 75, cgpa: 7.5},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 60, color: '#22c55e'},
          {grade: 'A', count: 220, color: '#3b82f6'},
          {grade: 'B+', count: 120, color: '#06b6d4'},
          {grade: 'B', count: 110, color: '#8b5cf6'},
          {grade: 'C', count: 40, color: '#f59e0b'},
          {grade: 'F', count: 70, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,270',
          faculty: '370',
          departments: '5',
          courses: '42',
          income: 3300000,
          expense: 1700000,
          scholarships: '110'
        }
      }
    },
    '2026': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2026', attendance: 82, target: 90},
          {year: '2026', attendance: 84, target: 90},
          {year: '2026', attendance: 83, target: 90},
        ],
        performanceData: [
          {year: '2026', passRate: 85, avgMarks: 75},
          {year: '2026', passRate: 87, avgMarks: 79},
          {year: '2026', passRate: 82, avgMarks: 77},
        ],
        departmentData: [
          {name: 'Computer Science', students: 650, faculty: 78, avgAttendance: 83, cgpa: 8.2},
          {name: 'Physics', students: 400, faculty: 65, avgAttendance: 79, cgpa: 7.8},
          {name: 'Mathematics', students: 380, faculty: 55, avgAttendance: 77, cgpa: 8.0},
          {name: 'Electronics', students: 560, faculty: 92, avgAttendance: 84, cgpa: 8.1},
          {name: 'Mechanical', students: 490, faculty: 84, avgAttendance: 80, cgpa: 7.7},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 110, color: '#22c55e'},
          {grade: 'A', count: 270, color: '#3b82f6'},
          {grade: 'B+', count: 190, color: '#06b6d4'},
          {grade: 'B', count: 140, color: '#8b5cf6'},
          {grade: 'C', count: 70, color: '#f59e0b'},
          {grade: 'F', count: 35, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,580',
          faculty: '390',
          departments: '5',
          courses: '46',
          income: 3900000,
          expense: 2100000,
          scholarships: 130
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2026', attendance: 80, target: 90},
          {year: '2026', attendance: 82, target: 90},
          {year: '2026', attendance: 81, target: 90},
        ],
        performanceData: [
          {year: '2026', passRate: 83, avgMarks: 73},
          {year: '2026', passRate: 85, avgMarks: 77},
          {year: '2026', passRate: 80, avgMarks: 75},
        ],
        departmentData: [
          {name: 'Computer Science', students: 620, faculty: 76, avgAttendance: 81, cgpa: 8.1},
          {name: 'Physics', students: 390, faculty: 63, avgAttendance: 77, cgpa: 7.7},
          {name: 'Mathematics', students: 370, faculty: 53, avgAttendance: 75, cgpa: 7.9},
          {name: 'Electronics', students: 540, faculty: 90, avgAttendance: 82, cgpa: 8.0},
          {name: 'Mechanical', students: 480, faculty: 82, avgAttendance: 78, cgpa: 7.6},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 90, color: '#22c55e'},
          {grade: 'A', count: 250, color: '#3b82f6'},
          {grade: 'B+', count: 170, color: '#06b6d4'},
          {grade: 'B', count: 130, color: '#8b5cf6'},
          {grade: 'C', count: 60, color: '#f59e0b'},
          {grade: 'F', count: 45, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,450',
          faculty: '380',
          departments: '5',
          courses: '44',
          income: 3700000,
          expense: 1900000,
          scholarships: '120'
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2026', attendance: 78, target: 90},
          {year: '2026', attendance: 80, target: 90},
          {year: '2026', attendance: 79, target: 90},
        ],
        performanceData: [
          {year: '2026', passRate: 81, avgMarks: 71},
          {year: '2026', passRate: 83, avgMarks: 75},
          {year: '2026', passRate: 78, avgMarks: 73},
        ],
        departmentData: [
          {name: 'Computer Science', students: 590, faculty: 74, avgAttendance: 79, cgpa: 8.0},
          {name: 'Physics', students: 380, faculty: 61, avgAttendance: 75, cgpa: 7.6},
          {name: 'Mathematics', students: 360, faculty: 51, avgAttendance: 73, cgpa: 7.8},
          {name: 'Electronics', students: 520, faculty: 88, avgAttendance: 80, cgpa: 7.9},
          {name: 'Mechanical', students: 470, faculty: 80, avgAttendance: 76, cgpa: 7.5},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 70, color: '#22c55e'},
          {grade: 'A', count: 230, color: '#3b82f6'},
          {grade: 'B+', count: 150, color: '#06b6d4'},
          {grade: 'B', count: 120, color: '#8b5cf6'},
          {grade: 'C', count: 50, color: '#f59e0b'},
          {grade: 'F', count: 55, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,310',
          faculty: '370',
          departments: '5',
          courses: '42',
          income: 3500000,
          expense: 1700000,
          scholarships: '110'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2026', attendance: 76, target: 90},
          {year: '2026', attendance: 78, target: 90},
          {year: '2026', attendance: 77, target: 90},
        ],
        performanceData: [
          {year: '2026', passRate: 79, avgMarks: 69},
          {year: '2026', passRate: 81, avgMarks: 73},
          {year: '2026', passRate: 76, avgMarks: 71},
        ],
        departmentData: [
          {name: 'Computer Science', students: 560, faculty: 72, avgAttendance: 77, cgpa: 7.9},
          {name: 'Physics', students: 370, faculty: 59, avgAttendance: 73, cgpa: 7.4},
          {name: 'Mathematics', students: 340, faculty: 49, avgAttendance: 71, cgpa: 7.6},
          {name: 'Electronics', students: 500, faculty: 86, avgAttendance: 78, cgpa: 7.8},
          {name: 'Mechanical', students: 450, faculty: 78, avgAttendance: 74, cgpa: 7.4},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 50, color: '#22c55e'},
          {grade: 'A', count: 210, color: '#3b82f6'},
          {grade: 'B+', count: 110, color: '#06b6d4'},
          {grade: 'B', count: 100, color: '#8b5cf6'},
          {grade: 'C', count: 30, color: '#f59e0b'},
          {grade: 'F', count: 75, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,170',
          faculty: '360',
          departments: '5',
          courses: '40',
          income: 3300000,
          expense: 1500000,
          scholarships: '100'
        }
      }
    },
    '2025': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2025', attendance: 80, target: 90},
          {year: '2025', attendance: 82, target: 90},
          {year: '2025', attendance: 81, target: 90},
        ],
        performanceData: [
          {year: '2025', passRate: 83, avgMarks: 73},
          {year: '2025', passRate: 85, avgMarks: 77},
          {year: '2025', passRate: 80, avgMarks: 75},
        ],
        departmentData: [
          {name: 'Computer Science', students: 620, faculty: 76, avgAttendance: 82, cgpa: 8.1},
          {name: 'Physics', students: 390, faculty: 64, avgAttendance: 78, cgpa: 7.7},
          {name: 'Mathematics', students: 370, faculty: 54, avgAttendance: 76, cgpa: 7.9},
          {name: 'Electronics', students: 540, faculty: 90, avgAttendance: 83, cgpa: 8.0},
          {name: 'Mechanical', students: 480, faculty: 82, avgAttendance: 79, cgpa: 7.6},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 100, color: '#22c55e'},
          {grade: 'A', count: 260, color: '#3b82f6'},
          {grade: 'B+', count: 180, color: '#06b6d4'},
          {grade: 'B', count: 140, color: '#8b5cf6'},
          {grade: 'C', count: 70, color: '#f59e0b'},
          {grade: 'F', count: 40, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,470',
          faculty: '380',
          departments: '5',
          courses: '44',
          income: 3700000,
          expense: 1900000,
          scholarships: '120'
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2025', attendance: 78, target: 90},
          {year: '2025', attendance: 80, target: 90},
          {year: '2025', attendance: 79, target: 90},
        ],
        performanceData: [
          {year: '2025', passRate: 81, avgMarks: 71},
          {year: '2025', passRate: 83, avgMarks: 75},
          {year: '2025', passRate: 78, avgMarks: 73},
        ],
        departmentData: [
          {name: 'Computer Science', students: 590, faculty: 74, avgAttendance: 80, cgpa: 8.0},
          {name: 'Physics', students: 380, faculty: 62, avgAttendance: 76, cgpa: 7.6},
          {name: 'Mathematics', students: 360, faculty: 52, avgAttendance: 74, cgpa: 7.8},
          {name: 'Electronics', students: 520, faculty: 88, avgAttendance: 82, cgpa: 7.9},
          {name: 'Mechanical', students: 470, faculty: 80, avgAttendance: 78, cgpa: 7.5},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 80, color: '#22c55e'},
          {grade: 'A', count: 240, color: '#3b82f6'},
          {grade: 'B+', count: 160, color: '#06b6d4'},
          {grade: 'B', count: 130, color: '#8b5cf6'},
          {grade: 'C', count: 60, color: '#f59e0b'},
          {grade: 'F', count: 50, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,340',
          faculty: '370',
          departments: '5',
          courses: '42',
          income: 3500000,
          expense: 1700000,
          scholarships: '110'
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2025', attendance: 76, target: 90},
          {year: '2025', attendance: 78, target: 90},
          {year: '2025', attendance: 77, target: 90},
        ],
        performanceData: [
          {year: '2025', passRate: 79, avgMarks: 69},
          {year: '2025', passRate: 81, avgMarks: 73},
          {year: '2025', passRate: 76, avgMarks: 71},
        ],
        departmentData: [
          {name: 'Computer Science', students: 560, faculty: 72, avgAttendance: 78, cgpa: 7.9},
          {name: 'Physics', students: 370, faculty: 60, avgAttendance: 74, cgpa: 7.5},
          {name: 'Mathematics', students: 350, faculty: 50, avgAttendance: 72, cgpa: 7.7},
          {name: 'Electronics', students: 500, faculty: 86, avgAttendance: 80, cgpa: 7.8},
          {name: 'Mechanical', students: 460, faculty: 78, avgAttendance: 76, cgpa: 7.4},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 60, color: '#22c55e'},
          {grade: 'A', count: 220, color: '#3b82f6'},
          {grade: 'B+', count: 140, color: '#06b6d4'},
          {grade: 'B', count: 120, color: '#8b5cf6'},
          {grade: 'C', count: 50, color: '#f59e0b'},
          {grade: 'F', count: 60, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,200',
          faculty: '360',
          departments: '5',
          courses: '40',
          income: 3300000,
          expense: 1500000,
          scholarships: '100'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2025', attendance: 74, target: 90},
          {year: '2025', attendance: 76, target: 90},
          {year: '2025', attendance: 75, target: 90},
        ],
        performanceData: [
          {year: '2025', passRate: 77, avgMarks: 67},
          {year: '2025', passRate: 79, avgMarks: 71},
          {year: '2025', passRate: 74, avgMarks: 69},
        ],
        departmentData: [
          {name: 'Computer Science', students: 530, faculty: 70, avgAttendance: 76, cgpa: 7.8},
          {name: 'Physics', students: 350, faculty: 58, avgAttendance: 72, cgpa: 7.3},
          {name: 'Mathematics', students: 340, faculty: 48, avgAttendance: 70, cgpa: 7.5},
          {name: 'Electronics', students: 480, faculty: 84, avgAttendance: 78, cgpa: 7.7},
          {name: 'Mechanical', students: 450, faculty: 76, avgAttendance: 74, cgpa: 7.3},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 40, color: '#22c55e'},
          {grade: 'A', count: 200, color: '#3b82f6'},
          {grade: 'B+', count: 120, color: '#06b6d4'},
          {grade: 'B', count: 110, color: '#8b5cf6'},
          {grade: 'C', count: 20, color: '#f59e0b'},
          {grade: 'F', count: 80, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,090',
          faculty: '350',
          departments: '5',
          courses: '38',
          income: 3100000,
          expense: 1300000,
          scholarships: '90'
        }
      }
    },
    '2024': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2024', attendance: 78, target: 90},
          {year: '2024', attendance: 80, target: 90},
          {year: '2024', attendance: 79, target: 90},
        ],
        performanceData: [
          {year: '2024', passRate: 81, avgMarks: 71},
          {year: '2024', passRate: 83, avgMarks: 75},
          {year: '2024', passRate: 78, avgMarks: 73},
        ],
        departmentData: [
          {name: 'Computer Science', students: 590, faculty: 74, avgAttendance: 80, cgpa: 8.0},
          {name: 'Physics', students: 380, faculty: 62, avgAttendance: 76, cgpa: 7.6},
          {name: 'Mathematics', students: 360, faculty: 52, avgAttendance: 74, cgpa: 7.8},
          {name: 'Electronics', students: 520, faculty: 88, avgAttendance: 82, cgpa: 7.9},
          {name: 'Mechanical', students: 470, faculty: 80, avgAttendance: 78, cgpa: 7.5},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 90, color: '#22c55e'},
          {grade: 'A', count: 250, color: '#3b82f6'},
          {grade: 'B+', count: 170, color: '#06b6d4'},
          {grade: 'B', count: 130, color: '#8b5cf6'},
          {grade: 'C', count: 60, color: '#f59e0b'},
          {grade: 'F', count: 45, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,360',
          faculty: '370',
          departments: '5',
          courses: '42',
          income: 3500000,
          expense: 1700000,
          scholarships: '110'
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2024', attendance: 76, target: 90},
          {year: '2024', attendance: 78, target: 90},
          {year: '2024', attendance: 77, target: 90},
        ],
        performanceData: [
          {year: '2024', passRate: 79, avgMarks: 69},
          {year: '2024', passRate: 81, avgMarks: 73},
          {year: '2024', passRate: 76, avgMarks: 71},
        ],
        departmentData: [
          {name: 'Computer Science', students: 560, faculty: 72, avgAttendance: 78, cgpa: 7.9},
          {name: 'Physics', students: 370, faculty: 60, avgAttendance: 74, cgpa: 7.5},
          {name: 'Mathematics', students: 350, faculty: 50, avgAttendance: 72, cgpa: 7.7},
          {name: 'Electronics', students: 500, faculty: 86, avgAttendance: 80, cgpa: 7.8},
          {name: 'Mechanical', students: 460, faculty: 78, avgAttendance: 76, cgpa: 7.4},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 70, color: '#22c55e'},
          {grade: 'A', count: 230, color: '#3b82f6'},
          {grade: 'B+', count: 150, color: '#06b6d4'},
          {grade: 'B', count: 120, color: '#8b5cf6'},
          {grade: 'C', count: 50, color: '#f59e0b'},
          {grade: 'F', count: 55, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,230',
          faculty: '360',
          departments: '5',
          courses: '40',
          income: 3300000,
          expense: 1500000,
          scholarships: '100'
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2024', attendance: 74, target: 90},
          {year: '2024', attendance: 76, target: 90},
          {year: '2024', attendance: 75, target: 90},
        ],
        performanceData: [
          {year: '2024', passRate: 77, avgMarks: 67},
          {year: '2024', passRate: 79, avgMarks: 71},
          {year: '2024', passRate: 74, avgMarks: 69},
        ],
        departmentData: [
          {name: 'Computer Science', students: 530, faculty: 70, avgAttendance: 76, cgpa: 7.8},
          {name: 'Physics', students: 350, faculty: 58, avgAttendance: 72, cgpa: 7.3},
          {name: 'Mathematics', students: 340, faculty: 48, avgAttendance: 70, cgpa: 7.5},
          {name: 'Electronics', students: 480, faculty: 84, avgAttendance: 78, cgpa: 7.7},
          {name: 'Mechanical', students: 450, faculty: 76, avgAttendance: 74, cgpa: 7.3},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 50, color: '#22c55e'},
          {grade: 'A', count: 210, color: '#3b82f6'},
          {grade: 'B+', count: 130, color: '#06b6d4'},
          {grade: 'B', count: 110, color: '#8b5cf6'},
          {grade: 'C', count: 30, color: '#f59e0b'},
          {grade: 'F', count: 70, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,090',
          faculty: '350',
          departments: '5',
          courses: '38',
          income: 3100000,
          expense: 1300000,
          scholarships: '90'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2024', attendance: 72, target: 90},
          {year: '2024', attendance: 74, target: 90},
          {year: '2024', attendance: 73, target: 90},
        ],
        performanceData: [
          {year: '2024', passRate: 75, avgMarks: 65},
          {year: '2024', passRate: 77, avgMarks: 69},
          {year: '2024', passRate: 72, avgMarks: 67},
        ],
        departmentData: [
          {name: 'Computer Science', students: 500, faculty: 68, avgAttendance: 74, cgpa: 7.7},
          {name: 'Physics', students: 330, faculty: 56, avgAttendance: 70, cgpa: 7.2},
          {name: 'Mathematics', students: 320, faculty: 46, avgAttendance: 68, cgpa: 7.4},
          {name: 'Electronics', students: 460, faculty: 82, avgAttendance: 76, cgpa: 7.6},
          {name: 'Mechanical', students: 430, faculty: 74, avgAttendance: 72, cgpa: 7.2},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 30, color: '#22c55e'},
          {grade: 'A', count: 190, color: '#3b82f6'},
          {grade: 'B+', count: 110, color: '#06b6d4'},
          {grade: 'B', count: 100, color: '#8b5cf6'},
          {grade: 'C', count: 10, color: '#f59e0b'},
          {grade: 'F', count: 90, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,960',
          faculty: '340',
          departments: '5',
          courses: '36',
          income: 2900000,
          expense: 1100000,
          scholarships: '80'
        }
      }
    },
    '2023': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2023', attendance: 76, target: 90},
          {year: '2023', attendance: 78, target: 90},
          {year: '2023', attendance: 77, target: 90},
        ],
        performanceData: [
          {year: '2023', passRate: 79, avgMarks: 69},
          {year: '2023', passRate: 81, avgMarks: 73},
          {year: '2023', passRate: 76, avgMarks: 71},
        ],
        departmentData: [
          {name: 'Computer Science', students: 560, faculty: 72, avgAttendance: 78, cgpa: 7.9},
          {name: 'Physics', students: 370, faculty: 60, avgAttendance: 74, cgpa: 7.5},
          {name: 'Mathematics', students: 350, faculty: 50, avgAttendance: 72, cgpa: 7.7},
          {name: 'Electronics', students: 500, faculty: 86, avgAttendance: 80, cgpa: 7.8},
          {name: 'Mechanical', students: 460, faculty: 78, avgAttendance: 76, cgpa: 7.4},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 80, color: '#22c55e'},
          {grade: 'A', count: 240, color: '#3b82f6'},
          {grade: 'B+', count: 160, color: '#06b6d4'},
          {grade: 'B', count: 120, color: '#8b5cf6'},
          {grade: 'C', count: 50, color: '#f59e0b'},
          {grade: 'F', count: 50, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,250',
          faculty: '360',
          departments: '5',
          courses: '40',
          income: 3300000,
          expense: 1500000,
          scholarships: '100'
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2023', attendance: 74, target: 90},
          {year: '2023', attendance: 76, target: 90},
          {year: '2023', attendance: 75, target: 90},
        ],
        performanceData: [
          {year: '2023', passRate: 77, avgMarks: 67},
          {year: '2023', passRate: 79, avgMarks: 71},
          {year: '2023', passRate: 74, avgMarks: 69},
        ],
        departmentData: [
          {name: 'Computer Science', students: 530, faculty: 70, avgAttendance: 76, cgpa: 7.8},
          {name: 'Physics', students: 350, faculty: 58, avgAttendance: 72, cgpa: 7.3},
          {name: 'Mathematics', students: 340, faculty: 48, avgAttendance: 70, cgpa: 7.5},
          {name: 'Electronics', students: 480, faculty: 84, avgAttendance: 78, cgpa: 7.7},
          {name: 'Mechanical', students: 450, faculty: 76, avgAttendance: 74, cgpa: 7.3},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 60, color: '#22c55e'},
          {grade: 'A', count: 220, color: '#3b82f6'},
          {grade: 'B+', count: 140, color: '#06b6d4'},
          {grade: 'B', count: 110, color: '#8b5cf6'},
          {grade: 'C', count: 40, color: '#f59e0b'},
          {grade: 'F', count: 60, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,120',
          faculty: '350',
          departments: '5',
          courses: '38',
          income: 3100000,
          expense: 1300000,
          scholarships: '90'
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2023', attendance: 72, target: 90},
          {year: '2023', attendance: 74, target: 90},
          {year: '2023', attendance: 73, target: 90},
        ],
        performanceData: [
          {year: '2023', passRate: 75, avgMarks: 65},
          {year: '2023', passRate: 77, avgMarks: 69},
          {year: '2023', passRate: 72, avgMarks: 67},
        ],
        departmentData: [
          {name: 'Computer Science', students: 500, faculty: 68, avgAttendance: 74, cgpa: 7.7},
          {name: 'Physics', students: 330, faculty: 56, avgAttendance: 70, cgpa: 7.2},
          {name: 'Mathematics', students: 320, faculty: 46, avgAttendance: 68, cgpa: 7.4},
          {name: 'Electronics', students: 460, faculty: 82, avgAttendance: 76, cgpa: 7.6},
          {name: 'Mechanical', students: 430, faculty: 74, avgAttendance: 72, cgpa: 7.2},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 40, color: '#22c55e'},
          {grade: 'A', count: 200, color: '#3b82f6'},
          {grade: 'B+', count: 120, color: '#06b6d4'},
          {grade: 'B', count: 100, color: '#8b5cf6'},
          {grade: 'C', count: 20, color: '#f59e0b'},
          {grade: 'F', count: 80, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,980',
          faculty: '340',
          departments: '5',
          courses: '36',
          income: 2900000,
          expense: 1100000,
          scholarships: '80'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2023', attendance: 70, target: 90},
          {year: '2023', attendance: 72, target: 90},
          {year: '2023', attendance: 71, target: 90},
        ],
        performanceData: [
          {year: '2023', passRate: 73, avgMarks: 63},
          {year: '2023', passRate: 75, avgMarks: 67},
          {year: '2023', passRate: 70, avgMarks: 65},
        ],
        departmentData: [
          {name: 'Computer Science', students: 470, faculty: 66, avgAttendance: 72, cgpa: 7.6},
          {name: 'Physics', students: 310, faculty: 54, avgAttendance: 68, cgpa: 7.1},
          {name: 'Mathematics', students: 300, faculty: 44, avgAttendance: 66, cgpa: 7.3},
          {name: 'Electronics', students: 440, faculty: 80, avgAttendance: 74, cgpa: 7.5},
          {name: 'Mechanical', students: 410, faculty: 72, avgAttendance: 70, cgpa: 7.1},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 20, color: '#22c55e'},
          {grade: 'A', count: 180, color: '#3b82f6'},
          {grade: 'B+', count: 100, color: '#06b6d4'},
          {grade: 'B', count: 90, color: '#8b5cf6'},
          {grade: 'C', count: 0, color: '#f59e0b'},
          {grade: 'F', count: 100, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,850',
          faculty: '330',
          departments: '5',
          courses: '34',
          income: 2700000,
          expense: 900000,
          scholarships: '70'
        }
      }
    },
    '2022': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2022', attendance: 74, target: 90},
          {year: '2022', attendance: 76, target: 90},
          {year: '2022', attendance: 75, target: 90},
        ],
        performanceData: [
          {year: '2022', passRate: 77, avgMarks: 67},
          {year: '2022', passRate: 79, avgMarks: 71},
          {year: '2022', passRate: 74, avgMarks: 69},
        ],
        departmentData: [
          {name: 'Computer Science', students: 540, faculty: 70, avgAttendance: 76, cgpa: 7.8},
          {name: 'Physics', students: 360, faculty: 58, avgAttendance: 72, cgpa: 7.4},
          {name: 'Mathematics', students: 340, faculty: 48, avgAttendance: 70, cgpa: 7.6},
          {name: 'Electronics', students: 480, faculty: 84, avgAttendance: 78, cgpa: 7.7},
          {name: 'Mechanical', students: 450, faculty: 76, avgAttendance: 74, cgpa: 7.3},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 70, color: '#22c55e'},
          {grade: 'A', count: 230, color: '#3b82f6'},
          {grade: 'B+', count: 150, color: '#06b6d4'},
          {grade: 'B', count: 110, color: '#8b5cf6'},
          {grade: 'C', count: 40, color: '#f59e0b'},
          {grade: 'F', count: 45, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,120',
          faculty: '350',
          departments: '5',
          courses: '38',
          income: 3100000,
          expense: 1300000,
          scholarships: '90'
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2022', attendance: 72, target: 90},
          {year: '2022', attendance: 74, target: 90},
          {year: '2022', attendance: 73, target: 90},
        ],
        performanceData: [
          {year: '2022', passRate: 75, avgMarks: 65},
          {year: '2022', passRate: 77, avgMarks: 69},
          {year: '2022', passRate: 72, avgMarks: 67},
        ],
        departmentData: [
          {name: 'Computer Science', students: 520, faculty: 68, avgAttendance: 74, cgpa: 7.7},
          {name: 'Physics', students: 350, faculty: 56, avgAttendance: 70, cgpa: 7.3},
          {name: 'Mathematics', students: 330, faculty: 46, avgAttendance: 68, cgpa: 7.5},
          {name: 'Electronics', students: 460, faculty: 82, avgAttendance: 76, cgpa: 7.6},
          {name: 'Mechanical', students: 440, faculty: 74, avgAttendance: 72, cgpa: 7.2},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 50, color: '#22c55e'},
          {grade: 'A', count: 210, color: '#3b82f6'},
          {grade: 'B+', count: 130, color: '#06b6d4'},
          {grade: 'B', count: 100, color: '#8b5cf6'},
          {grade: 'C', count: 20, color: '#f59e0b'},
          {grade: 'F', count: 75, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,980',
          faculty: '340',
          departments: '5',
          courses: '36',
          income: 2900000,
          expense: 1100000,
          scholarships: '80'
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2022', attendance: 70, target: 90},
          {year: '2022', attendance: 72, target: 90},
          {year: '2022', attendance: 71, target: 90},
        ],
        performanceData: [
          {year: '2022', passRate: 73, avgMarks: 63},
          {year: '2022', passRate: 75, avgMarks: 67},
          {year: '2022', passRate: 70, avgMarks: 65},
        ],
        departmentData: [
          {name: 'Computer Science', students: 500, faculty: 66, avgAttendance: 72, cgpa: 7.6},
          {name: 'Physics', students: 330, faculty: 54, avgAttendance: 68, cgpa: 7.1},
          {name: 'Mathematics', students: 320, faculty: 44, avgAttendance: 66, cgpa: 7.3},
          {name: 'Electronics', students: 440, faculty: 80, avgAttendance: 74, cgpa: 7.5},
          {name: 'Mechanical', students: 420, faculty: 72, avgAttendance: 70, cgpa: 7.1},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 30, color: '#22c55e'},
          {grade: 'A', count: 190, color: '#3b82f6'},
          {grade: 'B+', count: 110, color: '#06b6d4'},
          {grade: 'B', count: 90, color: '#8b5cf6'},
          {grade: 'C', count: 0, color: '#f59e0b'},
          {grade: 'F', count: 95, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,850',
          faculty: '330',
          departments: '5',
          courses: '34',
          income: 2700000,
          expense: 900000,
          scholarships: '70'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2022', attendance: 68, target: 90},
          {year: '2022', attendance: 70, target: 90},
          {year: '2022', attendance: 69, target: 90},
        ],
        performanceData: [
          {year: '2022', passRate: 71, avgMarks: 61},
          {year: '2022', passRate: 73, avgMarks: 65},
          {year: '2022', passRate: 68, avgMarks: 63},
        ],
        departmentData: [
          {name: 'Computer Science', students: 460, faculty: 62, avgAttendance: 70, cgpa: 7.5},
          {name: 'Physics', students: 310, faculty: 50, avgAttendance: 66, cgpa: 7.0},
          {name: 'Mathematics', students: 300, faculty: 40, avgAttendance: 64, cgpa: 7.2},
          {name: 'Electronics', students: 420, faculty: 78, avgAttendance: 72, cgpa: 7.4},
          {name: 'Mechanical', students: 390, faculty: 70, avgAttendance: 68, cgpa: 7.0},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 10, color: '#22c55e'},
          {grade: 'A', count: 170, color: '#3b82f6'},
          {grade: 'B+', count: 90, color: '#06b6d4'},
          {grade: 'B', count: 80, color: '#8b5cf6'},
          {grade: 'C', count: 0, color: '#f59e0b'},
          {grade: 'F', count: 110, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,720',
          faculty: '320',
          departments: '5',
          courses: '32',
          income: 2500000,
          expense: 700000,
          scholarships: '60'
        }
      }
    },
    '2021': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2021', attendance: 72, target: 90},
          {year: '2021', attendance: 74, target: 90},
          {year: '2021', attendance: 73, target: 90},
        ],
        performanceData: [
          {year: '2021', passRate: 75, avgMarks: 65},
          {year: '2021', passRate: 77, avgMarks: 69},
          {year: '2021', passRate: 72, avgMarks: 67},
        ],
        departmentData: [
          {name: 'Computer Science', students: 520, faculty: 68, avgAttendance: 74, cgpa: 7.7},
          {name: 'Physics', students: 350, faculty: 56, avgAttendance: 70, cgpa: 7.3},
          {name: 'Mathematics', students: 330, faculty: 46, avgAttendance: 68, cgpa: 7.5},
          {name: 'Electronics', students: 460, faculty: 82, avgAttendance: 76, cgpa: 7.6},
          {name: 'Mechanical', students: 440, faculty: 74, avgAttendance: 72, cgpa: 7.2},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 60, color: '#22c55e'},
          {grade: 'A', count: 220, color: '#3b82f6'},
          {grade: 'B+', count: 140, color: '#06b6d4'},
          {grade: 'B', count: 100, color: '#8b5cf6'},
          {grade: 'C', count: 20, color: '#f59e0b'},
          {grade: 'F', count: 40, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,980',
          faculty: '340',
          departments: '5',
          courses: '36',
          income: 2900000,
          expense: 1100000,
          scholarships: '80'
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2021', attendance: 70, target: 90},
          {year: '2021', attendance: 72, target: 90},
          {year: '2021', attendance: 71, target: 90},
        ],
        performanceData: [
          {year: '2021', passRate: 73, avgMarks: 63},
          {year: '2021', passRate: 75, avgMarks: 67},
          {year: '2021', passRate: 70, avgMarks: 65},
        ],
        departmentData: [
          {name: 'Computer Science', students: 500, faculty: 66, avgAttendance: 72, cgpa: 7.6},
          {name: 'Physics', students: 330, faculty: 54, avgAttendance: 68, cgpa: 7.1},
          {name: 'Mathematics', students: 320, faculty: 44, avgAttendance: 66, cgpa: 7.3},
          {name: 'Electronics', students: 440, faculty: 80, avgAttendance: 74, cgpa: 7.5},
          {name: 'Mechanical', students: 420, faculty: 72, avgAttendance: 70, cgpa: 7.1},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 40, color: '#22c55e'},
          {grade: 'A', count: 200, color: '#3b82f6'},
          {grade: 'B+', count: 120, color: '#06b6d4'},
          {grade: 'B', count: 90, color: '#8b5cf6'},
          {grade: 'C', count: 0, color: '#f59e0b'},
          {grade: 'F', count: 70, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,850',
          faculty: '330',
          departments: '5',
          courses: '34',
          income: 2700000,
          expense: 900000,
          scholarships: '70'
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2021', attendance: 68, target: 90},
          {year: '2021', attendance: 70, target: 90},
          {year: '2021', attendance: 69, target: 90},
        ],
        performanceData: [
          {year: '2021', passRate: 71, avgMarks: 61},
          {year: '2021', passRate: 73, avgMarks: 65},
          {year: '2021', passRate: 68, avgMarks: 63},
        ],
        departmentData: [
          {name: 'Computer Science', students: 480, faculty: 62, avgAttendance: 70, cgpa: 7.5},
          {name: 'Physics', students: 310, faculty: 50, avgAttendance: 66, cgpa: 7.0},
          {name: 'Mathematics', students: 300, faculty: 40, avgAttendance: 64, cgpa: 7.2},
          {name: 'Electronics', students: 420, faculty: 78, avgAttendance: 72, cgpa: 7.4},
          {name: 'Mechanical', students: 400, faculty: 70, avgAttendance: 68, cgpa: 7.0},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 20, color: '#22c55e'},
          {grade: 'A', count: 180, color: '#3b82f6'},
          {grade: 'B+', count: 100, color: '#06b6d4'},
          {grade: 'B', count: 80, color: '#8b5cf6'},
          {grade: 'C', count: 0, color: '#f59e0b'},
          {grade: 'F', count: 90, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,720',
          faculty: '320',
          departments: '5',
          courses: '32',
          income: 2500000,
          expense: 700000,
          scholarships: '60'
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2021', attendance: 66, target: 90},
          {year: '2021', attendance: 68, target: 90},
          {year: '2021', attendance: 67, target: 90},
        ],
        performanceData: [
          {year: '2021', passRate: 69, avgMarks: 59},
          {year: '2021', passRate: 71, avgMarks: 63},
          {year: '2021', passRate: 66, avgMarks: 61},
        ],
        departmentData: [
          {name: 'Computer Science', students: 440, faculty: 58, avgAttendance: 68, cgpa: 7.4},
          {name: 'Physics', students: 290, faculty: 46, avgAttendance: 64, cgpa: 6.9},
          {name: 'Mathematics', students: 280, faculty: 36, avgAttendance: 62, cgpa: 7.1},
          {name: 'Electronics', students: 400, faculty: 76, avgAttendance: 70, cgpa: 7.3},
          {name: 'Mechanical', students: 380, faculty: 68, avgAttendance: 66, cgpa: 6.9},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 0, color: '#22c55e'},
          {grade: 'A', count: 160, color: '#3b82f6'},
          {grade: 'B+', count: 80, color: '#06b6d4'},
          {grade: 'B', count: 70, color: '#8b5cf6'},
          {grade: 'C', count: 0, color: '#f59e0b'},
          {grade: 'F', count: 120, color: '#ef4444'},
        ],
        summaryData: {
          students: '1,590',
          faculty: '310',
          departments: '5',
          courses: '30',
          income: 2300000,
          expense: 500000,
          scholarships: '50'
        }
      }
    },
    '2029': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2029', attendance: 88, target: 90},
          {year: '2029', attendance: 90, target: 90},
          {year: '2029', attendance: 89, target: 90},
        ],
        performanceData: [
          {year: '2029', passRate: 92, avgMarks: 82},
          {year: '2029', passRate: 94, avgMarks: 86},
          {year: '2029', passRate: 89, avgMarks: 84},
        ],
        departmentData: [
          {name: 'Computer Science', students: 720, faculty: 88, avgAttendance: 89, cgpa: 8.6},
          {name: 'Physics', students: 450, faculty: 72, avgAttendance: 85, cgpa: 8.1},
          {name: 'Mathematics', students: 420, faculty: 62, avgAttendance: 83, cgpa: 8.3},
          {name: 'Electronics', students: 620, faculty: 100, avgAttendance: 88, cgpa: 8.4},
          {name: 'Mechanical', students: 550, faculty: 92, avgAttendance: 84, cgpa: 8.0},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 150, color: '#22c55e'},
          {grade: 'A', count: 320, color: '#3b82f6'},
          {grade: 'B+', count: 220, color: '#06b6d4'},
          {grade: 'B', count: 170, color: '#8b5cf6'},
          {grade: 'C', count: 90, color: '#f59e0b'},
          {grade: 'F', count: 20, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,860',
          faculty: '420',
          departments: '5',
          courses: '52',
          income: 4500000,
          expense: 2500000,
          scholarships: 160
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2029', attendance: 86, target: 90},
          {year: '2029', attendance: 88, target: 90},
          {year: '2029', attendance: 87, target: 90},
        ],
        performanceData: [
          {year: '2029', passRate: 90, avgMarks: 80},
          {year: '2029', passRate: 92, avgMarks: 84},
          {year: '2029', passRate: 87, avgMarks: 82},
        ],
        departmentData: [
          {name: 'Computer Science', students: 690, faculty: 86, avgAttendance: 87, cgpa: 8.5},
          {name: 'Physics', students: 440, faculty: 70, avgAttendance: 83, cgpa: 8.0},
          {name: 'Mathematics', students: 400, faculty: 60, avgAttendance: 81, cgpa: 8.2},
          {name: 'Electronics', students: 600, faculty: 98, avgAttendance: 86, cgpa: 8.3},
          {name: 'Mechanical', students: 540, faculty: 90, avgAttendance: 82, cgpa: 7.9},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 130, color: '#22c55e'},
          {grade: 'A', count: 300, color: '#3b82f6'},
          {grade: 'B+', count: 200, color: '#06b6d4'},
          {grade: 'B', count: 160, color: '#8b5cf6'},
          {grade: 'C', count: 80, color: '#f59e0b'},
          {grade: 'F', count: 30, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,720',
          faculty: '410',
          departments: '5',
          courses: '50',
          income: 4300000,
          expense: 2300000,
          scholarships: 150
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2029', attendance: 84, target: 90},
          {year: '2029', attendance: 86, target: 90},
          {year: '2029', attendance: 85, target: 90},
        ],
        performanceData: [
          {year: '2029', passRate: 88, avgMarks: 78},
          {year: '2029', passRate: 90, avgMarks: 82},
          {year: '2029', passRate: 85, avgMarks: 80},
        ],
        departmentData: [
          {name: 'Computer Science', students: 660, faculty: 84, avgAttendance: 85, cgpa: 8.4},
          {name: 'Physics', students: 430, faculty: 68, avgAttendance: 81, cgpa: 7.9},
          {name: 'Mathematics', students: 380, faculty: 58, avgAttendance: 79, cgpa: 8.1},
          {name: 'Electronics', students: 580, faculty: 96, avgAttendance: 84, cgpa: 8.2},
          {name: 'Mechanical', students: 530, faculty: 88, avgAttendance: 80, cgpa: 7.8},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 110, color: '#22c55e'},
          {grade: 'A', count: 280, color: '#3b82f6'},
          {grade: 'B+', count: 180, color: '#06b6d4'},
          {grade: 'B', count: 150, color: '#8b5cf6'},
          {grade: 'C', count: 70, color: '#f59e0b'},
          {grade: 'F', count: 40, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,580',
          faculty: '400',
          departments: '5',
          courses: '48',
          income: 4100000,
          expense: 2100000,
          scholarships: 140
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2029', attendance: 82, target: 90},
          {year: '2029', attendance: 84, target: 90},
          {year: '2029', attendance: 83, target: 90},
        ],
        performanceData: [
          {year: '2029', passRate: 86, avgMarks: 76},
          {year: '2029', passRate: 88, avgMarks: 80},
          {year: '2029', passRate: 83, avgMarks: 78},
        ],
        departmentData: [
          {name: 'Computer Science', students: 630, faculty: 82, avgAttendance: 83, cgpa: 8.3},
          {name: 'Physics', students: 420, faculty: 66, avgAttendance: 79, cgpa: 7.8},
          {name: 'Mathematics', students: 360, faculty: 56, avgAttendance: 77, cgpa: 8.0},
          {name: 'Electronics', students: 560, faculty: 94, avgAttendance: 82, cgpa: 8.1},
          {name: 'Mechanical', students: 520, faculty: 86, avgAttendance: 78, cgpa: 7.7},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 90, color: '#22c55e'},
          {grade: 'A', count: 260, color: '#3b82f6'},
          {grade: 'B+', count: 160, color: '#06b6d4'},
          {grade: 'B', count: 140, color: '#8b5cf6'},
          {grade: 'C', count: 60, color: '#f59e0b'},
          {grade: 'F', count: 50, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,440',
          faculty: '390',
          departments: '5',
          courses: '46',
          income: 3900000,
          expense: 1900000,
          scholarships: 130
        }
      }
    },
    '2028': {
      'Semester 4 (Current)': {
        attendanceData: [
          {year: '2028', attendance: 86, target: 90},
          {year: '2028', attendance: 88, target: 90},
          {year: '2028', attendance: 87, target: 90},
        ],
        performanceData: [
          {year: '2028', passRate: 90, avgMarks: 80},
          {year: '2028', passRate: 92, avgMarks: 84},
          {year: '2028', passRate: 87, avgMarks: 82},
        ],
        departmentData: [
          {name: 'Computer Science', students: 700, faculty: 85, avgAttendance: 87, cgpa: 8.5},
          {name: 'Physics', students: 435, faculty: 70, avgAttendance: 83, cgpa: 8.0},
          {name: 'Mathematics', students: 405, faculty: 60, avgAttendance: 81, cgpa: 8.2},
          {name: 'Electronics', students: 600, faculty: 97, avgAttendance: 86, cgpa: 8.3},
          {name: 'Mechanical', students: 530, faculty: 89, avgAttendance: 82, cgpa: 7.9},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 130, color: '#22c55e'},
          {grade: 'A', count: 300, color: '#3b82f6'},
          {grade: 'B+', count: 200, color: '#06b6d4'},
          {grade: 'B', count: 160, color: '#8b5cf6'},
          {grade: 'C', count: 80, color: '#f59e0b'},
          {grade: 'F', count: 30, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,770',
          faculty: '410',
          departments: '5',
          courses: '50',
          income: 4300000,
          expense: 2300000,
          scholarships: 150
        }
      },
      'Semester 3': {
        attendanceData: [
          {year: '2028', attendance: 84, target: 90},
          {year: '2028', attendance: 86, target: 90},
          {year: '2028', attendance: 85, target: 90},
        ],
        performanceData: [
          {year: '2028', passRate: 88, avgMarks: 78},
          {year: '2028', passRate: 90, avgMarks: 82},
          {year: '2028', passRate: 85, avgMarks: 80},
        ],
        departmentData: [
          {name: 'Computer Science', students: 670, faculty: 83, avgAttendance: 85, cgpa: 8.4},
          {name: 'Physics', students: 425, faculty: 68, avgAttendance: 81, cgpa: 7.9},
          {name: 'Mathematics', students: 385, faculty: 58, avgAttendance: 79, cgpa: 8.1},
          {name: 'Electronics', students: 580, faculty: 95, avgAttendance: 84, cgpa: 8.2},
          {name: 'Mechanical', students: 520, faculty: 87, avgAttendance: 80, cgpa: 7.8},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 110, color: '#22c55e'},
          {grade: 'A', count: 280, color: '#3b82f6'},
          {grade: 'B+', count: 180, color: '#06b6d4'},
          {grade: 'B', count: 150, color: '#8b5cf6'},
          {grade: 'C', count: 70, color: '#f59e0b'},
          {grade: 'F', count: 40, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,630',
          faculty: '400',
          departments: '5',
          courses: '48',
          income: 4100000,
          expense: 2100000,
          scholarships: 140
        }
      },
      'Semester 2': {
        attendanceData: [
          {year: '2028', attendance: 82, target: 90},
          {year: '2028', attendance: 84, target: 90},
          {year: '2028', attendance: 83, target: 90},
        ],
        performanceData: [
          {year: '2028', passRate: 86, avgMarks: 76},
          {year: '2028', passRate: 88, avgMarks: 80},
          {year: '2028', passRate: 83, avgMarks: 78},
        ],
        departmentData: [
          {name: 'Computer Science', students: 640, faculty: 81, avgAttendance: 83, cgpa: 8.3},
          {name: 'Physics', students: 415, faculty: 66, avgAttendance: 79, cgpa: 7.8},
          {name: 'Mathematics', students: 365, faculty: 56, avgAttendance: 77, cgpa: 8.0},
          {name: 'Electronics', students: 560, faculty: 93, avgAttendance: 82, cgpa: 8.1},
          {name: 'Mechanical', students: 510, faculty: 85, avgAttendance: 78, cgpa: 7.7},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 90, color: '#22c55e'},
          {grade: 'A', count: 260, color: '#3b82f6'},
          {grade: 'B+', count: 160, color: '#06b6d4'},
          {grade: 'B', count: 140, color: '#8b5cf6'},
          {grade: 'C', count: 60, color: '#f59e0b'},
          {grade: 'F', count: 50, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,490',
          faculty: '390',
          departments: '5',
          courses: '46',
          income: 3900000,
          expense: 1900000,
          scholarships: 130
        }
      },
      'Semester 1': {
        attendanceData: [
          {year: '2028', attendance: 80, target: 90},
          {year: '2028', attendance: 82, target: 90},
          {year: '2028', attendance: 81, target: 90},
        ],
        performanceData: [
          {year: '2028', passRate: 84, avgMarks: 74},
          {year: '2028', passRate: 86, avgMarks: 78},
          {year: '2028', passRate: 81, avgMarks: 76},
        ],
        departmentData: [
          {name: 'Computer Science', students: 610, faculty: 79, avgAttendance: 81, cgpa: 8.2},
          {name: 'Physics', students: 405, faculty: 64, avgAttendance: 77, cgpa: 7.7},
          {name: 'Mathematics', students: 345, faculty: 54, avgAttendance: 75, cgpa: 7.9},
          {name: 'Electronics', students: 540, faculty: 91, avgAttendance: 80, cgpa: 8.0},
          {name: 'Mechanical', students: 500, faculty: 83, avgAttendance: 76, cgpa: 7.6},
        ],
        gradeDistribution: [
          {grade: 'A+', count: 70, color: '#22c55e'},
          {grade: 'A', count: 240, color: '#3b82f6'},
          {grade: 'B+', count: 140, color: '#06b6d4'},
          {grade: 'B', count: 130, color: '#8b5cf6'},
          {grade: 'C', count: 50, color: '#f59e0b'},
          {grade: 'F', count: 60, color: '#ef4444'},
        ],
        summaryData: {
          students: '2,350',
          faculty: '380',
          departments: '5',
          courses: '44',
          income: 3700000,
          expense: 1700000,
          scholarships: '120'
        }
      }
    }
  };
  
  return yearData[year]?.[semester] || yearData['2027']['Semester 4 (Current)'];
}

function fmtCr(n){return `₹${(n/1000000).toFixed(1)}Cr`;}

function SCard({label,value,sub,tone,icon}){
  const bg = {blue:'#eff6ff',green:'#f0fdf4',orange:'#fff7ed',red:'#fef2f2',purple:'#f3f4ff'}[tone] || '#f9fafb';
  const text = {blue:'#2563eb',green:'#16a34a',orange:'#c2410c',red:'#b91c1c',purple:'#7c3aed'}[tone] || '#6b7280';
  return (
    <div style={{background:bg,padding:'24px',borderRadius:12,border:'1px solid #e5e7eb',flex:'1',minWidth:'200px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
        <span style={{fontSize:12,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:0.5}}>{label}</span>
        <span style={{fontSize:20}}>{icon}</span>
      </div>
      <div style={{fontSize:24,fontWeight:800,color:'#1f2937',marginBottom:'4px'}}>{value}</div>
      <div style={{fontSize:13,color:text,fontWeight:500}}>{sub}</div>
    </div>
  );
}

function CC({title,subtitle,children}){
  return (
    <div style={{background:'#fff',padding:'24px',borderRadius:12,border:'1px solid #e5e7eb'}}>
      <div style={{marginBottom:'20px'}}>
        <div style={{fontSize:16,fontWeight:700,color:'#1f2937',marginBottom:'4px'}}>{title}</div>
        <div style={{fontSize:13,color:'#6b7280'}}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

function AdminView({activeYears,rangeLabel,department,semester,year}){
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = async (dept) => {
    setSelectedDepartment(dept);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDepartment(null);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Extract semester number from string like "Semester 3" or "Semester 4 (Current)"
        const semesterMatch = semester.match(/\d+/);
        const semesterNum = semesterMatch ? parseInt(semesterMatch[0]) : null;
        
        // Get department code (e.g., "CSE" from "Computer Science" or pass directly)
        const deptCode = department === 'All Departments' ? null : 
                        department === 'Computer Science' ? 'CSE' :
                        department === 'Physics' ? 'Physics' :
                        department === 'Mathematics' ? 'Mathematics' :
                        department === 'Electronics' ? 'Electronics' :
                        department === 'Mechanical' ? 'Mechanical' : null;
        
        // Fetch real data from MongoDB with filters
        const data = await getRealAnalyticsData(parseInt(year), semesterNum, deptCode);
        if (data) {
          setAnalyticsData(data);
          window.analyticsData = data; // Store globally for download function
        } else {
          // Fallback to static data if MongoDB returns null
          const fallbackData = getYearSemesterSpecificStaticData(year, semester);
          setAnalyticsData(fallbackData);
          window.analyticsData = fallbackData; // Store globally for download function
        }
      } catch (err) {
        console.error('Error loading analytics data:', err);
        // Fallback to static data on error
        const fallbackData = getYearSemesterSpecificStaticData(year, semester);
        setAnalyticsData(fallbackData);
        window.analyticsData = fallbackData; // Store globally for download function
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [year, semester, department]); // Re-fetch when filters change

  if (loading) {
    return (
      <div style={{display:'flex',flexDirection:'column',gap:'24px',alignItems:'center',justifyContent:'center',padding:'60px'}}>
        <div style={{fontSize:16,color:'#6b7280'}}>Loading analytics data from MongoDB...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div style={{display:'flex',flexDirection:'column',gap:'24px',alignItems:'center',justifyContent:'center',padding:'60px'}}>
        <div style={{fontSize:16,color:'#6b7280'}}>No data available</div>
      </div>
    );
  }

  const filteredDepartmentData = department === 'All Departments' 
    ? analyticsData.departmentData 
    : analyticsData.departmentData.filter(dept => dept.name === department);

  // Debug: Log the data being used for the chart
  console.log('Department Chart Data:', filteredDepartmentData);
  console.log('Analytics Data:', analyticsData);
  console.log('Department Filter:', department);
  
  // Ensure data has correct structure
  const departmentChartData = filteredDepartmentData.map(dept => ({
    name: dept.name || 'Unknown',
    students: dept.students || 0,
    faculty: dept.faculty || 0
  }));
  
  console.log('Processed Chart Data:', departmentChartData);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
      <div style={{display:'flex',gap:'20',flexWrap:'wrap',width:'100%'}}>
        <SCard label="Total Students" value={analyticsData.summaryData.students} sub={rangeLabel} tone="blue" icon="👥"/>
        <SCard label="Total Faculty" value={analyticsData.summaryData.faculty} sub="Active teachers" tone="green" icon="👨‍🏫"/>
        <SCard label="Departments" value={analyticsData.summaryData.departments} sub="Academic units" tone="purple" icon="🏢"/>
        <SCard label="Courses" value={analyticsData.summaryData.courses} sub="Offered this term" tone="orange" icon="📚"/>
      </div>

      <div style={{display:'flex',gap:'20',flexWrap:'wrap',width:'100%'}}>
        <SCard label="Total Income" value={fmtCr(analyticsData.summaryData.income)} sub="This year" tone="green" icon="💰"/>
        <SCard label="Total Expense" value={fmtCr(analyticsData.summaryData.expense)} sub="This year" tone="red" icon="💸"/>
        <SCard label="Net Surplus" value={fmtCr(analyticsData.summaryData.income - analyticsData.summaryData.expense)} sub="This year" tone="blue" icon="📈"/>
        <SCard label="Scholarships" value={analyticsData.summaryData.scholarships} sub="Active awards" tone="purple" icon="🎓"/>
      </div>

      <CC title="Department Summary" subtitle="Overview of all departments">
        <div style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f8fafc'}}>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Department</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Students</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Faculty</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Avg Att</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>CGPA</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Pass%</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Status</th>
                <th style={{padding:'12px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'2px solid #e5e7eb'}}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartmentData.map((dept, index) => (
                <tr key={index} style={{borderBottom:'1px solid #f3f4f6'}}>
                  <td style={{padding:'12px',fontWeight:600,color:'#1f2937'}}>{dept.name}</td>
                  <td style={{padding:'12px'}}>{dept.students}</td>
                  <td style={{padding:'12px'}}>{dept.faculty}</td>
                  <td style={{padding:'12px',fontWeight:600,color:'#059669'}}>{dept.avgAttendance}%</td>
                  <td style={{padding:'12px',fontWeight:600,color:'#2563eb'}}>{dept.cgpa}</td>
                  <td style={{padding:'12px',fontWeight:600,color:'#059669'}}>{Math.round(dept.avgAttendance * 0.88)}%</td>
                  <td style={{padding:'12px'}}>
                    <span style={{padding:'4px 8px',borderRadius:'6px',background:'#dcfce7',color:'#166534',fontSize:'11',fontWeight:600}}>Excellent</span>
                  </td>
                  <td style={{padding:'12px'}}>
                    <button 
                      onClick={() => handleViewDetails(dept)}
                      style={{padding:'4px 12px',borderRadius:'6px',background:'#eff6ff',color:'#2563eb',fontSize:'11',fontWeight:600,cursor:'pointer',border:'1px solid #bfdbfe'}}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CC>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',width:'100%'}}>
        <CC title="Attendance Trends" subtitle="Yearly attendance vs target">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CC>

        <CC title="Performance Overview" subtitle="Pass rates and average marks">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="passRate" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="avgMarks" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CC>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',width:'100%'}}>
        <CC title="Department Comparison" subtitle="Students and faculty distribution">
          {departmentChartData && departmentChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:12}} />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#2563eb" name="Students" />
                <Bar dataKey="faculty" fill="#16a34a" name="Faculty" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'300px',color:'#6b7280',fontSize:'14px'}}>
              <div>No department data available</div>
            </div>
          )}
        </CC>

        <CC title="Grade Distribution" subtitle="Overall grade breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.gradeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CC>
      </div>

      {/* Department Details Modal */}
      {showDetailsModal && selectedDepartment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                  {selectedDepartment.name} Department
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                  Detailed performance metrics and statistics
                </p>
              </div>
              <button
                onClick={closeDetailsModal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Students</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>{selectedDepartment.students}</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Faculty Members</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a' }}>{selectedDepartment.faculty}</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Attendance</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706' }}>{selectedDepartment.avgAttendance}%</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f3e8ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average CGPA</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed' }}>{selectedDepartment.cgpa}</div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Performance Indicators
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>Pass Rate</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                    {Math.round(selectedDepartment.avgAttendance * 0.88)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>Student-Faculty Ratio</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>
                    {Math.round(selectedDepartment.students / selectedDepartment.faculty)}:1
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>Department Status</span>
                  <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: '600' }}>
                    Excellent
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={closeDetailsModal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#fff',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FinanceView({activeYears,rangeLabel,department,semester,year}){
  return (
    <div style={{textAlign:'center',padding:'60px 0',color:'#9ca3af',fontSize:16}}>
      Finance Analytics coming soon...
    </div>
  );
}

function FacultyView({activeYears,rangeLabel,department,semester,year}){
  return (
    <div style={{textAlign:'center',padding:'60px 0',color:'#9ca3af',fontSize:16}}>
      Faculty Analytics coming soon...
    </div>
  );
}

function downloadReport(role, activeYears, rangeLabel, semester, department, year) {
  // Use real analyticsData if available, otherwise fall back to static data
  let realData = null;
  
  // Try to get real data from component state
  if (window.analyticsData) {
    realData = window.analyticsData;
  } else {
    // Fallback to static data if real data not available
    const yearData = getYearSemesterSpecificStaticData(year, semester);
    realData = yearData;
  }
  
  const filteredDeptData = department === 'All Departments' 
    ? realData.departmentData 
    : realData.departmentData.filter(dept => dept.name === department);
  
  const reportContent = 'Year,Students,Faculty,Avg Attendance,Avg Pass Rate,Courses,Semester,Department\n' +
    activeYears.map(year => {
      const attendanceRecord = realData.attendanceData.find(d => d.year === year);
      const performanceRecord = realData.performanceData.find(d => d.year === year);
      const totalStudents = filteredDeptData.reduce((sum, dept) => sum + dept.students, 0);
      const totalFaculty = filteredDeptData.reduce((sum, dept) => sum + dept.faculty, 0);
      const avgAttendance = attendanceRecord ? attendanceRecord.attendance : realData.summaryData.averageAttendance || 'N/A';
      const avgPassRate = performanceRecord ? performanceRecord.passRate : realData.summaryData.averagePerformance || 'N/A';
      const courses = realData.summaryData.courses || 'N/A';
      
      return [year, totalStudents, totalFaculty, avgAttendance + '%', avgPassRate + '%', courses, semester, department];
    }).join('\n');
  
  const blob = new Blob([reportContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CMS_' + role + '_students_' + year + '_' + semester + '_' + department + '_' + rangeLabel.replace(/[\s\-]/g, '_') + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AnalyticsPage({role:propRole}){
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef(null);

  const storedRole = localStorage.getItem('cmsRole') || 'student';
  const role = getValidRole(propRole||searchParams.get('role')||storedRole);
  const data = cmsRoles[role];
  const menuGroups = roleMenuGroups[role]||roleMenuGroups.student;

  const [selectedRange, setSelectedRange] = useState(YEAR_RANGES[0]);
  const [department, setDepartment] = useState(DEPT_OPTS[0]);

  // Dynamic semester options based on selected year range
  const getSemesterOptions = (range) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11 (0 = January)
    const rangeStartYear = parseInt(range.start);
    
    // Calculate how many years have passed since the start of the range
    const yearsPassed = currentYear - rangeStartYear;
    
    // Each year has 2 semesters, so calculate current semester number
    // If we're in first 6 months (0-5), we're in the first semester of the year
    // If we're in last 6 months (6-11), we're in the second semester of the year
    const semesterInYear = currentMonth < 6 ? 1 : 2;
    const currentSemesterNum = Math.min((yearsPassed * 2) + semesterInYear, 12);
    
    // Special adjustments for specific ranges
    let adjustedSemesterNum = currentSemesterNum;
    if (range.label === '2023-2027') {
      adjustedSemesterNum = 6; // Special case for 2023-2027
    } else if (range.label === '2024-2028') {
      adjustedSemesterNum = 4; // Special case for 2024-2028
    } else if (range.label === '2025-2029') {
      adjustedSemesterNum = 2; // Special case for 2025-2029
    }
    
    // Get previous 3 semesters + current semester
    const semesterOptions = [];
    for (let i = adjustedSemesterNum; i >= Math.max(1, adjustedSemesterNum - 3); i--) {
      const semesterLabel = i === adjustedSemesterNum ? `Semester ${i} (Current)` : `Semester ${i}`;
      semesterOptions.push(semesterLabel);
    }
    return semesterOptions;
  };

  const currentSemesterOptions = useMemo(() => getSemesterOptions(selectedRange), [selectedRange]);
  const [semester, setSemester] = useState(() => {
    const options = getSemesterOptions(selectedRange);
    return options[0];
  });

  useEffect(()=>{
    function onOut(e){
      if(calRef.current && !calRef.current.contains(e.target)) setCalOpen(false);
    }
    if(calOpen) document.addEventListener('mousedown',onOut);
    return () => document.removeEventListener('mousedown',onOut);
  },[calOpen]);

  const activeYears = useMemo(()=>{
    const sk=myToKey(selectedRange.start), ek=myToKey(selectedRange.end), lo=Math.min(sk,ek), hi=Math.max(sk,ek);
    const res=[];
    for(let k=lo;k<=hi;k++){
      const year = keyToYear(k);
      res.push(year);
    }
    return res;
  },[selectedRange]);

  const rangeLabel = myToKey(selectedRange.start)===myToKey(selectedRange.end)?myLabel(selectedRange.start):`${myLabel(selectedRange.start)} - ${myLabel(selectedRange.end)}`;
  const triggerLabel = myToKey(selectedRange.start)===myToKey(selectedRange.end)?myLabel(selectedRange.start):`${myLabel(selectedRange.start)} -> ${myLabel(selectedRange.end)}`;

  useEffect(()=>{
    document.title=`MIT Connect - ${data.label} Analytics`;
    localStorage.setItem('cmsRole',role);
  },[data.label,role]);
  
  function handleLogout(){
    destroyUserSession();
    navigate('/',{replace:true});
  }

  function FilterBar(){
    return (
      <div style={{marginBottom:32,padding:'24px 28px',background:'#fff',borderRadius:12,border:'1px solid #e5e7eb'}}>
        <div style={{display:'flex',alignItems:'flex-end',gap:16,flexWrap:'wrap',marginBottom:16}}>
          
          <div>
            <div style={{fontSize:12,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:.5,marginBottom:8}}>Semester</div>
            <select 
              value={semester} 
              onChange={e=>setSemester(e.target.value)} 
              style={{
                height:44,
                padding:'0 12px',
                borderRadius:10,
                border:'2px solid #e5e7eb',
                background:'#fff',
                fontSize:14,
                fontWeight:600,
                color:'#374151',
                cursor:'pointer',
                outline:'none',
                appearance:'none',
                WebkitAppearance:'none',
                minWidth:180
              }}
            >
              {currentSemesterOptions.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <div style={{fontSize:12,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:.5,marginBottom:8}}>Year Range</div>
            <select 
              value={selectedRange.label} 
              onChange={e => {
                const selected = YEAR_RANGES.find(r => r.label === e.target.value);
                setSelectedRange(selected || YEAR_RANGES[0]);
                // Update semester to the current semester of the new range
                const newSemesterOptions = getSemesterOptions(selected || YEAR_RANGES[0]);
                setSemester(newSemesterOptions[0]); // Set to the first (current) semester
              }} 
              style={{
                height:44,
                padding:'0 12px',
                borderRadius:10,
                border:'2px solid #e5e7eb',
                background:'#fff',
                fontSize:14,
                fontWeight:600,
                color:'#374151',
                cursor:'pointer',
                outline:'none',
                appearance:'none',
                WebkitAppearance:'none',
                minWidth:140
              }}
            >
              {YEAR_RANGES.map(r => (<option key={r.label}>{r.label}</option>))}
            </select>
          </div>

          {role!=='student' && (
            <div>
              <div style={{fontSize:12,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:.5,marginBottom:8}}>Department</div>
              <select 
                value={department} 
                onChange={e=>setDepartment(e.target.value)} 
                style={{
                  height:44,
                  padding:'0 12px',
                  borderRadius:10,
                  border:'2px solid #e5e7eb',
                  background:'#fff',
                  fontSize:14,
                  fontWeight:600,
                  color:'#374151',
                  cursor:'pointer',
                  outline:'none',
                  appearance:'none',
                  WebkitAppearance:'none',
                  minWidth:200
                }}
              >
                {DEPT_OPTS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          )}

          <div>
            <div style={{fontSize:12,fontWeight:700,color:'transparent',marginBottom:8}}>-</div>
            <button 
              onClick={()=>{
                setSelectedRange(YEAR_RANGES[0]);
                setSemester(YEAR_RANGES[0].currentSemester);
                setDepartment(DEPT_OPTS[0]);
              }} 
              style={{
                height:44,
                padding:'0 16px',
                borderRadius:10,
                border:'2px solid #e5e7eb',
                background:'#f9fafb',
                color:'#6b7280',
                fontSize:13,
                fontWeight:600,
                cursor:'pointer'
              }}
            >
              Reset
            </button>
          </div>

          <div style={{marginLeft:'auto'}}>
            <div style={{fontSize:12,fontWeight:700,color:'transparent',marginBottom:8}}>-</div>
            <button 
              onClick={() => downloadReport(role, activeYears, rangeLabel, semester, department, selectedRange.start)}
              style={{
                display:'flex',
                alignItems:'center',
                gap:8,
                height:44,
                padding:'0 20px',
                borderRadius:10,
                border:'none',
                background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color:'#fff',
                fontSize:14,
                fontWeight:700,
                cursor:'pointer',
                boxShadow:'0 4px 12px rgba(37,99,235,.3)'
              }}
            >
              <Ico.Download/> Download Report
            </button>
          </div>
        </div>

        <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:12,color:'#9ca3af'}}>Showing:</span>
          <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:999,background:'#eff6ff',color:'#2563eb',border:'1px solid #bfdbfe'}}>{triggerLabel}</span>
          <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:999,background:'#f5f3ff',color:'#7c3aed',border:'1px solid #ddd6fe'}}>{semester}</span>
          {department!==DEPT_OPTS[0] && <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:999,background:'#f0fdf4',color:'#16a34a',border:'1px solid #bbf7d0'}}>{department}</span>}
          {activeYears.length===4 && <span style={{fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:999,background:'#fff7ed',color:'#c2410c',border:'1px solid #fed7aa'}}>4 years</span>}
        </div>
      </div>
    );
  }

  return (
    <div style={{padding: '20px 24px'}}>
      <FilterBar/>
      
      {role==='admin' && <AdminView activeYears={activeYears} rangeLabel={rangeLabel} department={department} semester={semester} year={selectedRange.start}/>}
      {role==='finance' && <FinanceView activeYears={activeYears} rangeLabel={rangeLabel} department={department} semester={semester} year={selectedRange.start}/>}
      {role==='faculty' && <FacultyView activeYears={activeYears} rangeLabel={rangeLabel} department={department} semester={semester} year={selectedRange.start}/>}
      {role==='student' && <div style={{textAlign:'center',padding:'60px 0',color:'#9ca3af',fontSize:14}}>Student analytics coming soon</div>}
    </div>
  );
}
