-- Create sample users with authentication
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
-- Patient user
(
    'a1b2c3d4-e5f6-4321-a123-123456789abc',
    '00000000-0000-0000-0000-000000000000',
    'patient@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "patient", "name": "John Smith"}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    '',
    '',
    ''
),
-- Doctor user
(
    'b2c3d4e5-f6a7-5432-b234-234567890bcd',
    '00000000-0000-0000-0000-000000000000',
    'doctor@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "practitioner", "name": "Dr. Sarah Johnson"}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    '',
    '',
    ''
),
-- Admin user
(
    'c3d4e5f6-a7b8-6543-c345-345678901def',
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "name": "Admin User"}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    '',
    '',
    ''
);

-- Insert sample patient data
INSERT INTO patient_data (patient_id, fhir_resource_bundle)
VALUES (
    'a1b2c3d4-e5f6-4321-a123-123456789abc',
    '{
        "resourceType": "Bundle",
        "type": "collection",
        "entry": [
            {
                "resource": {
                    "resourceType": "Patient",
                    "id": "a1b2c3d4-e5f6-4321-a123-123456789abc",
                    "active": true,
                    "name": [
                        {
                            "use": "official",
                            "family": "Smith",
                            "given": ["John"]
                        }
                    ],
                    "gender": "male",
                    "birthDate": "1990-01-01",
                    "address": [
                        {
                            "use": "home",
                            "type": "physical",
                            "line": ["123 Main St"],
                            "city": "Brisbane",
                            "state": "QLD",
                            "postalCode": "4000",
                            "country": "Australia"
                        }
                    ]
                }
            },
            {
                "resource": {
                    "resourceType": "CarePlan",
                    "id": "cp1",
                    "status": "active",
                    "intent": "plan",
                    "title": "Diabetes Management Plan",
                    "subject": {
                        "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
                    },
                    "period": {
                        "start": "2024-01-01",
                        "end": "2024-12-31"
                    },
                    "careTeam": [
                        {
                            "reference": "CareTeam/ct1"
                        }
                    ],
                    "activity": [
                        {
                            "detail": {
                                "code": {
                                    "coding": [
                                        {
                                            "system": "http://example.org/codes",
                                            "code": "glucose-monitoring",
                                            "display": "Blood Glucose Monitoring"
                                        }
                                    ]
                                },
                                "status": "in-progress",
                                "scheduledTiming": {
                                    "repeat": {
                                        "frequency": 3,
                                        "period": 1,
                                        "periodUnit": "d"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                "resource": {
                    "resourceType": "CareTeam",
                    "id": "ct1",
                    "status": "active",
                    "name": "Diabetes Care Team",
                    "participant": [
                        {
                            "role": [
                                {
                                    "coding": [
                                        {
                                            "system": "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                                            "code": "primary",
                                            "display": "Primary Care Physician"
                                        }
                                    ]
                                }
                            ],
                            "member": {
                                "reference": "Practitioner/b2c3d4e5-f6a7-5432-b234-234567890bcd",
                                "display": "Dr. Sarah Johnson"
                            }
                        }
                    ]
                }
            }
        ]
    }'
); 