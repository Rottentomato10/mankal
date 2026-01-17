# Feature Specification: CEOs (מנכ"לים) Financial Management PWA

**Feature Branch**: `001-ceos-financial-pwa`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Build a minimalist, high-tech financial management PWA for young adults (17-23) with Hebrew RTL support, featuring expense/income tracking, customizable categories, advanced dashboard analytics, and PDF export capabilities."

## Clarifications

### Session 2026-01-15

- Q: What currency should the app use? → A: Single currency (ILS/Shekel) - amounts displayed as ₪
- Q: Can users edit or delete transactions? → A: Allow edit and delete of own transactions (no audit trail)
- Q: How should offline sync conflicts be resolved? → A: Last-write-wins (server timestamp)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Daily Expense (Priority: P1)

As a young adult managing my finances, I want to quickly log an expense so that I can track where my money goes without friction.

**Why this priority**: This is the core value proposition - fast, frictionless expense entry is essential for daily engagement and accurate financial tracking. Without this, the app has no utility.

**Independent Test**: Can be fully tested by entering an expense with amount, category, and payment method, then verifying it appears in the transaction list and affects the balance.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the home screen, **When** they tap the expense button and enter amount 50, select "Food" category, choose "Card" payment, **Then** the transaction is saved and the balance decreases by 50.
2. **Given** a user entering an expense, **When** they add an optional description "Lunch at cafe", **Then** the description is saved and visible in transaction history.
3. **Given** a user on the expense entry form, **When** they select a date different from today, **Then** the transaction is recorded with the selected date.

---

### User Story 2 - Record Income (Priority: P1)

As a young adult with various income sources, I want to log my income so that I can see my true financial balance and track my earnings.

**Why this priority**: Income tracking is equally fundamental to expense tracking - users need to see their complete financial picture to make the app valuable.

**Independent Test**: Can be fully tested by entering income with amount, source, and date, then verifying it appears in transactions and increases the balance.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the home screen, **When** they tap the income button and enter amount 1000 with source "Salary", **Then** the transaction is saved and the balance increases by 1000.
2. **Given** a user entering income, **When** they add an optional description "January wages", **Then** the description is saved and visible in transaction history.

---

### User Story 3 - View Financial Dashboard (Priority: P2)

As a user tracking my finances, I want to see visual summaries of my income vs expenses so that I can understand my spending patterns at a glance.

**Why this priority**: Visualization transforms raw data into actionable insights. This is the payoff for entering transactions - users see the value of their tracking efforts.

**Independent Test**: Can be fully tested by viewing the dashboard after entering multiple transactions and verifying charts display correct percentages and totals.

**Acceptance Scenarios**:

1. **Given** a user with recorded transactions for January 2026, **When** they view the dashboard and select January 2026, **Then** they see a donut chart showing income vs expenses with percentages.
2. **Given** a user viewing the dashboard, **When** they look at the "Net Bottom Line", **Then** they see the net amount (income minus expenses) and what percentage of income remains.
3. **Given** a user with expenses across multiple categories, **When** they view the category breakdown, **Then** they see a pie chart showing spending distribution by category.

---

### User Story 4 - Filter and Browse Transactions (Priority: P2)

As a user reviewing my financial history, I want to filter transactions by month/year so that I can analyze specific time periods.

**Why this priority**: Users need to navigate their historical data to understand trends and find specific transactions.

**Independent Test**: Can be fully tested by filtering to a specific month and verifying only transactions from that period are displayed.

**Acceptance Scenarios**:

1. **Given** a user with transactions spanning multiple months, **When** they open the month filter dropdown, **Then** only months with recorded data are shown as options.
2. **Given** a user filtering by March 2026, **When** they apply the filter, **Then** only March 2026 transactions appear in the scrollable list.
3. **Given** a user viewing filtered transactions, **When** they scroll through the list, **Then** they see each transaction with its description, amount, category, and date.

---

### User Story 5 - View Yearly Trends (Priority: P2)

As a user planning my finances, I want to see how my monthly performance compares across the year so that I can identify seasonal patterns.

**Why this priority**: Trend analysis provides long-term insights that help users improve their financial habits over time.

**Independent Test**: Can be fully tested by viewing the trends section with multiple months of data and verifying the bar chart accurately compares months.

**Acceptance Scenarios**:

