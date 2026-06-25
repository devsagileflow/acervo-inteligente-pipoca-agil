## ADDED Requirements

### Requirement: Event tracking ingestion

The system SHALL accept a unitary analytics event request for interaction tracking.

#### Scenario: Store a click event

- **WHEN** a client sends a valid click event payload
- **THEN** the system SHALL validate the payload and persist the event

#### Scenario: Reject invalid payloads

- **WHEN** a client sends an event with an invalid event type or missing required fields
- **THEN** the system SHALL reject the request with a validation error

### Requirement: Event context capture

The system SHALL persist enough context for analysis of interaction events.

#### Scenario: Capture click metadata

- **WHEN** a click event is recorded
- **THEN** the system SHALL store the page path, target identifier, and event timestamp

#### Scenario: Capture actor identity

- **WHEN** an event is recorded for an authenticated user or anonymous visitor
- **THEN** the system SHALL associate the event with either the user identifier or the anonymous identifier

### Requirement: Event analytics readiness

The system SHALL store interaction events in a way that supports later analysis of clicks and engagement.

#### Scenario: Analyze CTA clicks

- **WHEN** analytics queries are run over stored click events
- **THEN** the system SHALL provide data that can be grouped by ctaId, page path, and time range

#### Scenario: Track supported event types

- **WHEN** a supported interaction event is submitted
- **THEN** the system SHALL accept event types for click, scroll_depth, video_play, and video_complete
