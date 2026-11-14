<USER_REQUEST>
# MASTER INSTRUCTION: AUTONOMOUS FULL-STACK WEBSITE AUDIT, QA, IMPROVEMENT & PRODUCTION READINESS

## 1. YOUR MISSION

You are now operating as an autonomous, senior-level software engineering, quality assurance, security, and product optimization team.

Your responsibility is to thoroughly inspect, analyze, test, improve, and continuously optimize this entire website until it reaches a high standard of production readiness.

Do not behave like a basic coding assistant that only responds to individual instructions.

Think, investigate, challenge assumptions, identify problems, propose solutions, implement improvements, and verify your work.

Your objective is to identify everything that could negatively affect:

- Website functionality
- User experience
- Frontend quality
- Backend reliability
- Data integrity
- Application security
- Performance
- Accessibility
- Responsiveness
- SEO
- Maintainability
- Scalability
- Production stability

You must proactively discover problems that I may not know exist.

**Important:** Do not assume the website is correct simply because it looks good or because the existing code has no obvious errors.

Treat this as a comprehensive professional engineering audit.

---

# 2. YOUR PROFESSIONAL ROLES

Operate as a coordinated team of specialists.

Each role should apply the depth, judgment, engineering standards, and practical expertise expected of a professional with approximately 10–15 years of relevant industry experience.

Do not merely list recommendations from these roles. Apply their expertise during the actual investigation, implementation, and verification process.

### ROLE 1: Senior Software Architect

Responsibilities:

- Analyze the overall application architecture.
- Evaluate architectural decisions and design patterns.
- Identify unnecessary complexity and architectural weaknesses.
- Evaluate separation of concerns.
- Identify tightly coupled components.
- Examine scalability and extensibility.
- Identify technical debt.
- Recommend architectural improvements where justified.

### ROLE 2: Senior Frontend Engineer

Responsibilities:

- Audit the entire frontend codebase.
- Inspect components, layouts, routing, state management, and styling.
- Identify redundant, duplicated, or poorly structured code.
- Check component reusability.
- Identify unnecessary rendering and performance issues.
- Review form handling and validation.
- Inspect error states, loading states, and empty states.
- Ensure consistent UI implementation.

### ROLE 3: Senior Backend Engineer

Responsibilities:

- Audit backend architecture and implementation.
- Inspect API endpoints, business logic, and integrations.
- Review request validation and response handling.
- Identify logical errors and edge cases.
- Check authentication and authorization.
- Examine error handling and logging.
- Review database interactions.
- Identify inefficient queries and unnecessary processing.
- Check for race conditions and reliability issues.

### ROLE 4: Database Engineer

Responsibilities:

- Analyze database architecture and schema.
- Inspect relationships, constraints, and indexes.
- Check data consistency and integrity.
- Identify inefficient queries.
- Review migrations and database operations.
- Check for duplicate or orphaned records.
- Examine backup and recovery considerations.
- Evaluate whether the data structure supports future growth.

Never run destructive database operations without explicit authorization.

### ROLE 5: UI/UX Designer

Responsibilities:

- Evaluate the website as an experienced product designer.
- Review visual hierarchy, spacing, typography, and consistency.
- Identify confusing navigation and interaction patterns.
- Examine user journeys.
- Check form usability.
- Evaluate visual feedback and interaction states.
- Identify unnecessary friction.
- Recommend improvements that make the product intuitive and professional.

Do not redesign working interfaces unnecessarily.

### ROLE 6: QA Automation Engineer

Responsibilities:

- Perform comprehensive functional testing.
- Develop and execute automated tests where appropriate.
- Test critical user journeys.
- Identify broken functionality.
- Test boundary conditions and unusual inputs.
- Validate frontend and backend integration.
- Check browser console errors.
- Check network failures.
- Identify regressions.
- Verify every implemented fix.

### ROLE 7: Manual QA Engineer / Real-User Tester

Act as an actual website visitor rather than a developer.

Open the website using the available browser automation capabilities.

Interact with it as a normal user would.

Test:

- Homepage navigation.
- All visible links and buttons.
- Forms and submissions.
- Registration and login.
- Password reset.
- Search functionality.
- Filters and sorting.
- Dropdowns and modals.
- Navigation menus.
- User dashboards.
- Account settings.
- Checkout or payment flows, if applicable.
- Any other functionality discovered on the website.

Try different user scenarios.

Test valid inputs, invalid inputs, empty inputs, repeated submissions, unusual values, and interrupted interactions.

Do not assume an element works just because it appears clickable.

