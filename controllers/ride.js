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
    dropoff,
    isCompleted
  } = req.body;

  // try {
  // const ride = await prisma.ride.findMany({
  //   where: {
  //     parentId: parseInt(parentId),
  //     driverId: parseInt(driverId),
  //     pickup: pickup,
  //     dropoff: dropoff
  //   },
  // })
  // console.log(ride);
  // if(ride.length === 0){
  try {
    const ride = await prisma.ride.create({
      data: {
        parentId,
        driverId,
        pickup,
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
  // }else if(ride.length > 0){
  // Update the record
  // }
  // } catch (error) {
  //   console.log(error)
  //   res.status(500).json({ error: error });
  // }
}

// export async function rideRequestUpdates(req, res) {
//   const {userId} = req.params;
//   const sseConnection = req.headers.accept === 'text/event-stream';

//   if (!sseConnection) {
//     res.status(400).send('SSE connection required!');
//   }

//   // Set up SSE channel for the user
//   const channel = new SseChannel();
//   channel.addClient(req, res);

//   // Listen for rideRequestAccepted events and send updates to the user's SSE channel
//   eventEmitter.on('rideRequestAccepted', (data) => {
//     if (+data.acceptedBy === +userId) {
//       channel.send({ data });
//     }
//   });
// }

export async function rideRequestAction(req, res) {
  const { id, isAccepted, acceptedBy } = req.body;
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
        ]
      },
      include: {
        parent: true,
      },
    })
    res.status(200).json(driverRides);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get record.' });
  }
}

export async function markRideComplete(req, res) {
  const { id, acceptedBy } = req.body;

  try {
    const driverRides = await prisma.ride.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isCompleted: true
      }
    })
    io.to(acceptedBy).emit('rideRequestAccepted', { message: "Ride completed" });
    res.status(200).json(driverRides);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get record.' });
  }
}