let token = localStorage.getItem("token") || null;

// Login
$("#loginForm").on("submit", function(e){
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();
  $.post("/api/auth/login", { email, password }, function(data){
    if(data.token){
      localStorage.setItem("token", data.token);
      window.location.href = "profile.html";
    } else {
      alert(data.message || "Login failed");
    }
  });
});

// Load Profile
if(window.location.pathname.includes("profile.html")){
  $.ajax({
    url: "/api/employee/profile",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    success: function(data){
      $("#empid").text(data.empid);
      $("#name").text(data.name);
      $("#email").text(data.email);
      $("#salary").text(data.salary);
    },
    error: function(){ window.location.href="login.html"; }
  });
}

// Leave form
$("#leaveForm").on("submit", function(e){
  e.preventDefault();
  const date = $("#date").val();
  const reason = $("#reason").val();
  $.ajax({
    url: "/api/leave",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ date, reason }),
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    success: function(){ alert("Leave applied"); loadLeaves(); }
  });
});

function loadLeaves(){
  $.ajax({
    url: "/api/leave",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    success: function(data){
      let list = $("#leaveList");
      list.empty();
      data.forEach(l => list.append(`<li>${l.date.substring(0,10)} - ${l.reason} | Granted: ${l.granted}</li>`));
    }
  });
}

if(window.location.pathname.includes("leave.html")) loadLeaves();

// Logout
$("#logoutBtn").on("click", function(){
  localStorage.removeItem("token");
  window.location.href="login.html";
});