1. **Given** a user with 6 months of transaction history, **When** they view the yearly trends section, **Then** they see a bar chart comparing monthly income/expense totals.
2. **Given** a user viewing yearly trends, **When** they examine the chart, **Then** each month clearly shows income (green) and expenses (red) bars.

---

### User Story 6 - Manage Expense Categories (Priority: P3)

As a user with specific spending habits, I want to customize my expense categories so that they match my actual spending patterns.

**Why this priority**: Category customization improves accuracy and personal relevance, but the default categories provide immediate value.

**Independent Test**: Can be fully tested by renaming a category and verifying new expenses use the updated name while historical data remains unchanged.

**Acceptance Scenarios**:

1. **Given** a user in settings, **When** they rename the "Fun" category to "Entertainment", **Then** the new name appears in expense entry forms.
2. **Given** a user with historical "Fun" expenses, **When** they rename the category, **Then** historical transactions still display correctly in the dashboard.
3. **Given** a user removing a category, **When** they archive "Clothing", **Then** historical data remains visible but the category is hidden from new entry forms.

---

### User Story 7 - Export Financial Summary (Priority: P3)

As a user who needs records for external purposes, I want to export my financial data to PDF so that I can share or archive my financial history.

**Why this priority**: Export is valuable for record-keeping but not essential for daily financial management.

**Independent Test**: Can be fully tested by generating a PDF for a selected month and verifying it contains accurate transaction summaries.

**Acceptance Scenarios**:

1. **Given** a user on the dashboard with January 2026 selected, **When** they tap "Export to PDF", **Then** a PDF is generated with that month's income, expenses, net balance, and category breakdown.
2. **Given** a user requesting a yearly export, **When** they select 2026 and export, **Then** a PDF is generated summarizing all 12 months with totals.

---

### User Story 8 - Access App (Demo Mode) (Priority: P1)

As a new user, I want to sign in easily so that I can start tracking my finances immediately without complex registration.

**Why this priority**: User access is fundamental - without authentication, nothing else works. Demo mode removes friction for initial adoption.

**Independent Test**: Can be fully tested by clicking "Sign in with Google" and verifying access to the app with demo data.

**Acceptance Scenarios**:

1. **Given** a new user on the login screen, **When** they click "Sign in with Google", **Then** they are granted access to a demo account with sample data.
2. **Given** a returning user, **When** they sign in again, **Then** they see their previously entered data preserved.

---

### User Story 9 - Receive Daily Reminders (Priority: P3)

As a user who might forget to log expenses, I want to receive a daily reminder so that I maintain consistent tracking habits.

**Why this priority**: Engagement features improve retention but the core functionality works without them.

**Independent Test**: Can be fully tested by enabling notifications, not entering data for a day, and verifying a reminder appears at 20:00.

**Acceptance Scenarios**:

1. **Given** a user who has not entered any transactions today, **When** 20:00 arrives, **Then** they receive a randomized reminder notification.
2. **Given** a user who has entered transactions today, **When** 20:00 arrives, **Then** no reminder is sent.

---

### Edge Cases

- What happens when a user enters a transaction with amount 0? System should reject with validation error.
- What happens when a user tries to export PDF for a month with no data? System should display message "No data available for this period."
- How does system handle extremely large transaction amounts? System should support amounts up to 10,000,000 with 2 decimal places.
- What happens when all 8 category slots are archived? System should prevent archiving the last active category.
- How does the app behave offline? System should queue transactions locally and sync when connection restores.
- What happens when date filter has no months with data? System should display "No transactions recorded yet" with prompt to add first transaction.
- What happens when user deletes a transaction? System should show confirmation dialog before permanent deletion.
- What happens when offline edits conflict with server data? System uses last-write-wins; most recent timestamp overwrites silently.

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Access**
- **FR-001**: System MUST display a "Sign in with Google" button on the login screen
- **FR-002**: System MUST grant demo account access to any user attempting to sign in (until OAuth is enabled)
- **FR-003**: System MUST persist user data between sessions for returning users

**Transaction Entry**
- **FR-004**: System MUST allow users to record expenses with: amount in ILS (required), date (required, defaults to today), category (required, 1 of 8), payment method (required, Cash or Card), description (optional)
- **FR-005**: System MUST allow users to record income with: amount in ILS (required), date (required, defaults to today), source (required), description (optional)
- **FR-006**: System MUST validate that transaction amounts are positive numbers greater than zero
- **FR-007**: System MUST allow selecting any past or present date for transactions (not future dates)
- **FR-034**: System MUST display all monetary amounts with the ₪ (Shekel) symbol
- **FR-035**: System MUST allow users to edit any of their own transactions (amount, date, category, payment method, source, description)
- **FR-036**: System MUST allow users to delete any of their own transactions permanently
- **FR-037**: System MUST update balance immediately after transaction edit or delete

