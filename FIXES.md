# A-ONE FREEZE — Billing Fix

This package contains the full source project with the service billing/parts flow fixed.

## Main fix
The technician-added parts were previously stored only as an extra amount in some flows, while the final bill page could fall back to a hardcoded ₹529. The project now keeps the actual service amount and individual parts together and calculates:

`Final Amount = Booking Service Price + Technician Parts Total`

The QR payment amount uses that same final amount.

## Frontend changes
- `frontend/a-one-freeze/src/services/serviceStore.js`
  - Stores individual technician parts on each booking.
  - Calculates `extraAmount` and `totalAmount` from the parts.
  - Prevents duplicate technician earnings on repeated payment recording.
- `frontend/a-one-freeze/src/pages/technician/TechnicianService.jsx`
  - Carries the current booking's real service price and parts into the final bill.
- `frontend/a-one-freeze/src/pages/technician/ActiveService.jsx`
  - Removed hardcoded ₹529 service charge.
  - Loads the real booking amount and persists parts.
- `frontend/a-one-freeze/src/pages/technician/ServiceComplete.jsx`
  - Uses the current booking/parts as the source of truth for the displayed final amount.
  - No ₹529 fallback.
  - Uses the booking End OTP when available.
  - Syncs completed/paid state back to the local booking store.
- Customer quick-book navigation now passes the selected service price correctly.
- Frontend commission configuration now uses the required maximum of 3 accepted works.

## Backend changes
- `backend/models/booking.py`
  - Added `parts`, `parts_total`, and `final_amount` fields.
- `backend/routes/customer_routes.py`
  - New bookings initialize parts and final amount from the database service price.
- `backend/routes/technician_booking_routes.py`
  - Added `PUT /api/technician/bookings/<booking_id>/parts`.
  - The server validates parts and calculates `parts_total` and `final_amount` from the booking service price.
  - End-OTP response includes the final bill values.
- Added migration:
  - `backend/migrations/versions/c3f8d2a1b7e4_add_booking_parts_and_final_amount.py`

## Backend migration
From the `backend` directory, after activating the Python environment:

```bash
flask db upgrade
```

Then start Flask normally.

## Important
The current React prototype still uses `serviceStore` for its existing UI/state flow. The backend now has server-side billing fields and a parts API so the financial calculation can be moved fully to PostgreSQL without redesigning the current UI.

Do not commit `.env`, uploaded identity documents, `node_modules`, or `.venv` to source control.
