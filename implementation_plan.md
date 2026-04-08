# Implementation Plan: Fix Winners Not Updating

## Goal
Ensure that after a draw run, the winners are correctly inserted into the `winners` table, and the admin winners page reflects the latest data, including verification and payment status updates.

## Steps
1. **Verify Draw Run Insertion**
   - Review `src/app/api/admin/draws/run/route.ts` to confirm that winners are inserted with correct fields.
   - Ensure `match_type` values match the frontend expectations (`match_5`, `match_4`, `match_3`).
   - Add error handling for the insert operation and log any failures.

2. **Update GET Winners API**
   - In `src/app/api/admin/winners/route.ts`, include related `draws` and `profiles` fields if missing.
   - Ensure the query orders by `created_at` descending and returns all necessary columns.
   - Add a fallback to return an empty array if no winners exist.

3. **Frontend Adjustments**
   - In `src/app/admin/winners/page.tsx`, verify that the `winners` state is refreshed after updates.
   - Add a `useEffect` dependency on a `refreshKey` that increments after a successful PATCH to re‑fetch data.
   - Ensure the UI displays newly added winners (e.g., after a draw run) by calling `fetchWinners` on component mount and after draw execution.

4. **Database Schema Check**
   - Confirm `winners` table has columns: `id`, `draw_id`, `user_id`, `match_type`, `prize_amount`, `matched_numbers`, `verification_status`, `payment_status`, `notes`.
   - If any column is missing, add it via a migration (not implemented here but note for future).

5. **Testing**
   - Simulate a draw run via POST to `/api/admin/draws/run` and verify the response contains `winners`.
   - Refresh the admin winners page and confirm the new winners appear.
   - Update a winner's verification status and payment status; ensure the PATCH returns success and UI updates.

## Acceptance Criteria
- Winners appear in the admin winners table immediately after a draw run.
- Updating verification or payment status persists and reflects in the UI.
- No console errors during fetch or update operations.
- All API responses include appropriate error handling.

---
*Please review this plan and approve to proceed with implementation.*
