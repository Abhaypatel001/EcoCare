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
    // ==========================================
    // CONVERT IMAGE TO BASE64
    // ==========================================

    const base64Image = file.buffer.toString("base64");

    const imageDataUrl = `data:${file.mimetype};base64,${base64Image}`;

    console.log("🤖 Sending image to OpenAI...");
    console.log("Image type:", file.mimetype);
    console.log("Image size:", file.size);

    // ==========================================
    // OPENAI VISION ANALYSIS
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

Your task is to determine whether the uploaded image genuinely contains
visible waste related to a public waste-management complaint.

Analyze ONLY what is visibly present in the image.

Do NOT trust the complaint title or description as evidence.

========================================
VALID WASTE EXAMPLES
========================================

- Garbage piles
- Uncollected household waste
- Plastic waste
- Garbage dumped on roads
- Illegal garbage dumping
- Overflowing garbage bins
- Organic waste
- Construction waste
- Hazardous waste
- Waste blocking drains
- Dirty public areas caused by visible waste

========================================
INVALID / UNRELATED IMAGES
========================================

Reject images containing only:

- Selfies
- Human portraits
- People
- Animals
- Vehicles without visible waste
- Buildings without visible waste
- Normal roads
- Nature
- Trees
- Landscapes
- Rivers
- Food photos
- Screenshots
- Documents
- Random objects
- Consumer products
- Blank images
- Indoor rooms without visible waste
- Any image where waste cannot reasonably be identified

========================================
IMPORTANT RULE
========================================

Only classify an image as waste when there is visible evidence
of waste in the image.

Do not assume waste exists simply because the user says there is waste.

If the image is ambiguous, use Review.

========================================
ALLOWED CATEGORIES
========================================

Use exactly ONE of these categories:

- Uncollected Waste
- Illegal Dumping
- Plastic Waste
- Organic Waste
- Hazardous Waste
- Construction Waste
- Blocked Drain Waste
- Other

========================================
CONFIDENCE RULES
========================================

Confidence must be a number from 0 to 1.

If clearly visible waste and confidence >= 0.80:
status = "Approved"

If possible waste is visible but evidence is uncertain
and confidence is between 0.50 and 0.79:
status = "Review"

If confidence < 0.50:
status = "Rejected"

If no visible waste exists:
isWaste = false
status = "Rejected"

========================================
RETURN FORMAT
========================================

Return ONLY valid JSON.

Do not return markdown.
Do not return code fences.
Do not return any text outside JSON.

Use exactly this structure:

{
  "isWaste": true,
  "confidence": 0.95,
  "category": "Plastic Waste",
  "explanation": "Visible accumulation of plastic waste is present.",
  "status": "Approved"
}
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
    // READ OPENAI RESPONSE
    // ==========================================

    let resultText = response.output_text?.trim();

    console.log("🤖 OpenAI Raw Response:", resultText);

    if (!resultText) {
      throw new Error("OpenAI returned an empty response");
    }

    // ==========================================
    // REMOVE MARKDOWN FENCES IF AI ADDS THEM
    // ==========================================

    resultText = resultText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // ==========================================
    // PARSE JSON
    // ==========================================

    let aiResult;

    try {
      aiResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error(
        "❌ Failed to parse OpenAI JSON:",
        resultText
      );

      throw new Error(
        "OpenAI returned invalid JSON"
      );
    }

    // ==========================================
    // NORMALIZE AI RESULT
    // ==========================================

    const isWaste = Boolean(aiResult.isWaste);

    let confidence = Number(aiResult.confidence);

    if (Number.isNaN(confidence)) {
      confidence = 0;
    }

    // Keep confidence between 0 and 1
    confidence = Math.max(
      0,
      Math.min(1, confidence)
    );

    // ==========================================
    // VALID CATEGORIES
    // ==========================================

    const allowedCategories = [
      "Uncollected Waste",
      "Illegal Dumping",
      "Plastic Waste",
      "Organic Waste",
      "Hazardous Waste",
      "Construction Waste",
      "Blocked Drain Waste",
      "Other",
    ];

    let category =
      typeof aiResult.category === "string"
        ? aiResult.category.trim()
        : "Other";

    if (!allowedCategories.includes(category)) {
      category = "Other";
    }

    // ==========================================
    // EXPLANATION
    // ==========================================

    const explanation =
      typeof aiResult.explanation === "string" &&
      aiResult.explanation.trim()
        ? aiResult.explanation.trim()
        : "AI image analysis completed.";

    // ==========================================
    // SERVER-SIDE FINAL DECISION
    // ==========================================

    let status = "Rejected";

    if (isWaste && confidence >= 0.8) {
      status = "Approved";
    } else if (isWaste && confidence >= 0.5) {
      status = "Review";
    } else {
      status = "Rejected";
    }

    // If AI says no waste, always reject
    if (!isWaste) {
      status = "Rejected";
    }

    // ==========================================
    // FINAL RESULT
    // ==========================================

    return {
      isWaste,
      confidence,
      category,
      explanation,
      status,
    };
  } catch (error) {
    console.error(
      "❌ AI Image Verification Error:",
      error
    );

    // AI failure should NEVER automatically approve
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

    console.log("=================================");
    console.log("📝 CREATE COMPLAINT");
    console.log("Title:", title);
    console.log("Location:", location);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Category:", category);
    console.log(
      "Image received:",
      req.file ? req.file.originalname : "NO IMAGE"
    );
    console.log("=================================");

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
    // VALIDATE LATITUDE
    // ==========================================

    const numericLatitude =
      latitude !== undefined &&
      latitude !== null &&
      latitude !== ""
        ? Number(latitude)
        : undefined;

    // ==========================================
    // VALIDATE LONGITUDE
    // ==========================================

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

    console.log(
      "🤖 Starting AI waste verification..."
    );

    const aiVerification =
      await verifyWasteImage(req.file);

    console.log(
      "🤖 FINAL AI RESULT:",
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

    const base64Image =
      req.file.buffer.toString("base64");

    const imageDataUrl =
      `data:${req.file.mimetype};base64,${base64Image}`;

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

        confidence:
          aiVerification.confidence,

        category:
          aiVerification.category,

        explanation:
          aiVerification.explanation,

        status:
          aiVerification.status,
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
    // RESPONSE MESSAGE
    // ==========================================

    let message =
      "Complaint submitted successfully";

    if (
      aiVerification.status === "Review"
    ) {
      message =
        "Complaint submitted and sent for admin review because the AI could not verify the image with high confidence.";
    }

    if (
      aiVerification.status === "Approved"
    ) {
      message =
        "Complaint submitted successfully. AI verified the waste image.";
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message,

      aiVerification,

      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error(
      "❌ Create Complaint Error:",
      error
    );

    console.error(
      "Error message:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ==========================================
// GET ALL COMPLAINTS — ADMIN
// ==========================================

const getAllComplaints = async (req, res) => {
  try {
    const complaints =
      await Complaint.find()
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
    const complaints =
      await Complaint.find({
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