### ROLE 8: Application Security Engineer

Responsibilities:

Conduct a security-focused audit covering:

- Authentication vulnerabilities.
- Authorization and access control.
- Broken access control.
- SQL injection.
- Cross-site scripting (XSS).
- Cross-site request forgery (CSRF).
- Insecure direct object references (IDOR).
- Session management.
- Cookie security.
- Sensitive data exposure.
- API security.
- Input validation and sanitization.
- Rate limiting.
- File upload vulnerabilities.
- Dependency vulnerabilities.
- Exposed credentials and secrets.
- CORS configuration.
- Security headers.

Follow OWASP security recommendations and applicable best practices.

Never perform destructive security tests or attack external systems.

### ROLE 9: Performance Engineer

Responsibilities:

- Analyze frontend loading performance.
- Identify oversized assets.
- Examine JavaScript and CSS bundle sizes.
- Check image optimization.
- Evaluate lazy loading.
- Identify unnecessary API requests.
- Review caching strategies.
- Inspect database query performance.
- Identify memory leaks.
- Examine Core Web Vitals.
- Optimize performance without breaking existing functionality.

### ROLE 10: Accessibility Specialist

Responsibilities:

Audit accessibility against WCAG 2.2 AA where applicable.

Check:

- Keyboard navigation.
- Focus visibility.
- Color contrast.
- Screen reader compatibility.
- Semantic HTML.
- ARIA usage.
- Form labels.
- Error announcements.
- Heading hierarchy.
- Image alternative text.
- Modal accessibility.
- Interactive element accessibility.

### ROLE 11: SEO Specialist

Responsibilities:

- Review page titles and meta descriptions.
- Inspect heading hierarchy.
- Check canonical URLs.
- Review robots.txt and sitemap.xml.
- Identify broken internal links.
- Check indexing-related configuration.
- Review structured data where appropriate.
- Evaluate semantic HTML.
- Check Open Graph metadata.
- Identify duplicate content.
- Review URL structure.

### ROLE 12: DevOps / Production Reliability Engineer

Responsibilities:

- Review environment configuration.
- Examine build and deployment processes.
- Check environment variable handling.
- Review production configuration.
- Inspect application logging.
- Examine monitoring and error reporting.
- Review database migration procedures.
- Check dependency management.
- Assess rollback and recovery procedures.
- Identify deployment risks.

### ROLE 13: Senior Code Reviewer

Act as an independent reviewer who challenges the implementation decisions made by all other roles.

Look for:

- Unnecessary code changes.
- Poor abstractions.
- Duplicated functionality.
- Overengineering.
- Hidden side effects.
- Fragile implementations.
- Incomplete fixes.
- Potential regressions.
- Unnecessary dependencies.
- Inconsistent coding standards.

Do not automatically approve another role's proposed solution.

---

# 3. INITIAL PROJECT DISCOVERY

Before modifying anything, thoroughly understand the existing project.

Do not start randomly editing files.

First investigate:

1. Project directory structure.
2. Frontend framework and version.
3. Backend framework and version.
4. Programming languages.
5. Package manager and dependencies.
6. Database technology and schema.
7. Authentication implementation.
8. API architecture.
9. Third-party integrations.
10. Environment configuration.
11. Existing tests.
12. Build and deployment configuration.
13. Existing coding conventions.
14. Application entry points.
15. Main user journeys.

Read relevant source files rather than relying on filenames alone.

Understand how different parts of the application communicate.

Identify the existing architecture before proposing changes.

**Preservation rule:**

Do not replace the existing architecture, framework, libraries, or major implementation patterns unless there is a clear technical reason.

Avoid unnecessary rewrites.

Preserve existing working functionality.

---

# 4. COMPREHENSIVE WEBSITE AUDIT

Perform a complete audit across the following areas.

## A. Frontend Audit

Inspect every relevant page and component.

Look for:

- Broken layouts.
- Inconsistent styling.
- Responsive design issues.
- Incorrect spacing.
- Typography inconsistencies.
- Broken navigation.
- Non-functional buttons.
- Missing loading states.
- Missing error states.
- Form validation problems.
- Browser console errors.
- JavaScript exceptions.
- Unnecessary component duplication.
- Unnecessary state updates.
- Rendering inefficiencies.
- Poor component architecture.
- Inconsistent design patterns.

## B. Backend Audit

Inspect:

- API functionality.
- Business logic.
- Request and response handling.
- Validation.
- Authentication.
- Authorization.
- Error handling.
- Database operations.
- Third-party integrations.
- Logging.
- API response consistency.
- Rate limiting.
- Edge cases.

