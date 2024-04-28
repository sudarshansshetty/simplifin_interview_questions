class RideSharingApp {
  constructor() {
    this.users = {};
    this.rides = {};
  }

  add_user(user_detail) {
    const [name, gender, age] = user_detail.split(", ");
    this.users[name] = { gender, age, vehicles: [] };
  }

  add_vehicle(vehicle_detail) {
    const [name, vehicle, registration] = vehicle_detail.split(", ");
    if (this.users[name]) {
      this.users[name].vehicles.push({ vehicle, registration });
    }
  }

  offer_ride(ride_detail) {
    const [user, origin, availableSeats, vehicle, registration, destination] =
      ride_detail.split(", ");

    let userVehicle = vehicle.split("=")[1];

    if (this.rides[user + userVehicle]) {
      console.log(
        "A ride has already been offered by this user for this vehicle."
      );
      return;
    }

    this.rides[user + userVehicle] = {
      origin: origin.split("=")[1],
      availableSeats: parseInt(availableSeats.split("=")[1]),
      destination: destination.split("=")[1],
      vehicle: vehicle.split("=")[1],
    };

    this.users[user].ridesOffered = this.users[user].ridesOffered
      ? this.users[user].ridesOffered + 1
      : 1;
  }

  select_ride(details) {
    const [name, source, destination, seats, selection_strategy] =
      details.split(", ");

    const rides = Object.values(this.rides);

    const availableRides = rides.filter(
      (ride) =>
        ride.origin === source.split("=")[1] &&
        ride.destination === destination.split("=")[1] &&
        ride.availableSeats >= parseInt(seats.split("=")[1])
    );

    let selectedRide;

    if (selection_strategy.includes("Most Vacant")) {
      availableRides.sort((a, b) => b.availableSeats - a.availableSeats);
      selectedRide = availableRides[0];
    } else if (selection_strategy.includes("Preferred Vehicle")) {
      const preferredVehicle = selection_strategy.split("=")[1];
      selectedRide = availableRides.find(
        (ride) => ride.vehicle === preferredVehicle
      );
    }

    if (selectedRide) {
      this.users[name].ridesTaken = this.users[name].ridesTaken
        ? this.users[name].ridesTaken + 1
        : 1;
    } else {
      console.log("No rides found.");
    }
  }

  end_ride(ride_details) {
    delete this.rides[ride_details];
  }

  print_ride_stats() {
    console.log(this.rides);
    const userNames = Object.keys(this.users);
    userNames.forEach((userName) => {
      const user = this.users[userName];
      const ridesTaken = user.ridesTaken ? user.ridesTaken : 0;
      const ridesOffered = user.ridesOffered ? user.ridesOffered : 0;
      console.log(`${userName}: ${ridesTaken} Taken, ${ridesOffered} Offered`);
    });
  }
}

const rideSharingApp = new RideSharingApp();

rideSharingApp.add_user("Rohan, M, 36");
rideSharingApp.add_vehicle("Rohan, Swift, KA-01-12345");
rideSharingApp.add_user("Shashank, M, 29");
rideSharingApp.add_vehicle("Shashank, Baleno, TS-05-62395");
rideSharingApp.add_user("Nandini, F, 29");
rideSharingApp.add_user("Shipra, F, 27");
rideSharingApp.add_vehicle("Shipra, Polo, KA-05-41491");
rideSharingApp.add_vehicle("Shipra, Activa, KA-12-12332");
rideSharingApp.add_user("Gaurav, M, 29");
rideSharingApp.add_user("Rahul, M, 35");
rideSharingApp.add_vehicle("Rahul, XUV, KA-05-1234");

rideSharingApp.offer_ride(
  "Rohan, Origin=Hyderabad, Available Seats=1, Vehicle=Swift, KA-01-12345, Destination=Bangalore"
);
rideSharingApp.offer_ride(
  "Shipra, Origin=Bangalore, Available Seats=1, Vehicle=Activa, KA-12-12332, Destination=Mysore"
);
rideSharingApp.offer_ride(
  "Shipra, Origin=Bangalore, Available Seats=2, Vehicle=Polo, KA-05-41491, Destination=Mysore"
);
rideSharingApp.offer_ride(
  "Shashank, Origin=Hyderabad, Available Seats=2, Vehicle=Baleno, TS-05-62395, Destination=Bangalore"
);
rideSharingApp.offer_ride(
  "Rahul, Origin=Hyderabad, Available Seats=5, Vehicle=XUV, KA-05-1234, Destination=Bangalore"
);

rideSharingApp.select_ride(
  "Nandini, Origin=Bangalore, Destination=Mysore, Seats=1, Most Vacant"
);
rideSharingApp.select_ride(
  "Gaurav, Origin=Bangalore, Destination=Mysore, Seats=1, Preferred Vehicle=Activa"
);
rideSharingApp.select_ride(
  "Shashank, Origin=Mumbai, Destination=Bangalore, Seats=1, Most Vacant"
);
rideSharingApp.select_ride(
  "Rohan, Origin=Hyderabad, Destination=Bangalore, Seats=1, Preferred Vehicle=Baleno"
);
rideSharingApp.select_ride(
  "Shashank, Origin=Hyderabad, Destination=Bangalore, Seats=1, Preferred Vehicle=Polo"
);

rideSharingApp.end_ride("RohanSwift");
rideSharingApp.end_ride("ShipraActiva");
rideSharingApp.end_ride("ShipraPolo");
rideSharingApp.end_ride("ShashankBaleno");
rideSharingApp.end_ride("RahulXUV");

rideSharingApp.print_ride_stats();
