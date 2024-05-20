// Wait until the entire DOM content is loaded before executing the function
window.addEventListener("DOMContentLoaded", () => {
  restoreActiveSection(); // Restore the last active section from local storage
});

// Variable to store the map object
var map;

// Function to load the map scenario (using Microsoft Maps)
function loadMapScenario() {
  map = new Microsoft.Maps.Map(document.getElementById("myMap"), {});
}

// Arrays to store data for patients, staff, registrations, and payments
let allPatients = [];
let allStaff = [];
let allReg = [];
let allPayment = [];
let currentPage = 1;
let everything = [allPatients, allStaff, allPayment, allReg];

// Select all side navigation buttons
const theButtons = document.querySelectorAll(".li-btn");

// Add click event listeners to each side navigation button
theButtons.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    const title = document.querySelector(".screen-title");
    const listItems = document.querySelectorAll(".li-btn");
    const divs = document.querySelectorAll(".main-contained > div");

    // Remove 'active' class from all list items and divs
    listItems.forEach((item) => item.classList.remove("active"));
    divs.forEach((div) => div.classList.remove("active"));

    // Add 'active' class to the clicked tab and its corresponding content div
    tab.classList.add("active");
    const pageTitle = tab.querySelector("p");
    title.textContent = pageTitle.innerText;

    const targetDivId = tab.getAttribute("data-target");
    const page = document.getElementById(targetDivId);
    page.classList.add("active");

    // Store the new active page in local storage
    storeActiveSection(targetDivId);
  });
});

// Dashboard screens
const title = document.querySelector(".screen-title");
const dashboardScreen = document.getElementById("dashboard-screen");
const accountScreen = document.getElementById("account-screen");
const ticketScreen = document.getElementById("ticket-screen");
const busScreen = document.getElementById("bus-screen");

// Forms
// const regForm = registerScreen.querySelector(".main-form-all#regForm form");
const staffForm = staffScreen.querySelector(".main-form-all#staffForm form");

const listItems = document.querySelectorAll(".li-btn");
const divs = document.querySelectorAll(".main-contained > div");

// Function to store the active section in local storage
function storeActiveSection(sectionId) {
  localStorage.setItem("activeSection", sectionId);
}

// Function to get the active section from local storage
function getActiveSection() {
  return localStorage.getItem("activeSection");
}

// Function to restore the active section based on stored data in local storage
function restoreActiveSection() {
  const activeSectionId = getActiveSection();
  if (activeSectionId) {
    const activeTab = document.querySelector(
      `[data-target="${activeSectionId}"]`
    );
    if (activeTab) {
      activeTab.click(); // Trigger click to show the active section
    }
  }
}

// Add click event listeners to tabs for handling tab clicks
listItems.forEach((tab) => {
  tab.addEventListener("click", handleTabClick);
});

