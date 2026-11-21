import express from "express";

const app = express();

port =3000;

app.use(express.json());

app.listen(()=>{
    console.log(`App is listening at  port ${port}`);
})


