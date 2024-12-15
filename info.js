// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA4cAerPVghUUGzz_SEY6x87RKAQj3hhtA",
  authDomain: "nt101-ae2a9.firebaseapp.com",
  databaseURL:
    "https://nt101-ae2a9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nt101-ae2a9",
  storageBucket: "nt101-ae2a9.firebasestorage.app",
  messagingSenderId: "970129026346",
  appId: "1:970129026346:web:ae55e8a30e8903d97c8253",
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Hàm định dạng ngày từ yyyy-mm-dd sang dd/mm/yyyy
function formatDateToDDMMYYYY(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Hàm kiểm tra dữ liệu đầu vào
function validateInput(input, condition) {
  if (condition) {
    input.classList.remove("error"); // Xóa lỗi nếu hợp lệ
    return true;
  } else {
    input.classList.add("error"); // Thêm lỗi nếu không hợp lệ
    return false;
  }
}

// Xử lý khi form được submit
document
  .getElementById("healthForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn hành vi mặc định (reload trang)

    // Lấy các giá trị từ form
    const name = document.getElementById("name");
    const age = document.getElementById("age");
    const height = document.getElementById("height");
    const weight = document.getElementById("weight");
    const bloodPressure = document.getElementById("bloodPressure");
    const medicalHistory = document.getElementById("medicalHistory");
    const admissionDate = document.getElementById("admissionDate");
    const address = document.getElementById("address");
    const phoneNumber = document.getElementById("phoneNumber");
    const heartRate = document.getElementById("heartRate");

    // Xác thực dữ liệu đầu vào
    let isValid = true;
    isValid &= validateInput(name, name.value.trim() !== "");
    isValid &= validateInput(age, age.value > 0);
    isValid &= validateInput(height, height.value > 0);
    isValid &= validateInput(weight, weight.value > 0);
    isValid &= validateInput(bloodPressure, bloodPressure.value.trim() !== "");
    isValid &= validateInput(
      medicalHistory,
      medicalHistory.value.trim() !== ""
    );
    isValid &= validateInput(admissionDate, admissionDate.value !== "");
    isValid &= validateInput(address, address.value.trim() !== "");
    isValid &= validateInput(
      phoneNumber,
      /^\d{10,11}$/.test(phoneNumber.value)
    );
    isValid &= validateInput(heartRate, heartRate.value > 0);
    if (isValid) {
      const formattedDate = formatDateToDDMMYYYY(admissionDate.value);

      // Kiểm tra dữ liệu trước khi lưu vào Firebase
      console.log({
        name: name.value.trim(),
        age: parseInt(age.value),
        height: parseFloat(height.value),
        weight: parseFloat(weight.value),
        bloodPressure: bloodPressure.value.trim(),
        medicalHistory: medicalHistory.value.trim(),
        admissionDate: formattedDate,
        address: address.value.trim(),
        phoneNumber: phoneNumber.value.trim(),
        heartRate: parseInt(heartRate.value),
      });

      // Tạo reference đến vị trí trong Realtime Database
      const healthInfoRef = ref(
        database,
        "health_info/" + fileNumber.value.trim()
      );

      // Lưu dữ liệu vào Firebase Realtime Database
      set(healthInfoRef, {
        name: name.value.trim(),
        age: parseInt(age.value),
        height: parseFloat(height.value),
        weight: parseFloat(weight.value),
        bloodPressure: bloodPressure.value.trim(),
        medicalHistory: medicalHistory.value.trim(),
        admissionDate: formattedDate,
        address: address.value.trim(),
        phoneNumber: phoneNumber.value.trim(),
        heartRate: parseInt(heartRate.value),
      })
        .then(() => {
          alert("Thông tin đã được lưu thành công!");
          document.getElementById("healthForm").reset(); // Xóa nội dung form sau khi lưu
          document
            .querySelectorAll(".error")
            .forEach((input) => input.classList.remove("error")); // Xóa trạng thái lỗi
        })
        .catch((error) => {
          console.error("Firebase Error: ", error);
          alert("Có lỗi xảy ra: " + error.message);
        });
    } else {
      alert("Vui lòng kiểm tra lại các trường nhập!");
    }
  });
