import { prisma } from "../index.js";
// import { eventEmitter } from "../index.js";
// import SseChannel from 'sse-channel';
import { io } from "../index.js";


export async function getAvailableDrivers(req, res) {
  const { userId } = req.params;
  try {
    const drivers = await prisma.user.findMany({
      where: {
        userType: "Driver",
        isAvailable: true,
      },
      take: 10,
      include: {
        DriverRides: {
          where: {
            parentId: parseInt(userId),
            isAccepted: null,
            isCompleted: false
          }
        }
      }
    });

    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

export async function addRide(req, res) {
  const {
    parentId,
    driverId,
    pickup,
    passengers,
    dropoff,
    isCompleted
  } = req.body;

  try {
    const ride = await prisma.ride.create({
      data: {
        parentId,
        driverId,
        pickup,
        passengers: parseInt(passengers),
        dropoff,
        isCompleted
      },
      include: {
        parent: true,
        driver: true
      }
    });

    io.to(req.body.driverId).emit('rideRequest', { message: "request recieved" });
    res.status(200).json(ride);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
}

export async function rideRequestAction(req, res) {
  const { id, isAccepted, acceptedBy, uId, passengers } = req.body;
  try {
    const updatedRecord = await prisma.ride.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isAccepted
      },
    });

    if (isAccepted) {
      try {

        const getUser = await prisma.user.findFirst({
          where: {
            id: parseInt(uId)
          }
        })
        const updatePassengerRecord = await prisma.user.update({
          where: {
            id: parseInt(uId)
          },
          data: {
            totalPassenger: parseInt(passengers) + parseInt(getUser.totalPassenger)
          }
        })

        const deleteRecords = await prisma.ride.deleteMany({
          where: {
            parentId: parseInt(acceptedBy),
            isAccepted: null,
            isCompleted: false
          }
        })


      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }

    const ride = await prisma.ride.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    io.to(req.body.acceptedBy).emit('rideRequest', { isAccepted: isAccepted });
    io.to(req.body.acceptedBy).emit('rideRequestAccepted', { isAccepted: isAccepted });
    res.status(200).json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update record.' });
  }
}


export async function getDriverRides(req, res) {
  const { driverId } = req.params;
  console.log(driverId)
  try {
    const driverRides = await prisma.ride.findMany({
      where: {
        driverId: parseInt(driverId),
        OR: [
          { isAccepted: true },
          { isAccepted: null }
        ],
        isCompleted: false
      },
      include: {
        parent: true,
      },
    })
    console.log(driverRides);
    res.status(200).json(driverRides);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get record.' });
  }
}

export async function markRideComplete(req, res) {
  const { id, acceptedBy, uId, passengers } = req.body;

  try {
    const driverRides = await prisma.ride.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isCompleted: true
      }
    })

    const getUser = await prisma.user.findFirst({
      where: {
        id: parseInt(uId)
      }
    })

    const updatePassengerRecord = await prisma.user.update({
      where: {
        id: parseInt(uId)
      },
      data: {
        totalPassenger:parseInt(getUser.totalPassenger) - parseInt(passengers) 
      }
    })

    io.to(acceptedBy).emit('rideRequestAccepted', { message: "Ride completed" });
    res.status(200).json(driverRides);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get record.' });
  }
}

export async function getActiveRideForParent(req, res) {
  const { userId } = req.params;
  try {
    const parentActiveRides = await prisma.ride.findMany({
      where: {
        parentId: parseInt(userId),
        isAccepted: true,
        isCompleted: false
      },
      include: {
        driver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    console.log(parentActiveRides);
    res.status(200).json(parentActiveRides);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get record.' });
  }
}