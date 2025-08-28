import express from "express";
import {RoadMaps} from "../models/RoadMaps.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const newRoadMap = new RoadMaps(req.body);
    await newRoadMap.save();
    res.status(201).json(newRoadMap);
  } catch (error) {
    res.status(500).json({ message: "Error creating roadmap", error });
  }
});

router.get("/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const roadmap = await RoadMaps.findOne({ title });
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    res.status(200).json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roadmap", error });
  }
});

router.get("/titleName",async(req,res)=>{
    try{
        const allTitle = await RoadMaps.find({}, "title");
        res.status(200).json(allTitle);
    }catch(error){
        res.status(500).json({ message: "Error fetching titles", error });
    }
})

export default router;
