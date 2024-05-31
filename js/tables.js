// tables.js
(function () {
  // Common variables for pagination
  const itemsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;
  let allUsers;

  // Common function to update pagination info
  const updatePaginationInfo = () => {
    document.getElementById("currentPage").textContent = currentPage;
    document.getElementById("totalPages").textContent = totalPages;
  };

  // Common function to handle pagination navigation
  const navigatePagination = (direction, data, populateFunction) => {
    if (direction === "next" && currentPage < totalPages) {
      currentPage++;
    } else if (direction === "prev" && currentPage > 1) {
      currentPage--;
    }

    // Repopulate the table with data for the updated page
    populateFunction(data, currentPage);
    updatePaginationInfo();
  };

  // Event listeners for next and previous pagination buttons
  document
    .querySelector("#nextBtn")
    .addEventListener("click", () =>
      navigatePagination("next", dbUsers, populateAccountTable)
    );
  document
    .querySelector("#prevBtn")
    .addEventListener("click", () =>
      navigatePagination("prev", dbUsers, populateAccountTable)
    );

  // Common function to filter data based on search input
  const filterData = (data, searchInput, populateFunction) => {
    const filteredData = data.filter((item) => {
      const fullName = `${
        item.first_name || item.name || item.ticket_id
      }`.toLowerCase();
      return fullName.includes(searchInput.toLowerCase());
    });

    currentPage = 1;
    totalPages = Math.ceil(filteredData.length / itemsPerPage);
    populateFunction(filteredData, currentPage);
    updatePaginationInfo();
  };

  // Event listener for search form submission
  document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = event.target.querySelector("input").value;
    filterData(dbUsers, searchInput, populateAccountTable);
  });

  // Event listener for search input changes
  document.getElementById("search-form").addEventListener("input", (event) => {
    const searchInput = event.target.value;
    filterData(dbUsers, searchInput, populateAccountTable);
  });

  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = e.target.querySelector("input").value.toLowerCase();
    const filteredTickets = currentTickets.filter((ticket) =>
      Object.values(ticket).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    populateTicketsTable(filteredTickets, 1);
  });

  // Common function to handle refresh button click
  const handleRefresh = (fetchFunction) => {
    const rfElement = document.getElementById("rf-btn");
    const rfpState = rfElement.previousElementSibling;
    rfElement.style.animation = "rotate 1s infinite";
    rfpState.textContent = "Getting...";

    fetchFunction().then(() => {
      rfpState.textContent = "Up to date";
      rfElement.style.animation = "none";
      setTimeout(() => {
        rfpState.textContent = "";
      }, 2000);
    });
  };

  document
    .getElementById("rf-btn")
    .addEventListener("click", () => handleRefresh(fetchUsers));

  // Accounts specific variables and functions
  let dbUsers = [];

  const populateAccountTable = (users, page) => {
    const tbody = document.querySelector("#accountTable tbody");
    tbody.innerHTML = ""; // Clear existing rows

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    displayedUsers.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.phone_number}</td>
          <td>${user.balance}</td>
          <td class="status">${user.is_active ? "active" : "inactive"}</td>
          <td><button class="ban-btn" data-id="${user.email}">${
        user.is_active ? "Ban" : "Unban"
      }</button></td>
        `;
      tbody.appendChild(row);
    });
  };

  const fetchUsers = async () => {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://air.pythonanywhere.com/get_all_users/";

      const response = await fetch(proxyUrl + targetUrl, { method: "GET" });
      const result = await response.json();
      const users = result.users;
      allUsers = users;
      const wallets = result.wallet;

      dbUsers = users.map((user) => {
        const wallet = wallets.find((w) => w.user_id === user.user_id);
        return {
          ...user,
          balance: wallet ? wallet.wallet_balance : "0.00",
        };
      });

      totalPages = Math.ceil(dbUsers.length / itemsPerPage);
      populateAccountTable(dbUsers, currentPage);
      updatePaginationInfo();

      document.getElementById("tAcc").innerText = dbUsers.length;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  fetchUsers();

  // Tickets specific variables and functions
  let dbTickets = [];

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString(undefined, { hour12: false });
    return `${formattedDate} T${formattedTime}`;
  };

  const populateTicketsTable = (tickets, page) => {
    const tbody = document.querySelector("#patientTable tbody");
    tbody.innerHTML = ""; // Clear existing rows

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTickets = tickets.slice(startIndex, endIndex);

    displayedTickets.forEach((ticket) => {
      const row = document.createElement("tr");
      

      const bookingDateFormatted = formatDateTime(ticket.booking_date);
      const transportDateFormatted = formatDate(ticket.transport_date);
      const user = allUsers.find((user) => user.user_id === ticket.user_id);
      const username = user ? user.username : "Unknown";

      row.innerHTML = `
          <td>${ticket.ticket_id}</td>
          <td>${ticket.trip_type}</td>
          <td>${ticket.from_loc}</td>
          <td>${ticket.to_loc}</td>
          <td>${bookingDateFormatted}</td>
          <td>${transportDateFormatted}</td>
          <td>${ticket.price}</td>
          <td>${username}</td>
        `;

      tbody.appendChild(row);
    });
  };

  const fetchTickets = async () => {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://air.pythonanywhere.com/get_all_tickets/";

      const response = await fetch(proxyUrl + targetUrl, { method: "GET" });
      const result = await response.json();
      dbTickets = result.user_tickets;

      totalPages = Math.ceil(dbTickets.length / itemsPerPage);
      populateTicketsTable(dbTickets, currentPage);
      updatePaginationInfo();

      document.getElementById("tTik").innerText = dbTickets.length;
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  fetchTickets();

  // Transactions specific variables and functions
  const fetchTransactions = async () => {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://air.pythonanywhere.com/get_all_transactions/";

      const response = await fetch(proxyUrl + targetUrl, { method: "GET" });
      const result = await response.json();
      const allTransactions = result.all_transactions;

      const totalAmount = allTransactions.reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount),
        0
      );
      document.getElementById("tTran").innerText = totalAmount.toFixed(2);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  fetchTransactions();

  // Ban/unban event listener for accounts table
  document.querySelector("#accountTable").addEventListener("click", (event) => {
    if (event.target.classList.contains("ban-btn")) {
      const button = event.target;
      const userId = button.dataset.email;
      const statusCell = button.closest("tr").querySelector(".status");

      if (statusCell.textContent === "inactive") {
        if (confirm("Are you sure you want to unban this user?")) {
          setTimeout(() => {
            alert("User unbanned successfully.");
            statusCell.textContent = "active";
            button.textContent = "Ban";
            button.style.backgroundColor = "red";
          }, 1000);
        }
      } else {
        if (confirm("Are you sure you want to ban this user?")) {
          setTimeout(() => {
            alert("User banned successfully.");
            statusCell.textContent = "inactive";
            button.textContent = "Unban";
            button.style.backgroundColor = "green";
          }, 1000);
        }
      }
    }
  });
})();
