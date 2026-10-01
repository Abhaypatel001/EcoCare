const Complaint = require("../models/Complaint");
const OpenAI = require("openai");

// ==========================================
// OPENAI CLIENT
// ==========================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==========================================
// AI IMAGE VERIFICATION
// ==========================================

const verifyWasteImage = async (file) => {
  if (!file || !file.buffer) {
    return {
      isWaste: false,
      confidence: 0,
      category: "",
      explanation: "No image was provided.",
      status: "Rejected",
    };
  }

  try {
    // Convert uploaded image to base64
    const base64Image = file.buffer.toString("base64");

    const imageDataUrl = `data:${file.mimetype};base64,${base64Image}`;

    // ==========================================
    // AI VISION ANALYSIS
    // ==========================================

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: [
        {
          role: "user",

          content: [
            {
              type: "input_text",

              text: `
You are an advanced AI waste-management image verification system.

Your job is to determine whether the uploaded image is genuinely related
to a waste-management complaint.

Analyze the image carefully.

VALID WASTE EXAMPLES:
- Garbage piles
- Uncollected household waste
- Plastic waste
- Waste dumped on roads
- Illegal garbage dumping
- Overflowing garbage bins
- Organic waste
- Construction waste
- Hazardous waste
- Waste blocking drains
- Dirty public areas caused by waste

INVALID / UNRELATED EXAMPLES:
- Selfies
- Human portraits
- Animals
- Vehicles without visible waste
- Buildings without visible waste
- Normal roads
- Nature/scenery
- Food photos
- Screenshots
- Random objects
- Products
- Documents
- Blank images
- Images where waste cannot reasonably be identified

IMPORTANT:
Do not assume an image contains waste just because the complaint
description says so.

Only classify as waste when visible evidence exists in the image.

Return ONLY valid JSON in exactly this structure:

{
  "isWaste": true,
  "confidence": 0.95,
  "category": "Plastic Waste",
  "explanation": "Visible accumulation of plastic waste is present.",
  "status": "Approved"
}

CATEGORY MUST BE ONE OF:
- Uncollected Waste
- Illegal Dumping
- Plastic Waste
- Organic Waste
- Hazardous Waste
- Construction Waste
- Blocked Drain Waste
- Other

DECISION RULES:

1. If clearly visible waste and confidence >= 0.80:
   status = "Approved"

2. If image may contain waste but evidence is uncertain
   and confidence is between 0.50 and 0.79:
   status = "Review"

3. If confidence < 0.50 OR image is unrelated:
   status = "Rejected"

4. If there is no visible waste:
   isWaste = false
   status = "Rejected"

5. Confidence must be a number between 0 and 1.

Do not include markdown.
Do not include ```json.
Return JSON only.
`,
            },

            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "high",
            },
          ],
        },
      ],
    });

    // ==========================================
    // READ AI RESPONSE
    // ==========================================

    let resultText = response.output_text?.trim();

    if (!resultText) {
      throw new Error("AI returned an empty response");
    }

    // Remove accidental markdown fences
    resultText = resultText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const aiResult = JSON.parse(resultText);

    // ==========================================
    // NORMALIZE AI RESULT
    // ==========================================

    const isWaste = Boolean(aiResult.isWaste);

    let confidence = Number(aiResult.confidence);

    if (Number.isNaN(confidence)) {
      confidence = 0;
    }

    // Keep confidence between 0 and 1
    confidence = Math.max(0, Math.min(1, confidence));

    const category =
      typeof aiResult.category === "string"
        ? aiResult.category.trim()
        : "";

    const explanation =
      typeof aiResult.explanation === "string"
        ? aiResult.explanation.trim()
        : "AI analysis completed.";

    // ==========================================
    // SERVER-SIDE DECISION
    // ==========================================
    // AI ke status par blindly trust nahi karenge.
    // Backend khud final status calculate karega.

    let status = "Rejected";

    if (isWaste && confidence >= 0.8) {
      status = "Approved";
    } else if (isWaste && confidence >= 0.5) {
      status = "Review";
    } else {
      status = "Rejected";
    }

    return {
      isWaste,
      confidence,
      category,
      explanation,
      status,
    };
  } catch (error) {
    console.error("AI Image Verification Error:", error);

    // AI fail hone par complaint ko automatically approve nahi karna.
    return {
      isWaste: false,
      confidence: 0,
      category: "",
      explanation:
        "AI image verification could not be completed.",
      status: "Review",
    };
  }
};

// ==========================================
// CREATE COMPLAINT — CITIZEN
// ==========================================

const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      landmark,
      category,
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and location are required",
      });
    }

    // ==========================================
    // IMAGE REQUIRED
    // ==========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Waste image is required for AI verification",
      });
    }

    // ==========================================
    // VALIDATE COORDINATES
    // ==========================================

    const numericLatitude =
      latitude !== undefined &&
      latitude !== null &&
      latitude !== ""
        ? Number(latitude)
        : undefined;

    const numericLongitude =
      longitude !== undefined &&
      longitude !== null &&
      longitude !== ""
        ? Number(longitude)
        : undefined;

    if (
      numericLatitude !== undefined &&
      (Number.isNaN(numericLatitude) ||
        numericLatitude < -90 ||
        numericLatitude > 90)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    if (
      numericLongitude !== undefined &&
      (Number.isNaN(numericLongitude) ||
        numericLongitude < -180 ||
        numericLongitude > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    // ==========================================
    // AI IMAGE VERIFICATION
    // ==========================================

    console.log("🤖 Starting AI waste verification...");

    const aiVerification = await verifyWasteImage(
      req.file
    );

    console.log(
      "🤖 AI Result:",
      aiVerification
    );

    // ==========================================
    // REJECT INVALID IMAGE
    // ==========================================

    if (aiVerification.status === "Rejected") {
      return res.status(400).json({
        success: false,

        message:
          "The uploaded image does not appear to show valid waste. Please upload a clear waste-related image.",

        aiVerification,
      });
    }

    // ==========================================
    // TEMPORARY IMAGE STORAGE
    // ==========================================
    // NOTE:
    // For now image is stored as base64 in MongoDB.
    // Later Cloudinary/S3 can be added for production.

    const base64Image =
      req.file.buffer.toString("base64");

    const imageDataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // ==========================================
    // CREATE COMPLAINT
    // ==========================================

    const complaint = await Complaint.create({
      user: req.user.id,

      title,

      description,

      location,

      latitude: numericLatitude,

      longitude: numericLongitude,

      landmark: landmark || "",

      category: category || "Other",

      image: imageDataUrl,

      aiVerification: {
        isWaste: aiVerification.isWaste,

        confidence: aiVerification.confidence,

        category: aiVerification.category,

        explanation: aiVerification.explanation,

        status: aiVerification.status,
      },
    });

    // ==========================================
    // POPULATE USER
    // ==========================================

    const populatedComplaint =
      await complaint.populate(
        "user",
        "name email phone"
      );

    // ==========================================
    // RESPONSE
    // ==========================================

    let message =
      "Complaint submitted successfully";

    if (aiVerification.status === "Review") {
      message =
        "Complaint submitted and sent for admin review because the AI could not verify the image with high confidence.";
    }

    if (aiVerification.status === "Approved") {
      message =
        "Complaint submitted successfully. AI verified the waste image.";
    }

    return res.status(201).json({
      success: true,

      message,

      aiVerification,

      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error(
      "Create Complaint Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL COMPLAINTS — ADMIN
// ==========================================

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "user",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(
      "Get Complaints Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY COMPLAINTS — CITIZEN
// ==========================================

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    })
      .populate(
        "user",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(
      "Get My Complaints Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE COMPLAINT STATUS — ADMIN
// ==========================================

const updateComplaintStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email phone"
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(
      "Update Complaint Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
};