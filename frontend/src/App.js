import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [score, setScore] = useState(0);
  const [inputDir, setInputDir] = useState({ x: 12, y: 10 });
  const [currentKey, setCurrentKey] = useState('');
  const [food,setFood] = useState({x:5,y:5});
  const [learder1,setLeader1] = useState([]);
  const [userName,setName] = useState("");
  const [adminData,setAdminData] = useState({
  playerName:'',playerScore:'',adminPassword:''})

  const checkName=async (pname)=>{
    try{

      const adding =await fetch('https://snake-backend-0rta.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: pname
        })
      })
      const response = await adding.json();
      return response.exist;
    }catch{
      alert("Something wrong");
      return "error";
    }
  }

  useEffect(()=>{
    const forasync =async ()=>{
      const contain = localStorage.getItem('username');
      if(contain){
      setName(contain);
        return;
      }
    let pname = prompt("Enter the Username: ");
    if(!pname){
      alert("Invalid Username");
      window.location.reload();
    }
    let result = await checkName(pname)
    if(result){
      setName(pname);
      localStorage.setItem('username',pname);
    }else{
      alert("Invalid Username");
      window.location.reload();
    }
  }
  forasync()
  },[])

  const moveSnake = () => {
    setInputDir((prev) => {
      switch (currentKey) {
        case 'ArrowUp':
          return { x: prev.x, y: prev.y - 1 };
        case 'ArrowDown':
          return { x: prev.x, y: prev.y + 1 };
        case 'ArrowLeft':
          return { x: prev.x - 1, y: prev.y };
        case 'ArrowRight':
          return { x: prev.x + 1, y: prev.y };
        default:
          return prev;
      }
    });
  };

  const handleOnChange = (e)=>{
    const {name,value} = e.target;
    setAdminData((prev)=>({
      ...prev, 
      [name] : value
    }))
  }

  const foodGen = ()=>{
    let a = 18
    let b = 2
    setFood(()=>{
      return {x: Math.round(a+(b-a)* Math.random()),y: Math.round(a + (b-a)* Math.random())}
    })
  }

  const isCollied = ()=>{
    if(inputDir.x < 1 || inputDir.x > 17 || inputDir.y < 1 || inputDir.y > 19){
      return true;
    }
    else{
      return false;
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch('https://snake-backend-0rta.onrender.com/ranks');
        const data = await response.json();
        const sortedData = data.sort((a, b) => b.score - a.score);
        setLeader1(sortedData);
      }catch{
        console.log("Server is in Maintanance");
      }
    };

    fetchData();
  }, []); 
  const submitScore = async ()=>{
    try{
      const sendScore =await fetch('https://snake-backend-0rta.onrender.com/subscore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: userName,
          cur_score:score
        })
      })
      const response = await sendScore.json();
      if(response.cracked){
        alert(response.message);
      }else{
        return;
      }
    }catch{
      alert("Server is On maintanance");
    }
  }
  const [speed,setSpeed]=useState(155);
  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake();
      //
      if(isCollied()){
        alert(`Score submitted : ${score}`);
        submitScore();
        setScore(0);
        setInputDir({ x: 12, y: 10 });
        setCurrentKey('');
        setFood({x:5,y:5});
        setSpeed(155);
      }
      // food generate
      if(inputDir.x==food.x && inputDir.y == food.y){
        foodGen();
        setScore(scr => scr+1);
        setSpeed((prev)=>prev-5);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentKey,inputDir]);

  const handleKeyPress = (e) => {
    setCurrentKey(e.key);
  };

  const handleOnClick = async ()=>{
    if(adminData.playerName != '' && adminData.playerScore != '' && adminData.adminPassword != ''){
      try{

        const adding =await fetch('https://snake-backend-0rta.onrender.com/addPlayer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerName: adminData.playerName,
            playerScore: adminData.playerScore,
            adminPassword: adminData.adminPassword
          })
        })
        const response = await adding.json();
        alert(response.message);
      }catch{
        alert("Something wrong");
      }
      }else{
        alert("Should not be empty");
      }
    }

  return (
    <div className="box" onKeyDown={handleKeyPress} tabIndex="0">
      <span id="userName">{userName}</span>
      <div id="score">Score : {score}</div>
      <div id='admin'>
        <h3>Admin</h3>
        <input name="playerName" value={adminData.playerName} placeholder='Player Name' onChange={handleOnChange}/>
        <input name="playerScore" value={adminData.playerScore} placeholder='Score' onChange={handleOnChange}/>
        <input name='adminPassword' value={adminData.adminPassword} placeholder='Password' onChange={handleOnChange}/>
        <button onClick={handleOnClick}>Add</button>
      </div>
      <div id='leader'>
        <h2>LeaderBoard</h2>
        <ul>
          {learder1.map((e,i)=>{
            return <li key={i}>{i+1}. {e.name} -- {e.score}</li>
          })}
        </ul>
      </div>
      <div id="gamebox">
        {/* Food */}
        <div
          style={{
            gridColumn: food.x,
            gridRow: food.y,
            backgroundColor: 'red',
            borderRadius: '100%',
          }}
        ></div>
        {/* Snake */}
        <div
          style={{
            gridColumn: inputDir.x,
            gridRow: inputDir.y,
            backgroundColor: 'purple',
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
