const autoAgeSpans = document.getElementsByClassName("autoAge");

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if birthday hasn't occurred yet this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

for(let i = 0; i < autoAgeSpans.length; i++) {
    autoAgeSpans[i].innerHTML = calculateAge("2009-03-01");
}
