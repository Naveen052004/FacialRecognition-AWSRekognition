import './App.css';
import React, { useState } from 'react';

const uuid = require('uuid')

function App() {

  const [image, setImage] = useState('');
  const [resultMessage, setresultMessage] = useState('Please Upload the image')
  const [imgName, setImageName] = useState('placeHolder.jpg')
  const [isAuth, setIsAuth] = useState(false)
  const sendImage = (e)=>{
    e.preventDefault();
    setImageName(image.name)
    const imageName = uuid.v4()
    fetch(`https://r4otq1ig1g.execute-api.us-east-1.amazonaws.com/dev/project-visitor-images/${imageName}.jpeg`,{
      method:"PUT",
      headers:{
        'Content-Type':'image/jpeg'
      },
      body:image,
    }).then(async(res)=>{
      console.log(res);
      console.log("First success");
      console.log(imageName);
      const response = await authenticate(imageName);
      console.log(response);
      if(response.Message === 'Success'){
        setIsAuth(true)
        setresultMessage(`Hi ${response['firstName']} ${response['lastName']}, Welcome!`)
      }
      else{
        setIsAuth(false)
        setresultMessage(`Access Denied, Face not recognised`)
      }
    }).catch(e=>{
      alert("Error vochindi")
      setIsAuth(false)
      setresultMessage(`There was some error during the authentication. Try Again`)
      console.log(e);
    })
    // alert("Checking");
    return;
  }

  const authenticate = async(imageName)=>{
    // const temp = 
    // console.log(temp);
    const reqUrl = `https://r4otq1ig1g.execute-api.us-east-1.amazonaws.com/dev/employ?${new URLSearchParams({
      objectKey: `${imageName}.jpeg`
    })}`;
    console.log("In here");
    console.log(reqUrl);
    return await fetch(reqUrl,{
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'application/json'
      },
    }).then(res=>res.json()).then((data)=>{
      console.log("This is data " + data)
      return data;
    }).catch(e=>console.log(e))
  }
  return (
    <div className="App">
      <h1>Serverless Facial Recognition Application</h1>
      <form onSubmit={sendImage}>
        <input type="file" name='image' onChange={e=>setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth?'success':'failure'}>{resultMessage}</div>
      <img src={ require(`./visitors/${imgName}`)} alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;
