export const TOKEN_INFO = {
  general: {
    title: "SSD & DD Tokens",
    subtitle: "Free offline darshan tokens issued in Tirupati",
    category: "Free Darshan",
    mode: "Offline",
    issuedBy: "Tirumala Tirupati Devasthanams (TTD)",
  },

  ssd: {
    id: "ssd",
    name: "Slotted Sarva Darshan",
    shortName: "SSD",
    description:
      "Free offline tokens that assign pilgrims a reporting date and time for Sarva Darshan at Tirumala.",
    centres: [
      {
        id: "srinivasam",
        name: "Srinivasam",
        location: "Near Tirupati Bus Stand",
        mapUrl: "https://maps.app.goo.gl/sJ2HpFbn9Mnz7Pw16",
      },
      {
        id: "vishnu-nivasam",
        name: "Vishnu Nivasam",
        location: "Opposite Tirupati Railway Station",
        mapUrl: "https://maps.app.goo.gl/ESc8dYiH5siXjVVS8",
      },
      {
        id: "bhudevi",
        name: "Bhudevi Complex",
        location: "Near Alipiri",
        mapUrl: "https://maps.app.goo.gl/GF1MLA6nNeSz6UqN9",
      },
    ],
  },

  dd: {
    id: "dd",
    name: "Divya Darshan",
    shortName: "DD",
    description:
      "Free offline darshan tokens associated with the Divya Darshan pedestrian pilgrimage route.",
    centres: [
      {
        id: "bhudevi-dd",
        name: "Bhudevi Complex",
        location: "Separate DD token counter near Alipiri",
        mapUrl: "https://maps.app.goo.gl/GF1MLA6nNeSz6UqN9",
      },
    ],
  },
};