-- Drop existing objects if they exist
DROP POLICY IF EXISTS "Users can read their own patient data" ON patient_data;
DROP POLICY IF EXISTS "Users can insert their own patient data" ON patient_data;
DROP POLICY IF EXISTS "Users can update their own patient data" ON patient_data;
DROP POLICY IF EXISTS "Users can delete their own patient data" ON patient_data;

-- Enable RLS on patient_data table
ALTER TABLE patient_data ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read their own patient data"
ON patient_data
FOR SELECT
USING (auth.uid() = patient_id);

-- Create policy for users to insert their own data
CREATE POLICY "Users can insert their own patient data"
ON patient_data
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

-- Create policy for users to update their own data
CREATE POLICY "Users can update their own patient data"
ON patient_data
FOR UPDATE
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- Create policy for users to delete their own data
CREATE POLICY "Users can delete their own patient data"
ON patient_data
FOR DELETE
USING (auth.uid() = patient_id); 