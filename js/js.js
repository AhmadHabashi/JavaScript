"use strict";

const contactsList = document.getElementById("contactsList");
const addContactBtn = document.getElementById("addContactBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const toggleEffectBtn = document.getElementById("toggleEffectBtn");
const popupModal = document.getElementById("popupModal");
const viewModal = document.getElementById("viewModal");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const notesInput = document.getElementById("notes");
const profilePicInput = document.getElementById("profilePic");
const previewImage = document.getElementById("previewImage");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");
const viewName = document.getElementById("viewName");
const viewPhone = document.getElementById("viewPhone");
const viewEmail = document.getElementById("viewEmail");
const viewAddress = document.getElementById("viewAddress");
const viewNotes = document.getElementById("viewNotes");
const viewImage = document.getElementById("viewImage");
const closeViewBtn = document.getElementById("closeViewBtn");

let contacts = [
  {
    name: "Ahmad",
    phone: "+972-50-1234567",
    email: "ahmad@example.com",
    address: "Tel Aviv",
    notes: "Friend from university",
    image: "images/360_F_308196365_Nl9pcWZr8hqXaeilsMBxYi5D32hH6LCK.jpg",
    favorite: false
  },
  {
    name: "David",
    phone: "+972-52-2222222",
    email: "david@example.com",
    address: "Haifa",
    notes: "Team leader",
    image: "images/360_F_396167959_aAhZiGlJoeXOBHivMvaO0Aloxvhg3eVT.jpg",
    favorite: true
  },
  {
    name: "Also",
    phone: "+972-54-3333333",
    email: "Also@example.com",
    address: "Haifa",
    notes: "Teacher",
    image: "images/images.jpg",
    favorite: false
  }
];

let editIndex = null;

function renderContacts(filter = "") {
  contactsList.innerHTML = "";
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length === 0) {
    document.getElementById("emptyMessage").classList.remove("hidden");
  } else {
    document.getElementById("emptyMessage").classList.add("hidden");
  }

  filtered.sort((a, b) => {
    if (b.favorite && !a.favorite) return 1;
    if (a.favorite && !b.favorite) return -1;
    return a.name.localeCompare(b.name);
  });

  filtered.forEach(contact => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${contact.image}" alt="${contact.name}" />
      <p><strong>${contact.name}</strong></p>
      <p>${contact.phone}</p>
      <div class="card-buttons">
        <button class="view" data-name="${contact.name}">View</button>
        <button class="edit" data-name="${contact.name}">Edit</button>
        <button class="delete" data-name="${contact.name}">Delete</button>
        <button class="favorite" data-name="${contact.name}">${contact.favorite ? "★" : "☆"}</button>
      </div>`;
    card.addEventListener("mouseover", () => card.classList.add("highlight"));
    card.addEventListener("mouseout", () => card.classList.remove("highlight"));
    contactsList.appendChild(card);
  });
}

function openPopup(contact = null) {
  popupModal.classList.remove("hidden");
  document.getElementById("formTitle").textContent = editIndex === null ? "Add Contact" : "Edit Contact";
  if (contact) {
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;
    addressInput.value = contact.address;
    notesInput.value = contact.notes;
    previewImage.src = contact.image;
    previewImage.classList.remove("hidden");
  } else {
    contactForm.reset();
    previewImage.src = "";
    previewImage.classList.add("hidden");
  }
}

function closePopup() {
  popupModal.classList.add("hidden");
  editIndex = null;
}

function openViewModal(contact) {
  viewModal.classList.remove("hidden");
  viewName.textContent = contact.name;
  viewPhone.textContent = contact.phone;
  viewEmail.textContent = contact.email || "";
  viewAddress.textContent = contact.address || "";
  viewNotes.textContent = contact.notes || "";
  viewImage.src = contact.image;
}

function closeViewModal() {
  viewModal.classList.add("hidden");
}

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const newContact = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    notes: notesInput.value.trim(),
    image: previewImage.src || "",
    favorite: false
  };
  if (editIndex === null) {
    const exists = contacts.some(c => c.name.toLowerCase() === newContact.name.toLowerCase());
    if (exists) {
      alert("Contact already exists");
      return;
    }
    contacts.push(newContact);
  } else {
    contacts[editIndex] = newContact;
  }
  renderContacts();
  closePopup();
});

addContactBtn.addEventListener("click", () => openPopup());
cancelBtn.addEventListener("click", closePopup);
closeViewBtn.addEventListener("click", closeViewModal);
deleteAllBtn.addEventListener("click", () => {
  contacts = [];
  renderContacts();
});

toggleEffectBtn.addEventListener("click", () => {
  document.body.classList.toggle("grayscale");
});


searchInput.addEventListener("input", e => renderContacts(e.target.value));

profilePicInput.addEventListener("change", () => {
  const file = profilePicInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImage.src = e.target.result;
      previewImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener("click", e => {
  const name = e.target.dataset.name;
  const contact = contacts.find(c => c.name === name);

  if (!contact) return;

  if (e.target.classList.contains("edit")) {
    editIndex = contacts.indexOf(contact);
    openPopup(contact);
  } else if (e.target.classList.contains("delete")) {
    contacts = contacts.filter(c => c.name !== name);
    renderContacts();
  } else if (e.target.classList.contains("view")) {
    openViewModal(contact);
  } else if (e.target.classList.contains("favorite")) {
    contact.favorite = !contact.favorite;
    renderContacts();
  }
});

renderContacts();