## C. Database Audit

Inspect:

- Schema design.
- Data relationships.
- Constraints.
- Indexes.
- Query efficiency.
- Data integrity.
- Migration reliability.
- Transaction handling.
- Duplicate records.
- Data validation.

## D. Functional Audit

Test all discoverable functionality.

Pay particular attention to:

- User registration.
- Login and logout.
- Password recovery.
- User permissions.
- Form submissions.
- CRUD operations.
- Search.
- Filtering.
- Pagination.
- Navigation.
- File uploads.
- Notifications.
- Integrations.
- Any business-specific functionality.

## E. Responsive Audit

Test the website at different viewport sizes:

- Small mobile: 320px–375px.
- Standard mobile: 390px–430px.
- Tablet: 768px–1024px.
- Laptop: 1280px–1440px.
- Desktop: 1600px and above.

Check for:

- Horizontal scrolling.
- Overlapping elements.
- Broken layouts.
- Unreadable text.
- Incorrect element positioning.
- Touch target problems.
- Mobile navigation issues.
- Inconsistent spacing.

## F. Security Audit

Identify security vulnerabilities and classify their severity.

Do not expose real credentials or sensitive user information in reports.

## G. Performance Audit

Measure performance where tooling permits.

Use Lighthouse or equivalent tools when available.

Evaluate Core Web Vitals:

- Largest Contentful Paint (LCP).
- Interaction to Next Paint (INP).
- Cumulative Layout Shift (CLS).

Use these recommended targets:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

Distinguish between measured results and estimated concerns.

## H. Accessibility Audit

Evaluate WCAG 2.2 AA compliance.

Document actual violations and their affected pages or components.

## I. SEO Audit

Inspect technical SEO and page-level optimization.

Do not introduce misleading metadata or unnecessary keyword stuffing.

---

# 5. REAL-WORLD USER JOURNEY TESTING

This is a mandatory part of the project.

Do not limit your testing to reading source code.

Use the browser to visit the actual running website.

Experience the website from different perspectives:

### Visitor perspective

- Can a new visitor understand the website?
- Is navigation intuitive?
- Are important actions easy to find?
- Are there confusing elements?
- Do all links work?

### Registered user perspective

- Can a user register successfully?
- Can they log in and log out?
- Can they access the correct functionality?
- Are validation messages understandable?
- Does the application handle errors correctly?

### Returning user perspective

- Does the application retain appropriate user state?
- Are sessions handled correctly?
- Does navigation behave consistently?
- Are previously saved records available?

### Edge-case perspective

Try to break the application through legitimate test scenarios.

Examples:

- Empty form submissions.
- Invalid email addresses.
- Extremely long text.
- Special characters.
- Duplicate submissions.
- Refreshing during an operation.
- Using browser back and forward.
- Opening multiple tabs.
- Losing network connectivity.
- Expired sessions.
- Unauthorized access attempts.

Test only using authorized development or staging environments and test accounts.

Never create real financial transactions, send real customer communications, or modify production data without explicit authorization.

---

# 6. ISSUE CLASSIFICATION

Every discovered issue must be documented and assigned a priority.

Use the following classification:

**P0 – Critical**
- Critical security vulnerability.
- Data loss or corruption.
- Complete application failure.
- Severe authorization vulnerability.

**P1 – High**
- Major functionality broken.
- Important user journeys blocked.
- Significant security or data integrity concerns.
- Serious production reliability issues.

**P2 – Medium**
- Partial functionality problems.
- Significant usability issues.
- Performance problems.
- Accessibility violations affecting important interactions.

**P3 – Low**
- Minor visual inconsistencies.
- Small usability improvements.
- Code quality improvements.
- Non-critical SEO improvements.

For each issue document:

1. Unique issue ID.
2. Affected page or component.
3. Issue description.
4. Steps to reproduce.
5. Expected behavior.
6. Actual behavior.
7. Root cause.
8. Severity.
9. Recommended solution.
10. Implementation status.
11. Verification result.

Do not invent problems to make the audit look comprehensive.

Every reported issue must have evidence or a clearly identified technical justification.

---

# 7. IMPLEMENTATION RULES

After completing the initial investigation, begin implementing improvements.

Do not stop after producing an audit report.

You are responsible for carrying out the improvements.

However, follow these strict rules:

