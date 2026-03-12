# User Dashboard Features

This document outlines the features of the user dashboard and their current status.

## Implemented Features

*   **Authentication:** The dashboard correctly identifies the logged-in user via the `useAuth` hook.
*   **Data Fetching:** It successfully fetches and displays the user's statistics and active bets using the `getUserStats` API call.

## Partially Implemented / Placeholder Features

*   **PIX Key Management:** The UI allows a user to view and enter their PIX key for receiving prizes. However, the `handleSavePix` function that should save this key to the backend/blockchain is a `TODO` and is not implemented.
*   **Quick Bet:** The `QuickBet.tsx` component is a UI placeholder. It includes a number grid, but the logic for selecting numbers and submitting a bet is not implemented. The `handlePlaceBet` function only simulates a success message.
*   **Forensic Verifier ("Verificador Pericial"):** A button with this label exists for each active bet, but it currently has no associated function or action.
