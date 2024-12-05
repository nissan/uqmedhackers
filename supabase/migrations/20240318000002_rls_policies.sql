-- Enable RLS on all tables
ALTER TABLE patient_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create a function to check user role
CREATE OR REPLACE FUNCTION auth.check_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  -- Check if the user has the required role in their metadata
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = required_role
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow authenticated users to read user roles from auth.users
CREATE POLICY "Allow authenticated users to read users"
    ON auth.users
    FOR SELECT
    USING (
        auth.uid() = id
        OR auth.check_user_role('practitioner')
        OR auth.check_user_role('admin')
    );

-- RLS Policies for patient_data table
CREATE POLICY "Users can view their own patient data"
    ON patient_data
    FOR SELECT
    USING (
        patient_id = auth.uid()::text
        OR auth.check_user_role('practitioner')
        OR auth.check_user_role('admin')
    );

CREATE POLICY "Users can insert their own patient data"
    ON patient_data
    FOR INSERT
    WITH CHECK (
        patient_id = auth.uid()::text
        OR auth.check_user_role('practitioner')
        OR auth.check_user_role('admin')
    );

-- RLS Policies for user_profiles table
CREATE POLICY "Users can view their own profile"
    ON user_profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR auth.check_user_role('admin')
    );

CREATE POLICY "Users can update their own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for activity_logs table
CREATE POLICY "Users can view their own activities"
    ON activity_logs
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR auth.check_user_role('admin')
    );

CREATE POLICY "Users can create their own activity logs"
    ON activity_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id); 