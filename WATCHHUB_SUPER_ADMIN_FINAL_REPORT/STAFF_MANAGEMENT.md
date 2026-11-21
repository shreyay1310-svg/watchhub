# 6. STAFF MANAGEMENT

## Staff Onboarding & Account Lifecycle
1. **Onboarding Form**:
   - Accessible via the top right `+ Add Staff Member` button in the Super Admin interface.
   - Captures: Full Name, Email, Phone, Employee ID, Department, and Role.
   - Generates initial secure credentials (`Admin@123`) hashed with bcrypt.
2. **Data Validation**:
   - Frontend and backend email uniqueness verification.
   - Phone format validation.
   - Mandatory role selection.
3. **Directory Features**:
   - Initials avatar styling for quick visual identification.
   - Fast search across names, emails, and phone numbers.
   - Quick action triggers for modal viewing and permission auditing.
