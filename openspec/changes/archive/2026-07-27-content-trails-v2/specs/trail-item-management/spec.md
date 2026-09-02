## ADDED Requirements

### Requirement: Trail MUST support ordered items

The system MUST allow a trail to be composed by multiple items and MUST preserve ordering by position.

#### Scenario: Add ordered item to trail

- **WHEN** an ADMIN adds an item with position to an existing trail
- **THEN** the item is stored and returned in trail order by ascending position

#### Scenario: Automatic repositioning on position conflict

- **WHEN** an ADMIN adds or updates an item using a position already occupied in the same trail
- **THEN** the system MUST automatically shift affected items to preserve a unique and deterministic ordering

### Requirement: Trail item MUST be content-type driven

Each trail item MUST reference content using contentType and contentId, enabling polymorphic association.

#### Scenario: Item stores content reference

- **WHEN** an ADMIN adds an item to a trail
- **THEN** the system persists contentType and contentId for that item

### Requirement: Initial supported trail item type MUST be VIDEO

In this phase, the system MUST accept VIDEO as the only contentType for trail item creation while preserving extensible model structure for future types.

#### Scenario: Create VIDEO item

- **WHEN** an ADMIN adds a trail item with contentType=VIDEO and valid contentId
- **THEN** the item is accepted and associated to the trail

#### Scenario: Create unsupported type item

- **WHEN** an ADMIN adds a trail item with unsupported contentType
- **THEN** the system rejects the request with validation error

### Requirement: Trail item management MUST be admin-only

The system MUST allow only ADMIN users to create, update, and remove trail items.

#### Scenario: Non-admin attempts item management

- **WHEN** a non-admin user requests add, edit, or delete trail item
- **THEN** the system denies the operation with authorization error

### Requirement: Trail sequencing MUST NOT enforce access lock

Trail order MUST organize user experience and MUST NOT block access to subsequent content items.

#### Scenario: User accesses later content without prior completion

- **WHEN** a user selects an item positioned after other items in the same trail
- **THEN** the system allows access to that item

### Requirement: Trail item MUST remain when referenced video becomes inactive

When a referenced video is deactivated or soft deleted, the trail item MUST remain persisted and manageable by ADMIN.

#### Scenario: Video deactivated with existing trail item

- **WHEN** a video referenced by a trail item is deactivated or soft deleted
- **THEN** the trail item remains in storage and can be updated or removed by ADMIN
