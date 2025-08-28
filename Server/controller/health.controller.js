const asyncHandler=require("../utils/asyncHandler.js");
const ApiResponse=require("../utils/ApiResponse.js");

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "Backend is running"));
});

module.exports=healthCheck;
