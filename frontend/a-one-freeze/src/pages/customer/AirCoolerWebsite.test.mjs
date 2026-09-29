import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createServer } from 'vite';

const appUrl = new URL('../../App.jsx', import.meta.url);

// Characterize existing route contracts before adding the new entry point.
test('existing customer, technician, admin and fallback routes remain intact', async () => {
  const source = await readFile(appUrl, 'utf8');
  const routes = [...source.matchAll(/path="([^"]+)"\s+element=\{\s*<([A-Za-z]+)/g)]
    .map((match) => [match[1], match[2]]);
  const expected = [
    ['/', 'RoleSelection'],
    ['/customer/login', 'CustomerLogin'],
    ['/customer', 'CustomerHome'],
    ['/customer/services', 'Services'],
    ['/customer/service-selection', 'ServiceSelection'],
    ['/customer/services/:applianceId', 'ApplianceServices'],
    ['/customer/bookings', 'MyBookings'],
    ['/customer/booking', 'Booking'],
    ['/customer/booking-success', 'BookingSuccess'],
    ['/customer/track-service', 'TrackingService'],
    ['/customer/service-completed', 'ServiceCompleted'],
    ['/admin/login', 'AdminLogin'],
    ['/admin', 'AdminDashboard'],
    ['/admin/technicians', 'AdminLayout'],
    ['/admin/customers', 'AdminLayout'],
    ['/admin/bookings', 'AdminLayout'],
    ['/admin/services', 'AdminLayout'],
    ['/admin/payments', 'AdminLayout'],
    ['/admin/commission', 'AdminLayout'],
    ['/admin/reviews', 'AdminLayout'],
    ['/admin/incidents', 'AdminLayout'],
    ['/technician/login', 'TechnicianLogin'],
    ['/technician/register', 'TechnicianRegister'],
    ['/technician/dashboard', 'TechnicianDashboard'],
    ['/technician/services', 'TechnicianServices'],
    ['/technician/active-work', 'TechnicianActiveWork'],
    ['/technician/service/:bookingId/complete', 'ServiceComplete'],
    ['/technician/earnings', 'TechnicianEarnings'],
    ['/technician/ratings', 'TechnicianRatings'],
    ['/technician/profile', 'TechnicianProfile'],
    ['/technician/service/:bookingId', 'TechnicianService'],
    ['/technician/service/:bookingId/active', 'TechnicianActiveWork'],
    ['*', 'div'],
  ];
  for (const [path, component] of expected) {
    assert.ok(routes.some(([actualPath, actualComponent]) => actualPath === path && actualComponent === component), `${path} must retain ${component}`);
  }
});

test('landing page renders accessible navigation, service links and native FAQs', async () => {
  const root = new URL('../../../', import.meta.url).pathname;
  const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { default: React } = await server.ssrLoadModule('react');
    const { renderToStaticMarkup } = await server.ssrLoadModule('react-dom/server');
    const { MemoryRouter } = await server.ssrLoadModule('react-router-dom');
    const { default: Page } = await server.ssrLoadModule('/src/pages/customer/AirCoolerWebsite.jsx');
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/air-cooler'] }, React.createElement(Page)));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(html, /aria-label="Air cooler navigation"/);
    assert.match(html, /href="#acf-main"/);
    assert.match(html, /id="acf-main"/);
    assert.match(html, /href="\/customer\/services\/air-cooler"/);
    assert.match(html, /href="\/customer\/bookings"/);
    assert.match(html, /href="\/customer\/login"/);
    assert.equal((html.match(/<details[\s>]/g) || []).length, 4);
    for (const fragment of [...html.matchAll(/href="#([^"]+)"/g)]) {
      assert.ok(html.includes(`id="${fragment[1]}"`), `Missing anchor ${fragment[1]}`);
    }
    assert.doesNotMatch(html, /href="(?:#"|javascript:)|<form[\s>]/);
    const source = await readFile(appUrl, 'utf8');
    assert.match(source, /path="\/air-cooler"\s+element=\{<AirCoolerWebsite\s*\/>\}/);
    assert.match(source, /pathname === "\/air-cooler"/);
  } finally {
    await server.close();
  }
});
