## ADDED Requirements

### Requirement: Page view ingestion

The system SHALL record a page view event whenever a page is displayed.

#### Scenario: Record a landing page view

- **WHEN** a visitor opens a public page in the site
- **THEN** the system SHALL persist a page view event for that page path

#### Scenario: Record authenticated page views

- **WHEN** a logged-in user navigates to a page
- **THEN** the system SHALL persist the page view and associate it with the user when available

### Requirement: Page view context capture

The system SHALL store context sufficient to count page access and unique views.

#### Scenario: Capture page path and referrer

- **WHEN** a page view event is recorded
- **THEN** the system SHALL store the page path and referrer when available

#### Scenario: Capture anonymous identity

- **WHEN** a page view event is recorded for an anonymous visitor
- **THEN** the system SHALL store the anonymous identifier for later unique-view analysis

### Requirement: Page view metrics readiness

The system SHALL store page view data in a way that supports total and unique page access metrics.

#### Scenario: Count total views

- **WHEN** analytics queries are run for a page path
- **THEN** the system SHALL support counting total page view events for that page

#### Scenario: Count unique views

- **WHEN** analytics queries are run for a page path
- **THEN** the system SHALL support counting unique views by user identifier or anonymous identifier
