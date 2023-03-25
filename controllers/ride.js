import { prisma } from "../index.js";
import { eventEmitter } from "../index.js";
import SseChannel from 'sse-channel';


export async function getAvailableDrivers(req, res) {
  try {
    const drivers = await prisma.user.findMany({
      where: {
        userType: "Driver",
        isAvailable: true,
      },
      take: 10,
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
    return ride;
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function rideRequestUpdates(req, res) {
  const {userId} = req.params;
  const sseConnection = req.headers.accept === 'text/event-stream';

  if (!sseConnection) {
    res.status(400).send('SSE connection required!');
  }

  // Set up SSE channel for the user
  const channel = new SseChannel();
  channel.addClient(req, res);

  // Listen for rideRequestAccepted events and send updates to the user's SSE channel
  eventEmitter.on('rideRequestAccepted', (data) => {
    console.log(+data.acceptedBy, +userId);
    console.log(+data.acceptedBy === +userId);
    if (+data.acceptedBy === +userId) {
      channel.send({ data });
    }
  });
}

export async function rideRequestAction(req, res) {
  const { id, isAccepted } = req.body;

  try {
    const updatedRecord = await prisma.ride.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isAccepted
      },
    });

    const ride = await prisma.ride.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    eventEmitter.emit('rideRequestAccepted', {
      acceptedBy: req.body.acceptedBy
    });

    res.status(200).json(ride);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update record.' });
  }
}