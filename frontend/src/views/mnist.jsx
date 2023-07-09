import React, { useEffect, useState } from 'react';
import { login } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useSnackbar } from 'notistack';
import useAxios from '../utils/useAxios';
import { Button } from '@mui/material';

const MNIST = () => {

    const api = useAxios();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        randomImage()
    })

    const randomImage = async (index) => {
        document.getElementById("prediction").innerHTML = "&nbsp;";
        const { data, status } = await api.get('mnist/get_image/');
        if (status == 200) {
            console.log(data)
            document.getElementById("image").src = data.image
            document.getElementById("image_big").src = data.image
            document.getElementById("class").innerText = data.type
            return data
        }
    }

    const classifyImage = async (index) => {
       
        try {
            const { data, status } = await api.post('mnist/classify_image/',new URLSearchParams( {
                image: document.getElementById("image").src
            }).toString());
            if (status == 200) {
                console.log(data)
                let color = data.prediction == document.getElementById("class").innerText ? "green" : "red"
                document.getElementById("prediction").innerHTML = "<b style='color:"+color+"'>Classified as " + data.prediction + "</b>"
                return data
            }
            else {
                console.log(data)
                enqueueSnackbar("Received status code: " + status, { variant: "error"} )
            }
        }
        catch (e) {
            enqueueSnackbar("An error occured: " + e, { variant: "error"} )
        }
    }

    let size = 280
  
    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen">
                <section className="">
                    <div className="flex flex-col items-center justify-center lg:py-0">
                        <img id="image" />
                        <br />
                        <img id="image_big" width={size} height={size} />
                        <p id="class"></p>
                        <div className="flex" style={{marginTop: "10px"}} > 
                            <Button variant="contained" style={{marginRight: "10px"}} onClick={randomImage}>Random Image</Button>
                            <Button variant="contained"  onClick={classifyImage}>Classify</Button>
                        </div>
                        <p id="prediction" style={{fontSize: "24px", marginTop: "10px"}}></p>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default MNIST;
