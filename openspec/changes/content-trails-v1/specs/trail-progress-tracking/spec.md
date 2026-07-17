## ADDED Requirements

### Requirement: System MUST track user progress per trail item

The system MUST record when a user visualizes a trail item so progress can be calculated per trail.

#### Scenario: Mark item as viewed

- **WHEN** an authenticated user visualizes a trail item
- **THEN** the system records progress for that user, trail, and item

### Requirement: System MUST provide trail completion percentage

The system MUST compute and expose progress percentage for each user trail context considering only active and published trail items.

#### Scenario: Partial progress percentage

- **WHEN** a user has viewed part of the items in a trail
- **THEN** the system returns completion percentage greater than zero and lower than one hundred

#### Scenario: Inactive or unpublished items are excluded from percentage

- **WHEN** a trail contains inactive or unpublished items
- **THEN** the system excludes those items from progress percentage denominator

### Requirement: System MUST indicate trail completion status

The system MUST mark a trail as completed only when all required items (isRequired=true) are completed according to the configured criteria.

#### Scenario: Trail completed

- **WHEN** a user meets completion criteria for a trail
- **THEN** the system marks the trail status as completed for that user

#### Scenario: Optional items do not block completion

- **WHEN** a user completes all required items and leaves optional items pending
- **THEN** the system still marks the trail as completed

### Requirement: Progress model MUST support future content types

Progress records MUST be compatible with additional content types beyond VIDEO without structural break.

#### Scenario: Progress schema uses content-aware reference

- **WHEN** the system stores progress information for trail item visualization
- **THEN** the persisted model remains valid for polymorphic trail items defined by contentType and contentId

### Requirement: Progress reconciliation MUST follow hybrid strategy after trail changes

The system MUST preserve historical progress records and MUST reconcile completion/percentage using a hybrid strategy when trail composition changes.

#### Scenario: Trail updated after user progress exists

- **WHEN** trail items are added, removed, or reordered after a user already has recorded progress
- **THEN** the system preserves historical item progress and recomputes derived trail progress using the active composition policy
