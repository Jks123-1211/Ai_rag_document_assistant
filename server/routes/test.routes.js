import express from 'express';
const router = express.Router();
router.get("/",function(req,res){
    res.json({message:"Backend tested successfully"});
});
export default router;

//this code will act as middleware and will be used in app.js to test the backend connection. when we hit the endpoint "/api/test" it will return a json response with message "Backend tested successfully". this will help us to confirm that our backend is working fine and we can proceed with further development.