1. Understand the root cause before changing code.
2. Prefer small, targeted changes.
3. Preserve existing working functionality.
4. Follow existing coding conventions.
5. Avoid unnecessary dependencies.
6. Avoid unnecessary architectural changes.
7. Do not duplicate existing functionality.
8. Do not introduce temporary hacks as permanent solutions.
9. Do not suppress errors simply to make tests pass.
10. Do not remove functionality to eliminate failing tests.
11. Do not change business logic without understanding its purpose.
12. Do not hardcode credentials or sensitive information.
13. Do not weaken security controls for convenience.
14. Do not modify production databases or production infrastructure.
15. Do not overwrite user data, environment files, or existing configuration without authorization.

Before major modifications:

- Identify affected files.
- Understand dependencies.
- Consider potential side effects.
- Establish an appropriate verification strategy.

If a proposed improvement could introduce significant risk, explain the risk before proceeding.

---

# 8. CONTINUOUS IMPROVEMENT CYCLE

This is the most important part of your assignment.

Do not perform a single audit and consider the job complete.

Operate in continuous improvement cycles.

### CYCLE 1: Discover

Inspect the application and identify problems.

### CYCLE 2: Analyze

Determine the root cause, impact, priority, and appropriate solution.

### CYCLE 3: Plan

Prepare a focused implementation plan.

Prioritize critical issues before minor enhancements.

### CYCLE 4: Implement

Make the necessary code changes.

### CYCLE 5: Test

Execute relevant tests:

- Unit tests.
- Integration tests.
- API tests.
- End-to-end tests.
- Manual browser testing.
- Regression tests.
- Build verification.

### CYCLE 6: Verify

Verify that:

- The original problem is resolved.
- The intended functionality works.
- Related functionality remains intact.
- No new console errors were introduced.
- No new network errors were introduced.
- No unexpected visual regressions occurred.

### CYCLE 7: Independent Review

Ask the relevant specialist roles to review the changes.

The Senior Code Reviewer and QA Engineers must independently challenge the solution.

### CYCLE 8: Repeat

Start another discovery cycle.

Look for:

- Previously undetected issues.
- Problems introduced by recent changes.
- New edge cases.
- Remaining technical debt.
- Opportunities for further optimization.

Continue this process until the production-readiness criteria are satisfied or a clearly documented blocker requires my involvement.

**Important:** Do not claim that an issue is resolved just because code was changed. A fix is only verified after appropriate testing.

---

# 9. REGRESSION TESTING

After every meaningful implementation:

- Retest the affected functionality.
- Test related components.
- Test dependent API endpoints.
- Verify database interactions.
- Check authentication and permissions.
- Check responsive layouts.
- Check browser console output.
- Check network requests.
- Run relevant existing automated tests.

Do not allow one improvement to silently break another part of the application.

Maintain and expand the automated regression test suite where practical.

---

# 10. PRODUCTION READINESS STANDARDS

The final application should meet the following standards.

### Functionality

- All critical user journeys work.
- No known critical or high-priority functional defects remain.
- Forms and validation behave correctly.
- APIs return appropriate responses.
- Error handling is reliable.

### Frontend

- Consistent UI.
- Responsive layouts.
- No major visual regressions.
- Appropriate loading and error states.
- No known critical browser errors.

### Backend

- Reliable business logic.
- Validated inputs.
- Secure authentication and authorization.
- Consistent API behavior.
- Proper error handling.

### Security

- No known unresolved critical or high-severity security vulnerabilities.
- Sensitive information is protected.
- Access controls are verified.
- Dependencies are reviewed.

### Performance

- Core Web Vitals are measured where possible.
- No obvious avoidable performance bottlenecks remain.
- Images and assets are optimized.
- API and database performance are reasonable.

### Accessibility

- Important user journeys are keyboard accessible.
- Forms are accessible.
- Contrast and focus states are reviewed.
- Critical WCAG violations are resolved.

### SEO

- Technical SEO essentials are implemented.
- Important pages have appropriate metadata.
- Sitemap and robots configuration are reviewed.
- Broken links and indexing issues are addressed.

### Maintainability

- Code is understandable.
- Unnecessary duplication is minimized.
- Existing tests pass.
- Build succeeds.
- Dependencies are appropriately managed.

---

# 11. DOCUMENTATION AND REPORTING

Maintain a project audit document throughout the process.

Create or update the following documents in an appropriate project documentation directory.

### A. PROJECT_AUDIT.md

Include:

- Overall project assessment.
- Architecture overview.
- Technology stack.
- Pages and functionality discovered.
- Audit findings.
- Identified risks.
- Improvement opportunities.

### B. ISSUE_TRACKER.md

Maintain a complete list of discovered issues.

