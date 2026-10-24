
const form = document.getElementById("registerForm");
const resultBox = document.getElementById("formResult");
const btnReset = document.getElementById("btnReset");
const alasanInput = document.getElementById("alasan");
const charCount = document.getElementById("charCount");

const validators = {
  nama(value) {
    if (!value.trim()) return "Nama wajib diisi.";
    if (value.trim().length < 3) return "Nama minimal 3 karakter.";
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Format email tidak valid.";
    return "";
  },
  umur(value) {
    if (value === "") return "Umur wajib diisi.";
    const n = Number(value);
    if (!Number.isInteger(n)) return "Umur harus berupa bilangan bulat.";
    if (n < 17 || n > 60) return "Umur harus antara 17 sampai 60 tahun.";
    return "";
  },
  topik(value) {
    return value ? "" : "Pilih salah satu topik.";
  },
  alasan(value) {
    if (!value.trim()) return "Alasan wajib diisi.";
    if (value.trim().length < 10) return "Alasan minimal 10 karakter.";
    return "";
  },
};

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  errorEl.textContent = message;
  input.classList.toggle("is-invalid", message !== "");
  input.classList.toggle("is-valid", message === "");
}

function validateField(fieldId) {
  const input = document.getElementById(fieldId);
  const message = validators[fieldId](input.value);
  showError(fieldId, message);
  return message === "";
}

function validateAgreement() {
  const checkbox = document.getElementById("setuju");
  const errorEl = document.getElementById("setujuError");
  errorEl.textContent = checkbox.checked ? "" : "Anda harus menyetujui syarat dan ketentuan.";
  return checkbox.checked;
}

function showResult(data) {
  resultBox.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = `Terima kasih, ${data.nama}! Pendaftaran berhasil.`;

  const list = document.createElement("dl");
  const rows = [
    ["Nama", data.nama],
    ["Email", data.email],
    ["Umur", data.umur + " tahun"],
    ["Topik", data.topik],
    ["Level", data.level],
    ["Alasan", data.alasan],
  ];
  rows.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.append(dt, dd);
  });

  resultBox.append(title, list);
  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


["nama", "email", "umur", "alasan"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => validateField(id));
});
document.getElementById("topik").addEventListener("change", () => validateField("topik"));
document.getElementById("setuju").addEventListener("change", validateAgreement);


alasanInput.addEventListener("input", () => {
  charCount.textContent = alasanInput.value.length;
});


form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fieldIds = ["nama", "email", "umur", "topik", "alasan"];
  const results = fieldIds.map(validateField);
  const agreed = validateAgreement();

  if (!results.every(Boolean) || !agreed) {
    resultBox.hidden = true;
    const firstInvalid = form.querySelector(".is-invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  showResult({
    nama: form.nama.value.trim(),
    email: form.email.value.trim(),
    umur: form.umur.value,
    topik: form.topik.value,
    level: form.level.value,
    alasan: form.alasan.value.trim(),
  });
});

btnReset.addEventListener("click", () => {
  form.reset();
  charCount.textContent = "0";
  resultBox.hidden = true;
  form.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
    el.classList.remove("is-valid", "is-invalid");
  });
});
