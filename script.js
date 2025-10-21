let entries = JSON.parse(localStorage.getItem("entries")) || [];

const form = document.getElementById("entry-form");
const list = document.getElementById("entry-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");
const resetBtn = document.getElementById("reset-btn");

function updateSummary() {
  const income = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  netBalance.textContent = income - expense;
}

function renderEntries(filter = "all") {
  list.innerHTML = "";
  const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);
  filtered.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "entry-item";
    li.innerHTML = `
      ${entry.description} - ₹${entry.amount} (${entry.type})
      <span>
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </span>
    `;
    list.appendChild(li);
  });
  updateSummary();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  entries.push({ description, amount, type });
  localStorage.setItem("entries", JSON.stringify(entries));
  form.reset();
  renderEntries(document.querySelector('input[name="filter"]:checked').value);
});

resetBtn.addEventListener("click", () => form.reset());

function editEntry(index) {
  const entry = entries[index];
  document.getElementById("description").value = entry.description;
  document.getElementById("amount").value = entry.amount;
  document.getElementById("type").value = entry.type;
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries(document.querySelector('input[name="filter"]:checked').value);
}

function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries(document.querySelector('input[name="filter"]:checked').value);
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener("change", () => renderEntries(radio.value));
});

renderEntries();
