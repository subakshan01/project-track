# TechTrack MongoDB Schema Design

## Collections Overview

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│    Users     │────>│   Projects  │────>│ RoleRequests │
│ (staff/student)│   │ (vacancies) │     │ (pending/    │
└─────────────┘     └─────────────┘     │  approved/   │
       │                   │             │  rejected)   │
       │                   │             └──────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐
│  Documents  │     │ ChatMessages │
│ (verification)│   │ (per-project)│
└─────────────┘     └──────────────┘
                          │
┌─────────────┐           │
│Notifications│◄──────────┘
│ (in-app)    │
└─────────────┘
```

## Users Collection
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique, login credential |
| password | String | Bcrypt hashed |
| role | Enum | 'student' or 'staff' |
| department | String | CS, IT, ECE, etc. |
| studentId | String | Student: unique ID |
| rollNumber | String | Student: roll number |
| year | Number | Student: studying year (1-5) |
| languages | [String] | Student: programming languages |
| preferredRole | String | Student: preferred project role |
| cabinNumber | String | Staff: office location |
| floor | String | Staff: building floor |
| yearsExperience | Number | Staff: years of experience |
| linkedIn | String | Staff: LinkedIn URL |
| contactNumber | String | Staff: phone number |
| availability | Enum | Staff: Available/Busy/Not Interested |
| photo | String | Profile photo URL |
| bio | String | Short bio (max 500 chars) |

## Projects Collection
| Field | Type | Description |
|-------|------|-------------|
| name | String | Project name |
| description | String | Full description |
| department | String | Department |
| maxMembers | Number | Maximum team size |
| status | Enum | Not Started/Ongoing/Completed |
| level | Enum | Low/Medium/High |
| vacancies | [Vacancy] | Array of vacancy subdocuments |
| members | [Member] | Array of team members |
| staff | ObjectId→User | Project lead (staff) |
| archived | Boolean | Whether project is archived |
| archivedAt | Date | Archive date |
| outcomes | String | Project outcomes |
| teamSummary | String | Team summary |

### Vacancy Subdocument
| Field | Type | Description |
|-------|------|-------------|
| role | String | Role name |
| requiredSkills | [String] | Required skills |
| filled | Boolean | Whether filled |
| assignedTo | ObjectId→User | Assigned student |

## RoleRequests Collection
| Field | Type | Description |
|-------|------|-------------|
| project | ObjectId→Project | Target project |
| student | ObjectId→User | Requesting student |
| vacancyId | ObjectId | Target vacancy |
| role | String | Role name |
| experienceDescription | String | Student's experience |
| status | Enum | pending/approved/rejected |
| reviewedBy | ObjectId→User | Reviewing staff |
| reviewComment | String | Staff comment |

## Notifications Collection
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId→User | Target user |
| type | Enum | Notification type |
| title | String | Notification title |
| message | String | Full message |
| read | Boolean | Read status |
| project | ObjectId→Project | Related project |
| link | String | Frontend link |

## ChatMessages Collection
| Field | Type | Description |
|-------|------|-------------|
| project | ObjectId→Project | Project discussion |
| user | ObjectId→User | Message author |
| message | String | Message text |
| parentMessage | ObjectId→ChatMessage | Reply target |

## Documents Collection
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId→User | Uploader |
| type | Enum | resume/certificate/project_proof |
| title | String | Document title |
| filePath | String | Server file path |
| verificationStatus | Enum | pending/verified/rejected |
| verifiedBy | ObjectId→User | Verifying staff |
| staffComment | String | Verification comment |
