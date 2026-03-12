# Admin Panel Features

This document outlines the features of the admin panel and their current status.

## Fully Implemented Features

*   **Authentication:** The dashboard correctly handles logins and checks for admin privileges.
*   **Platform Settings:** The form for updating bet prices and prize percentages is functional and connected to the backend API (`getConfig`, `updateConfig`).
*   **Draw Management:** The panel successfully fetches and displays the history of past draws.

## Partially Implemented / Placeholder Features

*   **Financial Monitoring:** The component `FinancialMonitoring.tsx` exists, but it displays static, empty data. It needs to be connected to a real-time data source for both PIX and Solana transactions.
*   **Draw Scheduling:** The `NextDrawSettings.tsx` component has a UI for setting a weekly draw schedule, but the save functionality is a `TODO` and does not call any API.
*   **User Management:** The `UserManagement.tsx` component is a placeholder. The user list is empty, and the search functionality is not implemented.
*   **Draw Trigger:** The UI to trigger a draw is present and calls the `triggerDraw` function. The multi-signature aspect seems to be a UI simulation at this stage.