**Home Screen**
- **FR-008**: System MUST display total current balance prominently on home screen
- **FR-009**: System MUST provide large, easily tappable buttons for adding income and expenses
- **FR-010**: System MUST calculate balance as sum of all income minus sum of all expenses

**Category Management**
- **FR-011**: System MUST provide 8 customizable expense category slots
- **FR-012**: System MUST pre-populate default categories: Food, Transport, Rent, Fun, Gifts, Clothing, Other, Savings
- **FR-013**: System MUST implement soft-delete for categories (archived categories hidden from new entries but visible in historical data)
- **FR-014**: System MUST prevent users from archiving the last active category

**Dashboard & Analytics**
- **FR-015**: System MUST provide a month/year filter dropdown showing only periods containing data
- **FR-016**: System MUST display income vs expense donut chart with percentage labels
- **FR-017**: System MUST display "Net Bottom Line" showing: net amount and percentage of income remaining
- **FR-018**: System MUST provide scrollable transaction list with descriptions, amounts, categories, and dates
- **FR-019**: System MUST display category breakdown pie chart for expenses
- **FR-020**: System MUST provide yearly bar chart comparing monthly income/expense totals

**Export**
- **FR-021**: System MUST allow PDF export of monthly financial summaries
- **FR-022**: System MUST allow PDF export of yearly financial summaries
- **FR-023**: System MUST include in PDF exports: income total, expense total, net balance, category breakdown, transaction list

**Notifications**
- **FR-024**: System MUST send daily reminder notification at 20:00 if no transactions entered that day
- **FR-025**: System MUST randomize reminder message between at least 2 variations

**UI/UX Requirements**
- **FR-026**: System MUST support full Hebrew localization with RTL layout
- **FR-027**: System MUST implement dark mode theme as the default and only theme
- **FR-028**: System MUST use glassmorphism visual style for cards and containers
- **FR-029**: System MUST be installable as a Progressive Web App (PWA)
- **FR-030**: System MUST be mobile-first and responsive

**Data & Performance**
- **FR-031**: System MUST support offline transaction entry with sync when online
- **FR-032**: System MUST retain all historical transaction data indefinitely
- **FR-033**: System MUST optimize data loading for users with years of transaction history
- **FR-038**: System MUST resolve sync conflicts using last-write-wins strategy (most recent server timestamp overwrites)

### Key Entities

- **User**: Represents an app user with unique identifier, email, name, and account creation date. Each user has their own isolated transaction and category data.
- **Transaction**: A financial record with amount, date, type (income/expense), category reference (for expenses), payment method (for expenses), source (for income), optional description, and user reference.
- **Category**: An expense classification with name, display order, archive status, user reference, and creation date. Categories use soft-delete - archived categories remain in database but are excluded from new transaction entry options.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete expense entry in under 15 seconds (from tapping + button to saving)
- **SC-002**: Users can complete income entry in under 10 seconds
- **SC-003**: Dashboard loads and displays charts within 2 seconds for users with up to 5 years of transaction history
- **SC-004**: 90% of users can successfully enter their first transaction without guidance or errors
- **SC-005**: PDF export generates and downloads within 5 seconds for monthly summaries
- **SC-006**: App works offline - users can enter transactions without internet connection
- **SC-007**: All text displays correctly in Hebrew RTL layout with no visual glitches
- **SC-008**: App installs as PWA and launches from home screen within 3 seconds
- **SC-009**: System supports at least 10,000 users with 5 years of daily transactions each without performance degradation
- **SC-010**: Daily reminder notifications arrive within 5 minutes of 20:00 for users with notifications enabled

## Assumptions

- Users have smartphones capable of running modern PWAs (Chrome/Safari mobile browsers)
- Users are comfortable with Hebrew as the only language option
- Default categories will suit most users; customization is for edge cases
- Demo mode is acceptable for MVP; real OAuth will be implemented in future iteration
- Users will primarily access on mobile devices; desktop is secondary
- Internet connectivity is generally available, offline mode is for occasional disconnections
- Users are in Israel timezone (or accept 20:00 notification time in local device timezone)
