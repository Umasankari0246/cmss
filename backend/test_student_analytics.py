import requests
import json

def test_student_analytics():
    response = requests.get("http://127.0.0.1:5000/api/analytics/dashboard")
    data = response.json()
    
    if data.get("success"):
        student_data = data.get("data", {}).get("studentAnalytics", {})
        
        print("=" * 60)
        print("🎓 STUDENT ANALYTICS FROM MONGODB")
        print("=" * 60)
        
        # Demographics
        print("\n📊 DEMOGRAPHICS:")
        print(f"   Total Students: {student_data.get('demographics', {}).get('totalStudents', 'N/A')}")
        print(f"   Gender Distribution: {student_data.get('demographics', {}).get('byGender', {})}")
        print(f"   Age Groups: {student_data.get('demographics', {}).get('byAgeGroup', {})}")
        print(f"   States: {student_data.get('demographics', {}).get('byState', {})}")
        print(f"   Categories: {student_data.get('demographics', {}).get('byCategory', {})}")
        
        # Academic Performance
        print("\n📚 ACADEMIC PERFORMANCE:")
        print(f"   Average CGPA: {student_data.get('academicPerformance', {}).get('averageCGPA', 'N/A')}")
        print(f"   CGPA Distribution:")
        cgpa_dist = student_data.get('academicPerformance', {}).get('cgpaDistribution', {})
        for range_key, data in cgpa_dist.items():
            print(f"     {range_key}: {data.get('count', 0)} students")
        
        print(f"\n   🏆 Top Performers:")
        for i, performer in enumerate(student_data.get('academicPerformance', {}).get('topPerformers', []), 1):
            print(f"     {i}. {performer.get('name', 'N/A')} - CGPA: {performer.get('cgpa', 'N/A')}, Dept: {performer.get('department', 'N/A')}")
        
        print(f"\n   ⚠️  At-Risk Students:")
        for i, student in enumerate(student_data.get('academicPerformance', {}).get('atRiskStudents', []), 1):
            print(f"     {i}. {student.get('name', 'N/A')} - CGPA: {student.get('cgpa', 'N/A')}, Risk: {student.get('risk', 'N/A')}")
        
        # Attendance
        print("\n📅 ATTENDANCE:")
        print(f"   Average Attendance: {student_data.get('attendance', {}).get('averageAttendance', 'N/A')}%")
        print(f"   Perfect Attendance: {student_data.get('attendance', {}).get('perfectAttendance', 'N/A')} students")
        print(f"   Department-wise Attendance:")
        dept_att = student_data.get('attendance', {}).get('byDepartment', {})
        for dept, att in dept_att.items():
            print(f"     {dept}: {att}%")
        
        # Enrollment
        print("\n📝 ENROLLMENT:")
        print(f"   By Semester: {student_data.get('enrollment', {}).get('bySemester', {})}")
        print(f"   By Year: {student_data.get('enrollment', {}).get('byYear', {})}")
        print(f"   Dropout Rate: {student_data.get('enrollment', {}).get('dropoutRate', 'N/A')}%")
        print(f"   New Enrollments: {student_data.get('enrollment', {}).get('newEnrollments', 'N/A')}")
        
        # Placements
        print("\n💼 PLACEMENTS:")
        print(f"   Placed Students: {student_data.get('placements', {}).get('placedStudents', 'N/A')}")
        print(f"   Placement Rate: {student_data.get('placements', {}).get('placementRate', 'N/A')}%")
        print(f"   Companies: {student_data.get('placements', {}).get('companies', [])}")
        print(f"   Average Package: {student_data.get('placements', {}).get('averagePackage', 'N/A')} LPA")
        
        print("\n" + "=" * 60)
        print("✅ Student analytics successfully fetched from MongoDB!")
        print("=" * 60)
        
    else:
        print("❌ Error:", data.get("error", "Unknown error"))

if __name__ == "__main__":
    test_student_analytics()
