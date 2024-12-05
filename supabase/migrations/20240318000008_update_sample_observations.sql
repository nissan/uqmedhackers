-- Update the patient data with the new FHIR bundle
UPDATE patient_data
SET fhir_resource_bundle = '{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "id": "a1b2c3d4-e5f6-4321-a123-123456789abc",
        "name": [
          {
            "use": "official",
            "given": ["John"],
            "family": "Smith"
          }
        ],
        "active": true,
        "gender": "male",
        "address": [
          {
            "use": "home",
            "city": "Brisbane",
            "line": ["123 Main St"],
            "type": "physical",
            "state": "QLD",
            "country": "Australia",
            "postalCode": "4000"
          }
        ],
        "birthDate": "1990-01-01",
        "resourceType": "Patient"
      }
    },
    {
      "resource": {
        "id": "cp1",
        "title": "Diabetes Management Plan",
        "intent": "plan",
        "period": {
          "end": "2024-12-31",
          "start": "2024-01-01"
        },
        "status": "active",
        "subject": {
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "activity": [
          {
            "detail": {
              "code": {
                "coding": [
                  {
                    "code": "glucose-monitoring",
                    "system": "http://example.org/codes",
                    "display": "Blood Glucose Monitoring"
                  }
                ]
              },
              "status": "in-progress",
              "scheduledTiming": {
                "repeat": {
                  "period": 1,
                  "frequency": 3,
                  "periodUnit": "d"
                }
              }
            }
          }
        ],
        "careTeam": [
          {
            "reference": "CareTeam/ct1"
          }
        ],
        "resourceType": "CarePlan"
      }
    },
    {
      "resource": {
        "id": "ct1",
        "name": "Diabetes Care Team",
        "status": "active",
        "participant": [
          {
            "role": [
              {
                "coding": [
                  {
                    "code": "primary",
                    "system": "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    "display": "Primary Care Physician"
                  }
                ]
              }
            ],
            "member": {
              "display": "Dr. Sarah Johnson",
              "reference": "Practitioner/b2c3d4e5-f6a7-5432-b234-234567890bcd"
            }
          }
        ],
        "resourceType": "CareTeam"
      }
    },
    {
      "resource": {
        "id": "blood-sugar-level",
        "code": {
          "text": "Blood Sugar Level",
          "coding": [
            {
              "code": "15074-8",
              "system": "http://loinc.org",
              "display": "Glucose [Mass/volume] in Capillary blood"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "vital-signs",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Vital Signs"
              }
            ]
          }
        ],
        "resourceType": "Observation",
        "valueQuantity": {
          "code": "mg/dL",
          "unit": "mg/dL",
          "value": 105,
          "system": "http://unitsofmeasure.org"
        },
        "effectiveDateTime": "2024-12-05T10:06:00.000Z"
      }
    },
    {
      "resource": {
        "id": "blood-pressure",
        "code": {
          "text": "Blood Pressure",
          "coding": [
            {
              "code": "85354-9",
              "system": "http://loinc.org",
              "display": "Blood pressure panel with all children optional"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "vital-signs",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Vital Signs"
              }
            ]
          }
        ],
        "component": [
          {
            "code": {
              "text": "Systolic Blood Pressure",
              "coding": [
                {
                  "code": "8480-6",
                  "system": "http://loinc.org",
                  "display": "Systolic blood pressure"
                }
              ]
            },
            "valueQuantity": {
              "code": "mm[Hg]",
              "unit": "mmHg",
              "value": 145,
              "system": "http://unitsofmeasure.org"
            }
          },
          {
            "code": {
              "text": "Diastolic Blood Pressure",
              "coding": [
                {
                  "code": "8462-4",
                  "system": "http://loinc.org",
                  "display": "Diastolic blood pressure"
                }
              ]
            },
            "valueQuantity": {
              "code": "mm[Hg]",
              "unit": "mmHg",
              "value": 90,
              "system": "http://unitsofmeasure.org"
            }
          }
        ],
        "resourceType": "Observation",
        "effectiveDateTime": "2024-12-05T10:08:00.000Z"
      }
    },
    {
      "resource": {
        "id": "369cbcf0-e5e1-58de-95ff-329f5792cfdb",
        "code": {
          "text": "Steps",
          "coding": [
            {
              "code": "55423-8",
              "system": "http://loinc.org",
              "display": "Steps"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "activity",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Activity"
              }
            ]
          }
        ],
        "resourceType": "Observation",
        "valueQuantity": {
          "code": "count",
          "unit": "count",
          "value": 14368,
          "system": "http://unitsofmeasure.org"
        },
        "effectiveDateTime": "2024-12-02T14:00:00+00:00"
      }
    },
    {
      "resource": {
        "id": "7a73a270-88b6-5fba-9ee2-6e4fbf3520be",
        "code": {
          "text": "Active Hours",
          "coding": [
            {
              "code": "55423-8",
              "system": "http://loinc.org",
              "display": "Active Hours"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "activity",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Activity"
              }
            ]
          }
        ],
        "resourceType": "Observation",
        "valueQuantity": {
          "code": "h",
          "unit": "hour",
          "value": 16,
          "system": "http://unitsofmeasure.org"
        },
        "effectiveDateTime": "2024-12-02T14:00:00+00:00"
      }
    },
    {
      "resource": {
        "id": "ba8e4112-e6fc-55ff-975e-214925ac3cca",
        "code": {
          "text": "Active Hours",
          "coding": [
            {
              "code": "55423-8",
              "system": "http://loinc.org",
              "display": "Active Hours"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "activity",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Activity"
              }
            ]
          }
        ],
        "resourceType": "Observation",
        "valueQuantity": {
          "code": "h",
          "unit": "hour",
          "value": 15,
          "system": "http://unitsofmeasure.org"
        },
        "effectiveDateTime": "2024-12-03T14:00:00+00:00"
      }
    },
    {
      "resource": {
        "id": "ba3b0f66-cbc0-5054-be65-67bb08e4562a",
        "code": {
          "text": "Heart Rate during Sleep",
          "coding": [
            {
              "code": "9279-1",
              "system": "http://loinc.org",
              "display": "Heart Rate during Sleep"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "vital-signs",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Vital Signs"
              }
            ]
          }
        ],
        "resourceType": "Observation",
        "valueQuantity": {
          "code": "bpm",
          "unit": "bpm",
          "value": 49,
          "system": "http://unitsofmeasure.org"
        },
        "effectiveDateTime": "2024-12-02T14:00:00+00:00"
      }
    },
    {
      "resource": {
        "id": "94931ed8-7b9e-5676-afda-4ac722ed9817",
        "code": {
          "text": "Heart Rate during Sleep",
          "coding": [
            {
              "code": "9279-1",
              "system": "http://loinc.org",
              "display": "Heart Rate during Sleep"
            }
          ]
        },
        "status": "final",
        "subject": {
          "display": "John Smith",
          "reference": "Patient/a1b2c3d4-e5f6-4321-a123-123456789abc"
        },
        "category": [
          {
            "coding": [
              {
                "code": "vital-signs",
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "display": "Vital Signs"
              }
            ]
          }
        ],
        "resourceType": "Observation",
        "valueQuantity": {
          "code": "bpm",
          "unit": "bpm",
          "value": 48,
          "system": "http://unitsofmeasure.org"
        },
        "effectiveDateTime": "2024-12-03T14:00:00+00:00"
      }
    }
  ]
}'::jsonb
WHERE patient_id = 'a1b2c3d4-e5f6-4321-a123-123456789abc'; 