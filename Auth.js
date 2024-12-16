// Lấy thông tin từ biến môi trường
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth(app);

// Tính năng đăng ký
document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.getElementById("signUp");

  signUpButton.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const cpassword = document.getElementById("cPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Đã đăng ký
        const user = userCredential.user;
        set(ref(database, "users/" + user.uid), {
          email: email,
          password: password,
          cpassword: cpassword,
        });
        window.location.href = "info.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorMessage, "signUpMessage");
      });
  });
});

// Tính năng đăng nhập
const signInButton = document.getElementById("signIn");
if (signInButton) {
  signInButton.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email_field").value;
    const password = document.getElementById("password_field").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Đã đăng nhập
        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href = "Menu1.html";
        update(ref(database, "users/" + user.uid), {});
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
}

// Hàm này tạo ra để theo dõi trạng thái đăng nhập của người dùng
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    const uid = user.uid;

    // Lấy thời gian đăng nhập và chuyển sang giờ Việt Nam
    const loginTimestamp = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    // Lưu trạng thái đăng nhập vào Realtime Database
    update(ref(database, "users/" + uid), {
      isLoggedIn: true,
      lastLogin: loginTimestamp,
    });

    console.log(`User logged in: ${uid}`);
  } else {
    // Người dùng đã đăng xuất
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
      update(ref(database, "users/" + loggedInUserId), {
        isLoggedIn: false,
      }).then(() => {
        localStorage.removeItem("loggedInUserId"); // Xóa thông tin người dùng khỏi localStorage
        console.log("User logged out and status updated in database.");
      });
    }
  }
});
