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

//tính năng đăng kí
document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.getElementById("signUp");

  signUpButton.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const cpassword = document.getElementById("cPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Đã đăng kí
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

//tính năng đăng nhập
const signInButton = document.getElementById("signIn");
if (signInButton) {
  signInButton.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email_field").value;
    const password = document.getElementById("password_field").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //đã đăng nhập
        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href = "info.html";
        const dt = new Date();
        update(ref(database, "users/" + user.uid), {
          last_login: dt,
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
}

//Hàm này tạo ra để theo dõi trạng thái đăng nhập của người dùng
const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    //người dùng đã đăng xuất
  }
});
