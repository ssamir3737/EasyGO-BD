let seatCount = 0;
let price = Number(localStorage.getItem("seatPrice")) || 1200;

console.log("Seat price:", price);

function searchRoute() {
    if (!from.value || !to.value || !date.value) {
        alert("Fill all fields");
        return;
    }
    window.location.href = "search.html";
}
function selectSeat(seat) {

    if (seat.classList.contains("booked")) return;

    seat.classList.toggle("selected");

    seatCount = document.querySelectorAll(".seat.selected").length;
    count.innerText = seatCount;
    total.innerText = seatCount * price;
}
function goSeat(busPrice) {
    localStorage.setItem("seatPrice", busPrice);
    window.location.href = "seat.html";
}

function goBooking() {
    if (seatCount === 0) {
        alert("Select at least one seat");
        return;
    }

    const seats = [...document.querySelectorAll(".seat.selected")].map(s => s.innerText);

    const booking = {
        id: "EGB" + Date.now(),
        seats,
        price: seatCount * price
    };

    const history = JSON.parse(localStorage.getItem("bookingHistory")) || [];
    history.push(booking);

    localStorage.setItem("bookingHistory", JSON.stringify(history));
    localStorage.setItem("lastBooking", JSON.stringify(booking));

    window.location.href = "booking.html";
}
