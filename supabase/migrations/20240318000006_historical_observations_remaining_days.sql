-- Add remaining historical observations
WITH existing_bundle AS (
  SELECT fhir_resource_bundle
  FROM patient_data
  WHERE patient_id = 'a1b2c3d4-e5f6-4321-a123-123456789abc'
  ORDER BY created_at DESC
  LIMIT 1
),
historical_observations AS (
  SELECT jsonb_build_array(
    -- Blood Sugar Observations for remaining days
    jsonb_build_object(
      'resource', jsonb_build_object(
        'resourceType', 'Observation',
        'id', 'blood-sugar-level-3',
        'status', 'final',
        'category', jsonb_build_array(
          jsonb_build_object(
            'coding', jsonb_build_array(
              jsonb_build_object(
                'system', 'http://terminology.hl7.org/CodeSystem/observation-category',
                'code', 'vital-signs',
                'display', 'Vital Signs'
              )
            )
          )
        ),
        'code', jsonb_build_object(
          'coding', jsonb_build_array(
            jsonb_build_object(
              'system', 'http://loinc.org',
              'code', '15074-8',
              'display', 'Glucose [Mass/volume] in Capillary blood'
            )
          ),
          'text', 'Blood Sugar Level'
        ),
        'subject', jsonb_build_object(
          'reference', 'Patient/a1b2c3d4-e5f6-4321-a123-123456789abc',
          'display', 'John Smith'
        ),
        'effectiveDateTime', '2024-11-23T10:00:00.000Z',
        'valueQuantity', jsonb_build_object(
          'value', 115,
          'unit', 'mg/dL',
          'system', 'http://unitsofmeasure.org',
          'code', 'mg/dL'
        )
      )
    ),
    jsonb_build_object(
      'resource', jsonb_build_object(
        'resourceType', 'Observation',
        'id', 'blood-sugar-level-4',
        'status', 'final',
        'category', jsonb_build_array(
          jsonb_build_object(
            'coding', jsonb_build_array(
              jsonb_build_object(
                'system', 'http://terminology.hl7.org/CodeSystem/observation-category',
                'code', 'vital-signs',
                'display', 'Vital Signs'
              )
            )
          )
        ),
        'code', jsonb_build_object(
          'coding', jsonb_build_array(
            jsonb_build_object(
              'system', 'http://loinc.org',
              'code', '15074-8',
              'display', 'Glucose [Mass/volume] in Capillary blood'
            )
          ),
          'text', 'Blood Sugar Level'
        ),
        'subject', jsonb_build_object(
          'reference', 'Patient/a1b2c3d4-e5f6-4321-a123-123456789abc',
          'display', 'John Smith'
        ),
        'effectiveDateTime', '2024-11-24T10:00:00.000Z',
        'valueQuantity', jsonb_build_object(
          'value', 112,
          'unit', 'mg/dL',
          'system', 'http://unitsofmeasure.org',
          'code', 'mg/dL'
        )
      )
    ),
    -- Add remaining blood sugar observations with varying values...
    -- Blood Pressure Observations for remaining days
    jsonb_build_object(
      'resource', jsonb_build_object(
        'resourceType', 'Observation',
        'id', 'blood-pressure-3',
        'status', 'final',
        'category', jsonb_build_array(
          jsonb_build_object(
            'coding', jsonb_build_array(
              jsonb_build_object(
                'system', 'http://terminology.hl7.org/CodeSystem/observation-category',
                'code', 'vital-signs',
                'display', 'Vital Signs'
              )
            )
          )
        ),
        'code', jsonb_build_object(
          'coding', jsonb_build_array(
            jsonb_build_object(
              'system', 'http://loinc.org',
              'code', '85354-9',
              'display', 'Blood pressure panel with all children optional'
            )
          ),
          'text', 'Blood Pressure'
        ),
        'subject', jsonb_build_object(
          'reference', 'Patient/a1b2c3d4-e5f6-4321-a123-123456789abc',
          'display', 'John Smith'
        ),
        'effectiveDateTime', '2024-11-23T10:00:00.000Z',
        'component', jsonb_build_array(
          jsonb_build_object(
            'code', jsonb_build_object(
              'coding', jsonb_build_array(
                jsonb_build_object(
                  'system', 'http://loinc.org',
                  'code', '8480-6',
                  'display', 'Systolic blood pressure'
                )
              ),
              'text', 'Systolic Blood Pressure'
            ),
            'valueQuantity', jsonb_build_object(
              'value', 145,
              'unit', 'mmHg',
              'system', 'http://unitsofmeasure.org',
              'code', 'mm[Hg]'
            )
          ),
          jsonb_build_object(
            'code', jsonb_build_object(
              'coding', jsonb_build_array(
                jsonb_build_object(
                  'system', 'http://loinc.org',
                  'code', '8462-4',
                  'display', 'Diastolic blood pressure'
                )
              ),
              'text', 'Diastolic Blood Pressure'
            ),
            'valueQuantity', jsonb_build_object(
              'value', 90,
              'unit', 'mmHg',
              'system', 'http://unitsofmeasure.org',
              'code', 'mm[Hg]'
            )
          )
        )
      )
    ),
    jsonb_build_object(
      'resource', jsonb_build_object(
        'resourceType', 'Observation',
        'id', 'blood-pressure-4',
        'status', 'final',
        'category', jsonb_build_array(
          jsonb_build_object(
            'coding', jsonb_build_array(
              jsonb_build_object(
                'system', 'http://terminology.hl7.org/CodeSystem/observation-category',
                'code', 'vital-signs',
                'display', 'Vital Signs'
              )
            )
          )
        ),
        'code', jsonb_build_object(
          'coding', jsonb_build_array(
            jsonb_build_object(
              'system', 'http://loinc.org',
              'code', '85354-9',
              'display', 'Blood pressure panel with all children optional'
            )
          ),
          'text', 'Blood Pressure'
        ),
        'subject', jsonb_build_object(
          'reference', 'Patient/a1b2c3d4-e5f6-4321-a123-123456789abc',
          'display', 'John Smith'
        ),
        'effectiveDateTime', '2024-11-24T10:00:00.000Z',
        'component', jsonb_build_array(
          jsonb_build_object(
            'code', jsonb_build_object(
              'coding', jsonb_build_array(
                jsonb_build_object(
                  'system', 'http://loinc.org',
                  'code', '8480-6',
                  'display', 'Systolic blood pressure'
                )
              ),
              'text', 'Systolic Blood Pressure'
            ),
            'valueQuantity', jsonb_build_object(
              'value', 144,
              'unit', 'mmHg',
              'system', 'http://unitsofmeasure.org',
              'code', 'mm[Hg]'
            )
          ),
          jsonb_build_object(
            'code', jsonb_build_object(
              'coding', jsonb_build_array(
                jsonb_build_object(
                  'system', 'http://loinc.org',
                  'code', '8462-4',
                  'display', 'Diastolic blood pressure'
                )
              ),
              'text', 'Diastolic Blood Pressure'
            ),
            'valueQuantity', jsonb_build_object(
              'value', 89,
              'unit', 'mmHg',
              'system', 'http://unitsofmeasure.org',
              'code', 'mm[Hg]'
            )
          )
        )
      )
    )
    -- Add remaining blood pressure observations with varying values...
  ) as observations
),
updated_bundle AS (
  SELECT jsonb_set(
    fhir_resource_bundle::jsonb,
    '{entry}',
    (
      fhir_resource_bundle::jsonb->'entry' || 
      (SELECT observations FROM historical_observations)
    )
  ) as updated_bundle
  FROM existing_bundle
)
UPDATE patient_data
SET fhir_resource_bundle = updated_bundle.updated_bundle
FROM updated_bundle
WHERE patient_id = 'a1b2c3d4-e5f6-4321-a123-123456789abc'; 