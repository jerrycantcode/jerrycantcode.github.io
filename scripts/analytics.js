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
      ip = data.ip
      getGeoLocation(ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return false;
    }
  }


getPublicIP()

async function sendAnalytics(p) {
    var log = await getCurrentDateTime(p)
    const formData = new FormData();
    formData.append("data", JSON.stringify(log));

    fetch('https://script.google.com/macros/s/AKfycbw4iHog2R5oQndN1qBpjBmXguzunABFGeMoZkFM89FaTABWNX6Gq1J7YktZ6QmXLZpr/exec', {
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

function getLocalTimeZone() {
    const date = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get the time zone abbreviation using toLocaleString
    const options = { timeZone, timeZoneName: 'short' };
    const timeZoneInfo = date.toLocaleString('en-US', options);

    // The abbreviation is usually at the end of the returned string
    const abbreviation = timeZoneInfo.split(' ').pop();

    return `${timeZone} (${abbreviation})`;
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

function getDetroitDateTime() {
    // Create a date object for the current time
    const now = new Date();

    // Convert the current time to Detroit time (Eastern Time)
    const options = { 
        timeZone: 'America/New_York', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    };
    
    // Get the formatted date
    const detroitDate = new Intl.DateTimeFormat('en-US', options).format(now);
    
    // Split the date and time
    const [monthDay, year, time] = detroitDate.split(', ');
    const [month, dayWithSuffix] = monthDay.split(' ');

    // Determine the ordinal suffix for the day
    const day = parseInt(dayWithSuffix, 10);
    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
        return ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
    };

    // Combine everything into the desired format
    return `${month} ${day}${suffix(day)}, ${year}`;
}

function getLocalLanguage() {
    return navigator.language || navigator.userLanguage; // For older versions of IE
}

async function getCurrentDateTime(page) {

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
        site: window.location.href,
        localTime: `${month} ${day}${suffix(day)}, ${now.getFullYear()} at ${time}`,
        hqTime: getDetroitDateTime(),
        page: page,
        hash: window.location.hash,
        ip: ip,
        os: getOS(),
        location: `${locationn.city}, ${locationn.region} ${locationn.postal}`,
        timeZone: getLocalTimeZone(),
        lang: getLocalLanguage(),
        wifi: locationn.org,
        gmaps: `https://www.google.com/maps?q=${locationn.loc.split(',')[0]},${locationn.loc.split(',')[1]}`
    }
}