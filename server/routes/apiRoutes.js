const express =require('express');
const router =express.Router();

//캐싱이 적용될 경로
router.get('/some-data',(req,res)=>{
    const responseData ={
        message : 'This data is cached for 1 hour',
        timestamp : new Data()
    };
    res.send(responseData);

});

module.exports=router;