// Fetch patient data from the backend API
const getPatients = async () => {
  try {
    const response = await fetch("/api/patients");
    allPatients = await response.json();
    const pageSwitch = document.querySelector(
      ".patient-screen #paginationSwitch"
    );
    const pagControls = document.querySelector(".patient-screen #pagination");

    // Toggle pagination controls based on the switch
    if (pageSwitch.checked) {
      pagControls.style.display = "flex";
    } else {
      pagControls.style.display = "none";
    }

    // Update tables and pagination info
    updateTables(
      "patient-screen",
      allPatients,
      currentPage,
      pageSwitch.checked
    );
    updatePaginationInfo("patient-screen", allPatients);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log("List =>", allPatients);
};

// Fetch staff data from the backend API
const getStaff = async () => {
  try {
    const response = await fetch("/api/staff");
    allStaff = await response.json();
    const pageSwitch = document.querySelector(
      ".staff-screen #paginationSwitch"
    );
    const pagControls = document.querySelector(".staff-screen #pagination");

    // Toggle pagination controls based on the switch
    if (pageSwitch.checked) {
      pagControls.style.display = "flex";
    } else {
      pagControls.style.display = "none";
    }

    // Update tables and pagination info
    updateTables("staff-screen", allStaff, currentPage, pageSwitch.checked);
    updatePaginationInfo("staff-screen", allStaff);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch registration data from the backend API
const getReg = async () => {
  try {
    const response = await fetch("/api/registers");
    allReg = await response.json();
    const pageSwitch = document.querySelector(
      ".register-screen #paginationSwitch"
    );
    const pagControls = document.querySelector(".staff-screen #pagination");

    // Toggle pagination controls based on the switch
    if (pageSwitch.checked) {
      pagControls.style.display = "flex";
    } else {
      pagControls.style.display = "none";
    }

    // Update tables and pagination info
    updateTables("register-screen", allReg, currentPage, pageSwitch.checked);
    updatePaginationInfo("register-screen", allReg);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Add click event listeners to refresh buttons
const refreshPatients = document.querySelectorAll("#rf-btn");

refreshPatients.forEach((rfElement) => {
  rfElement.addEventListener("click", () => {
    rfpState = rfElement.nextElementSibling;
    rfElement.style.animation = "rotate 1s infinite";
    rfpState.textContent = "Getting...";
    getDocs(); // Refresh data
    setTimeout(function () {
      rfpState.textContent = "Up to date";
      rfElement.style.animation = "none";
    }, 2000);
    setTimeout(function () {
      rfpState.textContent = "";
    }, 4000);
  });
});

// Event delegation for delete and edit buttons
const btnsForEdit = document.querySelectorAll(".edit-btn");
const btnsForDel = document.querySelectorAll(".delete-btn");
const tables = document.querySelectorAll("table");

tables.forEach((table) => {
  table.addEventListener("click", () => {
    const target = event.target;
    if (target.classList.contains("edit-btn")) {
      const documentId = target.getAttribute("data-id");
      console.log("Edit document with ID:", documentId);
      // Implement edit logic using the documentId
    }
    if (target.classList.contains("delete-btn")) {
      const documentId = target.getAttribute("data-id");
      console.log("Delete document with ID:", documentId);
      // Implement delete logic using the documentId
    }
  });
});

// Function for editing a record
function editRecord(event) {
  const button = event.target.closest("button.edit-btn");
  if (button) {
    const params = button.dataset.id;
    const collection = button.dataset.collection;
    let mainForm;

    console.log("Params:", params);
    console.log("Collection:", collection);

    if (collection == "staff") {
      record = allStaff.find((item) => item._id == params);
      // mainForm = staffForm
      // Populate the staff form with the record data
      staffForm.querySelector('input[name="id"]').value = record._id; // Assuming you have an input field with name "id" for the record ID
      staffForm.querySelector('input[name="name"]').value = record.name;
      staffForm.querySelector('select[name="gender"]').value = record.gender;
      staffForm.querySelector('input[name="role"]').value = record.role;
      staffForm.querySelector('input[name="department"]').value =
        record.department;
      staffForm.querySelector('input[name="email"]').value = record.email;
      staffForm.querySelector('input[name="contact"]').value = record.contact;

      // Scroll to the form
      staffForm.scrollIntoView({ behavior: "smooth" });
    } else if (collection == "patients") {
      record = allPatients.find((item) => item._id == params);
      // record = allPatients.find(item => item._id == "65fdd424f94c421d463d98ef");
      console.info("Patients Record:", record);
    } else if (collection == "registers") {
      record = allReg.find((item) => item._id == params);

      if (record.gender.toLowerCase() == "male") {
        regForm.querySelector('select[name="gender"]').selectedIndex = 1;
      } else {
        regForm.querySelector('select[name="gender"]').selectedIndex = 2;
      }

      if (record.is_patient == true) {
        regForm.querySelector('select[name="is_patient"]').selectedIndex = 0;
      } else {
        regForm.querySelector('select[name="is_patient"]').selectedIndex = 1;
      }

      regForm.querySelector('input[name="id"]').value = record._id; // Assuming you have an input field with name "id" for the record ID
      regForm.querySelector('input[name="name"]').value = record.name;
      // regForm.querySelector('select[name="gender"]').value = record.gender;
      regForm.querySelector('input[name="email"]').value = record.email;
      regForm.querySelector('input[name="contact"]').value = record.contact;
      regForm.querySelector('input[name="occupation"]').value =
        record.occupation;
      regForm.querySelector('input[name="registration_date"]').value =
        record.registration_date;
      regForm.querySelector('input[name="next_of_kin"]').value =
        record.next_of_kin;
      regForm.querySelector('input[name="nok_contact"]').value =
        record.nok_contact;
      // regForm.querySelector('select[name="is_patient"]').value = record.is_patient;
      regForm.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// Function for deleting a record
function deleteRecord(event) {
  const button = event.target.closest("button.delete-btn");
  if (button) {
    const params = button.dataset.id;
    const collection = button.dataset.collection;

    console.log("Params:", params);
    console.log("Collection:", collection);
    let record;

    // Find the record based on collection and params
    if (collection == "staff") {
      record = allStaff.find((item) => item._id == params);
      console.log("Staff Record:", record);
    } else if (collection == "patients") {
      record = allPatients.find((item) => item._id == params);
      console.log("Patients Record:", record);
    } else if (collection == "registers") {
      record = allReg.find((item) => item._id == params);
      console.log("Registers Record:", record);
    }
  }
}