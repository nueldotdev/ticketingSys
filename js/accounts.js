// Dummy Data
const dummyUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    balance: "$100",
    status: "active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "123-456-7891",
    balance: "$200",
    status: "active",
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    phone: "123-456-7892",
    balance: "$150",
    status: "active",
  },
  {
    id: 4,
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    phone: "123-456-7893",
    balance: "$120",
    status: "active",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    phone: "123-456-7894",
    balance: "$80",
    status: "active",
  },
  {
    id: 6,
    firstName: "Diana",
    lastName: "Miller",
    email: "diana.miller@example.com",
    phone: "123-456-7895",
    balance: "$90",
    status: "active",
  },
  {
    id: 7,
    firstName: "Eve",
    lastName: "Wilson",
    email: "eve.wilson@example.com",
    phone: "123-456-7896",
    balance: "$110",
    status: "active",
  },
  {
    id: 8,
    firstName: "Frank",
    lastName: "Moore",
    email: "frank.moore@example.com",
    phone: "123-456-7897",
    balance: "$130",
    status: "active",
  },
  {
    id: 9,
    firstName: "Grace",
    lastName: "Taylor",
    email: "grace.taylor@example.com",
    phone: "123-456-7898",
    balance: "$140",
    status: "active",
  },
  {
    id: 10,
    firstName: "Hank",
    lastName: "Anderson",
    email: "hank.anderson@example.com",
    phone: "123-456-7899",
    balance: "$160",
    status: "active",
  },
  {
    id: 11,
    firstName: "Ivy",
    lastName: "Thomas",
    email: "ivy.thomas@example.com",
    phone: "123-456-7800",
    balance: "$170",
    status: "active",
  },
  {
    id: 12,
    firstName: "Jack",
    lastName: "Jackson",
    email: "jack.jackson@example.com",
    phone: "123-456-7801",
    balance: "$180",
    status: "active",
  },
  {
    id: 13,
    firstName: "Karen",
    lastName: "White",
    email: "karen.white@example.com",
    phone: "123-456-7802",
    balance: "$190",
    status: "active",
  },
  {
    id: 14,
    firstName: "Leo",
    lastName: "Harris",
    email: "leo.harris@example.com",
    phone: "123-456-7803",
    balance: "$210",
    status: "active",
  },
  {
    id: 15,
    firstName: "Mona",
    lastName: "Clark",
    email: "mona.clark@example.com",
    phone: "123-456-7804",
    balance: "$220",
    status: "active",
  },
  {
    id: 16,
    firstName: "Nina",
    lastName: "Lewis",
    email: "nina.lewis@example.com",
    phone: "123-456-7805",
    balance: "$230",
    status: "active",
  },
  {
    id: 17,
    firstName: "Oscar",
    lastName: "Walker",
    email: "oscar.walker@example.com",
    phone: "123-456-7806",
    balance: "$240",
    status: "active",
  },
  {
    id: 18,
    firstName: "Pam",
    lastName: "Hall",
    email: "pam.hall@example.com",
    phone: "123-456-7807",
    balance: "$250",
    status: "active",
  },
  {
    id: 19,
    firstName: "Quinn",
    lastName: "Young",
    email: "quinn.young@example.com",
    phone: "123-456-7808",
    balance: "$260",
    status: "active",
  },
  {
    id: 20,
    firstName: "Rita",
    lastName: "King",
    email: "rita.king@example.com",
    phone: "123-456-7809",
    balance: "$270",
    status: "active",
  }, // Populate the account table with dummy users
];

// Define variables for pagination
const itemsPerPage = 10;
let currentPage = 1;
let totalUsers = dummyUsers.length;
let totalPages = Math.ceil(totalUsers / itemsPerPage);

