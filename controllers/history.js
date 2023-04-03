import { prisma } from "../index.js";

export async function getHistory(req, res) {
  const { id, userType } = req.params;

  if (userType === "Parent") {
    try {
      const history = await prisma.ride.findMany({
        where: {
          parentId: parseInt(id)
        },
        include:{
          driver:true
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      res.status(200).json(history)
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else if (userType === "Driver") {
    try {
      const history = await prisma.ride.findMany({
        where: {
          driverId: parseInt(id)
        },
        include:{
          parent:true
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.status(200).json(history)
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}