// API Configuration
const API_BASE = 'http://localhost:5000/api';

// Store user token in localStorage
let currentUser = null;
let currentToken = null;
let selectedRoute = null;
let selectedSeats = [];

// ========== AUTHENTICATION ==========

// Check if user is logged in on page load
function checkAuth() {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('current_user');
  
  if (token && user) {
    currentToken = token;
    currentUser = JSON.parse(user);
    return true;
  }
  return false;
}

// Submit admin request from seat selection page
async function submitAdminRequest(event) {
  event.preventDefault();
  
  if (!checkAuth()) {
    alert('Please login first to submit a request');
    return;
  }
  
  const requestText = document.getElementById('userRequest').value.trim();
  const statusDiv = document.getElementById('requestStatus');
  
  if (!requestText) {
    statusDiv.textContent = 'Please enter your request';
    statusDiv.className = 'request-status error';
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/admin/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        request: requestText,
        routeId: selectedRoute?.id || null
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      statusDiv.textContent = '✓ Request sent successfully! Admin will review and contact you.';
      statusDiv.className = 'request-status success';
      document.getElementById('adminRequestForm').reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'request-status';
      }, 5000);
    } else {
      statusDiv.textContent = '✗ Error: ' + (data.message || 'Failed to send request');
      statusDiv.className = 'request-status error';
    }
  } catch (error) {
    console.error('Request submission error:', error);
    statusDiv.textContent = '✗ Network error: ' + error.message;
    statusDiv.className = 'request-status error';
  }
}

// Initialize admin request form on seat page
function initializeAdminRequestForm() {
  const form = document.getElementById('adminRequestForm');
  if (form) {
    form.addEventListener('submit', submitAdminRequest);
  }
}