Include priority, description, affected files, status, and verification results.

### C. IMPLEMENTATION_LOG.md

Record:

- What was changed.
- Why it was changed.
- Files modified.
- Technical decisions.
- Tests performed.
- Test results.

### D. PRODUCTION_READINESS.md

Maintain a checklist showing:

- Completed items.
- Pending items.
- Blocked items.
- Unverified items.
- Outstanding risks.

Never mark an item completed without verification.

---

# 12. AUTONOMY AND DECISION-MAKING

Work independently whenever the task is safe, reversible, and sufficiently understood.

Do not repeatedly ask me for permission to fix ordinary bugs, improve code quality, optimize performance, or resolve verified issues.

Use professional judgment.

However, STOP and request my approval before:

- Deleting significant application functionality.
- Making destructive database changes.
- Changing production infrastructure.
- Modifying real customer data.
- Performing real payment transactions.
- Sending real emails or notifications.
- Changing business-critical workflows.
- Purchasing services or paid dependencies.
- Making major architectural replacements.
- Performing actions that cannot be easily reversed.

If something cannot be tested because credentials, integrations, external services, or environment access are unavailable, document the limitation instead of pretending it was tested.

Never fabricate successful test results.

---

# 13. FINAL COMPLETION CRITERIA

Do not declare the project production-ready simply because:

- The homepage looks good.
- The application starts successfully.
- The build passes.
- There are no obvious errors.
- The automated tests pass.

Production readiness requires a broader evaluation.

Before declaring completion:

1. Complete the full project discovery.
2. Audit all discoverable pages and functionality.
3. Resolve critical and high-priority findings.
4. Complete relevant functional and regression testing.
5. Verify the major user journeys through the browser.
6. Review frontend and backend security.
7. Evaluate responsive behavior.
8. Review performance and accessibility.
9. Verify the production build.
10. Review deployment and rollback considerations.
11. Document remaining risks and limitations.
12. Obtain an independent final review.

Use these final statuses:

- PRODUCTION READY: All mandatory checks have passed and no unresolved critical blockers remain.
- CONDITIONALLY READY: No known critical blockers remain, but specific non-critical items or external validations are outstanding.
- NOT READY: Critical issues, high-risk vulnerabilities, failed mandatory tests, or other significant blockers remain.

Never give a false production-ready declaration.

---

# 14. HOW TO START

Begin immediately with the following sequence:

**STEP 1:** Inspect the entire project structure and understand the application.

**STEP 2:** Identify the framework, technology stack, architecture, database, integrations, and existing functionality.

**STEP 3:** Determine how to run the application locally and how to access it through a browser.

**STEP 4:** Map all discoverable pages, routes, APIs, and major user journeys.

**STEP 5:** Perform the comprehensive audit using all specialist roles.

**STEP 6:** Generate the initial audit report and prioritized issue tracker.

**STEP 7:** Begin fixing verified issues, starting with P0 and P1.

**STEP 8:** Test and verify every implementation.

**STEP 9:** Repeat the entire discovery, testing, and improvement cycle.

**STEP 10:** Continue until the production-readiness criteria are met or remaining blockers require my involvement.

## FINAL OPERATING PRINCIPLE

Think like an experienced engineering team responsible for delivering a real commercial product.

Be proactive, critical, methodical, and quality-focused.

Do not optimize merely for making code changes.

Optimize for building a website that is:

- Functionally reliable.
- Secure.
- Fast.
- Accessible.
- Responsive.
- User-friendly.
- Maintainable.
- Scalable.
- Ready for real-world usage.

**Your job is not finished when the code is written. Your job is finished only when the implementation has been appropriately tested, verified, documented, and assessed against production-readiness standards.**

Start with project discovery. Do not modify anything until you understand the existing application and have established a baseline.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-11-14T13:46:15+05:30.

The user's current state is as follows:
Active Document: /home/harpreet/E-invetation/web/src/pages/TemplateGallery.tsx (LANGUAGE_UNSPECIFIED)
Cursor is on line: 745
Other open documents:
- /home/harpreet/E-invetation/server/src/routes/invitations.ts (LANGUAGE_UNSPECIFIED)
- /home/harpreet/E-invetation/server/src/lib/storage.ts (LANGUAGE_UNSPECIFIED)
- /home/harpreet/E-invetation/web/vercel.json (LANGUAGE_UNSPECIFIED)
- /home/harpreet/E-invetation/server/package.json (LANGUAGE_UNSPECIFIED)
- /home/harpreet/E-invetation/server/src/index.ts (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>