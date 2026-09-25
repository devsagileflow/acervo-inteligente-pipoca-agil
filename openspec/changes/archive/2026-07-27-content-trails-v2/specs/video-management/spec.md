## ADDED Requirements

### Requirement: Admin MUST manage videos

The system MUST allow only users with ADMIN role to create, update, and remove video records.

#### Scenario: Admin creates video

- **WHEN** an authenticated ADMIN submits valid video data
- **THEN** the system creates the video and returns success

#### Scenario: Non-admin attempts write operation

- **WHEN** an authenticated non-admin user requests create, update, or delete video
- **THEN** the system denies the operation with authorization error

### Requirement: Public video listing MUST expose only active videos

The system MUST allow anonymous and authenticated users to view only videos marked as active and not soft deleted.

#### Scenario: Public list hides inactive video

- **WHEN** a consumer requests video listing and a video is inactive or soft deleted
- **THEN** the video is excluded from public response

#### Scenario: Public get by id for active video

- **WHEN** a consumer requests a video by id and the video is active
- **THEN** the system returns the video data

#### Scenario: Public access to soft deleted video

- **WHEN** a consumer requests a video that is soft deleted
- **THEN** the system MUST NOT expose the resource in public response

### Requirement: Video input MUST be validated

The system MUST validate YouTube URL format (including all supported YouTube variants) and MUST validate durationInSeconds as a positive integer greater than zero.

#### Scenario: Invalid URL is rejected

- **WHEN** an ADMIN submits video data with invalid URL
- **THEN** the system rejects the request with validation error

#### Scenario: Supported YouTube URL is accepted

- **WHEN** an ADMIN submits video data with a YouTube URL in a supported variant
- **THEN** the system accepts the URL as valid

#### Scenario: Non-positive duration is rejected

- **WHEN** an ADMIN submits durationInSeconds equal to zero or negative
- **THEN** the system rejects the request with validation error

### Requirement: Video deletion MUST be soft delete

The system MUST implement video deletion as logical removal by setting isActive=false and deletedAt with current timestamp.

#### Scenario: Soft delete video

- **WHEN** an ADMIN requests video deletion
- **THEN** the system marks the video as inactive and stores deletedAt without physical removal

### Requirement: Video listing MUST support pagination and title filter

The system MUST support paginated listing and title-based filtering for video queries.

#### Scenario: Paginated filtered listing

- **WHEN** a consumer requests videos with pagination parameters and title filter
- **THEN** the system returns only matching records for the requested page

### Requirement: Video update via PUT MUST be partial semantic

The system MUST treat PUT update payload as partial input, preserving existing values for omitted fields.

#### Scenario: PUT updates only provided fields

- **WHEN** an ADMIN sends PUT with only a subset of mutable video fields
- **THEN** the system updates only provided fields and preserves omitted values
