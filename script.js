//admindashboard.html


const sidebarBtn = document.querySelector(".sidebarBtn");
const sidebar = document.querySelector(".sidebar");
const homeSection = document.querySelector(".home-section");

sidebarBtn.onclick = function () {
  sidebar.classList.toggle("active");
  homeSection.classList.toggle("active");
};

// Initialize Firebase
const firebaseConfig = {
apiKey: "AIzaSyBr6DfSQdrr8nj7l5_zJXZhKJMk1puWbR0",
authDomain: "fir-73e54.firebaseapp.com",
databaseURL: "https://fir-73e54-default-rtdb.firebaseio.com",
projectId: "fir-73e54",
storageBucket: "fir-73e54.appspot.com",
messagingSenderId: "578007925758",
appId: "1:578007925758:web:df4216c180067bc3dd76af",
measurementId: "G-BBB402HQTG"
};
firebase.initializeApp(firebaseConfig);

// Reference to the Firebase database
var database = firebase.database();
// Get references to the total customers and total medical shops elements
var totalCustomersElement = document.querySelector('.overview-boxes .box:nth-child(1) .number');
var totalMedicalShopsElement = document.querySelector('.overview-boxes .box:nth-child(2) .number');
var totalReservationsElement = document.querySelector('.overview-boxes .box:nth-child(3) .number');


// Retrieve data from the 'users' and 'medicalStores' nodes in Firebase Realtime Database
firebase.database().ref('RegisteredUsers').on('value', function (snapshot) {
var users = snapshot.val();
var totalCustomers = Object.keys(users).length;
totalCustomersElement.textContent = totalCustomers;
});

firebase.database().ref('medical store').on('value', function (snapshot) {
var medicalStores = snapshot.val();
var totalMedicalShops = Object.keys(medicalStores).length;
totalMedicalShopsElement.textContent = totalMedicalShops;
});


// Retrieve data from the 'reservations' node in Firebase Realtime Database
firebase.database().ref('reservation').once('value', function (snapshot) {
var reservations = snapshot.val();
var totalReservations = Object.keys(reservations).length;
totalReservationsElement.textContent = totalReservations;
});
// Retrieve the username from the localStorage
var username = localStorage.getItem("username");

// Get references to the label and span elements
var usernameLabel = document.getElementById("usernameLabel");
var usernameSpan = document.getElementById("username");

// Set the value of the span element and hide the label
usernameSpan.innerText = username;
usernameLabel.style.display = "none";

// Get the confirmation box element
const confirmationBox = document.getElementById('confirmationBox');

// Function to show the confirmation box
function showConfirmationBox() {
confirmationBox.style.display = 'block';
}

// Function to hide the confirmation box
function hideConfirmationBox() {
confirmationBox.style.display = 'none';
}

// Function to cancel logout
function cancelLogout() {
hideConfirmationBox();
}


function confirmLogout() {
sessionStorage.clear();
  window.history.replaceState({}, '', 'index.html');
  window.location.href = "index.html";
  hideConfirmationBox();
}
// Function to handle the logout process
function logout() {
// Show the confirmation box before logging out
showConfirmationBox();
}



document.addEventListener('DOMContentLoaded', function() {
  const calendarContainer = document.getElementById('calendar-container');
  const monthTitle = document.getElementById('month-title');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();

  // Function to generate the calendar for a specific month
  function generateCalendar(year, month) {
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const firstWeekDay = firstDayOfMonth.getDay();
      const lastWeekDay = lastDayOfMonth.getDay();
      const totalDays = lastDayOfMonth.getDate();
      const calendarTable = document.createElement('table');

      let dayCount = 1;

      // Create table header
      const tableHeader = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weekdays.forEach(weekday => {
          const th = document.createElement('th');
          th.textContent = weekday;
          headerRow.appendChild(th);
      });
      tableHeader.appendChild(headerRow);
      calendarTable.appendChild(tableHeader);

      // Create table body
      const tableBody = document.createElement('tbody');
      for (let week = 0; week < 6; week++) {
          const row = document.createElement('tr');
          for (let day = 0; day < 7; day++) {
              const cell = document.createElement('td');
              if ((week === 0 && day < firstWeekDay) || dayCount > totalDays) {
                  cell.textContent = '';
              } else {
                  cell.textContent = dayCount;
                  if (dayCount === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                      cell.classList.add('today');
                  }
                  dayCount++;
              }
              row.appendChild(cell);
          }
          tableBody.appendChild(row);
      }
      calendarTable.appendChild(tableBody);

      return calendarTable;
  }
 // Function to display the calendar for the current month
 function displayCalendar() {
  const calendarTable = generateCalendar(currentYear, currentMonth);
  calendarContainer.innerHTML = '';
  calendarContainer.appendChild(calendarTable);

  // Display the month name in the header
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentYear, currentMonth, 1));
  monthTitle.textContent = `${monthName} ${currentYear}`;
}


  displayCalendar();
   // Event listeners for navigation buttons
   prevMonthBtn.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayCalendar();
});