// Function to populate the account table with users based on pagination
const populateAccountTable = (users, page) => {
  const tbody = document.querySelector("#accountTable tbody");
  tbody.innerHTML = ""; // Clear existing rows

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  displayedUsers.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.balance}</td>
            <td class="status">active</td>
            <td><button class="ban-btn" data-id="${user.id}">Ban</button></td>
        `;

    tbody.appendChild(row);
  });
};

// Function to update pagination info
const updatePaginationInfo = () => {
  document.getElementById("currentPage").textContent = currentPage;
  document.getElementById("totalPages").textContent = totalPages;
};

// Initial display of users and pagination info
populateAccountTable(dummyUsers, currentPage);
updatePaginationInfo();

// Function to handle pagination navigation
const navigatePagination = (direction) => {
  if (direction === "next" && currentPage < totalPages) {
    currentPage++;
  } else if (direction === "prev" && currentPage > 1) {
    currentPage--;
  }

  // Repopulate the account table with users for the updated page
  populateAccountTable(dummyUsers, currentPage);
  updatePaginationInfo();
};

// Event listener for next and previous pagination buttons
document
  .querySelector("#nextBtn")
  .addEventListener("click", () => navigatePagination("next"));
document
  .querySelector("#prevBtn")
  .addEventListener("click", () => navigatePagination("prev"));

// Function to filter users based on search input
const filterUsers = (searchInput) => {
  const filteredUsers = dummyUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchInput.toLowerCase());
  });

  // Repopulate the account table with filtered users
  currentPage = 1;
  totalUsers = filteredUsers.length;
  totalPages = Math.ceil(totalUsers / itemsPerPage);
  populateAccountTable(filteredUsers, currentPage);
  updatePaginationInfo();
};

// Event listener for search form submission
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const searchInput = event.target.querySelector("input").value;
  filterUsers(searchInput);
});

// Event listener for search input changes
document.getElementById("search-form").addEventListener("input", (event) => {
  const searchInput = event.target.value;
  filterUsers(searchInput);
});

// // Function to handle refresh button click
// const handleRefresh = () => {
//   // Repopulate the account table with users for the current page
//   populateAccountTable(dummyUsers, currentPage);
// };

// // Event listener for refresh button click
// document.getElementById("rf-btn").addEventListener("click", handleRefresh);

// Event listener for ban buttons
document.querySelector("#accountTable").addEventListener("click", (event) => {
  if (event.target.classList.contains("ban-btn")) {
    const button = event.target;
    const userId = button.dataset.id;
    const statusCell = button.closest("tr").querySelector(".status");

    if (statusCell.textContent === "banned") {
      // Confirm the user's intention to unban
      if (confirm("Are you sure you want to unban this user?")) {
        // Perform unban operation
        // Simulate a successful unban operation for demonstration purposes
        setTimeout(() => {
          alert("User unbanned successfully.");
          // Update the table or any other necessary action
          statusCell.textContent = "active";
          button.textContent = "Ban";
          button.style.backgroundColor = "red";
        }, 1000);
      }
    } else {
      // Confirm the user's intention to ban
      if (confirm("Are you sure you want to ban this user?")) {
        // Perform ban operation
        // Simulate a successful ban operation for demonstration purposes
        setTimeout(() => {
          alert("User banned successfully.");
          // Update the table or any other necessary action
          statusCell.textContent = "banned";
          button.textContent = "Unban";
          button.style.backgroundColor = "green";
        }, 1000);
      }
    }

    // Commented out fetch API to send status to backend
    /*
          fetch(`/api/users/${userId}/status`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: statusCell.textContent }),
          })
          .then(response => response.json())
          .then(data => {
              console.log('Success:', data);
          })
          .catch((error) => {
              console.error('Error:', error);
          });
          */
  }
});

// Commented out fetch API to fetch users from backend
/*
  const fetchUsers = async () => {
      try {
          const response = await fetch('/api/users');
          const users = await response.json();
          console.log(users);
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  };
  
  // Uncomment this line to fetch users when ready
  // fetchUsers();
  */
