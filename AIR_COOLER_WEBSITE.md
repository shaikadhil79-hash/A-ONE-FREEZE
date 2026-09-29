# Air Cooler Service Website

A professional customer-facing website for A-ONE FREEZE air cooler services.

## 📍 Route

**URL:** `/air-cooler`

Access the website at: `http://localhost:5173/air-cooler` (during development)

## ✨ Features

### Customer-Facing Sections

1. **Hero Section**
   - Eye-catching headline and call-to-action
   - Direct booking button integration
   - Responsive animated design

2. **Services Showcase**
   - Air Cooler Cleaning (pad cleaning, tank sanitization, fan blade cleaning)
   - Water Pump Service (pump inspection, motor check, flow optimization)
   - General Repair (electrical repairs, mechanical fixes, parts replacement)

3. **Why Choose Us**
   - Certified & experienced technicians
   - Transparent pricing with no hidden charges
   - Same-day service availability
   - Genuine spare parts
   - Post-service support

4. **How It Works**
   - 4-step process visualization
   - Clear customer journey explanation
   - Integration with existing booking flow

5. **FAQ Section**
   - Booking process
   - Service areas coverage
   - Service duration expectations
   - Spare parts information
   - Service tracking instructions

6. **Call-to-Action**
   - Prominent booking invitation
   - Direct navigation to service selection

7. **Footer**
   - Quick links to customer portal
   - Contact information placeholders
   - Navigation to existing pages

## 🎨 Design

- **Color Scheme:** 
  - Primary: `#087ea4` (teal blue)
  - Secondary: `#31c6eb` (light cyan)
  - Background: `#f0f9ff` (ice blue)
  - Text: `#173b53` (dark blue-gray)

- **Responsive Breakpoints:**
  - Desktop: `> 768px`
  - Tablet: `≤ 768px`
  - Mobile: `≤ 480px`

- **Animations:**
  - Floating hero icon
  - Hover effects on cards
  - Smooth transitions

## 🔗 Integration

### Existing Flow Preservation

The website integrates seamlessly with your existing A-ONE FREEZE platform:

- **Booking:** "Book Service Now" → `/customer/service-selection`
- **My Bookings:** Footer link → `/customer/bookings`
- **Customer Home:** Footer link → `/customer`
- **All Services:** Footer link → `/customer/services`

### No Impact on Existing Routes

All technician, admin, and customer portal routes remain unchanged.

## 🧪 Testing

Run validation checks:

```bash
cd frontend/a-one-freeze
node src/pages/customer/AirCoolerWebsite.test.mjs
```

### Manual Testing Checklist

- [ ] Visit `/air-cooler` route
- [ ] Verify all sections render correctly
- [ ] Test "Book Service Now" button navigation
- [ ] Check responsive layout on mobile (< 480px)
- [ ] Verify footer links work
- [ ] Confirm CSS animations and hover effects
- [ ] Test on different browsers

## 📁 Files Added

| File | Purpose |
|------|---------|
| `src/pages/customer/AirCoolerWebsite.jsx` | Main component |
| `src/pages/customer/AirCoolerWebsite.css` | Responsive styles |
| `src/pages/customer/AirCoolerWebsite.test.mjs` | Validation tests |
| `src/App.jsx` | Added `/air-cooler` route |

## 🚀 Development

### Run locally

```bash
cd frontend/a-one-freeze
npm install
npm run dev
```

Then visit: `http://localhost:5173/air-cooler`

### Dependencies Used

- `react-router-dom` (already in project)
- `lucide-react` (already in project for icons)

No additional dependencies required.

## 🎯 Use Cases

1. **Marketing Landing Page**
   - Share `/air-cooler` link on social media
   - Use for air cooler service promotions
   - Dedicated air cooler service information

2. **Customer Education**
   - Explain air cooler maintenance importance
   - Showcase service offerings
   - Answer common questions

3. **Booking Funnel**
   - Clear call-to-action
   - Direct path to service selection
   - Reduced friction for new customers

## 📝 Notes

- No hardcoded prices (uses existing service pricing from backend)
- No fake reviews or testimonials
- Contact details use placeholders (update as needed)
- Service areas depend on backend configuration
- Integrates with existing booking and tracking systems

## 🔄 Future Enhancements

Optional additions for later:

- Real customer testimonials (once available)
- Service area map integration
- Live chat support
- Seasonal promotions section
- Before/after service images
- Video tutorials for basic maintenance

## 🐛 Troubleshooting

**Route not found?**
- Ensure you're on the `feature/air-cooler-site` branch
- Restart the Vite dev server

**Styles not loading?**
- Check that `AirCoolerWebsite.css` is imported in the component
- Clear browser cache

**Icons not showing?**
- Verify `lucide-react` is installed: `npm list lucide-react`
- Run `npm install` if missing

---

**Branch:** `feature/air-cooler-site`  
**Created:** September 2026  
**Compatible with:** Existing A-ONE FREEZE platform
