const accessToken = '9732a7e8f20238'; // Replace with your actual access token

var ip;
var locationn;

async function getGeoLocation(op) {
    try {
        const response = await fetch(`https://ipinfo.io/${op}/json?token=${accessToken}`);
        const data = await response.json();
        locationn = data;
      } catch (error) {
        console.error('Error fetching IP address:', error);
        return false;
      }
}

async function getPublicIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log("IP address: " + data.ip)
      ip = data.ip
      getGeoLocation(ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return false;
    }
  }


getPublicIP()

async function sendAnalytics(p,t) {
    var log = await getCurrentDateTime(p, t)
    const formData = new FormData();
    formData.append("data", JSON.stringify(log));

    fetch('https://script.google.com/macros/s/AKfycbz26nZqPM-AEs9MTBYWX0_36fkIc3OuUSU2GcT-4N2kAdB39igm1BKb-1pj-1ZR7igs/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        // Handle the response from the server
        console.log('Success:', result);
    })
    .catch(error => {
        // Handle any errors
        console.log('Error:', error);
    });
}

function getOS() {
    const userAgent = navigator.userAgent;

    if (/Windows/i.test(userAgent)) {
        return 'Windows';
    } else if (/Macintosh/i.test(userAgent)) {
        return 'Mac OS';
    } else if (/Linux/i.test(userAgent)) {
        return 'Linux';
    } else if (/Android/i.test(userAgent)) {
        return 'Android';
    } else if (/iOS/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {
        return 'iOS';
    } else if (/CrOS/i.test(userAgent)) {
        return 'Chrome OS';
    } else if (/FreeBSD/i.test(userAgent)) {
        return 'FreeBSD';
    } else if (/BlackBerry/i.test(userAgent)) {
        return 'BlackBerry OS';
    } else if (/Tizen/i.test(userAgent)) {
        return 'Tizen';
    } else if (/Windows Phone/i.test(userAgent)) {
        return 'Windows Phone';
    } else if (/KaiOS/i.test(userAgent)) {
        return 'KaiOS';
    } else {
        return 'Unknown OS';
    }
}

async function getCurrentDateTime(post, type) {

    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    
    // Get the month and day
    const month = now.toLocaleString('default', { month: 'long' });
    const day = now.getDate();
    
    // Determine the ordinal suffix
    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
        return ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
    };

    // Get the formatted time
    const time = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
    // Combine everything into the desired format
    return {
        time: `${month} ${day}${suffix(day)}, ${now.getFullYear()} at ${time}`,
        type: type,
        post: post.title,
        ip: ip,
        os: getOS(),
        location: `${locationn.city}, ${locationn.region} ${locationn.postal}`,
        wifi: locationn.org,
        gmaps: `https://www.google.com/maps?q=${locationn.loc.split(',')[0]},${locationn.loc.split(',')[1]}`
    }
}