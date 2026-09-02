## ADDED Requirements

### Requirement: Admin MUST manage trails

The system MUST allow only users with ADMIN role to create, update, and remove trails.

#### Scenario: Admin creates trail

- **WHEN** an authenticated ADMIN submits valid trail data
- **THEN** the system creates the trail and returns success

#### Scenario: Non-admin attempts trail write operation

- **WHEN** an authenticated non-admin user requests create, update, or delete trail
- **THEN** the system denies the operation with authorization error

### Requirement: Public trail listing MUST expose only published trails

The system MUST allow anonymous and authenticated users to view only trails marked as published and not soft deleted.

#### Scenario: Public list hides unpublished trail

- **WHEN** a consumer requests trail listing and a trail is unpublished or soft deleted
- **THEN** the trail is excluded from public response

#### Scenario: Public get by id for published trail

- **WHEN** a consumer requests a trail by id and the trail is published
- **THEN** the system returns the trail data

#### Scenario: Public access to soft deleted trail

- **WHEN** a consumer requests a trail that is soft deleted
- **THEN** the system MUST NOT expose the resource in public response

### Requirement: Trail deletion MUST be soft delete

The system MUST implement trail deletion as logical removal and MUST preserve historical integrity for references and progress records.

#### Scenario: Soft delete trail

- **WHEN** an ADMIN requests trail deletion
- **THEN** the system marks the trail as deleted logically without physical removal

### Requirement: Trail payload MUST support publication lifecycle

The system MUST support publication state transition through isPublished while preserving editability by ADMIN.

#### Scenario: Admin publishes trail

- **WHEN** an ADMIN updates a trail setting isPublished=true
- **THEN** the trail becomes eligible for public listing

### Requirement: Trail update via PUT MUST be partial semantic

The system MUST treat PUT update payload as partial input, preserving existing values for omitted fields.

#### Scenario: PUT updates only provided fields

- **WHEN** an ADMIN sends PUT with only a subset of mutable trail fields
- **THEN** the system updates only provided fields and preserves omitted values
