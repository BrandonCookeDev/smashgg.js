"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Venue_1 = require("../../lib/Venue");
var Oraganizer_1 = require("../../lib/Oraganizer");
exports.tournament1 = {
    "id": 6620,
    "name": "Tipped Off 12 , Presented by The Lab Gaming Center!",
    "slug": "tournament/tipped-off-12-presented-by-the-lab-gaming-center",
    "city": "Atlanta",
    "postalCode": "30339",
    "addrState": "GA",
    "countryCode": "US",
    "region": "11",
    "venueAddress": "2 Galleria Pkwy SE, Atlanta, GA 30339, USA",
    "venueName": "The Cobb Galleria",
    "gettingThere": null,
    "lat": 33.8835141,
    "lng": -84.4655017,
    "timezone": "America/New_York",
    "startAt": 1510401600,
    "endAt": 1510549140,
    "contactInfo": null,
    "contactEmail": "thelabgaminginc@gmail.com",
    "contactTwitter": "TheLabGamingCtr",
    "contactPhone": "404-368-5274",
    "ownerId": 11259
};
exports.tournament2 = {
    "id": 63515,
    "name": "21XX: cameron's birthday bash",
    "slug": "tournament/21xx-cameron-s-birthday-bash-1",
    "city": "Marietta",
    "postalCode": "30062",
    "addrState": "GA",
    "countryCode": "US",
    "region": "11",
    "venueAddress": "2860 Meadow Dr, Marietta, GA 30062, USA",
    "venueName": null,
    "gettingThere": "",
    "lat": 34.0219068,
    "lng": -84.445532,
    "timezone": "America/New_York",
    "startAt": 1532210400,
    "endAt": 1532231940,
    "contactInfo": null,
    "contactEmail": null,
    "contactTwitter": "dontcallmeslips",
    "contactPhone": null,
    "ownerId": 91767
};
exports.tournament3 = {
    "id": 1609,
    "name": "CEO 2016",
    "slug": "tournament/ceo-2016",
    "city": "Orlando",
    "postalCode": "32819",
    "addrState": "FL",
    "countryCode": "US",
    "region": "10",
    "venueAddress": "8001 International Dr, Orlando, FL 32819, USA",
    "venueName": "Wyndham Orlando Resort",
    "gettingThere": "For information on how to get to the venue, food options and more please visit http://www.ceogaming.org/ceohotel\n\nCEO at the Wyndham Orlando Resort is located less than 20 minutes from the Orlando International Airport (MCO). \n\nHotel Rooms will sell out fast for CEO 2016 at the Wyndham Orlando Resort so book now!",
    "lat": 28.448578,
    "lng": -81.4682618,
    "timezone": "America/New_York",
    "startAt": 1466740800,
    "endAt": 1467000000,
    "contactInfo": "For Media inquiries or Sponsorship/Partnership Opportunities please contact CEOGaming@gmail.com",
    "contactEmail": "ceogaming@gmail.com",
    "contactTwitter": "ceogaming",
    "contactPhone": null,
    "ownerId": 3431
};
exports.tournamentData1 = {
    tournament: exports.tournament1
};
exports.tournamentData2 = {
    tournament: exports.tournament2
};
exports.tournamentData3 = {
    tournament: exports.tournament3
};
// venues
exports.venue1 = new Venue_1.Venue(exports.tournament1.venueName, exports.tournament1.venueAddress, exports.tournament1.city, exports.tournament1.addrState, exports.tournament1.countryCode, exports.tournament1.region, exports.tournament1.postalCode, exports.tournament1.lat, exports.tournament1.lng);
exports.venue2 = new Venue_1.Venue(exports.tournament2.venueName, exports.tournament2.venueAddress, exports.tournament2.city, exports.tournament2.addrState, exports.tournament2.countryCode, exports.tournament2.region, exports.tournament2.postalCode, exports.tournament2.lat, exports.tournament2.lng);
exports.venue3 = new Venue_1.Venue(exports.tournament3.venueName, exports.tournament3.venueAddress, exports.tournament3.city, exports.tournament3.addrState, exports.tournament3.countryCode, exports.tournament3.region, exports.tournament3.postalCode, exports.tournament3.lat, exports.tournament3.lng);
// organizers
exports.organizer1 = new Oraganizer_1.Organizer(exports.tournament1.ownerId, exports.tournament1.contactEmail, exports.tournament1.contactPhone, exports.tournament1.contactTwitter, exports.tournament1.contactInfo);
exports.organizer2 = new Oraganizer_1.Organizer(exports.tournament2.ownerId, exports.tournament2.contactEmail, exports.tournament2.contactPhone, exports.tournament2.contactTwitter, exports.tournament2.contactInfo);
exports.organizer3 = new Oraganizer_1.Organizer(exports.tournament3.ownerId, exports.tournament3.contactEmail, exports.tournament3.contactPhone, exports.tournament3.contactTwitter, exports.tournament3.contactInfo);