nextMonthBtn.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayCalendar();
});
});

 // Function to fetch users data from Firebase and populate the table
 function populateRegisteredUsersTable() {
  const registeredUsersRef = firebase.database().ref("RegisteredUsers");
  registeredUsersRef.on("value", (snapshot) => {
    const registeredUsersData = snapshot.val();
    let tableBodyHtml = "";

    if (registeredUsersData) {
      Object.entries(registeredUsersData).forEach(([phoneNumber, userData], index) => {
        const { name } = userData;
        const slno = index + 1;
        // Fetch reservation details for the user from Firebase
        const reservationsRef = firebase.database().ref("reservation");
        reservationsRef.orderByChild("phNo").equalTo(phoneNumber).on("value", (reservationSnapshot) => {
          const reservationsData = reservationSnapshot.val();
          if (reservationsData) {
            // Calculate the number of reservations for this user
            const numReservations = Object.keys(reservationsData).length;
            // Collect the reservation history as an array
            const history = Object.values(reservationsData);
            tableBodyHtml += `
              <tr>
                <td>${slno}</td>
                <td>${phoneNumber}</td>
                <td>${name}</td>
               
                <td><a href="javascript:void(0)" onclick="viewReservationHistory('${phoneNumber}')">view history</a></td>
              </tr>
            `;
          } else {
            // If there are no reservations for this user, display zero values
            tableBodyHtml += `
              <tr>
                <td>${slno}</td>
                <td>${phoneNumber}</td>
                <td>${name}</td>
                
                <td>No reservations</td>
              </tr>
            `;
          }

          document.getElementById("tableBody").innerHTML = tableBodyHtml;
        });
      });
    }
  });
}


// Call the function to populate the table
populateRegisteredUsersTable();
 // Function to fetch the reservation history and show the popup
// Function to show the popup with reservation history table
function showPopup(historyData) {
const popup = document.getElementById("popup");
const historyTableBody = document.getElementById("historyTableBody");
const historyTableHtml = generateHistoryTable(historyData);
historyTableBody.innerHTML = historyTableHtml;
popup.style.display = "block";
}

// Function to close the popup
function closePopup() {
const popup = document.getElementById("popup");
popup.style.display = "none";
}

// Function to fetch the reservation history and show the popup
function viewReservationHistory(phoneNumber) {
const reservationsRef = firebase.database().ref("reservation");
reservationsRef.orderByChild("phNo").equalTo(phoneNumber).on("value", (reservationSnapshot) => {
  const reservationsData = reservationSnapshot.val();
  if (reservationsData) {
    const history = Object.values(reservationsData);
    showPopup(history); // Call showPopup with the reservation history data
  }
});
}

// Function to format the date as "dd-mm-yyyy"
function formatDate(dateString) {
const date = new Date(dateString);
const day = date.getDate().toString().padStart(2, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const year = date.getFullYear();
return `${day}-${month}-${year}`;
}

// Function to generate HTML for the history table
function generateHistoryTable(historyData) {
// Sort historyData in reverse chronological order based on the reservation dates
historyData.sort((a, b) =>  {
  // Convert the date and time strings to Date objects for comparison
  const dateTimeA = new Date(a.date + ' ' + a.time);
  const dateTimeB = new Date(b.date + ' ' + b.time);

  // Sort in descending order based on date and time
  return dateTimeB - dateTimeA;
});

let historyTableHtml = "";
historyData.forEach((reservation) => {
const { date, time, medicineName, qty, price, status } = reservation;
const formattedDate = formatDate(date);
const shopNameAndPlace = reservation.shopName + ", " + reservation.place;
historyTableHtml += `
  <tr>
    <td>${formattedDate}</td>
    <td>${time}</td>
    <td>${medicineName}</td>
    <td>${shopNameAndPlace}</td>
    <td>${qty}</td>
    <td>${price}</td>
    <td>${status}</td>
  </tr>
`;
});
return historyTableHtml;
}