// Register user
async function registerUser(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('[name="name"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const gender = form.querySelector('[name="gender"]').value.trim();
  const password = form.querySelector('[name="password"]').value;
  const confirmPassword = form.querySelector('[name="confirmPassword"]').value;

  console.log('Registration attempt:', { name, email, gender, password, confirmPassword });

  if (!name || !email || !gender || !password || !confirmPassword) {
    alert('All fields are required!');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  try {
    const requestBody = { name, email, gender, password, confirmPassword };
    console.log('Sending registration request:', requestBody);
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('current_user', JSON.stringify(data.user));
      currentToken = data.token;
      currentUser = data.user;
      console.log('Registration successful - User data:', currentUser);
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } else {
      alert('Registration failed: ' + data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Error registering user: ' + error.message);
  }
}

// Login user
async function loginUser(event) {
  event.preventDefault();
  
  const form = event.target;
  const email = form.querySelector('[name="email"]').value;
  const password = form.querySelector('[name="password"]').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('current_user', JSON.stringify(data.user));
      currentToken = data.token;
      currentUser = data.user;
      console.log('Login successful - User data:', currentUser);
      alert('Login successful!');
      window.location.href = 'homepage.html';
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Error logging in');
  }
}

// Search routes
async function searchRoutes(event) {
  event.preventDefault();
  
  const form = event.target;
  const from = form.querySelector('[name="from"]')?.value?.trim();
  const to = form.querySelector('[name="to"]')?.value?.trim();

  console.log('Search attempt:', { from, to });

  if (!from || !to) {
    alert('Please fill in all fields: From and To');
    return;
  }

  try {
    console.log('Fetching routes from API...');
    const params = new URLSearchParams({ from, to });
    const response = await fetch(`${API_BASE}/routes/search?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success && data.routes && data.routes.length > 0) {
      localStorage.setItem('route_search_results', JSON.stringify(data.routes));
      loadSearchResults();
      window.location.href = 'search.html';
    } else if (data.success && (!data.routes || data.routes.length === 0)) {
      alert('No routes found for this search');
    } else {
      alert('Search failed: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Search error:', error);
    alert('Error searching routes: ' + error.message);
  }
}

// Load search results on search.html
function loadSearchResults() {
  const results = localStorage.getItem('route_search_results');
  const resultsDiv = document.getElementById('search-results');
  
  if (!results || !resultsDiv) return;
  
  const routes = JSON.parse(results);
  resultsDiv.innerHTML = '';
  
  routes.forEach(route => {
    const routeCard = document.createElement('div');
    routeCard.className = 'route-card';
    routeCard.innerHTML = `
      <div class="route-info">
        <h3>${route.from_city} → ${route.to_city}</h3>
        <p><strong>Date:</strong> ${route.departure_date}</p>
        <p><strong>Departure:</strong> ${route.departure_time}</p>
        <p><strong>Price:</strong> Tk. ${route.price}</p>
        <p><strong>Available Seats:</strong> ${route.available_seats}</p>
      </div>
      <button class="select-btn" onclick="selectRoute(${route.id})">
        Select & Choose Seats
      </button>
    `;
    resultsDiv.appendChild(routeCard);
  });
}

// Select route and load seats
async function selectRoute(routeId) {
  try {
    // Fetch seats from API
    const response = await fetch(`${API_BASE}/seats/${routeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    
    if (data.success) {
      // Get the route details
      const results = localStorage.getItem('route_search_results');
      const routes = JSON.parse(results);
      selectedRoute = routes.find(r => r.id === routeId);
      
      // Store selected route and seats
      localStorage.setItem('selected_route', JSON.stringify(selectedRoute));
      localStorage.setItem('route_seats', JSON.stringify(data.seats));
      selectedSeats = [];
      
      // Redirect to seat selection
      window.location.href = 'seat.html';
    } else {
      alert('Error loading seats: ' + data.message);
    }
  } catch (error) {
    console.error('Error selecting route:', error);
    alert('Error loading seats');
  }
}

// Initialize seats on seat.html
function initializeSeats() {
  const seatsData = localStorage.getItem('route_seats');
  const routeData = localStorage.getItem('selected_route');
  const container = document.getElementById('seats-container');
  
  if (!seatsData || !container) {
    console.warn('No seats data or container not found');
    return;
  }

  const seats = JSON.parse(seatsData);
  const route = JSON.parse(routeData);
  
  // Display route info
  const routeInfo = document.getElementById('route-info');
  if (routeInfo) {
    routeInfo.innerHTML = `
      <h2>${route.from_city} → ${route.to_city}</h2>
      <p>Departure: ${route.departure_time} | Price per seat: Tk. ${route.price}</p>
    `;
  }

  // Create seat grid (7 rows × 4 columns with aisle)
  // Format: [A1][A2] AISLE [A3][A4]
  container.innerHTML = '';
  
  const seatsByLabel = {};
  seats.forEach(seat => {
    seatsByLabel[seat.seat_label] = seat;
  });

  // Rows: A-I (9 rows for better layout)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  
  rows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    
    // Left side: columns 1-2
    for (let col = 1; col <= 2; col++) {
      const seatLabel = row + col;
      const seatData = seatsByLabel[seatLabel];
      
      const seatBtn = document.createElement('button');
      seatBtn.className = 'seat';
      seatBtn.textContent = seatLabel;
      seatBtn.dataset.seatLabel = seatLabel;
      
      if (seatData) {
        if (seatData.status === 'booked') {
          seatBtn.classList.add('booked');
          seatBtn.disabled = true;
        } else {
          seatBtn.onclick = () => selectSeat(seatLabel, route.price);
        }
      }
      
      rowDiv.appendChild(seatBtn);
    }
    
    // Aisle (gap)
    const aisle = document.createElement('div');
    aisle.className = 'aisle';
    aisle.textContent = '';
    rowDiv.appendChild(aisle);
    
    // Right side: columns 3-4
    for (let col = 3; col <= 4; col++) {
      const seatLabel = row + col;
      const seatData = seatsByLabel[seatLabel];
      
      const seatBtn = document.createElement('button');
      seatBtn.className = 'seat';
      seatBtn.textContent = seatLabel;
      seatBtn.dataset.seatLabel = seatLabel;
      
      if (seatData) {
        if (seatData.status === 'booked') {
          seatBtn.classList.add('booked');
          seatBtn.disabled = true;
        } else {
          seatBtn.onclick = () => selectSeat(seatLabel, route.price);
        }
      }
      
      rowDiv.appendChild(seatBtn);
    }
    
    container.appendChild(rowDiv);
  });

  // Update seat count
  updateSeatCount(route.price);
  
  // Initialize admin request form
  initializeAdminRequestForm();
}

// Select/deselect a seat
function selectSeat(seatLabel, pricePerSeat) {
  const seatBtn = document.querySelector(`[data-seat-label="${seatLabel}"]`);
  
  if (!seatBtn) return;
  
  if (seatBtn.classList.contains('selected')) {
    // Deselect
    seatBtn.classList.remove('selected');
    selectedSeats = selectedSeats.filter(s => s !== seatLabel);
  } else {
    // Select
    seatBtn.classList.add('selected');
    selectedSeats.push(seatLabel);
  }
  
  localStorage.setItem('selected_seats', JSON.stringify(selectedSeats));
  updateSeatCount(pricePerSeat);
}

// Update selected seat count and total price
function updateSeatCount(pricePerSeat) {
  const countElement = document.getElementById('seat-count');
  const priceElement = document.getElementById('total-price');
  
  if (countElement) {
    countElement.textContent = selectedSeats.length;
  }
  
  if (priceElement) {
    const totalPrice = selectedSeats.length * pricePerSeat;
    priceElement.textContent = `Tk. ${totalPrice}`;
  }
}

// Go to payment page
function goBooking() {
  if (!checkAuth()) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }
  
  if (selectedSeats.length === 0) {
    alert('Please select at least one seat');
    return;
  }

  const route = JSON.parse(localStorage.getItem('selected_route'));
  if (!route) {
    alert('Route information not found');
    return;
  }

  // Store booking details
  localStorage.setItem('booking_details', JSON.stringify({
    route: route,
    seats: selectedSeats,
    totalPrice: selectedSeats.length * route.price,
    timestamp: new Date().toISOString()
  }));

  // Redirect to payment page
  window.location.href = 'payment.html';
}

// Create booking
async function createBooking(event) {
  if (event) event.preventDefault();
  
  if (!checkAuth()) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }
  
  // Restore selectedSeats from localStorage if empty (coming from payment page)
  if (selectedSeats.length === 0) {
    const storedSeats = localStorage.getItem('selected_seats');
    if (storedSeats) {
      selectedSeats = JSON.parse(storedSeats);
      console.log('Restored seats from localStorage:', selectedSeats);
    }
  }
  
  if (selectedSeats.length === 0) {
    alert('Please select at least one seat');
    return;
  }

  const route = JSON.parse(localStorage.getItem('selected_route'));
  
  try {
    const response = await fetch(`${API_BASE}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        userId: currentUser.id,
        routeId: route.id,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * route.price
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Format booking confirmation data
      const booking = {
        booking_id: data.bookingId,
        from_city: route.from_city,
        to_city: route.to_city,
        departure_time: route.departure_time,
        seats: selectedSeats,
        total_price: selectedSeats.length * route.price
      };
      localStorage.setItem('booking_confirmation', JSON.stringify(booking));
      alert('Booking successful!');
      window.location.href = 'booking.html';
    } else {
      alert('Booking failed: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Booking error:', error);
    alert('Error creating booking: ' + (error.message || 'Network error'));
  }
}

// Load booking confirmation on booking.html
function loadBookingConfirmation() {
  const confirmationData = localStorage.getItem('booking_confirmation');
  const container = document.getElementById('booking-details');
  
  if (!confirmationData || !container) return;
  
  const booking = JSON.parse(confirmationData);
  
  container.innerHTML = `
    <div class="confirmation-card">
      <h2>Booking Confirmed!</h2>
      <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
      <p><strong>Route:</strong> ${booking.from_city} → ${booking.to_city}</p>
      <p><strong>Departure:</strong> ${booking.departure_time}</p>
      <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
      <p><strong>Total Price:</strong> Tk. ${booking.total_price}</p>
      <button onclick="downloadTicket()">Download Ticket</button>
    </div>
  `;
}

// Download ticket (simple implementation)
function downloadTicket() {
  const booking = JSON.parse(localStorage.getItem('booking_confirmation'));
  const ticketText = `
TICKET CONFIRMATION
===================
Booking ID: ${booking.booking_id}
Route: ${booking.from_city} → ${booking.to_city}
Departure: ${booking.departure_time}
Seats: ${booking.seats.join(', ')}
Total Price: Tk. ${booking.total_price}

Valid ID required at check-in.
  `;
  
  const blob = new Blob([ticketText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticket_${booking.booking_id}.txt`;
  a.click();
}

// Load booking history on history.html
async function loadBookingHistory() {
  if (!checkAuth()) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/bookings/history/${currentUser.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      const historyContainer = document.getElementById('booking-history');
      
      if (data.bookings.length === 0) {
        historyContainer.innerHTML = '<p>No bookings found</p>';
        return;
      }

      historyContainer.innerHTML = '';
      data.bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
          <h3>${booking.from_city} → ${booking.to_city}</h3>
          <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
          <p><strong>Departure:</strong> ${booking.departure_time}</p>
          <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
          <p><strong>Price:</strong> Tk. ${booking.total_price}</p>
          <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
          <button onclick="viewBookingDetails('${booking.booking_id}')">View Details</button>
        `;
        historyContainer.appendChild(bookingCard);
      });
    } else {
      alert('Error loading booking history: ' + data.message);
    }
  } catch (error) {
    console.error('Error loading booking history:', error);
    alert('Error loading booking history');
  }
}

// View booking details
async function viewBookingDetails(bookingId) {
  if (!checkAuth()) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      const booking = data.booking;
      alert(`
Booking Details:
================
ID: ${booking.booking_id}
Route: ${booking.from_city} → ${booking.to_city}
Seats: ${booking.seats.join(', ')}
Price: Tk. ${booking.total_price}
Date: ${new Date(booking.booking_date).toLocaleDateString()}
      `);
    } else {
      alert('Error loading booking details');
    }
  } catch (error) {
    console.error('Error loading booking details:', error);
  }
}

// Submit contact form
async function submitContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const message = form.querySelector('[name="message"]').value;

  try {
    const response = await fetch(`${API_BASE}/contact/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Message sent successfully!');
      form.reset();
    } else {
      alert('Error sending message: ' + data.message);
    }
  } catch (error) {
    console.error('Contact form error:', error);
    alert('Error sending message');
  }
}

// Logout
function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  localStorage.removeItem('route_search_results');
  localStorage.removeItem('route_seats');
  localStorage.removeItem('selected_route');
  localStorage.removeItem('selected_seats');
  currentToken = null;
  currentUser = null;
  selectedSeats = [];
  window.location.href = 'index.html';
}

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  // Update nav bar if user is logged in
  const userNav = document.getElementById('user-nav');
  if (userNav && currentUser) {
    userNav.innerHTML = `
      <span>Welcome, ${currentUser.name}!</span>
      <button onclick="logout()">Logout</button>
    `;
  }
  
  // Initialize specific pages
  if (document.getElementById('search-results')) {
    loadSearchResults();
  }
  
  if (document.getElementById('seats-container')) {
    initializeSeats();
  }
  
  if (document.getElementById('booking-details')) {
    loadBookingConfirmation();
  }
  
  if (document.getElementById('booking-history')) {
    loadBookingHistory();
  }
});
